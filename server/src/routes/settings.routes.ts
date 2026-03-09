import { Router } from "express";
import {
  getSettings,
  addRapport,
  deleteRapport,
  addSource,
  deleteSource,
} from "../controllers/settings.controller";

const router = Router();

router.get("/", getSettings);
router.post("/rapports", addRapport);
router.delete("/rapports/:value", deleteRapport);
router.post("/sources", addSource);
router.delete("/sources/:value", deleteSource);

export default router;
