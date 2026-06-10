import cron from "node-cron";
import { newsRefresh } from "../services/newsService.js";

let isRunning = false;

export function startNewsCron() {
  console.log("[CRON] News cron initialized");

  cron.schedule("0 */1 * * *", async () => {
    if (isRunning) return;

    try {
      isRunning = true;
      console.log("[CRON] refreshing news...");

      await newsRefresh();

      console.log("[CRON] News updated succesfully");
    } catch (err) {
      console.error("[CRON ERROR]", err.message);
    } finally {
      isRunning = false;
    }
  });
}
