import express from "express";
import tmdb from "../services/tmdbService.js";

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const data = await tmdb.search(req.query.q);

    res.json(data.results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
