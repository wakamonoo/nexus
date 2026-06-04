import express from "express";

const router = express.Router();

router.post("/memoryFeed", async (req, res) => {
  try {
    const { recentTitles } = req.body;

    if (!recentTitles || !recentTitles.length) {
      return res.status(400).json({ error: "no recent watch for you" });
    }

    const formattedTitles = recentTitles
      .map((t, i) => `${i + 1}. ${t}`)
      .join("\n");

    const prompt = `you are nexus memory agent. user recently watched ${formattedTitles}. 

    task:
    - give short continuity reminders
    - only use provided titles
    - no new movie suggestions
    - keep it concise and accurate
    
    Return JSON:
    {
      "memory": {
        "Title": ["point 1", "point 2"]
      }
    }`;

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },

      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "you are a precise memory assistant for a marvel cinematic universe tracking website.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.4,
      }),
    });

    const data = await aiRes.json();

    const output = data?.choices?.[0]?.message?.content;

    res.status(200).json({ result: output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "memory route failed" });
  }
});

export default router;
