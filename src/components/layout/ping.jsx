import { useContext, useEffect, useState } from "react";
import { ScrollContext } from "@/context/scrollContext";
import { UserContext } from "@/context/userContext";

export default function Ping({ setShowPing }) {
  const { navHide } = useContext(ScrollContext);
  const { user, socket } = useContext(UserContext);
  const [pings, setPings] = useState([]);

  useEffect(() => {
    if (!user) return;

    socket.on("ping", (pingData) => {
      console.log("Received ping:", pingData);
      setPings((prev) => [...prev, pingData]);
    });

    return () => {
      socket.off("ping");
    };
  }, []);

  return (
    <div
      onClick={() => setShowPing(false)}
      className={`inset-0 z-50 backdrop-blur-xs flex items-center justify-center fixed ${
        navHide ? "translate-x-[-100%] opacity-0" : "translate-x-0 opacity-100"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-18 right-12 sm:right-18 md:right-22 lg:right-30 bg-second w-72 border-1 border-panel h-screen rounded overflow-hidden"
      >
        <div className="flex flex-col p-4">
          {pings.map((ping, index) => {
            <div key={index}>
              <p>{ping.message}</p>
            </div>;
          })}
        </div>
      </div>
    </div>
  );
}
