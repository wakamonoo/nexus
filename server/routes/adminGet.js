import express from "express";
import { requireAdmin } from "../lib/firebase/requireAdmin.js";

const router = express.Router();

router.get("/verify", async (req, res) => {
  try {
    const access = await requireAdmin(req);

    if (!access.authorized) {
      return res.status(access.status).json({
        error: "Unauthorized",
      });
    }

    return res.json({ authorized: true });
  } catch (err) {
    console.error("admin verification failed", err);
    return res.status(500).json({ error: "internal server error" });
  }
});

export default router;
