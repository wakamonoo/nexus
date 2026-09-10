const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

async function getUser(uid) {
  try {
    const res = await fetch(`${BASE_URL}/api/users/userGet/${uid}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.result;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { userId } = await params;
  const user = await getUser(userId);

  if (!user) {
    return {
      title: "User Not Found",
      description: "This user could not be found on Nexus.",
    };
  }

  return {
    title: `${user.name}'s Profile`,
    description: user.bio
      ? user.bio?.slice(0, 155)
      : `View ${user.name}'s profile, activity, and Marvel journey on Nexus.`,
  };
}

export default function UserProfileLayout({ children }) {
  return children;
}
