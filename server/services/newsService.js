import clientPromise from "../lib/mongodb.js";

export async function newsRefresh() {
  const response = await fetch(
    `https://newsapi.org/v2/everything?q="Marvel Studios"&language=en&sortBy=publishedAt&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`,
  );

  const data = await response.json();

  const articles = data.articles.map((article) => ({
    title: article.title,
    description: article.description,
    image: article.urlToImage,
    source: article.source.name,
    publishedAt: article.publishedAt,
    url: article.url,
  }));

  const prompt = `you are rina, a playful and funny nexus ai chatbot and now you are an MCU news reporter.

    Using ONLY the articles below, write a short Marvel news report.

    Requirements:
    Always introduce yourself first in a funny way.
    - Mention the biggest stories.
    - Keep it factual.
    - Do not invent information.
    - Keep it under 200 words.
    - Return only the report.

    Formatting:
    - Use **bold only for titles and key names**
    - Do not use italics(*text*)
    - Do not mix markdown styles
    - Use plain text or bold only

    Articles:

    ${articles
      .map(
        (article) => `
      title: ${article.title}
    Description: ${article.description}`,
      )
      .join("\n\n")}

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

  const gemData = await aiRes.json();

  console.log("Gemini Response:");
  console.dir(gemData, { depth: null });

  if (!aiRes.ok) {
    return res.status(aiRes.status).json({
      error: "Gemini request failed",
      details: gemData,
    });
  }

  const report = gemData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  console.log("Report:", report);

  if (!report) {
    return res.status(500).json({
      error: "No report returned",
      data,
    });
  }

  const client = await clientPromise;
  const mongodb = process.env.MONGODB;
  const db = client.db(mongodb);

  await db.collection("news").updateOne(
    {},
    {
      $set: {
        report,
        articles,
        createdAt: new Date(),
      },
    },
    { upsert: true },
  );

  return { report, articles };
}
