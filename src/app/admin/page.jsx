"use client";
import { useContext, useEffect, useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import CountUp from "react-countup";
import { UserContext } from "@/context/userContext";
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export default function Page() {
  const router = useRouter();
  const [count, setCount] = useState({ usersCount: 0, titlesCount: 0 });
  const { setShowSignIn } = useContext(UserContext);

  useEffect(() => {
    setShowSignIn(false);
  }, []);

  const fetchCounts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/counts/countData`);
      const data = await res.json();
      setCount(data);
    } catch (err) {
      console.error("failed to fetch count:", err);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <div className="p-4">
      <FaAngleLeft
        onClick={() => router.back()}
        className="text-2xl cursor-pointer"
      />

      <div className="flex flex-col gap-2 p-4 items-start justify-center">
        <div className="flex items-center gap-2 justify-center">
          <div className="flex items-center justify-center w-24 h-24">
            <CountUp
              end={count.usersCount}
              duration={1.5}
              className="text-7xl font-extrabold text-accent"
            />
          </div>
          <p className="text-base font-extrabold">USERS</p>
        </div>

        <div className="flex items-center gap-2 justify-center">
          <div className="flex items-center justify-center w-24 h-24">
            <CountUp
              end={count.titlesCount}
              duration={1.5}
              className="text-7xl font-extrabold text-accent"
            />
          </div>
          <p className="text-base font-extrabold">TITLES</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => router.push("/admin/addTitle")}
          className="bg-accent w-full p-2 rounded cursor-pointer"
        >
          <p className="font-bold uppercase text-base">Add new title</p>
        </button>
        <button
          onClick={() => router.push("/admin/editTitle")}
          className="bg-accent w-full p-2 rounded cursor-pointer"
        >
          <p className="font-bold uppercase text-base">Edit title</p>
        </button>
      </div>
    </div>
  );
}
