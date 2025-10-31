"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./userContext";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const SocketContext = createContext();

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export const SocketProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [chatLoad, setChatLoad] = useState(true);
  const { user, socket } = useContext(UserContext);
  const [sortedReviews, setSortedReviews] = useState([]);
  const [pings, setPings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/messages/messageGet`);
        const data = await res.json();
        setMessages(data);
        setChatLoad(false);
      } catch (err) {
        console.error("failed to fetch messages", err);
      }
    };
    fetchMessages();
    socket.on("citadel", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => {
      socket.off("citadel");
    };
  }, []);

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

      toast.custom(
        (t) => (
          <div
            onClick={() => {
              {
                if (
                  pingData.type === "comment" ||
                  pingData.type === "reply" ||
                  pingData.type === "energize" ||
                  pingData.type === "echo"
                ) {
                  router.push(`/post/${pingData.postId}`);
                } else if (pingData.type === "sigil") {
                  router.push(`/profile/${pingData.userId}`);
                }
              }
              toast.dismiss(t.id);
            }}
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-xs w-full bg-second border-1 border-panel text-normal rounded-lg shadow-lg px-4 py-2 flex items-center justify-center gap-4 cursor-pointer`}
          >
            <Image
              src={pingData.senderImage || null}
              alt="icon"
              width={0}
              height={0}
              sizes="100vw"
              className="cursor-pointer w-12 h-12 object-cover rounded-full"
            />
            <div className="flex-1">
              <p className="text-base text-normal font-semibold">
                {pingData.senderName} {pingData.message}
              </p>
            </div>
          </div>
        ),
        { duration: 5000 }
      );
    });

    return () => {
      socket.off("ping");
    };
  }, [user]);

  useEffect(() => {
    const fetchLatestReviews = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/reviews/latestReviewsGet`);
        const data = await res.json();

        setSortedReviews(data);
      } catch (err) {
        console.error("failed to fetch pings", err);
      }
    };

    fetchLatestReviews();

    socket.on("newReview", (data) => {
      console.log("Received latest review data:", data);
      setSortedReviews((prev) => [
        { ...data, title: data.title || "unknown" },
        ...prev,
      ]);
    });

    return () => {
      socket.off("newReview");
    };
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        messages,
        setMessages,
        chatLoad,
        pings,
        setPings,
        sortedReviews,
      }}
    >
      {children}
      <Toaster position="bottom-left" toastOptions={{ duration: 5000 }} />
    </SocketContext.Provider>
  );
};
