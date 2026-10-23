"use client";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/userContext";
import { GiAngryEyes } from "react-icons/gi";
import { useRouter } from "next/navigation";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export default function AdminGuard({ children }) {
  const { firebaseUser, loading } = useContext(UserContext);
  const [status, setStatus] = useState("checking");
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!firebaseUser) {
      router.replace("/");
      return;
    }

    let cancelled = false;

    async function checkAdmin() {
      setStatus("checking");

      try {
        const token = await firebaseUser.getIdToken();

        const response = await fetch(`${BASE_URL}/api/admin/adminGet`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (!cancelled) {
          setStatus(response.ok ? "authorized" : "unauthorized");
        }
      } catch (err) {
        console.error("admin verification failed:", err);

        if (!cancelled) {
          setStatus("unauthorized");
        }
      }
    }

    checkAdmin();

    return () => {
      cancelled = true;
    };
  }, [firebaseUser, loading]);

  if (loading || status === "checking")
    return (
      <div className="w-full h-screen bg-panel flex gap-2 items-center justify-center">
        <h4 className="text-normal text-2xl">Checking, if you're worthy</h4>
        <div className="flex flex-row gap-2">
          <div className="w-2 h-2 rounded-full bg-text animate-bounce"></div>
          <div className="w-2 h-2 rounded-full bg-text animate-bounce [animation-delay:-.3s]"></div>
          <div className="w-2 h-2 rounded-full bg-text animate-bounce [animation-delay:-.5s]"></div>
        </div>
      </div>
    );

  if (status === "unauthorized")
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen opacity-40 p-8">
        <GiAngryEyes className="text-9xl text-normal -m-8" />
        <h4 className="font-bold text-2xl text-normal text-center">
          Well, look who decided to crash the party
        </h4>
      </div>
    );

  return children;
}
