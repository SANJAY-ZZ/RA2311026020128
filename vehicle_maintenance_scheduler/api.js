import axios from "axios";
import dotenv from "dotenv";
import { log } from "../logging_middleware/logger.js";

dotenv.config();

const BASE = "http://20.207.122.201/evaluation-service";

const headers = () => ({
  Authorization: `Bearer ${process.env.TOKEN}`,
  "Content-Type": "application/json"
});

export async function fetchDepots() {
  try {
    const res = await axios.get(`${BASE}/depots`, { headers: headers() });
    await log("backend", "info", "service", "fetched depots");
    return res.data.depots || [];
  } catch (e) {
    await log("backend", "error", "service", `depots fetch failed: ${e.message}`);
    throw e;
  }
}

export async function fetchVehicles() {
  try {
    const res = await axios.get(`${BASE}/vehicles`, { headers: headers() });
    await log("backend", "info", "service", "fetched vehicles");
    return res.data.vehicles || [];
  } catch (e) {
    await log("backend", "error", "service", `vehicles fetch failed: ${e.message}`);
    throw e;
  }
}