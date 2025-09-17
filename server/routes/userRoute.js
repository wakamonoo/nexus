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

    await db
      .collection("users")
      .updateOne(
        { uid },
        { $setOnInsert: { uid, email, name, picture, createdAt: new Date().toISOString().split("T")[0] } },
        { upsert: true }
      );

    res.status(200).json({ message: "user signed up" });
  } catch (err) {
    console.error("failed to signup user", err);
    res.status(401).json({ error: "invalid token" });
  }
});

export default router;
