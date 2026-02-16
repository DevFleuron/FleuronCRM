import { Request, Response } from "express";
import Lead from "../models/Lead.model";

/**
 POST /api/webhooks/brevo
 Recevoir les événements de Brevo
 */

export const handleBrevoWebhook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const event = req.body;

    console.log(" Webhook Brevo reçu:", event.event, event.email || event.to);

    // Email delivered
    if (event.event === "delivered" && event.email) {
      await Lead.updateOne(
        { email: event.email },
        {
          $inc: { "brevoStats.emailDelivered": 1 },
          $set: { "brevoStats.lastEmailSentAt": new Date() },
        },
      );
    }

    // Email opened
    if (event.event === "opened" && event.email) {
      await Lead.updateOne(
        { email: event.email },
        {
          $inc: { "brevoStats.emailOpened": 1 },
          $set: {
            "brevoStats.lastEmailOpenedAt": new Date(),
            emailEnvoye: true,
          },
        },
      );
    }

    // Email clicked
    if (event.event === "click" && event.email) {
      await Lead.updateOne(
        { email: event.email },
        {
          $inc: { "brevoStats.emailClicked": 1 },
          $set: { "brevoStats.lastEmailClickedAt": new Date() },
        },
      );
    }

    // Email bounced
    if (event.event === "hard_bounce" && event.email) {
      await Lead.updateOne(
        { email: event.email },
        {
          $inc: { "brevoStats.emailBounced": 1 },
        },
      );
    }

    // SMS delivered
    if (event.event === "delivered" && event.to) {
      const mobile = formatPhoneNumber(event.to);
      await Lead.updateOne(
        { mobile },
        {
          $inc: { "brevoStats.smsDelivered": 1 },
          $set: {
            "brevoStats.lastSmsSentAt": new Date(),
            smsEnvoye: true,
          },
        },
      );
    }

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Erreur handleBrevoWebhook:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/*
  Formater un numéro de téléphone
 */
function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("33")) {
    cleaned = "0" + cleaned.substring(2);
  }

  return cleaned.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}
