import dotenv from "dotenv";
import { fetchDepots, fetchVehicles } from "./api.js";
import { scheduleTasks } from "./schedulerService.js";
import { log } from "../logging_middleware/logger.js";

dotenv.config();

async function main() {
  try {
    await log("backend", "info", "handler", "scheduler start");

    const depots = await fetchDepots();
    const vehicles = await fetchVehicles();

    if (!depots.length) {
      throw new Error("no depots returned");
    }

    // 👉 pick first depot for demo (you can loop all later)
    const capacity = depots[0].MechanicHours;

    await log("backend", "info", "service", `capacity=${capacity}, tasks=${vehicles.length}`);

    const result = scheduleTasks(vehicles, capacity);

    console.log("\n=== SCHEDULER RESULT ===");
    console.log("Total Impact:", result.totalImpact);
    console.log("Used Hours:", result.usedHours);
    console.log("Selected Tasks:", result.selectedTasks.length);

  } catch (e) {
    await log("backend", "fatal", "handler", e.message);
    console.error("Error:", e.message);
  }
}

main();