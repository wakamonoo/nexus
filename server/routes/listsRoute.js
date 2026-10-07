import express from "express";
import clientPromise from "../lib/mongodb.js";
import { v4 as uuidv4 } from "uuid";
import checkCommentSigils from "../utils/commentSigils.js";

const router = express.Router();

router.post("/addlist", async (req, res) => {
  try {
    const { userId, listTitle, listDescription, titles } = req.body;

    const io = req.app.get("io");
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const listId = `list-${uuidv4()}`;
    const createdAt = new Date();

    await db.collection("lists").updateOne(
      { listId },
      {
        $setOnInsert: {
          listTitle,
          listDescription,
          titles,
          userId,
          createdAt,
        },
      },
      { upsert: true },
    );

    const activityData = {
      activityId: `activity-${uuidv4()}`,
      type: "list",
      userId,
      listId,
      message: `added ${listTitle} to lists.`,
      date: new Date(),
    };

    await db.collection("activities").insertOne(activityData);

    io.emit("activity", activityData);

    res.status(200).json({
      message: "list created",
      list: {
        listId,
        listTitle,
        listDescription,
        titles,
        userId,
        createdAt,
      },
    });
  } catch (err) {
    console.error("list failed to create", err);
    res.status(401).json({ error: "failed to create list" });
  }
});

router.delete("/deleteList/:listId", async (req, res) => {
  try {
    const { listId } = req.params;
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    await db.collection("lists").deleteOne({ listId });

    res.status(200).json({ message: "list delete success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

router.patch("/updateList/:listId", async (req, res) => {
  try {
    const { listId } = req.params;
    const { userId, listTitle, listDescription, titles } = req.body;

    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    await db.collection("lists").updateOne(
      { listId, userId },
      {
        $set: {
          listTitle,
          listDescription,
          titles,
          updatedAt: new Date(),
        },
      },
    );
    res.status(200).json({ message: "list update success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

router.post("/addComment/:listId", async (req, res) => {
  try {
    const { listId } = req.params;
    const { userId, textComment } = req.body;

    const io = req.app.get("io");
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const list = await db.collection("lists").findOne({ listId });

    const userBefore = await db.collection("users").findOne({ uid: userId });

    await db.collection("users").findOneAndUpdate(
      { uid: userId },
      [
        {
          $set: {
            totalComments: { $add: [{ $ifNull: ["$totalComments", 0] }, 1] },
          },
        },
        {
          $set: {
            friendlyNeighbor: {
              $cond: [{ $gte: ["$totalComments", 1] }, true, false],
            },
            alleySwinger: {
              $cond: [{ $gte: ["$totalComments", 20] }, true, false],
            },
            webWalker: {
              $cond: [{ $gte: ["$totalComments", 40] }, true, false],
            },
          },
        },
      ],
      { upsert: true },
    );

    await checkCommentSigils(db, io, userId, userBefore);

    const newComment = {
      commentId: `comment-${uuidv4()}`,
      userId,
      textComment,
      date: new Date(),
    };

    await db.collection("lists").updateOne(
      { listId },
      {
        $push: {
          comments: newComment,
        },
      },
    );

    const listOwner = list.userId;

    if (listOwner && listOwner !== userId) {
      const pingData = {
        pingId: `ping-${uuidv4()}`,
        type: "listComment",
        senderId: userId,
        userId: listOwner,
        listId,
        message: "commented on your list.",
        date: new Date(),
        isRead: false,
      };

      await db.collection("pings").insertOne(pingData);

      io.to(listOwner).emit("ping", pingData);
      console.log(`ping sent to ${listOwner}`);
    }

    res.status(200).json({ message: "comment added", comment: newComment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to add comment" });
  }
});

router.delete("/deleteComment/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;

    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    await db
      .collection("lists")
      .updateOne(
        { "comments.commentId": commentId, "comments.userId": userId },
        { $pull: { comments: { commentId, userId } } },
      );

    await db.collection("users").updateOne({ uid: userId }, [
      {
        $set: {
          totalComments: {
            $max: [{ $subtract: [{ $ifNull: ["$totalComments", 0] }, 1] }, 0],
          },
        },
      },
    ]);
    res.status(200).json({ message: "Comment deleted succesfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
