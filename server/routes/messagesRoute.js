import express from "express";
import clientPromise from "../lib/mongodb.js";
import { v4 as uuid } from "uuid";

const router = express.Router();

router.post("/addMessage", async (req, res) => {
  try {
    const { senderId, text, files = [], replyTo = null } = req.body;

    const io = req.app.get("io");
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const newMessage = {
      msgId: `msg-${uuid()}`,
      senderId,
      text,
      files,
      replyTo,
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

router.patch("/seenMessage/:messageId", async (req, res) => {
  try {
    const io = req.app.get("io");
    const { messageId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "userId required",
      });
    }

    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const message = await db.collection("messages").findOne({
      msgId: messageId,
    });

    if (!message) {
      return res.status(404).json({
        error: "message not found",
      });
    }

    if (message.senderId === userId) {
      return res.status(200).json({
        message: "own message",
      });
    }

    const user = await db.collection("users").findOne({
      uid: userId,
    });

    if (!user) {
      return res.status(404).json({
        error: "user not found",
      });
    }

    if (user.latestCitadelSeenMessageId) {
      const currentSeenMessage = await db.collection("messages").findOne({
        msgId: user.latestCitadelSeenMessageId,
      });

      if (currentSeenMessage && currentSeenMessage._id >= message._id) {
        return res.status(200).json({
          message: "already saw this or a newer message",
        });
      }
    }

    const seenAt = new Date();

    await db.collection("users").updateOne(
      {
        uid: userId,
      },
      {
        $set: {
          latestCitadelSeenMessageId: messageId,
          latestCitadelSeenAt: seenAt,
        },
      },
    );

    io.emit("messageSeen", {
      userId,
      messageId,
      seenAt,
    });

    res
      .status(200)
      .json({ message: "messaged markes as seen succesfully", messageId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to mark message as seen" });
  }
});

export default router;
