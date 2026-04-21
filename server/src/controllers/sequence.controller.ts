import { Request, Response } from "express";
import SequenceCampaign from "../models/SequenceCampaign.model";
import { SequenceService } from "../services/sequence.service";

/**
 * POST /api/sequences
 * Créer une nouvelle séquence automatique
 */
export const createSequence = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, steps, leadIds } = req.body;

    // Validation
    if (!name || !steps || !leadIds || leadIds.length === 0) {
      res.status(400).json({
        success: false,
        message: "Données manquantes",
      });
      return;
    }

    // Créer la séquence
    const result = await SequenceService.createSequence({
      name,
      steps,
      leadIds,
    });

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: result.message || result.error,
        error: result.error,
        excludedLeads: result.excludedLeads,
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: `Séquence créée avec ${leadIds.length} leads`,
      data: result.data,
    });
  } catch (error: any) {
    console.error("Erreur createSequence:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de la séquence",
      error: error.message,
    });
  }
};

/**
 * GET /api/sequences
 * Récupérer toutes les séquences
 */
export const getSequences = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const sequences = await SequenceCampaign.find()
      .sort({ createdAt: -1 })
      .populate("steps.templateId", "name type");

    res.status(200).json({
      success: true,
      data: sequences,
    });
  } catch (error: any) {
    console.error("Erreur getSequences:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des séquences",
      error: error.message,
    });
  }
};

/**
 * GET /api/sequences/:id
 * Récupérer une séquence par ID
 */
export const getSequenceById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const sequence = await SequenceCampaign.findById(id)
      .populate("steps.templateId")
      .populate("recipients.leadId");

    if (!sequence) {
      res.status(404).json({
        success: false,
        message: "Séquence non trouvée",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: sequence,
    });
  } catch (error: any) {
    console.error("Erreur getSequenceById:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la séquence",
      error: error.message,
    });
  }
};

/**
 * POST /api/sequences/:id/stop
 * Arrêter une séquence complètement
 */
export const stopSequence = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const sequence = await SequenceCampaign.findById(id);

    if (!sequence) {
      res.status(404).json({
        success: false,
        message: "Séquence non trouvée",
      });
      return;
    }

    // Arrêter tous les recipients actifs
    sequence.recipients.forEach((recipient) => {
      if (
        recipient.status === "in_progress" ||
        recipient.status === "pending"
      ) {
        recipient.status = "stopped";
        recipient.stoppedAt = new Date();
        recipient.stopReason = "Manually stopped";
      }
    });

    sequence.status = "completed";
    sequence.completedAt = new Date();
    await sequence.save();

    res.status(200).json({
      success: true,
      message: "Séquence arrêtée",
      data: sequence,
    });
  } catch (error: any) {
    console.error("Erreur stopSequence:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'arrêt de la séquence",
      error: error.message,
    });
  }
};
