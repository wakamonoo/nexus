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

router.delete("/deletePing/:pingId", async (req, res) => {
  try {
    const { pingId } = req.params;
    const client = await clientPromise;
    const db = client.db("nexus");

    await db.collection("pings").deleteOne({ pingId });

    res.status(200).json({ message: "delete ping succesful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "delete ping error" });
  }
});

router.delete("/deleteAll/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const client = await clientPromise;
    const db = client.db("nexus");

    await db.collection("pings").deleteMany({ userId });

    res.status(200).json({ message: "delete all ping succesful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "delete all ping error" });
  }
});

router.patch("/markAllAsRead/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const client = await clientPromise;
    const db = client.db("nexus");

    await db
      .collection("pings")
      .updateMany({ userId }, { $set: { isRead: true } });

    res.status(200).json({ message: "update all ping succesful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "update ping error" });
  }
});

export default router;
