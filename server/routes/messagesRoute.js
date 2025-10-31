import express from "express";
import clientPromise from "../lib/mongodb.js";
import { v4 as uuid } from "uuid";

const router = express.Router();

router.post("/addMessage", async (req, res) => {
  try {
    const { picture, sender, senderId, email, text } = req.body;
    const { messageId } = req.params;

    const io = req.app.get("io");
    const client = await clientPromise;
    const db = client.db("nexus");

    const newMessage = {
      picture,
      sender,
      senderId,
      email,
      text,
      messagedAt: new Date(),
      msgId: `msg-${uuid()}`,
    };

    await db.collection("messages").insertOne(newMessage);

    io.emit("citadel", newMessage);

    res.status(200).json({ message: "Message sent succesfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "message send failed" });
  }
});

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
