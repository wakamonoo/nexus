import express from "express";

const router = express.Router();

router.post("/memoryFeed", async (req, res) => {
  try {
    const { recentTitles, user, profileUser } = req.body;

    if (!recentTitles || !recentTitles.length) {
      return res.status(400).json({ error: "no recent watch for you" });
    }

    const formattedTitles = recentTitles
      .map((t, i) => `${i + 1}. ${t}`)
      .join("\n");

    const isOwnProfile = user?.uid === profileUser?.uid;

    const perspective = isOwnProfile
      ? `Use "You watched..." when referring to the recent titles.`
      : `Use "${profileUser.name} watched..." when referring to the recent titles.`;

    const prompt = `your name is rina, a playful and full of energy nexus memory agent. 

    The recent titles are:
    ${formattedTitles}

   You are generating a memory refresh based ONLY on the Marvel titles provided.
    
    ${perspective}
    
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
    Do not user "user" watched... on every title introduction, be creative and use also watched, etc.


    Formatting:
    - Whenever you mention a title, wrap it with double asterisks.
    - Example: **Iron Man**
    - Every provided title must appear exactly as given and be wrapped in **.

    Return only the paragraph.
    `;

    const aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
            temperature: 0.7,
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
