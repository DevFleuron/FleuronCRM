import express from "express";
import {
  getCampaigns,
  createCampaign,
  getCampaignById,
} from "../controllers/campaign.controller";

const router = express.Router();

/**
 * @route   GET /api/campaigns
 * @desc    Récupérer toutes les campagnes
 */
router.get("/", getCampaigns);

/**
 * @route   POST /api/campaigns
 * @desc    Créer une nouvelle campagne
 */
router.post("/", createCampaign);

/**
 * @route   GET /api/campaigns/:id
 * @desc    Récupérer une campagne par ID
 */
router.get("/:id", getCampaignById);

export default router;
