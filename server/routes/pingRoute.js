import express from "express";
import clientPromise from "../lib/mongodb.js";

const router = express.Router();

router.patch("/isReadPatch/:pingId", async (req, res) => {
  try {
    const { pingId } = req.params;
    const client = await clientPromise;
    const db = client.db("nexus");

    await db
      .collection("pings")
      .updateOne({ pingId }, { $set: { isRead: true } });

    res.status(200).json({ message: "ping update success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to update ping" });
  }
});

export default router;
