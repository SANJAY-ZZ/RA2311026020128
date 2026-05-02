import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Allowed values (STRICT as per problem)
const allowedStacks = ["backend", "frontend"];

const allowedLevels = ["debug", "info", "warn", "error", "fatal"];

const allowedPackages = [
  // backend only
  "cache",
  "controller",
  "cron_job",
  "db",
  "domain",
  "handler",
  "repository",
  "route",
  "service",

  // frontend only
  "api",
  "component",
  "hook",
  "page",
  "state",
  "style",

  // both
  "auth",
  "config",
  "middleware",
  "utils"
];

export async function log(stack, level, pkg, message) {
  try {
    // validation checks (IMPORTANT for evaluation)
    if (!allowedStacks.includes(stack)) {
      throw new Error(`Invalid stack: ${stack}`);
    }

    if (!allowedLevels.includes(level)) {
      throw new Error(`Invalid level: ${level}`);
    }

    if (!allowedPackages.includes(pkg)) {
      throw new Error(`Invalid package: ${pkg}`);
    }

    if (!message || typeof message !== "string") {
      throw new Error("Message must be a non-empty string");
    }

    // API call
    const response = await axios.post(
      process.env.LOG_API,
      {
        stack,
        level,
        package: pkg,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;

  } catch (error) {
    // do NOT crash app
    console.error("Logging failed:", error.message);
  }
}