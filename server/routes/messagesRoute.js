import express from "express";
import clientPromise from "../lib/mongodb.js";

const router = express.Router();

router.delete("/deleteMessage/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;

    const client = await clientPromise;
    const db = client.db("nexus");

    await db.collection("messages").deleteOne({ msgId: messageId });

    res.status(200).json({ message: "Message deleted succesfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
