import { Request, Response } from "express";
import Lead from "../models/Lead.model";
import Campaign from "../models/Campaign.model";

export const handleBrevoWebhook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const event = req.body;
    const messageId = event["message-id"] || event.messageId;
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
  messageId?: string,
) {
  try {
    const query: any = {
      "recipients.leadId": leadId,
      status: "sent",
      type,
    };

    if (messageId) {
      query["recipients.messageId"] = messageId;
    }

    const campaign = await Campaign.findOne(query).sort({ sentAt: -1 });

    console.log(
      "Campaign trouvée:",
      campaign?._id,
      "pour lead:",
      leadId,
      "messageId:",
      messageId,
    );

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
