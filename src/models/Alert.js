import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const ALERT_STATES = ["OPEN", "ESCALATED", "RESOLVED"];
export const ALERT_LEVELS = ["INFO", "WARNING", "CRITICAL"];
export const SOURCE_TYPES = ["overspeed", "feedback_negative", "compliance"];

const historySchema = new mongoose.Schema(
  {
    fromState: { type: String, default: null },
    toState: { type: String, required: true },
    reason: { type: String, required: true },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const alertSchema = new mongoose.Schema(
  {
    alertId: {
      type: String,
      unique: true,
      default: () => uuidv4(),
    },
    driverId: {
      type: String,
      required: true,
      index: true,
    },
    sourceType: {
      type: String,
      enum: SOURCE_TYPES,
      required: true,
      index: true,
    },
    message: {
      type: String,
      default: "",
    },
    severity: {
      type: String,
      enum: ALERT_LEVELS,
      required: true,
    },
    status: {
      type: String,
      enum: ALERT_STATES,
      default: "OPEN",
      index: true,
    },
    escalationReason: {
      type: String,
      default: "",
    },
    history: {
      type: [historySchema],
      default: [],
    },
  },
  { timestamps: true }
);

alertSchema.index({ driverId: 1, sourceType: 1, createdAt: -1 });

const Alert = mongoose.model("Alert", alertSchema);

export default Alert;