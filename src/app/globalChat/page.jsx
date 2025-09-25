"use client";
import { MdSend } from "react-icons/md";
import ironman from "@/assets/tony.jpg";
import Image from "next/image";
import NavBar from "@/components/navBar";
import { UserContext } from "@/context/userContext";
import { useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { FaUserAlt, FaUserSlash } from "react-icons/fa";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

const socket = io.connect(`${BASE_URL}`);

export default function GlobalChat() {
  const { user, setShowSignIn } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const msgEndRef = useRef();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/messages/messageGet`);
        const data = await res.json();
        setMessages(data);

        setTimeout(() => {
          msgEndRef.current?.scrollIntoView({ behavior: "auto" });
        }, 0);
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

  const sendMessage = () => {
    if (!input.trim()) return;
    const data = {
      picture: user?.picture,
      sender: user?.name,
      email: user?.email,
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    };
    socket.emit("citadel", data);
    setInput("");
  };

  return (
    <>
      <NavBar />
      {!user ? (
        <div
          className="flex w-full items-center justify-center"
          style={{ height: "100dvh" }}
        >
          <div className="flex flex-col gap-2 items-center justify-center">
            <FaUserSlash className="text-4xl" />
            <p className="text-sm text-vibe">Login to the End of Time</p>
            <button
              onClick={() => setShowSignIn(true)}
              className="px-4 py-2 bg-accent rounded-full font-bold"
            >
              <p>Login</p>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col pt-16" style={{ height: "100dvh" }}>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex flex-col gap-4">
              {messages.map((msg, i) => {
                const ownMessage = user.email === msg.email;
                const currentDate = msg.date;
                const prevDate = i > 0 ? messages[i - 1].date : null;
                const showDate = currentDate !== prevDate;

                return (
                  <div key={i}>
                    {showDate && (
                      <p className="text-xs text-vibe font-extralight text-center py-2">
                        {currentDate}
                      </p>
                    )}
                    <div
                      className={`flex gap-2 ${
                        user.name === msg.sender
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {!ownMessage && (
                        <Image
                          src={msg.picture || ironman}
                          alt="user"
                          width={0}
                          height={0}
                          sizes="100vw"
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <div
                        className={`px-4 py-2 w-fit rounded-2xl ${
                          ownMessage ? "bg-second" : "bg-panel"
                        }`}
                      >
                        <p
                          className={`text-base font-bold flex ${
                            ownMessage ? "justify-end" : "justify-start"
                          }`}
                        >
                          {ownMessage ? "you" : msg.sender}
                        </p>

                        <p
                          className={`text-base text-normal py-2 flex ${
                            ownMessage ? "justify-end" : "justify-start"
                          }`}
                        >
                          {msg.text}
                        </p>
                        <p
                          className={`text-xs text-vibe flex ${
                            ownMessage ? "justify-end" : "justify-start"
                          }`}
                        >
                          {msg.time}
                        </p>
                      </div>
                      {ownMessage && (
                        <Image
                          src={msg.picture || ironman}
                          alt="user"
                          width={0}
                          height={0}
                          sizes="100vw"
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={msgEndRef} />
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-second">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="enter message ..."
              className="w-full bg-panel p-2 rounded text-base text-normal font-normal"
            />
            <MdSend className="text-2xl cursor-pointer" onClick={sendMessage} />
          </div>
        </div>
      )}
    </>
  );
}
