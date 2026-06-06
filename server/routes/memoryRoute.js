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

    Task:
    - Summarize the user's recent Marvel watch history in ONE paragraph
    - The goal is MEMORY REFRESH, not storytelling or narration
    - Focus on what the user actually watched and what each title is about
    - Keep it simple, direct, and factual
    - Do NOT create a flowing story or connect events like a movie script
    - Mention each title separately in the same paragraph
    - Only use the provided titles
    - Do not suggest new movies
    - Do not say "user", always talk like you are recapping the user. Like "You watched blahblah recenty and so on"
    - Describe what happened in that title, not just a one sentence title description. It's a recap not a description.

    Style:
    - Think: "recap notes in human form"
    - Not cinematic, not poetic, not storytelling

    Return only one paragraph.
    `;

    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },

      body: JSON.stringify({
        model: "z-ai/glm-4.5-air:free",
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