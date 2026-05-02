import { log } from "./logger.js";

(async () => {
  await log("backend", "info", "handler", "test log working");
})();