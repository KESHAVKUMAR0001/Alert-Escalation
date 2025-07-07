import Redis from "ioredis";
import logger from "./logger.js";

let client = null;

const connectRedis = () => {
  const options = {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    connectTimeout: 10000,
  };

  // Only include password if one exists
  if (process.env.REDIS_PASSWORD) {
    options.password = process.env.REDIS_PASSWORD;
  }

  client = new Redis(options);

  client.on("ready", () => {
    logger.info("Redis connection established");
  });

  client.on("error", (err) => {
    logger.error(`Redis error: ${err.message}`);
  });

  return client;
};

const getRedisClient = () => client;

export { connectRedis, getRedisClient };