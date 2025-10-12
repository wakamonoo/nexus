"use client";
import { useContext, useEffect, useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import CountUp from "react-countup";
import { UserContext } from "@/context/userContext";
import { GiAngryEyes } from "react-icons/gi";
import { LoaderContext } from "@/context/loaderContext";
import ColdLoader from "@/components/loaders/heroLoader";
import Splash from "@/components/loaders/splash";
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export default function AdminGuard() {
  const { user } = useContext(UserContext);
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [showUnauth, setShowUnauth] = useState(false);
  const [coldLoad, setColdLoad] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsAuthorized(false);
    }
    setIsAuthorized(user?.email == "joven.serdanbataller21@gmail.com");
  }, [user]);

  useEffect(() => {
    if (!isAuthorized) {
      setColdLoad(true);
      const timer = setTimeout(() => {
        setColdLoad(false);
        setShowUnauth(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setColdLoad(false);
      setShowUnauth(false);
    }
  }, [isAuthorized, setColdLoad]);

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

  if (coldLoad || isAuthorized === null)
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

  if (showUnauth)
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen opacity-40 p-8">
        <GiAngryEyes className="text-9xl text-normal -m-8" />
        <h4 className="font-bold text-2xl text-normal text-center">
          Well, look who decided to crash the party
        </h4>
      </div>
    );

  return (
    <div className="p-4">
      <FaAngleLeft
        onClick={() => router.back()}
        title="Back"
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
          <h2 className="text-xl font-extrabold">USERS</h2>
        </div>

        <div className="flex items-center gap-2 justify-center">
          <div className="flex items-center justify-center w-24 h-24">
            <CountUp
              end={count.titlesCount}
              duration={1.5}
              className="text-7xl font-extrabold text-accent"
            />
          </div>
          <h2 className="text-xl font-extrabold">TITLES</h2>
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
          onClick={() => router.push("/admin/editTitles")}
          className="bg-accent w-full p-2 rounded cursor-pointer"
        >
          <p className="font-bold uppercase text-base">Edit Titles</p>
        </button>
        <button
          onClick={() => router.push("/admin/updateTitlesOrder")}
          className="bg-accent w-full p-2 rounded cursor-pointer"
        >
          <p className="font-bold uppercase text-base">Update Order</p>
        </button>
      </div>
    </div>
  );
}
