import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import userRoute from "./routes/userRoute.js";

const app = express();

dotenv.config();

const allowedOrigin = ["http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/users", userRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => 
  console.log(`server running on http://localhost:${PORT}`)
);
