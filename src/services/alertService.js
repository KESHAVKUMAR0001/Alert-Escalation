import Alert, { SOURCE_TYPES } from "../models/Alert.js";
import { ApiError } from "../utils/apiError.js";
import { getRedisClient } from "../config/redis.js";
import logger from "../config/logger.js";

// Helper to invalidate Redis dashboard cache
export const invalidateDashboardCache = async () => {
  const redis = getRedisClient();
  if (!redis) return;
  try {
    await redis.del("dashboard:data");
    logger.info("Dashboard Redis cache invalidated");
  } catch (err) {
    logger.warn(`Redis cache invalidation skipped: ${err.message}`);
  }
};

// Initial severity lookup based on 3 core business types
const getInitialSeverity = (sourceType) => {
  switch (sourceType) {
    case "overspeed":
      return "INFO";
    case "feedback_negative":
      return "WARNING";
    case "compliance":
      return "CRITICAL";
    default:
      return "INFO";
  }
};

export const createAlertService = async (data) => {
  const { driverId, sourceType, message } = data;

  if (!driverId || !sourceType) {
    throw new ApiError(400, "driverId and sourceType are required");
  }

  if (!SOURCE_TYPES.includes(sourceType)) {
    throw new ApiError(
      400,
      `Invalid sourceType. Must be one of: ${SOURCE_TYPES.join(", ")}`
    );
  }

  const severity = getInitialSeverity(sourceType);
  const defaultMessage =
    message || `Alert logged for ${sourceType.replace("_", " ")}`;

  // Create initial alert object
  const alert = new Alert({
    driverId,
    sourceType,
    message: defaultMessage,
    severity,
    status: "OPEN",
    history: [
      {
        fromState: null,
        toState: "OPEN",
        reason: "Alert created",
      },
    ],
  });

  // Evaluate Escalation Thresholds for repeat events
  if (sourceType === "overspeed") {
    // Window: 60 minutes, Threshold: 3 occurrences (including this new alert)
    const windowStart = new Date(Date.now() - 60 * 60 * 1000);
    const countInWindow = await Alert.countDocuments({
      driverId,
      sourceType: "overspeed",
      createdAt: { $gte: windowStart },
    });

    if (countInWindow + 1 >= 3) {
      alert.severity = "CRITICAL";
      alert.status = "ESCALATED";
      alert.escalationReason = `Driver ${driverId} exceeded speed limit ${countInWindow + 1} times within 60 minutes.`;
      alert.history.push({
        fromState: "OPEN",
        toState: "ESCALATED",
        reason: alert.escalationReason,
      });
    }
  } else if (sourceType === "feedback_negative") {
    // Window: 24 hours (1440 mins), Threshold: 2 occurrences (including this new alert)
    const windowStart = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const countInWindow = await Alert.countDocuments({
      driverId,
      sourceType: "feedback_negative",
      createdAt: { $gte: windowStart },
    });

    if (countInWindow + 1 >= 2) {
      alert.severity = "CRITICAL";
      alert.status = "ESCALATED";
      alert.escalationReason = `Driver ${driverId} received ${countInWindow + 1} negative feedbacks within 24 hours.`;
      alert.history.push({
        fromState: "OPEN",
        toState: "ESCALATED",
        reason: alert.escalationReason,
      });
    }
  } else if (sourceType === "compliance") {
    alert.escalationReason = `Immediate compliance failure logged for Driver ${driverId}.`;
  }

  await alert.save();
  await invalidateDashboardCache();
  return alert;
};

export const getAlertsService = async () => {
  return Alert.find().sort({ createdAt: -1 }).limit(50);
};

export const getAlertByIdService = async (alertId) => {
  const alert = await Alert.findOne({ alertId });
  if (!alert) {
    throw new ApiError(404, "Alert not found");
  }
  return alert;
};

export const resolveAlertService = async (alertId) => {
  const alert = await Alert.findOne({ alertId });
  if (!alert) {
    throw new ApiError(404, "Alert not found");
  }

  if (alert.status === "RESOLVED") {
    throw new ApiError(400, "Alert is already resolved");
  }

  const previousState = alert.status;
  alert.status = "RESOLVED";
  alert.history.push({
    fromState: previousState,
    toState: "RESOLVED",
    reason: "Resolved manually by analyst",
  });

  await alert.save();
  await invalidateDashboardCache();
  return alert;
};