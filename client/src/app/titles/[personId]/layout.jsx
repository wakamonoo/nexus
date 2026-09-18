const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

async function getPerson(personId) {
  try {
    const res = await fetch(`${BASE_URL}/api/titles/personGet/${personId}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.person;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { personId } = await params;
  const personData = await getPerson(personId);

  if (!personData) {
    return {
      title: "Person Not Found",
      description: "This person could not be found on Nexus.",
    };
  }

  return {
    title: `${personData.name}'s Filmography`,
    description: personData.biography
      ? personData.biography.slice(0, 155)
      : `Explore ${personData.name}'s Marvel projects, credits, and other information on Nexus`,
  };
}

export default function PersonLayout({ children }) {
  return children;
}
