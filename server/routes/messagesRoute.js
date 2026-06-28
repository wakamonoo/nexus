import express from "express";
import clientPromise from "../lib/mongodb.js";
import { v4 as uuid } from "uuid";

const router = express.Router();

router.post("/addMessage", async (req, res) => {
  try {
    const { picture, sender, senderId, email, text, files = [] } = req.body;

    const io = req.app.get("io");
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const newMessage = {
      msgId: `msg-${uuid()}`,
      picture,
      sender,
      senderId,
      email,
      text,
      files,
      messagedAt: new Date(),
    };

    await db.collection("messages").insertOne(newMessage);

    io.emit("messageSent", newMessage);

    res.status(200).json({ message: "Message sent succesfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "message send failed" });
  }
});

router.delete("/deleteMessage/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;

    const io = req.app.get("io");
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    await db.collection("messages").deleteOne({ msgId: messageId });

    io.emit("messageDeleted", {
      msgId: messageId,
    });

    res.status(200).json({ message: "Message deleted succesfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.patch("/editMessage/:messageId", async (req, res) => {
  try {
    const io = req.app.get("io");
    const { messageId } = req.params;
    const { text } = req.body;

    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    await db.collection("messages").updateOne(
      { msgId: messageId },
      {
        $set: {
          text,
          edited: true,
          editAt: new Date(),
        },
      },
    );

    io.emit("messageEdited", {
      msgId: messageId,
      text,
      edited: true,
      editedAt: new Date(),
    });

    res.status(200).json({ message: "Message updated succesfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
