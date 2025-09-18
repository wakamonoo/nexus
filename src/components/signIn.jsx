"use client";
import { MdClose } from "react-icons/md";
import { googleSignUp } from "@/firebase/firebaseConfig";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { UserContext } from "@/context/userContext";
import Swal from "sweetalert2";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export default function SignIn({ setShowSignIn }) {
  const { isLogged, adminBtn, setUser, setIsLogged } = useContext(UserContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (isLogged) {
      // Logout
      await auth.signOut();
      setIsLogged(false);
      setUser(null);
      Swal.fire({
        title: "Success",
        text: "Logout complete!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-text)",
        color: "var(--color-bg)",
        iconColor: "var(--color-hulk)",
        customClass: {
          popup: "rounded-2xl shadow-lg",
          title: "text-lg font-bold text-[var(--color-hulk)]",
          htmlContainer: "text-sm",
        },
      });
      setShowSignIn(false);
    } else {
      // Sign in
      const { user, token, error } = await googleSignUp();
      if (error) {
        alert("Error logging in");
        return;
      }

      if (user) {
        // Update context immediately for UI update
        setIsLogged(true);
        setUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          picture: user.photoURL,
        });

        setLoading(true); // show loader
        setShowSignIn(false); // hide modal

        try {
          // Backend registration (runs in background)
          await fetch(`${BASE_URL}/api/users/signup`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          });

          Swal.fire({
            title: "Success",
            text: "Login complete!",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            background: "var(--color-text)",
            color: "var(--color-bg)",
            iconColor: "var(--color-hulk)",
            customClass: {
              popup: "rounded-2xl shadow-lg",
              title: "text-lg font-bold text-[var(--color-hulk)]",
              htmlContainer: "text-sm",
            },
          });
        } catch (err) {
          console.error("Signup failed:", err);
          Swal.fire({
            title: "Error",
            text: "Login succeeded but backend signup failed!",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
            background: "var(--color-text)",
            color: "var(--color-bg)",
            iconColor: "var(--color-accent)",
            customClass: {
              popup: "rounded-2xl shadow-lg",
              title: "text-lg font-bold text-[var(--color-accent)]",
              htmlContainer: "text-sm",
            },
          });
        } finally {
          setLoading(false); // hide loader
        }
      }
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <p className="text-white text-xl">Signing in...</p>
        </div>
      )}

      <div
        onClick={() => setShowSignIn(false)}
        className="inset-0 z-40 backdrop-blur-xs flex items-center justify-center fixed"
      >
        <div
          onClick={(e) => e.stopPropagation()} // prevent closing modal when clicking inside
          className="flex relative justify-center bg-red-600 w-[350px] sm:w-[400px] md:w-[450px] h-[350px] sm:h-[400px] md:h-[450px] rounded-2xl overflow-hidden"
        >
          <button
            className="absolute cursor-pointer top-4 right-4 text-2xl sm:text-3xl md:text-4xl font-bold duration-200 hover:scale-110 active:scale-110"
            onClick={() => setShowSignIn(false)}
          >
            <MdClose />
          </button>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleSignIn}
              className="bg-accent px-4 py-2 rounded-full"
            >
              <p>{isLogged ? "Logout" : "Sign in with Google"}</p>
            </button>

            {adminBtn && (
              <button
                onClick={() => router.push("/admin")}
                className="bg-accent px-4 py-2 rounded-full"
              >
                Nav to admin page
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
