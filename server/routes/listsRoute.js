import express from "express";
import clientPromise from "../lib/mongodb.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/addlist", async (req, res) => {
  try {
    const { userId, listTitle, listDescription, titles } = req.body;

    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    await db.collection("lists").updateOne(
      { listId: `list-${uuidv4()}` },
      {
        $setOnInsert: {
          listTitle,
          listDescription,
          titles,
          userId,
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );

    res.status(200).json({ message: "list created" });
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
  const { listId } = req.params;
  const { listTitle, listDescription, titles } = req.body;
  try {
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    await db.collection("lists").updateOne(
      { listId },
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

router.patch("/vote/:listId", async (req, res) => {
  try {
    const { listId } = req.params;
    const { userId, vote } = req.body;

    if (!userId || !["up", "down"].includes(vote)) {
      return res.status(400).json({
        error: "Invalid userId or vote",
      });
    }

    const io = req.app.get("io");
    const client = await clientPromise;
    const mongodb = process.env.MONGODB;
    const db = client.db(mongodb);

    const list = await db.collection("lists").findOne({ listId });

    if (!list) {
      return res.status(404).json({ error: "list not found" });
    }

    const hasUpvoted = list.upvotes?.includes(userId);
    const hasDownvoted = list.downvotes?.includes(userId);

    let update;

    if (vote === "up") {
      if (hasUpvoted) {
        update = {
          $pull: {
            upvotes: userId,
          },
        };
      } else {
        update = {
          $addToSet: { upvotes: userId },
          $pull: { downvotes: userId },
        };
      }
    } else {
      if (hasDownvoted) {
        update = {
          $pull: {
            downvotes: userId,
          },
        };
      } else {
        update = {
          $addToSet: { downvotes: userId },
          $pull: { upvotes: userId },
        };
      }
    }

    await db.collection("lists").updateOne({ listId }, update);

    const updatedList = await db
      .collection("lists")
      .findOne(
        { listId },
        { projection: { listId: 1, upvotes: 1, downvotes: 1 } },
      );

    const voteData = {
      listId,
      upvotes: updatedList.upvotes || [],
      downvotes: updatedList.downvotes || [],
    };

    io.emit("listVoteUpdated", voteData);

    const upvoteMileStones = [1, 5, 10, 25, 50, 100, 250, 500, 1000];

    const upvoteCount = voteData.upvotes.length;

    const isMilestone = upvoteMileStones.includes(upvoteCount);

    if (
      vote === "up" &&
      !hasUpvoted &&
      isMilestone &&
      list.userId &&
      list.userId !== userId
    ) {
      const pingData = {
        pingId: `ping-${uuidv4()}`,
        type: "listUpvote",
        senderId: "system",
        senderName: "Nexus",
        senderImage: "/icons/alt_logo.png",
        userId: list.userId,
        userName: list.userName,
        listId: list.listId,
        message:
          upvoteCount === 1
            ? `congrats, ${list.listTitle} received its first upvote`
            : `congrats, ${list.listTitle} reached ${upvoteCount} upvotes`,
        date: new Date(),
        isRead: false,
      };

      await db.collection("pings").insertOne(pingData);

      io.to(list.userId).emit("ping", pingData);
      console.log(`ping sent to ${list.userId}`);
    }

    res.status(200).json({
      message: `${vote} succeful`,
      ...voteData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
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

    const updatedUser = await db.collection("users").findOne({ uid: userId });

    const earnedSigils = [];

    if (updatedUser.totalComments === 1 && !userBefore.friendlyNeighbor) {
      earnedSigils.push("Friendly Neighbor");
    }
    if (updatedUser.totalComments === 20 && !userBefore.alleySwinger) {
      earnedSigils.push("Alley Swinger");
    }
    if (updatedUser.totalComments === 40 && !userBefore.webWalker) {
      earnedSigils.push("Web Walker");
    }

    if (earnedSigils.length > 0) {
      for (const sigil of earnedSigils) {
        let sigilImage = "../../src/assets/fallback.png";
        if (sigil === "Friendly Neighbor")
          sigilImage = "/sigils/friendlyNeighbor.png";
        if (sigil === "Alley Swinger") sigilImage = "/sigils/alleySwinger.png";
        if (sigil === "Web Walker") sigilImage = "/sigils/webWalker.png";

        const pingData = {
          pingId: `ping-${uuidv4()}`,
          type: "sigil",
          senderId: "system",
          senderName: "Nexus",
          senderImage: sigilImage,
          userId,
          message: `just awarded you the ${sigil} sigil, congrats!`,
          date: new Date(),
          isRead: false,
        };

        await db.collection("pings").insertOne(pingData);

        io.to(userId).emit("ping", pingData);
        console.log(`ping sent to ${userId}`);
      }
    }

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
    const commentSender = await db.collection("users").findOne({ uid: userId });

    if (listOwner && listOwner !== commentSender.uid) {
      const pingData = {
        pingId: `ping-${uuidv4()}`,
        type: "listComment",
        senderId: commentSender.uid,
        senderName: commentSender.name,
        senderImage: commentSender.picture,
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

    await db.collection("users").updateOne({ uid: userId }, [
      {
        $set: {
          totalComments: {
            $max: [{ $subtract: [{ $ifNull: ["$totalComments", 0] }, 1] }, 0],
          },
        },
      },
    ]);

    await db
      .collection("lists")
      .updateOne(
        { "comments.commentId": commentId },
        { $pull: { comments: { commentId } } },
      );

    res.status(200).json({ message: "Comment deleted succesfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
