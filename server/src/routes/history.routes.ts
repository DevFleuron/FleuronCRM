import express from "express";
import {
  getImportHistory,
  getImportHistoryById,
} from "../controllers/history.controller";

const router = express.Router();

/**
 * @route   GET /api/history
 * @desc    Récupérer l'historique des imports
 */
router.get("/", getImportHistory);

/**
 * @route   GET /api/history/:id
 * @desc    Récupérer un import spécifique avec détails
 */
router.get("/:id", getImportHistoryById);

export default router;
