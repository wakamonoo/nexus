"use client";
import { MdClose, MdLogout } from "react-icons/md";
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
import { LoaderContext } from "@/context/loaderContext";
import CircledButtons from "../buttons/circledBtns";
import RegularButtons from "../buttons/regBtns";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export default function SignIn() {
  const { isLogged, fetchUserData, setShowSignIn } = useContext(UserContext);
  const { setIsLoading } = useContext(LoaderContext);
  const router = useRouter();

  const handleSignIn = async () => {
    if (isLogged) {
      await auth.signOut();
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "You've been logged-out!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-hulk)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title:
            "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
        },
      });
      setShowSignIn(false);
    } else {
      const { user, token, error } = await googleSignUp();
      if (error) {
        Swal.fire({
          toast: true,
          position: "bottom-start",
          title: "Sign in failed, please try again later!",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
          background: "var(--color-secondary)",
          iconColor: "var(--color-accent)",
          customClass: {
            popup:
              "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
            title:
              "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
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
            toast: true,
            position: "bottom-start",
            title: `Welcome, ${user.displayName}`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            background: "var(--color-secondary)",
            iconColor: "var(--color-hulk)",
            customClass: {
              popup:
                "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
              title:
                "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
            },
          });
        } catch (err) {
          console.error(err);
          Swal.fire({
            toast: true,
            position: "bottom-start",
            title: "Sign in failed, please try again later!",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
            background: "var(--color-secondary)",
            iconColor: "var(--color-accent)",
            customClass: {
              popup:
                "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
              title:
                "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
            },
          });
        }
      }
    }
  };

  return (
    <div
      onClick={() => setShowSignIn(false)}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-panel bg-second shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-panel p-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold text-normal">
              {isLogged ? "Sign out" : "Sign in"}
            </h1>
            <p className="mt-0.5 text-xs text-vibe opacity-60 truncate">
              {isLogged
                ? "Sign out of your nexus account"
                : "Enter nexus and continue your journey."}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSignIn(false);
            }}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-vibe transition hover:bg-[var(--color-panel)] hover:text-[var(--color-accent)] shrink-0"
          >
            <MdClose className="text-xl" />
          </button>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center p-4">
          <Image
            src={Logo}
            priority
            alt="logo"
            width={0}
            height={0}
            className="w-36 h-auto"
          />
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
        </div>
        <div className="flex flex-col gap-1 border-t border-panel p-4">
          <RegularButtons onClick={handleSignIn}>
            {isLogged ? (
              <div className="flex gap-2 items-center justify-center">
                <p className="font-bold text-normal text-base">
                  Logout Account
                </p>
                <MdLogout className="text-2xl" />
              </div>
            ) : (
              <div className="flex gap-2 items-center justify-center">
                <p className="font-bold text-normal text-base">
                  Continue with Google
                </p>
                <FcGoogle className="text-2xl" />
              </div>
            )}
          </RegularButtons>
          {!isLogged && (
            <p className="text-xs text-center text-vibe">
              By continuing, you agree to our{" "}
              <span
                onClick={() => {
                  setShowSignIn(false);
                  setIsLoading(true);
                  router.push("/terms&Conditions");
                }}
                className="cursor-pointer text-blue-500"
              >
                Terms of Service
              </span>{" "}
              and{" "}
              <span
                onClick={() => {
                  setShowSignIn(false);
                  setIsLoading(true);
                  router.push("/privacyPolicy");
                }}
                className="cursor-pointer text-blue-500"
              >
                Privacy Policy
              </span>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
