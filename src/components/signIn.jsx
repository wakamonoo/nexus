"use client";
import { MdClose } from "react-icons/md";
import { googleSignUp } from "@/firebase/firebaseConfig";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";
import Swal from "sweetalert2";

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
      const { user, token, error } = await googleSignUp();
      if (error) {
        Swal.fire({
          title: "Error",
          text: "Login failed!",
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
          setShowSignIn(false);
          router.refresh();
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
          console.error(err);
          Swal.fire({
            title: "Error",
            text: "Login failed!",
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
