import Lead from "../models/Lead.model";
import { createObjectCsvWriter } from "csv-writer";
import xlsx from "xlsx";
import fs from "fs";
import path from "path";

export class ExportService {
  /**
   * Exporter des leads au format CSV
   */
  static async exportToCSV(filters: any = {}) {
    try {
      // Récupérer les leads
      const leads = await Lead.find(filters).lean();

      if (leads.length === 0) {
        return { success: false, error: "Aucun lead à exporter" };
      }

      // Créer le dossier exports si nécessaire
      const exportDir = path.join(__dirname, "../../exports");
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
      }

      // Nom du fichier
      const filename = `leads-export-${Date.now()}.csv`;
      const filepath = path.join(exportDir, filename);

      // Créer le CSV writer
      const csvWriter = createObjectCsvWriter({
        path: filepath,
        header: [
          { id: "ref", title: "Référence" },
          { id: "date", title: "Date" },
          { id: "heure", title: "Heure" },
          { id: "nom", title: "Nom" },
          { id: "prenom", title: "Prénom" },
          { id: "mobile", title: "Mobile" },
          { id: "email", title: "Email" },
          { id: "adresse", title: "Adresse" },
          { id: "codePostal", title: "Code Postal" },
          { id: "source", title: "Source" },
          { id: "telepro", title: "Téléprospecteur" },
          { id: "equipe", title: "Équipe" },
          { id: "rapport", title: "Rapport" },
          { id: "observation", title: "Observation" },
          { id: "typeInstallation", title: "Type Installation" },
          { id: "smsEnvoye", title: "SMS Envoyé" },
          { id: "smsCount", title: "Nombre SMS" },
          { id: "emailEnvoye", title: "Email Envoyé" },
          { id: "emailCount", title: "Nombre Emails" },
        ],
      });

      // Formater les données
      const records = leads.map((lead) => ({
        ref: lead.ref,
        date: lead.date ? new Date(lead.date).toLocaleDateString("fr-FR") : "",
        heure: lead.heure,
        nom: lead.nom,
        prenom: lead.prenom,
        mobile: lead.mobile,
        email: lead.email,
        adresse: lead.adresse,
        codePostal: lead.codePostal,
        source: lead.source,
        telepro: lead.telepro,
        equipe: lead.equipe,
        rapport: lead.rapport,
        observation: lead.observation,
        typeInstallation: lead.typeInstallation,
        smsEnvoye: lead.smsEnvoye ? "Oui" : "Non",
        smsCount: lead.smsCount || 0,
        emailEnvoye: lead.emailEnvoye ? "Oui" : "Non",
        emailCount: lead.emailCount || 0,
      }));

      await csvWriter.writeRecords(records);

      console.log(`CSV créé: ${filename} (${leads.length} leads)`);

      return {
        success: true,
        filename,
        filepath,
        count: leads.length,
      };
    } catch (error: any) {
      console.error("Erreur exportToCSV:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Exporter des leads au format Excel
   */
  static async exportToExcel(filters: any = {}) {
    try {
      // Récupérer les leads
      const leads = await Lead.find(filters).lean();

      if (leads.length === 0) {
        return { success: false, error: "Aucun lead à exporter" };
      }

      // Créer le dossier exports si nécessaire
      const exportDir = path.join(__dirname, "../../exports");
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
      }

      // Nom du fichier
      const filename = `leads-export-${Date.now()}.xlsx`;
      const filepath = path.join(exportDir, filename);

      // Formater les données
      const data = leads.map((lead) => ({
        Référence: lead.ref,
        Date: lead.date ? new Date(lead.date).toLocaleDateString("fr-FR") : "",
        Heure: lead.heure,
        Nom: lead.nom,
        Prénom: lead.prenom,
        Mobile: lead.mobile,
        Email: lead.email,
        Adresse: lead.adresse,
        "Code Postal": lead.codePostal,
        Source: lead.source,
        Téléprospecteur: lead.telepro,
        Équipe: lead.equipe,
        Rapport: lead.rapport,
        Observation: lead.observation,
        "Type Installation": lead.typeInstallation,
        "SMS Envoyé": lead.smsEnvoye ? "Oui" : "Non",
        "Nombre SMS": lead.smsCount || 0,
        "Email Envoyé": lead.emailEnvoye ? "Oui" : "Non",
        "Nombre Emails": lead.emailCount || 0,
      }));

      // Créer le workbook
      const ws = xlsx.utils.json_to_sheet(data);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Leads");

      // Largeur des colonnes
      const colWidths = [
        { wch: 15 }, // Référence
        { wch: 12 }, // Date
        { wch: 8 }, // Heure
        { wch: 20 }, // Nom
        { wch: 20 }, // Prénom
        { wch: 15 }, // Mobile
        { wch: 25 }, // Email
        { wch: 30 }, // Adresse
        { wch: 10 }, // Code Postal
        { wch: 15 }, // Source
        { wch: 20 }, // Téléprospecteur
        { wch: 15 }, // Équipe
        { wch: 20 }, // Rapport
        { wch: 30 }, // Observation
        { wch: 20 }, // Type Installation
        { wch: 12 }, // SMS Envoyé
        { wch: 12 }, // Nombre SMS
        { wch: 12 }, // Email Envoyé
        { wch: 12 }, // Nombre Emails
      ];
      ws["!cols"] = colWidths;

      // Écrire le fichier
      xlsx.writeFile(wb, filepath);

      console.log(`Excel créé: ${filename} (${leads.length} leads)`);

      return {
        success: true,
        filename,
        filepath,
        count: leads.length,
      };
    } catch (error: any) {
      console.error("Erreur exportToExcel:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Supprimer un fichier d'export
   */
  static deleteExportFile(filename: string) {
    try {
      const filepath = path.join(__dirname, "../../exports", filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        console.log(`Fichier supprimé: ${filename}`);
      }
    } catch (error: any) {
      console.error("Erreur deleteExportFile:", error);
    }
  }
}
