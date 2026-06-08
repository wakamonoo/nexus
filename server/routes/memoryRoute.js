import express from "express";
import { memoryRefresh } from "../services/memoryService.js";

const router = express.Router();

router.post("/memoryFeed", async (req, res) => {
  try {
    const { recentTitles, user, profileUser } = req.body;

    const result = await memoryRefresh({ recentTitles, user, profileUser });

    res.status(200).json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "memory route failed" });
  }
});

export default router;
