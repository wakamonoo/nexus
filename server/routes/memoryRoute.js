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

    const prompt = `
You are Nexus Memory Agent.

User recently watched:
${formattedTitles}

Task:
- Give short continuity reminders
- Only use provided titles
- No new movie suggestions
- Keep it concise

Return STRICT JSON:
{
  "memory": {
    "Title": ["point 1", "point 2"]
  }
}
`;

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a precise memory assistant for a media tracking app.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
      }),
    });

    // 🔴 IMPORTANT: check OpenAI response status
    const raw = await aiRes.text();

    if (!aiRes.ok) {
      console.error("OpenAI API ERROR:", raw);
      return res.status(500).json({
        error: "OpenAI request failed",
        details: raw,
      });
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      console.error("FAILED TO PARSE OPENAI RESPONSE:", raw);
      return res.status(500).json({
        error: "Invalid JSON from OpenAI",
        raw,
      });
    }

    const output = data?.choices?.[0]?.message?.content;

    if (!output) {
      console.error("NO OUTPUT FROM OPENAI:", data);
      return res.status(500).json({
        error: "Empty AI response",
        data,
      });
    }

    console.log("AI OUTPUT:", output);

    return res.status(200).json({ result: output });
  } catch (err) {
    console.error("MEMORY ROUTE CRASH:", err);
    return res.status(500).json({
      error: "memory route crashed",
      message: err.message,
    });
  }
});

export default router;