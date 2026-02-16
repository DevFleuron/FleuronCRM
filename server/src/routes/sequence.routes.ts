import { Router } from "express";
import {
  createSequence,
  getSequences,
  getSequenceById,
  stopSequence,
} from "../controllers/sequence.controller";

const router = Router();

router.post("/", createSequence);
router.get("/", getSequences);
router.get("/:id", getSequenceById);
router.post("/:id/stop", stopSequence);

export default router;
