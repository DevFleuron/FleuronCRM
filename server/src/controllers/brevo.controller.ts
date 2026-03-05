import { Request, Response } from "express";
import Lead from "../models/Lead.model";
import Campaign from "../models/Campaign.model";

export const handleBrevoWebhook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const event = req.body;
    console.log("Webhook Brevo reçu:", event.event, event.email || event.to);

    if (event.event === "delivered" && event.email) {
      const lead = await Lead.findOneAndUpdate(
        { email: event.email },
        {
          $inc: { "brevoStats.emailDelivered": 1 },
          $set: { "brevoStats.lastEmailSentAt": new Date() },
        },
        { new: true },
      );
      if (lead) await updateCampaignStats(lead._id, "delivered", "email");
    }

    if (event.event === "opened" && event.email) {
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
      if (lead) await updateCampaignStats(lead._id, "opened", "email");
    }

    if (event.event === "click" && event.email) {
      const lead = await Lead.findOneAndUpdate(
        { email: event.email },
        {
          $inc: { "brevoStats.emailClicked": 1 },
          $set: { "brevoStats.lastEmailClickedAt": new Date() },
        },
        { new: true },
      );
      if (lead) await updateCampaignStats(lead._id, "clicked", "email");
    }

    if (event.event === "hard_bounce" && event.email) {
      const lead = await Lead.findOneAndUpdate(
        { email: event.email },
        { $inc: { "brevoStats.emailBounced": 1 } },
        { new: true },
      );
      if (lead) await updateCampaignStats(lead._id, "bounced", "email");
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
      if (lead) await updateCampaignStats(lead._id, "delivered", "sms");
    }

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Erreur handleBrevoWebhook:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

async function updateCampaignStats(
  leadId: any,
  eventType: "delivered" | "opened" | "clicked" | "bounced",
  type: "email" | "sms",
) {
  try {
    const campaign = await Campaign.findOne({
      "recipients.leadId": leadId,
      "recipients.status": "sent",
      status: "sent",
      type,
    }).sort({ sentAt: -1 }); // La plus récente

    if (!campaign) return;

    const inc: any = {};
    inc[`brevoStats.${eventType}`] = 1;

    if (eventType === "delivered") {
      campaign.deliveredCount = (campaign.deliveredCount || 0) + 1;
    }

    await Campaign.updateOne({ _id: campaign._id }, { $inc: inc });

    // Recalculer les taux
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
