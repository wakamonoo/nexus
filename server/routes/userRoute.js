import express from "express";
import clientPromise from "../lib/mongodb.js";
import admin from "../lib/firebaseAdmin.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decoded;

    const client = await clientPromise;
    const db = client.db("nexus");

    await db.collection("users").updateOne(
      { uid },
      {
        $setOnInsert: {
          uid,
          email,
          name,
          picture,
          createdAt: new Date().toISOString().split("T")[0],
        },
      },
      { upsert: true }
    );

    res.status(200).json({ message: "user signed up" });
  } catch (err) {
    console.error("failed to signup user", err);
    res.status(401).json({ error: "invalid token" });
  }
});

router.put("/updateUser/:uid", async (req, res) => {
  const { uid } = req.params;
  const { picture, name, bio } = req.body;
  try {
    const client = await clientPromise;
    const db = client.db("nexus");

    await db.collection("users").updateOne(
      { uid },
      {
        $set: {
          name,
          picture,
          bio,
          updatedAt: new Date().toISOString().split("T")[0],
        },
      }
    );

    await db.collection("posts").updateOne(
      { userId: uid },
      {
        $set: {
          userName: name,
          userImage: picture,
        },
      }
    );

    await db.collection("posts").updateMany(
      { "comments.userId": uid },
      {
        $set: {
          "comments.$[elem].userName": name,
          "comments.$[elem].userImage": picture,
        },
      },
      { arrayFilters: [{ "elem.userId": uid }] }
    );

    await db.collection("titles").updateMany(
      { "reviews.userId": uid },
      {
        $set: {
          "reviews.$[elem].userName": name,
          "reviews.$[elem].userImage": picture,
        },
      },
      { arrayFilters: [{ "elem.userId": uid }] }
    );

    res.status(200).json({ message: "user updated" });
  } catch (err) {
    console.error("failed to signup user", err);
    res.status(401).json({ error: "update failed" });
  }
});

export default router;
