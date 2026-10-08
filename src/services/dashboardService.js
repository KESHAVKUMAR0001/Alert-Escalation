import Alert from "../models/Alert.js";
import { getRedisClient } from "../config/redis.js";
import logger from "../config/logger.js";

const CACHE_KEY = "dashboard:data";
const CACHE_TTL = 300; // 5 minutes

export const getDashboardData = async () => {
  const redis = getRedisClient();

  // Try fetching from Redis first
  if (redis) {
    try {
      const cachedData = await redis.get(CACHE_KEY);
      if (cachedData) {
        logger.info("Retrieved dashboard metrics from Redis cache");
        return JSON.parse(cachedData);
      }
    } catch (err) {
      logger.warn(`Redis get failed: ${err.message}. Fetching from MongoDB directly.`);
    }
  }

  // Calculate stats directly from MongoDB
  const total = await Alert.countDocuments();
  const open = await Alert.countDocuments({ status: "OPEN" });
  const warning = await Alert.countDocuments({ severity: "WARNING", status: { $ne: "RESOLVED" } });
  const critical = await Alert.countDocuments({ severity: "CRITICAL", status: { $ne: "RESOLVED" } });
  const resolved = await Alert.countDocuments({ status: "RESOLVED" });

  const escalatedAlerts = await Alert.find({ status: "ESCALATED" })
    .sort({ updatedAt: -1 })
    .limit(10);

  const recentAlerts = await Alert.find()
    .sort({ createdAt: -1 })
    .limit(10);

  const topDrivers = await Alert.aggregate([
    { $group: { _id: "$driverId", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  const dashboardPayload = {
    metrics: {
      total,
      open,
      warning,
      critical,
      resolved,
    },
    escalatedAlerts,
    recentAlerts,
    topDrivers,
  };

  // Cache result in Redis
  if (redis) {
    try {
      await redis.set(CACHE_KEY, JSON.stringify(dashboardPayload), "EX", CACHE_TTL);
      logger.info("Saved fresh dashboard metrics to Redis cache");
    } catch (err) {
      logger.warn(`Redis set failed: ${err.message}`);
    }
  }

  return dashboardPayload;
};