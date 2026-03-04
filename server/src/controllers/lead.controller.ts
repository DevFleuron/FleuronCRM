import { Request, Response } from "express";
import Lead from "../models/Lead.model";
import Campaign from "../models/Campaign.model";

/**
 * GET /api/leads
 * Récupérer tous les leads avec filtres
 */
export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      rapport,
      source,
      dateFrom,
      dateTo,
      typeInstallation,
      smsEnvoye,
      emailEnvoye,
      search,
      departement,
      region,
      importId,
      limit = 50,
      skip = 0,
    } = req.query;

    // Construire le filtre
    const filter: any = {};

    if (rapport) filter.rapport = rapport;
    if (source) filter.source = source;
    if (typeInstallation) filter.typeInstallation = typeInstallation;
    if (importId) filter.lastImportId = importId;

    // Filtres dates
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom as string);
      if (dateTo) filter.date.$lte = new Date(dateTo as string);
    }

    // Filtres SMS/Email
    if (smsEnvoye === "yes") filter.smsEnvoye = true;
    if (smsEnvoye === "no") filter.smsEnvoye = false;
    if (emailEnvoye === "yes") filter.emailEnvoye = true;
    if (emailEnvoye === "no") filter.emailEnvoye = false;

    // Filtrer par département
    if (departement) {
      // Nettoyer le département (enlever espaces)
      const cleanDept = String(departement).trim();
      // Chercher les codes postaux qui commencent par ce département (avec ou sans espaces)
      filter.codePostal = {
        $regex: `^\\s*${cleanDept}`,
        $options: "i",
      };
      console.log(`Filtre département "${cleanDept}":`, filter.codePostal);
    }

    // Filtrer par région (basé sur départements)
    if (region) {
      const departements = getDepartementsFromRegion(region as string);
      if (departements.length > 0) {
        filter.codePostal = {
          $regex: `^\\s*(${departements.join("|")})`,
          $options: "i",
        };
        console.log(`Filtre région "${region}":`, filter.codePostal);
      }
    }
    // Recherche textuelle
    if (search) {
      filter.$or = [
        { nom: { $regex: search, $options: "i" } },
        { prenom: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { ref: { $regex: search, $options: "i" } },
      ];
    }

    const leads = await Lead.find(filter)
      .sort({ date: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await Lead.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        limit: Number(limit),
        skip: Number(skip),
      },
    });
  } catch (error: any) {
    console.error("Erreur getLeads:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des leads",
      error: error.message,
    });
  }
};

/**
 * Helper : Obtenir les départements d'une région
 */
function getDepartementsFromRegion(region: string): string[] {
  const regions: Record<string, string[]> = {
    "ile-de-france": ["75", "77", "78", "91", "92", "93", "94", "95"],
    "auvergne-rhone-alpes": [
      "01",
      "03",
      "07",
      "15",
      "26",
      "38",
      "42",
      "43",
      "63",
      "69",
      "73",
      "74",
    ],
    bretagne: ["22", "29", "35", "56"],
    "nouvelle-aquitaine": [
      "16",
      "17",
      "19",
      "23",
      "24",
      "33",
      "40",
      "47",
      "64",
      "79",
      "86",
      "87",
    ],
    occitanie: [
      "09",
      "11",
      "12",
      "30",
      "31",
      "32",
      "34",
      "46",
      "48",
      "65",
      "66",
      "81",
      "82",
    ],
    "grand-est": ["08", "10", "51", "52", "54", "55", "57", "67", "68", "88"],
    "hauts-de-france": ["02", "59", "60", "62", "80"],
    normandie: ["14", "27", "50", "61", "76"],
    "pays-de-la-loire": ["44", "49", "53", "72", "85"],
    "provence-alpes-cote-azur": ["04", "05", "06", "13", "83", "84"],
    "bourgogne-franche-comte": ["21", "25", "39", "58", "70", "71", "89", "90"],
    "centre-val-de-loire": ["18", "28", "36", "37", "41", "45"],
    corse: ["2A", "2B"],
  };

  return regions[region.toLowerCase()] || [];
}

/*
 GET /api/leads/:id
 Récupérer un lead par ID
 */
export const getLeadById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id);

    if (!lead) {
      res.status(404).json({
        success: false,
        message: "Lead non trouvé",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error: any) {
    console.error("Erreur getLeadById:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du lead",
      error: error.message,
    });
  }
};

/**
 PATCH /api/leads/:id
 Mettre à jour un lead
 */
export const updateLead = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const lead = await Lead.findById(id);

    if (!lead) {
      res.status(404).json({
        success: false,
        message: "Lead non trouvé",
      });
      return;
    }

    // Si changement de statut, ajouter à l'historique
    if (updates.rapport && updates.rapport !== lead.rapport) {
      lead.statusHistory.push({
        oldStatus: lead.rapport,
        newStatus: updates.rapport,
        changedAt: new Date(),
        source: "manual",
      });

      // Si le lead sort du statut NRP, le retirer des campagnes
      if (lead.rapport === "NRP" && updates.rapport !== "NRP") {
        await removeLeadFromActiveCampaigns(lead._id);
      }
    }

    // Appliquer les modifications
    Object.assign(lead, updates);
    await lead.save();

    res.status(200).json({
      success: true,
      message: "Lead mis à jour avec succès",
      data: lead,
    });
  } catch (error: any) {
    console.error("Erreur updateLead:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du lead",
      error: error.message,
    });
  }
};

/**
 * Fonction helper pour retirer un lead des campagnes
 */
async function removeLeadFromActiveCampaigns(leadId: any) {
  const campaigns = await Campaign.find({
    "recipients.leadId": leadId,
    "recipients.status": "pending",
    status: { $in: ["draft", "scheduled"] },
  });

  for (const campaign of campaigns) {
    const recipientIndex = campaign.recipients.findIndex(
      (r) =>
        r.leadId.toString() === leadId.toString() && r.status === "pending",
    );

    if (recipientIndex !== -1) {
      campaign.recipients[recipientIndex].status = "removed";
      campaign.recipients[recipientIndex].removedAt = new Date();
      campaign.recipients[recipientIndex].removeReason = "status_changed";
      campaign.removedCount = (campaign.removedCount || 0) + 1;
      await campaign.save();
    }
  }
}
