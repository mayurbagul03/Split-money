import { createApp } from "./app.js";
import { config } from "./config.js";
import { prisma } from "./db.js";

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(
    `API running on http://localhost:${config.port} (${config.nodeEnv})`,
  );
});

function shutdown(signal: string) {
  console.log(`${signal} received, shutting down`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
