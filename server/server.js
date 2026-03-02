import "dotenv/config";
import express from "express";
import cors from "cors";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import { seedProblems } from "./seed/problems.js";
import problemRoutes from "./routes/problems.js";
import submitRoutes from "./routes/submit.js";

const app = express();
const PORT = process.env.PORT || 5000;
const HARDHAT_PORT = process.env.HARDHAT_PORT || 8545;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/api/problems", problemRoutes);
app.use("/api/problems", submitRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

function startHardhatNode() {
  return new Promise((resolve, reject) => {
    const hardhat = spawn(
      "npx",
      ["hardhat", "node", "--port", String(HARDHAT_PORT)],
      {
        cwd: fileURLToPath(new URL(".", import.meta.url)),
        shell: true,
        stdio: ["ignore", "pipe", "pipe"],
      }
    );

    let started = false;

    hardhat.stdout.on("data", (data) => {
      const output = data.toString();
      if (!started && output.includes("Started HTTP")) {
        started = true;
        console.log(`Hardhat node running on port ${HARDHAT_PORT}`);
        resolve(hardhat);
      }
    });

    hardhat.stderr.on("data", (data) => {
      const msg = data.toString();
      if (msg.includes("error") && !started) {
        console.error("Hardhat stderr:", msg);
      }
    });

    hardhat.on("close", (code) => {
      if (!started) {
        reject(new Error(`Hardhat node exited with code ${code}`));
      }
    });

    setTimeout(() => {
      if (!started) {
        started = true;
        console.log("Hardhat node startup wait exceeded, continuing...");
        resolve(hardhat);
      }
    }, 30000);
  });
}

async function start() {
  await connectDB();
  await seedProblems();

  try {
    console.log("Starting Hardhat development node...");
    const hardhatProcess = await startHardhatNode();

    process.on("SIGINT", () => {
      console.log("\nShutting down...");
      hardhatProcess.kill();
      process.exit(0);
    });

    process.on("SIGTERM", () => {
      hardhatProcess.kill();
      process.exit(0);
    });
  } catch (error) {
    console.error("Failed to start Hardhat node:", error.message);
    console.error("Make sure no other process is using port", HARDHAT_PORT);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
}

start();
