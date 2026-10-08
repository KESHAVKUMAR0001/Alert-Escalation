import cron from "node-cron";
import Alert from "../models/Alert.js";
import logger from "../config/logger.js";

export const startAlertCronJob = () => {
  // Schedule to run every 5 minutes
  const schedule = "*/5 * * * *";

  cron.schedule(schedule, async () => {
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const staleEscalations = await Alert.countDocuments({
        status: "ESCALATED",
        updatedAt: { $lt: twentyFourHoursAgo },
      });

      if (staleEscalations > 0) {
        logger.warn(
          `[CRON MONITOR] Found ${staleEscalations} escalated alerts remaining unresolved for > 24 hours.`
        );
      } else {
        logger.info("[CRON MONITOR] System audit complete: All escalated alerts are actively being managed.");
      }
    } catch (err) {
      logger.error("[CRON MONITOR] Error executing background audit cron job", {
        error: err.message,
      });
    }
  });

  logger.info("Background node-cron alert monitoring job scheduled (runs every 5 minutes)");
};
