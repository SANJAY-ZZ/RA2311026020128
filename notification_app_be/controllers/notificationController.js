import { addNotification, fetchNotifications } from "../services/notificationService.js";
import { log } from "../../logging_middleware/logger.js";

export async function createNotification(req, res) {
  try {
    const data = req.body;
    await log("backend", "info", "controller", "create notification");

    const result = addNotification(data);
    res.json(result);
  } catch (e) {
    await log("backend", "error", "controller", e.message);
    res.status(500).json({ error: e.message });
  }
}

export async function getNotifications(req, res) {
  try {
    await log("backend", "info", "controller", "get notifications");

    const result = fetchNotifications();
    res.json(result);
  } catch (e) {
    await log("backend", "error", "controller", e.message);
    res.status(500).json({ error: e.message });
  }
}