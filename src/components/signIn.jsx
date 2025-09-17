"use client";
import { MdClose } from "react-icons/md";
import { googleSignUp } from "@/firebase/firebaseConfig";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export default function SignIn({ setShowSignIn }) {
  const { isLogged, adminBtn } = useContext(UserContext);
  const router = useRouter();

  const handleSignIn = async () => {
    if (isLogged) {
      await auth.signOut();
      setShowSignIn(false);
    } else {
      const { user, token, error } = await googleSignUp();
      if (error) {
        alert("error logging in");
      }
      if (user) {
        try {
          await fetch(`${BASE_URL}/api/users/signup`, {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              token,
            }),
          });
          alert("succesful");
        } catch (err) {
          console.error(err);
          alert("error");
        }
      }
    }
  };

  return (
    <div
      onClick={() => setShowSignIn(false)}
      className="inset-0 z-50 backdrop-blur-xs flex items-center justify-center fixed"
    >
      <div className="flex relative justify-center bg-red-600 w-[350px] sm:w-[400px] md:w-[450px] h-[350px] sm:h-[400px] md:h-[450px] rounded-2xl overflow-hidden">
        <button className="absolute cursor-pointer top-4 right-4 text-2xl sm:text-3xl md:text-4xl font-bold duration-200 hover:scale-110 active:scale-110">
          <MdClose onClick={() => setShowSignIn(false)} />
        </button>
        <div className="flex items-center justify-center">
          <button
            onClick={handleSignIn}
            className="bg-accent px-4 py-2 rounded-full"
          >
            <p>{isLogged ? "logout" : "signin with google"}</p>
          </button>
          {adminBtn && (
            <button
              onClick={() => router.push("/admin")}
              className="bg-accent px-4 py-2 rounded-full"
            >
              nav to admin page
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
