"use client";
import { MdOutlineChatBubbleOutline, MdSend } from "react-icons/md";
import ironman from "@/assets/tony.jpg";
import Image from "next/image";
import NavBar from "@/components/layout/navBar";
import { UserContext } from "@/context/userContext";
import { useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { FaArrowDown, FaRegComments, FaUserSlash } from "react-icons/fa";
import ShowLoader from "@/components/loaders/showLoader";
import ChatLoader from "@/components/loaders/chatLoder";
import { useRouter } from "next/navigation";
import { LoaderContext } from "@/context/loaderContext";
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";
const socket = io.connect(`${BASE_URL}`);
export default function GlobalChat() {
  const { user, setShowSignIn } = useContext(UserContext);
  const { setIsLoading } = useContext(LoaderContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const msgEndRef = useRef();
  const [chatLoad, setChatLoad] = useState(true);
  const justSentMessage = useRef(false);
  const initialLoad = useRef(true);
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
  const sendMessage = () => {
    if (!input.trim()) return;
    const data = {
      picture: user?.picture,
      sender: user?.name,
      senderId: user?.uid,
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
    justSentMessage.current = true;
    socket.emit("citadel", data);
    setInput("");
  };

  useEffect(() => {
    if (messages.length && initialLoad.current) {
      msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
      initialLoad.current = false;
    }
  }, [messages]);
  useEffect(() => {
    if (messages.length && justSentMessage.current) {
      msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
      justSentMessage.current = false;
    }
  }, [messages]);
  return (
    <>
      <NavBar />
      <div>
        {!user ? (
          <div
            className="flex w-full items-center justify-center"
            style={{ height: "100dvh" }}
          >
            <div className="flex flex-col items-center justify-center">
              <FaUserSlash className="text-4xl text-vibe opacity-40" />
              <p className="text-xs text-vibe opacity-40">
                You're not logged in
              </p>
              <div className="p-2">
                <button
                  onClick={() => setShowSignIn(true)}
                  className="px-4 py-2 bg-accent rounded-full font-bold"
                >
                  <p>Continue to login</p>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col pt-16" style={{ height: "100dvh" }}>
            {chatLoad ? (
              <ChatLoader />
            ) : messages.length === 0 ? (
              <div className="flex h-full w-full justify-center items-center">
                <div className="flex flex-col items-center justify-center">
                  <FaRegComments className="text-4xl text-vibe opacity-40" />
                  <p className="text-xs text-vibe opacity-40">
                    no chats in here yet
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 p-2 sm:px-4 md:px-8 lg:px-16 overflow-y-auto">
                <div className="flex flex-col gap-4">
                  {messages.map((msg, i) => {
                    const ownMessage = user.uid === msg.senderId;
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
                            user.uid === msg.senderId
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          {!ownMessage && (
                            <Image
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsLoading(true);
                                router.push(`/profile/${msg.senderId}`);
                              }}
                              src={msg.picture || ironman}
                              alt="user"
                              width={0}
                              height={0}
                              sizes="100vw"
                              className="cursor-pointer w-8 h-8 rounded-full"
                            />
                          )}
                          <div
                            className={`px-4 py-2 max-w-[70%] rounded-2xl ${
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
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsLoading(true);
                                router.push(`/profile/${msg.senderId}`);
                              }}
                              src={msg.picture || ironman}
                              alt="user"
                              width={0}
                              height={0}
                              sizes="100vw"
                              className="cursor-pointer w-8 h-8 rounded-full"
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={msgEndRef} />
                </div>
              </div>
            )}
            <div className="w-full flex items-center gap-2 p-2 bg-second">
              <Image
                src={user?.picture || null}
                alt="user"
                width={0}
                height={0}
                sizes="100vw"
                className="w-12 h-12 object-cover rounded-full"
              />
              <div className="flex items-center w-full gap-2 bg-panel rounded-full border-1 border-[var(--color-secondary)] py-2 px-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder={`Chat as ${user.name}...`}
                  className="w-full px-2 text-normal outline-none rounded-full text-base font-normal truncate"
                />
                <MdSend
                  className="text-2xl cursor-pointer shrink-0"
                  onClick={sendMessage}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
