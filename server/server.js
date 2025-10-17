import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server as SocketServer } from "socket.io";
import clientPromise from "./lib/mongodb.js";
import { v4 as uuid } from "uuid";

import userRoute from "./routes/userRoute.js";
import userGet from "./routes/userGet.js";
import titleRoute from "./routes/titleRoute.js";
import titleGet from "./routes/titleGet.js";
import orderUpdate from "./routes/orderUpdate.js";
import fileRoute from "./routes/fileRoute.js";
import countRoute from "./routes/countRoute.js";
import messageGet from "./routes/messagesGet.js";
import postRoute from "./routes/postRoute.js";
import postGet from "./routes/postGet.js";
import commentRoute from "./routes/commentRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import reactRoute from "./routes/reactRoute.js";
import rankingRoute from "./routes/rankingRoute.js";
import watchRoute from "./routes/watchedRoute.js";
import watchGet from "./routes/watchedGet.js";
import gcashRoute from "./routes/gcashRoute.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigin = [
  "http://localhost:3000",
  "https://nexus-wakamonoo.vercel.app",
  "https://nexus-po8x.onrender.com",
];

const io = new SocketServer(server, {
  cors: {
    origin: allowedOrigin,
    credentials: true,
  },
});

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/users", userGet);
app.use("/api/titles", titleRoute);
app.use("/api/titles", titleGet);
app.use("/api/titles", orderUpdate);
app.use("/api/uploads", fileRoute);
app.use("/api/counts", countRoute);
app.use("/api/messages", messageGet);
app.use("/api/posts", postRoute);
app.use("/api/posts", postGet);
app.use("/api/comments", commentRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/reacts", reactRoute);
app.use("/api/rankings", rankingRoute);
app.use("/api/watched", watchRoute);
app.use("/api/watched", watchGet);
app.use("/api/payment", gcashRoute);

io.on("connection", (socket) => {
  console.log("a user is connected");

  socket.on("citadel", async (data) => {
    try {
      const { picture, sender, senderId, email, text, time, date } = data;
      const msg = {
        picture,
        sender,
        senderId,
        email,
        text,
        time,
        date,
        msgId: `msg-${uuid()}`,
      };

      const client = await clientPromise;
      const db = client.db("nexus");
      await db.collection("messages").insertOne(msg);
      io.emit("citadel", msg);
    } catch (err) {
      console.error(err);
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`server running on http://localhost:${PORT}`)
);
