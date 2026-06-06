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

   You are generating a memory refresh based ONLY on the Marvel titles provided.

    Goal:
    Help the viewer remember what they recently watched.
    Write as if speaking directly to the viewer.
    Use "You watched..." and "In this title..." naturally.

    Requirements:
    Return EXACTLY one paragraph.
    Mention every provided title.
    Summarize the major events, character developments, conflicts, and outcomes from each title.
    Focus on recalling what happened, not reviewing or analyzing it.
    Treat each title as a separate memory.
    Keep the information factual and concise.
    Use 2–4 recap sentences per title depending on importance.
    Preserve the order of the provided titles.

    Do NOT:
    Create a continuous story between titles.
    Use cinematic, dramatic, poetic, or promotional language.
    Recommend titles.
    Mention titles that were not provided.
    Invent events.
    Refer to "the user", "viewer", or "watch history".
    Use bullet points, numbering, headings, or lists.

    Writing style:
    Natural memory refresh.
    Direct second-person perspective.
    Sounds like someone reminding you what happened.
    Prioritize events and outcomes over plot descriptions.

    Formatting:
    - Whenever you mention a title, wrap it with double asterisks.
    - Example: **Iron Man**
    - Every provided title must appear exactly as given and be wrapped in **.

    Return only the paragraph.
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
