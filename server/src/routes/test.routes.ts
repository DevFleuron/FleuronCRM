import { Router } from "express";
import { SequenceService } from "../services/sequence.service";

const router = Router();

router.post("/execute-sequences", async (req, res) => {
  try {
    console.log("🧪 Test manuel des séquences...");
    await SequenceService.executeScheduledActions();
    res.json({ success: true, message: "Séquences exécutées" });
  } catch (error: any) {
    console.error("Erreur test séquences:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
