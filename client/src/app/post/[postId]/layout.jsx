const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

async function getPost(postId) {
  try {
    const res = await fetch(`${BASE_URL}/api/posts/postGet/${postId}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
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
  const { postId } = await params;
  const post = await getPost(postId);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "This post could not be found on Nexus.",
    };
  }

  const postOwner = await getUser(post.userId);

  return {
    title: postOwner ? `${postOwner.name}'s Post` : "Post",
    description: post.text
      ? post.text?.slice(0, 155)
      : postOwner
        ? `Read ${postOwner.name}'s community post on Nexus and join the discussion.`
        : "Read and engage with community posts on Nexus.",
  };
}

export default function PostLayout({ children }) {
  return children;
}
