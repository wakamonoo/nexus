import express from "express";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-wakamonoo.vercel.app"
    : "http://localhost:3000";

router.post("/gcashDonate", async (req, res) => {
  try {
    const { amount } = req.body;

    const response = await fetch("https://api.paymongo.com/v1/sources", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(process.env.PAYMONGO_SECRET_KEY + ":").toString("base64"),
      },

      body: JSON.stringify({
        data: {
          attributes: {
            amount,
            currency: "PHP",
            type: "gcash",
            redirect: {
              success: `${BASE_URL}/heroFund?success=true`,
              failed: `${BASE_URL}/heroFund?success=false`,
            },
          },
        },
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

export default router;
