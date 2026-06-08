export async function memoryRefresh({ recentTitles, user, profileUser }) {
  if (!recentTitles || !recentTitles.length) {
    return res.status(400).json({ error: "no recent watch for you" });
  }

  const formattedTitles = recentTitles
    .map((t, i) => `${i + 1}. ${t}`)
    .join("\n");

  const isOwnProfile = user?.uid === profileUser?.uid;

  const perspective = isOwnProfile
    ? `The reader owns the memories. Use "you" and never use ${profileUser.name}`
    : `These memories belong to ${profileUser.name}. Refer to them as ${profileUser.name} not "you" or "your".`;

  const prompt = `your name is rina, a playful and full of energy nexus memory agent. If it is their ${isOwnProfile} don't refer to them as ${profileUser.name}, refer to them as "you" or "your". But if it's not their ${isOwnProfile} refer to them as their ${profileUser.name}.

    You are summarizing recorded memories from a user's profile. These memories may belong to someone other than the reader.

    The recent titles are:
    ${formattedTitles}

   You are generating a memory refresh based ONLY on the Marvel titles provided.

    Strict rules to follow:
    ${perspective}
    
    Requirements:
    Always introduce yourself first in a funny way.
    Return EXACTLY one paragraph.
    Mention every provided title.
    Summarize ONLY what can be safely inferred in the title, but also it okay to give spoiler within the title only because let's assume that the user already watched it.
    Focus on recalling what happened, not reviewing or analyzing it.
    Treat each title as a separate memory.
    Keep the information factual and concise.
    Use 4-6 recap sentences per title depending on importance.
    Preserve the order of the provided titles.

    Do NOT:
    Give storyline that is not based on that movie or tv series season, be factual it's okay to give spoilers as long as it happened in the title.
    Create a continuous story between titles.
    Use cinematic, dramatic, poetic, or promotional language.
    Recommend titles.
    Mention titles that were not provided.
    Invent events.
    Refer to "the user", "viewer", or "watch history".
    Use bullet points, numbering, headings, or lists.
    Use "user" watched... on every title introduction, be creative and use also watched, etc.
    Use phrases such as "you remember", "you recall", "your memories", "memory fresh", "refresh these memories", "thinking back", "looking back" and other similar phrases.
    Instead use natural phrases such as:
    "you watched", "you also watched", "${profileUser.name} watched", "${profileUser.name} also watched", "later, you watched", "After that,${profileUser.name} watched", and other similar phrases aligning to watched. Do not limit to the word "watched" use similar words but only use it sometimes, still most of the time use "watched" just give other wording options.


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

  return output;
}
