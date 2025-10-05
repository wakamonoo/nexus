"use client";
import { MdAdminPanelSettings, MdClose, MdLogout } from "react-icons/md";
import { googleSignUp } from "@/firebase/firebaseConfig";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";
import Swal from "sweetalert2";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import Logo from "@/assets/main_logo.png";
import PopUp from "@/assets/pop-up.png";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export default function SignIn() {
  const { isLogged, adminBtn, fetchUserData, setShowSignIn } =
    useContext(UserContext);
  const router = useRouter();

  const handleSignIn = async () => {
    if (isLogged) {
      await auth.signOut();
      Swal.fire({
        title: "Success",
        text: "You've been logged out!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-text)",
        color: "var(--color-bg)",
        iconColor: "var(--color-hulk)",
        customClass: {
          popup: "rounded-2xl shadow-lg",
          title: "text-lg font-bold !text-[var(--color-hulk)]",
          htmlContainer: "text-sm",
        },
      });
      setShowSignIn(false);
    } else {
      const { user, token, error } = await googleSignUp();
      if (error) {
        Swal.fire({
          title: "Error",
          text: `Failed: ${error.code}`,
          icon: "error",
          timer: 2000,
          showConfirmButton: true,
          background: "var(--color-text)",
          color: "var(--color-bg)",
          iconColor: "var(--color-accent)",
          customClass: {
            popup: "rounded-2xl shadow-lg",
            title: "text-lg font-bold !text-[var(--color-accent)]",
            htmlContainer: "text-sm",
          },
        });
      }
      if (user && token) {
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
          await fetchUserData(user.uid);
          Swal.fire({
            title: "Success",
            text: `Welcome, ${user.displayName}`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            background: "var(--color-text)",
            color: "var(--color-bg)",
            iconColor: "var(--color-hulk)",
            customClass: {
              popup: "rounded-2xl shadow-lg",
              title: "text-lg font-bold !text-[var(--color-hulk)]",
              htmlContainer: "text-sm",
            },
          });
        } catch (err) {
          console.error(err);
          Swal.fire({
            title: "Error",
            text: `Failed: ${err.code}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: true,
            background: "var(--color-text)",
            color: "var(--color-bg)",
            iconColor: "var(--color-accent)",
            customClass: {
              popup: "rounded-2xl shadow-lg",
              title: "text-lg font-bold !text-[var(--color-accent)]",
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
      className="inset-0 z-[100] backdrop-blur-xs flex items-center justify-center fixed"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex relative justify-center bg-panel w-[95%] sm:w-[400px] md:w-[450px] h-[60%] sm:h-[400px] md:h-[450px] rounded-2xl overflow-hidden"
      >
        <button
          onClick={() => setShowSignIn(false)}
          className="absolute cursor-pointer top-4 right-4 text-2xl sm:text-3xl md:text-4xl font-bold duration-200 hover:scale-110 active:scale-110"
        >
          <MdClose />
        </button>
        <div className="flex flex-col gap-2 items-center justify-center p-8">
          <Image
            src={Logo}
            priority
            alt="logo"
            width={0}
            height={0}
            className="w-36 h-auto pb-8"
          />
          <button
            onClick={handleSignIn}
            className="bg-accent px-4 py-2 rounded-full font-bold cursor-pointer w-full hover:bg-[var(--color-hulk)] focus:bg-[var(--color-hulk)]"
          >
            {isLogged ? (
              <div className="flex gap-2 items-center justify-center">
                <p>Logout Account</p>
                <MdLogout className="text-2xl" />
              </div>
            ) : (
              <div className="flex gap-2 items-center justify-center">
                <p>Continue with Google</p>
                <FcGoogle className="text-2xl" />
              </div>
            )}
          </button>
          {adminBtn && (
            <>
              <p className="text-xs text-vibe mt-2">Hi wakamonoo:</p>
              <button
                onClick={() => router.push("/admin")}
                className="bg-accent px-4 py-2 rounded-full font-bold cursor-pointer w-full hover:bg-[var(--color-hulk)] focus:bg-[var(--color-hulk)]"
              >
                <div className="flex gap-2 items-center justify-center">
                  <p>Visit Admin Page</p>
                  <MdAdminPanelSettings className="text-2xl" />
                </div>
              </button>
            </>
          )}
          <div className="mt-4">
            {!isLogged ? (
              <div className="flex flex-col gap-1 items-center justify-center">
                <p className="text-xs text-vibe text-center">
                  To make sign-in work properly, ensure{" "}
                  <span className="font-bold">pop-ups aren’t blocked</span>.
                </p>
                <Image
                  src={PopUp}
                  width={0}
                  height={0}
                  sizes="100vw"
                  alt="pop-up"
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            ) : null}
            <p className="text-xs text-center text-vibe">
              By continuing, you agree to our{" "}
              <a href="" className="text-blue-400">
                Terms of Service
              </a>{" "}
              and
              <a href="" className="text-blue-400">
                {" "}
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
