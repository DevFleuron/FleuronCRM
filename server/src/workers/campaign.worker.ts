import Campaign from "../models/Campaign.model";
import Lead from "../models/Lead.model";
import { BrevoService } from "../services/brevo.service";
import { addCallToAction } from "../templates/email-layout";

/*
 * Traiter l'envoi d'une campagne
 */
export async function processCampaignSending(campaignId: string) {
  console.log(`\n ========================================`);
  console.log(`  Début envoi campagne ${campaignId}`);
  console.log(` ========================================\n`);

  try {
    const campaign = await Campaign.findById(campaignId).populate("templateId");

    if (!campaign) {
      console.error("Campagne non trouvée");
      return;
    }

    // Mettre le statut en "sending"
    campaign.status = "sending";
    await campaign.save();

    const template = campaign.templateId as any;

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < campaign.recipients.length; i++) {
      const recipient = campaign.recipients[i];

      // Ignorer si pas en pending
      if (recipient.status !== "pending") {
        console.log(
          ` [${i + 1}/${campaign.recipients.length}] Lead ${recipient.leadRef} déjà traité (${recipient.status})`,
        );
        continue;
      }

      console.log(
        `\n[${i + 1}/${campaign.recipients.length}] Traitement lead ${recipient.leadRef}...`,
      );

      try {
        // Récupérer le lead
        const lead = await Lead.findById(recipient.leadId);

        if (!lead) {
          recipient.status = "failed";
          recipient.error = "Lead non trouvé";
          failCount++;
          console.log(`Lead non trouvé`);
          continue;
        }

        console.log(`   → ${lead.prenom} ${lead.nom}`);

        // Vérifier les coordonnées
        if (campaign.type === "sms") {
          if (!BrevoService.isValidPhoneNumber(lead.mobile)) {
            recipient.status = "failed";
            recipient.error = "Numéro de téléphone invalide";
            failCount++;
            console.log(`Numéro invalide: ${lead.mobile}`);
            continue;
          }
          console.log(`   → Mobile: ${lead.mobile}`);
        } else {
          if (!BrevoService.isValidEmail(lead.email)) {
            recipient.status = "failed";
            recipient.error = "Email invalide";
            failCount++;
            console.log(`Email invalide: ${lead.email}`);
            continue;
          }
          console.log(`   → Email: ${lead.email}`);
        }

        // Remplacer les variables
        let content = BrevoService.replaceVariables(template.content, lead);

        // Envoyer
        let result;
        if (campaign.type === "sms") {
          result = await BrevoService.sendSMS(lead.mobile, content);
        } else {
          const subject = BrevoService.replaceVariables(
            template.subject || "",
            lead,
          );

          // Ajouter le CTA si présent
          if (template.ctaText && template.ctaUrl) {
            content = addCallToAction(
              content,
              template.ctaText,
              template.ctaUrl,
            );
          }

          result = await BrevoService.sendEmail(
            lead.email,
            subject,
            content,
            template.attachment,
          );
        }

        if (result.success) {
          recipient.status = "sent";
          recipient.sentAt = new Date();
          successCount++;

          // Mettre à jour le lead
          if (campaign.type === "sms") {
            lead.smsEnvoye = true;
            lead.brevoStats.lastSmsSentAt = new Date();
          } else {
            lead.emailEnvoye = true;
            lead.brevoStats.lastEmailSentAt = new Date();
          }
          await lead.save();

          console.log(`Envoyé avec succès`);
        } else {
          recipient.status = "failed";
          recipient.error = result.error;
          failCount++;
          console.log(`Erreur: ${result.error}`);
        }
      } catch (error: any) {
        console.error(`Exception: ${error.message}`);
        recipient.status = "failed";
        recipient.error = error.message;
        failCount++;
      }

      // Sauvegarder après chaque envoi
      campaign.sentCount = successCount;
      campaign.failedCount = failCount;
      await campaign.save();

      // Délai entre chaque envoi
      if (i < campaign.recipients.length - 1) {
        console.log(`Attente 1s avant le prochain envoi...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // Finaliser
    campaign.status = "sent";
    campaign.sentAt = new Date();
    await campaign.save();
  } catch (error: any) {
    console.error(` Erreur  campagne ${campaignId}`);
    console.error(` ${error.message}`);

    // Marquer la campagne comme failed
    await Campaign.findByIdAndUpdate(campaignId, {
      status: "failed",
    });
  }
}
