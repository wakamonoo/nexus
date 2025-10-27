import { useContext, useEffect, useState } from "react";
import { ScrollContext } from "@/context/scrollContext";
import { UserContext } from "@/context/userContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LoaderContext } from "@/context/loaderContext";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export default function Ping({ setShowPing }) {
  const { navHide } = useContext(ScrollContext);
  const { user, socket } = useContext(UserContext);
  const { setIsLoading } = useContext(LoaderContext);
  const [pings, setPings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const fetchPings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/pings/pingGet/${user.uid}`);
        const pingData = await res.json();

        setPings(pingData || []);
      } catch (err) {
        console.error("failed to fetch pings", err);
      }
    };

    fetchPings();

    socket.on("ping", (pingData) => {
      console.log("Received ping:", pingData);
      setPings((prev) => [...prev, pingData]);
    });

    return () => {
      socket.off("ping");
    };
  }, [user]);

  return (
    <div
      onClick={() => setShowPing(false)}
      className={`inset-0 z-50 backdrop-blur-xs flex items-center justify-center fixed ${
        navHide ? "translate-x-[-100%] opacity-0" : "translate-x-0 opacity-100"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-18 right-12 sm:right-18 md:right-22 lg:right-30 bg-second w-72 border-1 border-panel h-[70vh] rounded overflow-y-auto custom-scroll"
      >
        <div className="flex flex-col py-2">
          <h4 className="text-xl text-center">Pings</h4>
          {pings.map((ping, index) => (
            <div
              key={index}
              onClick={() => {
                setIsLoading(true);
                router.push(`/post/${ping.postId}`);
              }}
              className={`border-b-1 border-panel p-4 ${
                ping.isRead ? "bg-second" : "bg-panel"
              }`}
            >
              <div className="flex gap-2 items-start">
                <Image
                  src={ping.senderImage}
                  alt="user"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="cursor-pointer w-8 h-8 rounded-full"
                />
                <div className="flex gap-2">
                  <p className="leading-4 text-base font-bold">
                    {ping.senderName}{" "}
                    <span className="font-normal text-sm">{ping.message}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
