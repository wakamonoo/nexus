"use client";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/userContext";
import { GiAngryEyes } from "react-icons/gi";

export default function AdminGuard({ children }) {
  const { user } = useContext(UserContext);
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [showUnauth, setShowUnauth] = useState(false);
  const [coldLoad, setColdLoad] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsAuthorized(false);
    }
    setIsAuthorized(
      user?.email == "joven.serdanbataller21@gmail.com" ||
        user?.email === "wakamonoo9@gmail.com",
    );
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

  return children;
}
