import express from "express";
import clientPromise from "../lib/mongodb.js";

const router = express.Router();

router.post("/updateOrder", async (req, res) => {
  try {
    const { updates } = req.body;

    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const bulkOps = updates.map((u) => ({
      updateOne: {
        filter: { titleId: u.titleId },
        update: { $set: { order: u.order } },
      },
    }));

    await db.collection("titles").bulkWrite(bulkOps);
    res.status(200).json({ message: "update succesful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

export default router;
