"use client";
import { MdSend } from "react-icons/md";
import ironman from "@/assets/tony.jpg";
import Image from "next/image";
import NavBar from "@/components/navBar";
import { UserContext } from "@/context/userContext";
import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

const socket = io.connect(`${BASE_URL}`);

export default function GlobalChat() {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("citadel", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("citadel");
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg = {
      picture: user?.picture,
      sender: user?.name,
      text: input,
      date: new Date().toLocaleString(),
    };
    socket.emit("citadel", msg);
    setInput("");
  };

  return (
    <>
      <NavBar />
      {!user ? (
        <div className="pt-16">not user</div>
      ) : (
        <div className="flex flex-col pt-16" style={{ height: "100dvh" }}>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex flex-col gap-4">
              {messages.map((msg, i) => {
                const ownMessage = user.name === msg.sender;
                return (
                  <div
                    key={i}
                    className={`flex gap-2 ${
                      user.name === msg.sender ? "justify-end" : "justify-start"
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
                      className={`px-4 rounded-2xl ${
                        ownMessage ? "bg-second" : "bg-panel"
                      }`}
                    >
                      <div className="py-2">
                        <p className="text-base font-bold">{msg.sender}</p>
                        <p className="text-xs text-vibe">{msg.date}</p>
                      </div>
                      <p className="text-base text-normal py-2">{msg.text}</p>
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
                );
              })}
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
