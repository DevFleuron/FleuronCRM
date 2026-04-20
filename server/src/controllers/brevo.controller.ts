import { Request, Response } from "express";
import Lead from "../models/Lead.model";
import Campaign from "../models/Campaign.model";
import { SequenceService } from "../services/sequence.service";

export const handleBrevoWebhook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const event = req.body;
    const messageId = event["message-id"];
    console.log(
      "Webhook Brevo reçu:",
      event.event,
      event.email || event.to,
      "messageId:",
      messageId,
    );
    console.log("Webhook event complet:", JSON.stringify(event, null, 2));

    if (event.event === "delivered" && event.email) {
      const lead = await Lead.findOneAndUpdate(
        { email: event.email },
        {
          $inc: { "brevoStats.emailDelivered": 1 },
          $set: { "brevoStats.lastEmailSentAt": new Date() },
        },
        { new: true },
      );
      if (lead)
        await updateCampaignStats(lead._id, "delivered", "email", messageId);
    }

    if (event.event === "unique_opened" && event.email) {
      const lead = await Lead.findOneAndUpdate(
        { email: event.email },
        {
          $inc: { "brevoStats.emailOpened": 1 },
          $set: {
            "brevoStats.lastEmailOpenedAt": new Date(),
            emailEnvoye: true,
          },
        },
        { new: true },
      );
      if (lead)
        await updateCampaignStats(lead._id, "opened", "email", messageId);
    }

    if (
      (event.event === "click" || event.event === "unique_click") &&
      event.email
    ) {
      const lead = await Lead.findOneAndUpdate(
        { email: event.email },
        {
          $inc: { "brevoStats.emailClicked": 1 },
          $set: { "brevoStats.lastEmailClickedAt": new Date() },
        },
        { new: true },
      );
      if (lead)
        await updateCampaignStats(lead._id, "clicked", "email", messageId);
    }

    if (event.event === "hard_bounce" && event.email) {
      const lead = await Lead.findOneAndUpdate(
        { email: event.email },
        { $inc: { "brevoStats.emailBounced": 1 } },
        { new: true },
      );
      if (lead)
        await updateCampaignStats(lead._id, "bounced", "email", messageId);
    }

    if (event.event === "soft_bounce" && event.email) {
      const lead = await Lead.findOneAndUpdate(
        { email: event.email },
        { $inc: { "brevoStats.emailBounced": 1 } },
        { new: true },
      );
      if (lead)
        await updateCampaignStats(lead._id, "bounced", "email", messageId);
    }

    if (event.event === "spam" && event.email) {
      const lead = await Lead.findOneAndUpdate(
        { email: event.email },
        { $inc: { "brevoStats.emailSpam": 1 } },
        { new: true },
      );
      if (lead) await updateCampaignStats(lead._id, "spam", "email", messageId);
    }

    if (event.event === "delivered" && event.to) {
      const mobile = formatPhoneNumber(event.to);
      const lead = await Lead.findOneAndUpdate(
        { mobile },
        {
          $inc: { "brevoStats.smsDelivered": 1 },
          $set: { "brevoStats.lastSmsSentAt": new Date(), smsEnvoye: true },
        },
        { new: true },
      );
      if (lead)
        await updateCampaignStats(lead._id, "delivered", "sms", messageId);
    }
    // Réponse SMS entrant → sortir le lead de toutes les séquences actives
    if (event.event === "inboundSms" && event.from) {
      const { leadRef, stopped } = await SequenceService.stopLeadByPhone(
        event.from,
      );
      console.log(
        `[SMS Inbound] Lead: ${leadRef || "inconnu"}, séquences stoppées: ${stopped}`,
      );
    }
    // Réponse email entrant → sortir le lead de toutes les séquences actives
    if (event.event === "inboundEmail" && event.email) {
      const lead = await Lead.findOne({ email: event.email });
      if (lead) {
        await SequenceService.checkAndStopSequences(
          lead._id.toString(),
          "REPLIED_EMAIL",
        );
        console.log(
          `[Email Inbound] Lead ${lead.ref} sorti des campagnes actives`,
        );
      } else {
        console.warn(`[Email Inbound] Lead introuvable pour: ${event.email}`);
      }
    }
    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Erreur handleBrevoWebhook:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

async function updateCampaignStats(
  leadId: any,
  eventType: "delivered" | "opened" | "clicked" | "bounced" | "spam",
  type: "email" | "sms",
  messageId?: string,
) {
  try {
    let campaign = null;

    // Cherche d'abord par messageId (le plus fiable)
    if (messageId) {
      campaign = await Campaign.findOne({
        "recipients.messageId": messageId,
        type,
      });
      console.log(
        "Recherche par messageId:",
        messageId,
        "→",
        campaign?._id || "non trouvée",
      );
    }

    // Fallback par leadId avec diagnostic
    if (!campaign) {
      console.log("Fallback leadId:", leadId.toString());
      const allCampaigns = await Campaign.find({ type })
        .select("_id status recipients sentAt")
        .lean();
      console.log(
        "Campagnes dispo:",
        JSON.stringify(
          allCampaigns.map((c) => ({
            id: c._id,
            status: c.status,
            recipientIds: c.recipients.map((r: any) => r.leadId?.toString()),
            recipientMessageIds: c.recipients.map((r: any) => r.messageId),
          })),
          null,
          2,
        ),
      );

      campaign = await Campaign.findOne({
        "recipients.leadId": leadId,
        status: { $in: ["sent", "sending"] },
        type,
      }).sort({ sentAt: -1 });
    }

    console.log("Campaign finale:", campaign?._id || "undefined");
    if (!campaign) return;

    const inc: any = {};
    inc[`brevoStats.${eventType}`] = 1;
    await Campaign.updateOne({ _id: campaign._id }, { $inc: inc });

    const updated = await Campaign.findById(campaign._id);
    if (updated && updated.sentCount > 0) {
      await Campaign.updateOne(
        { _id: campaign._id },
        {
          $set: {
            deliveredCount: updated.brevoStats.delivered,
            "brevoStats.openRate": Math.round(
              (updated.brevoStats.opened / updated.sentCount) * 100,
            ),
            "brevoStats.clickRate": Math.round(
              (updated.brevoStats.clicked / updated.sentCount) * 100,
            ),
          },
        },
      );
    }
  } catch (error) {
    console.error("Erreur updateCampaignStats:", error);
  }
}

function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("33")) cleaned = "0" + cleaned.substring(2);
  return cleaned.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}
