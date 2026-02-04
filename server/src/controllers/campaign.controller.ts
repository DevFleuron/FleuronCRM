import { Request, Response } from "express";
import Campaign from "../models/Campaign.model";
import Lead from "../models/Lead.model";

/**
 * GET /api/campaigns
 * Récupérer toutes les campagnes
 */
export const getCampaigns = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { status, type, limit = 50, skip = 0 } = req.query;

    const filter: any = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const campaigns = await Campaign.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip))
      .populate("templateId", "name type");

    const total = await Campaign.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: campaigns,
      pagination: {
        total,
        limit: Number(limit),
        skip: Number(skip),
      },
    });
  } catch (error: any) {
    console.error("❌ Erreur getCampaigns:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des campagnes",
      error: error.message,
    });
  }
};

/**
 * POST /api/campaigns
 * Créer une nouvelle campagne
 */
export const createCampaign = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, type, templateId, recipients, scheduledAt } = req.body;

    // Valider les données
    if (
      !name ||
      !type ||
      !templateId ||
      !recipients ||
      recipients.length === 0
    ) {
      res.status(400).json({
        success: false,
        message: "Données manquantes",
      });
      return;
    }

    // Récupérer les leads
    const leads = await Lead.find({ _id: { $in: recipients } });

    if (leads.length === 0) {
      res.status(400).json({
        success: false,
        message: "Aucun lead trouvé",
      });
      return;
    }

    // Créer les recipients
    const campaignRecipients = leads.map((lead) => ({
      leadId: lead._id,
      leadRef: lead.ref,
      status: "pending",
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
    }));

    // Créer la campagne
    const campaign = await Campaign.create({
      name,
      type,
      templateId,
      recipients: campaignRecipients,
      recipientsCount: campaignRecipients.length,
      status: scheduledAt ? "scheduled" : "draft",
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      createdBy: req.body.userId || "system", // TODO: Récupérer depuis la session
    });

    res.status(201).json({
      success: true,
      message: "Campagne créée avec succès",
      data: campaign,
    });
  } catch (error: any) {
    console.error("❌ Erreur createCampaign:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de la campagne",
      error: error.message,
    });
  }
};

/**
 * GET /api/campaigns/:id
 * Récupérer une campagne par ID
 */
export const getCampaignById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findById(id).populate("templateId");

    if (!campaign) {
      res.status(404).json({
        success: false,
        message: "Campagne non trouvée",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: campaign,
    });
  } catch (error: any) {
    console.error("❌ Erreur getCampaignById:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la campagne",
      error: error.message,
    });
  }
};
