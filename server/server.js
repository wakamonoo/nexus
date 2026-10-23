import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server as SocketServer } from "socket.io";

import userRoute from "./routes/userRoute.js";
import userGet from "./routes/userGet.js";
import titleRoute from "./routes/titleRoute.js";
import titleGet from "./routes/titleGet.js";
import orderUpdate from "./routes/orderUpdate.js";
import fileRoute from "./routes/fileRoute.js";
import countGet from "./routes/countGet.js";
import messageRoute from "./routes/messagesRoute.js";
import messageGet from "./routes/messagesGet.js";
import postRoute from "./routes/postRoute.js";
import postGet from "./routes/postGet.js";
import commentRoute from "./routes/commentRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import reviewGet from "./routes/reviewGet.js";
import reactRoute from "./routes/reactRoute.js";
import rankingRoute from "./routes/rankingRoute.js";
import watchRoute from "./routes/watchedRoute.js";
import watchGet from "./routes/watchedGet.js";
import pingRoute from "./routes/pingRoute.js";
import pingGet from "./routes/pingGet.js";
import memoryRoute from "./routes/memoryRoute.js";
import newsRoute from "./routes/newsGet.js";
import tmdbGet from "./routes/tmdbGet.js";
import listsRoute from "./routes/listsRoute.js";
import listsGet from "./routes/listsGet.js";
import activitiesGet from "./routes/activitiesGet.js";
import feedbackRoute from "./routes/feedbackRoute.js";
import feedbackGet from "./routes/feedbackGet.js";
import momentRoute from "./routes/momentRoute.js";
import momentGet from "./routes/momentGet.js";
import adminGet from "./routes/adminGet.js";

import { startNewsCron } from "./cron/newsCron.js";
import { startTitleUpdateCron } from "./cron/titleUpdateCron.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigin = [
  "http://localhost:3000",
  "https://nexus-wakamonoo.vercel.app",
  "https://nexus-po8x.onrender.com",
  "https://nexus-git-test-wakamonoos-projects.vercel.app",
  "https://nexus-test-xxhl.onrender.com",
  "https://ournexus.space",
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
  }),
);
app.use(express.json());

app.set("io", io);

app.use("/api/users", userRoute);
app.use("/api/users", userGet);
app.use("/api/titles", titleRoute);
app.use("/api/titles", titleGet);
app.use("/api/titles", orderUpdate);
app.use("/api/uploads", fileRoute);
app.use("/api/counts", countGet);
app.use("/api/messages", messageRoute);
app.use("/api/messages", messageGet);
app.use("/api/posts", postRoute);
app.use("/api/posts", postGet);
app.use("/api/comments", commentRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/reviews", reviewGet);
app.use("/api/reacts", reactRoute);
app.use("/api/rankings", rankingRoute);
app.use("/api/watched", watchRoute);
app.use("/api/watched", watchGet);
app.use("/api/pings", pingRoute);
app.use("/api/pings", pingGet);
app.use("/api/memory", memoryRoute);
app.use("/api/news", newsRoute);
app.use("/api/tmdb", tmdbGet);
app.use("/api/lists", listsRoute);
app.use("/api/lists", listsGet);
app.use("/api/activities", activitiesGet);
app.use("/api/feedbacks", feedbackRoute);
app.use("/api/feedbacks", feedbackGet);
app.use("/api/moments", momentRoute);
app.use("/api/moments", momentGet);
app.use("/api/admin", adminGet);

app.get("/health", (req, res) => {
  res.status(200).send("uptimerobot restarter working");
});

startNewsCron();
startTitleUpdateCron();

io.on("connection", (socket) => {
  console.log("user connected:", socket.id);

  socket.on("joinRoom", (userId) => {
    if (userId) {
      socket.join(userId);
      console.log("user joined their socket.io room");
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`server running on http://localhost:${PORT}`),
);
