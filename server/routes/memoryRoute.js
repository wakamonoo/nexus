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

    const aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },

        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
          },
        }),
      },
    );

    console.log("Gemini Status:", aiRes.status);

    const data = await aiRes.json();

    console.log("Gemini Response:");
    console.dir(data, { depth: null });

    if (!aiRes.ok) {
      return res.status(aiRes.status).json({
        error: "Gemini request failed",
        details: data,
      });
    }

    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log("Output:", output);

    if (!output) {
      return res.status(500).json({
        error: "No output returned",
        data,
      });
    }

    res.status(200).json({ result: output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "memory route failed" });
  }
});

export default router;
