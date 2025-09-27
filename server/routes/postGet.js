import express from "express";
import clientPromise from "../lib/mongodb.js";

const router = express.Router();

router.get("/postGet", async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("nexus");

    const result = await db
      .collection("posts")
      .find({})
      .sort({ _id: -1 })
      .toArray();

    res.status(200).json(result);
  } catch (err) {}
});

export default router;
