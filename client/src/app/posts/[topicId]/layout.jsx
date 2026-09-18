const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

async function getTitle(topicId) {
  try {
    const res = await fetch(`${BASE_URL}/api/titles/titleGet/${topicId}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.title;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { topicId } = await params;
  const topicTitle = await getTitle(topicId);

  if (!topicTitle) {
    return {
      title: "Topic Not Found",
      description: "This Marvel topic could not be found on Nexus.",
    };
  }

  return {
    title: `Posts from "${topicTitle.title}"`,
    description: `Explore community posts about ${topicTitle.title} on Nexus`,
  };
}

export default function TopicPostingsLayout({ children }) {
  return children;
}
