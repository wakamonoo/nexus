import { getAuth, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from "firebase/auth";

const auth = getAuth();
const provider = new GoogleAuthProvider();

export const googleSignUp = async () => {
  try {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      // 👇 Use redirect flow for mobile
      await signInWithRedirect(auth, provider);
    } else {
      // 👇 Use popup for desktop
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken(true);
      return { user, token, error: null };
    }
  } catch (error) {
    console.error("Sign-in failed:", error);
    alert(`Login failed:\n${error.code}\n${error.message}`);
    return { user: null, token: null, error };
  }
};

// After redirect, handle result
export const handleRedirectResult = async () => {
  const result = await getRedirectResult(auth);
  if (result) {
    const user = result.user;
    const token = await user.getIdToken(true);
    return { user, token, error: null };
  }
  return { user: null, token: null, error: null };
};
