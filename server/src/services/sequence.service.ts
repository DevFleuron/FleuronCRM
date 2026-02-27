import SequenceCampaign from "../models/SequenceCampaign.model";
import Lead from "../models/Lead.model";
import Template from "../models/Template.model";
import { BrevoService } from "./brevo.service";
import { isNRPStatus } from "../utils/lead.utils";

export class SequenceService {
  /**
   * Créer une nouvelle séquence automatique
   */
  static async createSequence(data: {
    name: string;
    steps: Array<{
      type: "sms" | "email";
      templateId: string;
      delayDays: number;
    }>;
    leadIds: string[];
  }) {
    try {
      const { name, steps, leadIds } = data;

      // Récupérer les leads
      const leads = await Lead.find({ _id: { $in: leadIds } });

      // Créer les recipients
      const recipients = leads.map((lead) => ({
        leadId: lead._id,
        leadRef: lead.ref,
        status: "pending",
        currentStep: 0,
        nextActionAt: new Date(),
        stepsCompleted: [],
      }));

      // Créer la séquence
      const sequence = await SequenceCampaign.create({
        name,
        steps: steps.map((step, index) => ({
          stepNumber: index + 1,
          type: step.type,
          templateId: step.templateId,
          delayDays: step.delayDays,
        })),
        recipients,
        recipientsCount: recipients.length,
        activeCount: recipients.length,
        status: "active",
        startedAt: new Date(),
      });

      console.log(`Séquence "${name}" créée avec ${leads.length} leads`);

      return { success: true, data: sequence };
    } catch (error: any) {
      console.error("Erreur createSequence:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Exécuter les actions programmées
   */
  static async executeScheduledActions() {
    try {
      const now = new Date();

      console.log(`\nVérification des séquences automatiques`);
      console.log(`${now.toLocaleString("fr-FR")}\n`);

      const sequences = await SequenceCampaign.find({
        status: "active",
      });

      let actionsExecuted = 0;

      for (const sequence of sequences) {
        for (let i = 0; i < sequence.recipients.length; i++) {
          const recipient = sequence.recipients[i];

          if (
            recipient.status !== "in_progress" &&
            recipient.status !== "pending"
          ) {
            continue;
          }

          if (!recipient.nextActionAt || recipient.nextActionAt > now) {
            continue;
          }

          // Vérifier que le lead est toujours NRP
          const lead = await Lead.findById(recipient.leadId);
          if (!lead) {
            console.log(`Lead ${recipient.leadRef} introuvable, skipped`);
            continue;
          }

          // Arrêter si le lead n'est plus NRP (NRP, NRP 1, NRP 2, etc.)
          if (!isNRPStatus(lead.rapport)) {
            console.log(
              `\nLead ${recipient.leadRef} n'est plus NRP (${lead.rapport})`,
            );
            console.log(`Arrêt de la séquence`);

            recipient.status = "stopped";
            recipient.stoppedAt = new Date();
            recipient.stopReason = `Lead status changed to ${lead.rapport}`;
            sequence.stoppedCount = (sequence.stoppedCount || 0) + 1;
            sequence.activeCount = Math.max(0, (sequence.activeCount || 0) - 1);
            await sequence.save();
            continue;
          }

          const executed = await this.executeAction(sequence, i, lead);
          if (executed) {
            actionsExecuted++;
          }
        }

        await sequence.save();

        // Vérifier si la séquence est terminée
        const allDone = sequence.recipients.every(
          (r) => r.status === "completed" || r.status === "stopped",
        );

        if (allDone && sequence.status === "active") {
          sequence.status = "completed";
          sequence.completedAt = new Date();
          await sequence.save();
          console.log(`\nSéquence "${sequence.name}" terminée`);
        }
      }

      console.log(`\n${actionsExecuted} action(s) exécutée(s)\n`);
    } catch (error: any) {
      console.error("Erreur executeScheduledActions:", error);
    }
  }

  private static async executeAction(
    sequence: any,
    recipientIndex: number,
    lead: any,
  ): Promise<boolean> {
    const recipient = sequence.recipients[recipientIndex];
    const stepIndex = recipient.currentStep;
    const step = sequence.steps[stepIndex];

    if (!step) {
      recipient.status = "completed";
      recipient.completedAt = new Date();
      sequence.completedCount = (sequence.completedCount || 0) + 1;
      sequence.activeCount = Math.max(0, (sequence.activeCount || 0) - 1);

      console.log(
        `\n Lead ${recipient.leadRef} a déjà terminé la séquence "${sequence.name}"`,
      );
      return false;
    }

    console.log(`\nExécution action pour lead ${recipient.leadRef}`);
    console.log(`Séquence: ${sequence.name}`);
    console.log(`Étape: ${stepIndex + 1}/${sequence.steps.length}`);
    console.log(`Type: ${step.type.toUpperCase()}`);

    let success = false;
    let error = undefined;

    try {
      const template = await Template.findById(step.templateId);
      if (!template) {
        throw new Error("Template not found");
      }

      const content = BrevoService.replaceVariables(template.content, lead);

      if (step.type === "sms") {
        if (!lead.mobile || !BrevoService.isValidPhoneNumber(lead.mobile)) {
          throw new Error("Invalid or missing phone number");
        }
        const result = await BrevoService.sendSMS(lead.mobile, content);
        success = result.success;
        error = result.error;
      } else {
        if (!lead.email || !BrevoService.isValidEmail(lead.email)) {
          throw new Error("Invalid or missing email");
        }
        const subject = BrevoService.replaceVariables(
          template.subject || "",
          lead,
        );

        // Passer l'attachment si présent
        const result = await BrevoService.sendEmail(
          lead.email,
          subject,
          content,
          template.attachment,
        );
        success = result.success;
        error = result.error;
      }

      console.log(
        `${success ? "✅ Envoyé avec succès" : "❌ Échec: " + error}`,
      );
    } catch (err: any) {
      success = false;
      error = err.message;
      console.log(`❌ Erreur: ${error}`);
    }

    // Enregistrer l'étape complétée
    recipient.stepsCompleted.push({
      stepNumber: stepIndex + 1,
      completedAt: new Date(),
      success,
      error,
    });

    // Passer à l'étape suivante
    recipient.currentStep = stepIndex + 1;

    // Vérifier s'il y a une prochaine étape
    const nextStep = sequence.steps[recipient.currentStep];
    if (nextStep) {
      // Il reste des étapes
      recipient.status = "in_progress";
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + nextStep.delayDays);
      recipient.nextActionAt = nextDate;
      console.log(` Prochaine action: ${nextDate.toLocaleString("fr-FR")}`);
    } else {
      // C'était la dernière étape !
      recipient.status = "completed";
      recipient.completedAt = new Date();
      recipient.nextActionAt = undefined;
      sequence.completedCount = (sequence.completedCount || 0) + 1;
      sequence.activeCount = Math.max(0, (sequence.activeCount || 0) - 1);
      console.log(
        `\n Lead ${recipient.leadRef} a terminé TOUTES les étapes de la séquence !`,
      );
    }

    return true;
  }

  /**
   * Arrêter les séquences quand un lead change de statut
   */
  static async checkAndStopSequences(leadId: string, newStatus: string) {
    try {
      // Si le lead reste NRP (NRP, NRP 1, NRP 2, etc.), ne rien faire
      if (isNRPStatus(newStatus)) {
        return;
      }

      // Trouver toutes les séquences actives contenant ce lead
      const sequences = await SequenceCampaign.find({
        status: "active",
        "recipients.leadId": leadId,
      });

      for (const sequence of sequences) {
        const recipient = sequence.recipients.find(
          (r) => r.leadId.toString() === leadId,
        );

        if (
          recipient &&
          (recipient.status === "in_progress" || recipient.status === "pending")
        ) {
          recipient.status = "stopped";
          recipient.stoppedAt = new Date();
          recipient.stopReason = `Lead status changed to ${newStatus}`;

          sequence.stoppedCount = (sequence.stoppedCount || 0) + 1;
          sequence.activeCount = Math.max(0, (sequence.activeCount || 0) - 1);

          await sequence.save();

          console.log(
            `Séquence ${sequence.name} arrêtée pour lead ${recipient.leadRef}`,
          );
        }
      }
    } catch (error: any) {
      console.error("Erreur checkAndStopSequences:", error);
    }
  }
}
