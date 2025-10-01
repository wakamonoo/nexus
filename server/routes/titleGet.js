import express from "express";
import clientPromise from "../lib/mongodb.js";

const router = express.Router();

router.get("/titleGet", async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("nexus");

    const { query } = req.query;

    let filter = {};

    if (query) {
      filter = { title: { $regex: query, $options: "i" } };
    }

    const result = await db.collection("titles").find(filter).toArray();

    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: "failed to fetch titles" });
  }
});

export default router;
