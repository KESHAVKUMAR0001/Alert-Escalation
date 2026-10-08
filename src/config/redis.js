import Redis from "ioredis";
import logger from "./logger.js";

let client = null;

const connectRedis = () => {
  try {
    const options = {
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT) || 6379,
      connectTimeout: 5000,
      maxRetriesPerRequest: 1,
      retryStrategy: () => null, // Don't crash if Redis is unavailable
    };

    if (process.env.REDIS_PASSWORD) {
      options.password = process.env.REDIS_PASSWORD;
    }

    client = new Redis(options);

    client.on("connect", () => {
      logger.info("Redis connected successfully");
    });

    client.on("error", (err) => {
      logger.warn(`Redis connection unavailable: ${err.message}. Proceeding with direct DB queries.`);
    });
  } catch (err) {
    logger.warn(`Failed to initialize Redis client: ${err.message}`);
    client = null;
  }

  return client;
};

const getRedisClient = () => client;

export { connectRedis, getRedisClient };