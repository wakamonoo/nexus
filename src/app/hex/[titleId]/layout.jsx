const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

async function getTitle(titleId) {
  try {
    const res = await fetch(`${BASE_URL}/api/titles/titleGet/${titleId}`, {
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
  const { titleId } = await params;
  const title = await getTitle(titleId);

  if (!title) {
    return {
      title: "Title Not Found",
      description: "This Marvel title could not be found on Nexus.",
    };
  }

  return {
    title: title.title,
    description:
      title.summary?.slice(0, 155) ||
      `Explore ${title.title}, track your progress, read community reviews, and discover more about this Marvel title on Nexus.`,
  };
}

export default function TitleLayout({ children }) {
  return children;
}
