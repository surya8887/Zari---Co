import app from "./app.js";
import env from "./config/env.js";
import logger from "./config/logger.js";
import prisma from "./config/db.js";

const PORT = Number(env.PORT) || 5000;

const startServer = async () => {
  try {
    // Connect Database
    await prisma.$connect();
    logger.info("Connected to database");

    // Start Server
    const server = app.listen(PORT, () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
    });

    // Graceful Shutdown
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received, shutting down server...`);

      server.close(async () => {
        try {
          await prisma.$disconnect();
          logger.info("Database disconnected");
          logger.info("Server closed successfully");
          process.exit(0);
        } catch (error) {
          logger.error(error, "Error during shutdown");
          process.exit(1);
        }
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    logger.error(error, "Failed to start server");
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();