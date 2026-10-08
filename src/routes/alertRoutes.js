import express from "express";
import {
  createAlert,
  getAlerts,
  getAlert,
  resolveAlert,
} from "../controllers/alertController.js";

const router = express.Router();

router.post("/", createAlert);
router.get("/", getAlerts);
router.get("/:alertId", getAlert);
router.patch("/:alertId/resolve", resolveAlert);

export default router;