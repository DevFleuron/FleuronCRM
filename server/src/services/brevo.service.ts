import axios from "axios";
import Lead from "../models/Lead.model";
import { getEmailTemplate } from "@/src/templates/email-layout";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = "https://api.brevo.com/v3";
const BREVO_SENDER_EMAIL =
  process.env.BREVO_SENDER_EMAIL || "contact@fleuron-industries.fr";
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || "Fleuron Industries";

export class BrevoService {
  /**
   * Envoyer un SMS via Brevo
   */
  static async sendSMS(to: string, content: string) {
    try {
      console.log(`Envoi SMS vers ${to}`);

      // Formater le numéro (Brevo attend +33...)
      let formattedNumber = to.replace(/\s/g, ""); // Enlever les espaces

      // Si commence par 0, remplacer par +33
      if (formattedNumber.startsWith("0")) {
        formattedNumber = "+33" + formattedNumber.substring(1);
      }

      // Si ne commence pas par +, ajouter +33
      if (!formattedNumber.startsWith("+")) {
        formattedNumber = "+33" + formattedNumber;
      }

      const response = await axios.post(
        `${BREVO_API_URL}/transactionalSMS/sms`,
        {
          sender: "FleuronCRM",
          recipient: formattedNumber,
          content,
          type: "transactional",
        },
        {
          headers: {
            "api-key": BREVO_API_KEY,
            "Content-Type": "application/json",
          },
        },
      );

      console.log(`SMS envoyé vers ${to}`);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Erreur envoi SMS:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /*
   * Envoyer un Email via Brevo
   */
  static async sendEmail(to: string, subject: string, content: string) {
    try {
      console.log(`Envoi Email vers ${to}`);

      //  Wrapper le contenu dans le template HTML stylisé
      const htmlContent = getEmailTemplate(content);

      const response = await axios.post(
        `${BREVO_API_URL}/smtp/email`,
        {
          sender: {
            name: BREVO_SENDER_NAME,
            email: BREVO_SENDER_EMAIL,
          },
          to: [{ email: to }],
          subject,
          htmlContent,
        },
        {
          headers: {
            "api-key": BREVO_API_KEY,
            "Content-Type": "application/json",
          },
        },
      );

      console.log(`Email envoyé vers ${to}`);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error(
        "Erreur envoi Email:",
        error.response?.data || error.message,
      );
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /*
   * Remplacer les variables dans le template
   */
  static replaceVariables(content: string, lead: any): string {
    const now = new Date();
    const dateFormatted = now.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    return content
      .replace(/{{nom}}/g, lead.nom || "")
      .replace(/{{prenom}}/g, lead.prenom || "")
      .replace(/{{email}}/g, lead.email || "")
      .replace(/{{mobile}}/g, lead.mobile || "")
      .replace(/{{ref}}/g, lead.ref || "")
      .replace(/{{adresse}}/g, lead.adresse || "")
      .replace(/{{codePostal}}/g, lead.codePostal || "")
      .replace(/{{source}}/g, lead.source || "")
      .replace(/{{telepro}}/g, lead.telepro || "")
      .replace(/{{date}}/g, dateFormatted)
      .replace(/{{heure}}/g, now.toLocaleTimeString("fr-FR"));
  }

  /**
   * Valider un numéro de téléphone
   */
  static isValidPhoneNumber(phone: string): boolean {
    if (!phone) return false;

    // Enlever les espaces
    const cleaned = phone.replace(/\s/g, "");

    // Doit contenir 10 chiffres minimum
    const digits = cleaned.replace(/\D/g, "");
    return digits.length >= 10;
  }

  /**
   * Valider un email
   */
  static isValidEmail(email: string): boolean {
    if (!email) return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
