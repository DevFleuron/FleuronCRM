import express from "express";
import {
  getLeads,
  getLeadById,
  updateLead,
} from "../controllers/lead.controller";

const router = express.Router();

/**
 * @route   GET /api/leads
 * @desc    Récupérer tous les leads avec filtres
 */
router.get("/", getLeads);

/**
 * @route   GET /api/leads/:id
 * @desc    Récupérer un lead par ID
 */
router.get("/:id", getLeadById);

/**
 * @route   PATCH /api/leads/:id
 * @desc    Mettre à jour un lead
 */
router.patch("/:id", updateLead);

export default router;
