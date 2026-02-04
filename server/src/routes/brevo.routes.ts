import express from "express";
import { handleBrevoWebhook } from "../controllers/brevo.controller";

const router = express.Router();

/**
 * @route   POST /api/webhooks/brevo
 * @desc    Recevoir les webhooks de Brevo
 * @note    Cette route doit être accessible publiquement (pas d'auth)
 */
router.post("/brevo", handleBrevoWebhook);

export default router;
