import dotenv from "dotenv";
import { newsRefresh } from "../services/newsService.js";

dotenv.config();

try {
  console.log("[CRON] refreshing news...");

  await newsRefresh();

  console.log("[CRON] News updated succesfully");
} catch (err) {
  console.error("[CRON ERRON]", err.message);
}
