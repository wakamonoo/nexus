import express from "express";
import { requireAdmin } from "../lib/firebase/requireAdmin.js";

const router = express.Router();

router.get("/verify", async (req, res) => {
  const access = await requireAdmin(request);

  if (!access.authorized) {
    return res.status(access.status).json({
      error: "Unauthorized",
    });
  }

  return res.json({ authorized: true });
});

export default router;
