import cron from "node-cron";
import { titleRefresh } from "../services/titleUpdateService.js";

let isRunning = false;

export function startTitleUpdateCron() {
  console.log("[CRON] Title Update cron initialized");

  cron.schedule("0 */1 * * *", async () => {
    if (isRunning) return;

    try {
      isRunning = true;
      console.log("[CRON] refreshing titles...");

      await titleRefresh();

      console.log("[CRON] Titles updated succesfully");
    } catch (err) {
      console.error("[CRON ERROR]", err.message);
    } finally {
      isRunning = false;
    }
  });
}
