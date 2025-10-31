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
import MessageDelConfirm from "@/components/modals/messageDelConfirm";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { SocketContext } from "@/context/socketContext";
import { RiImageAiFill } from "react-icons/ri";

dayjs.extend(relativeTime);

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export default function Citadel() {
  const { user, setShowSignIn } = useContext(UserContext);
  const { setIsLoading } = useContext(LoaderContext);
  const { messages, setMessages, chatLoad } = useContext(SocketContext);
  const [input, setInput] = useState("");
  const msgEndRef = useRef();
  const justSentMessage = useRef(false);
  const initialLoad = useRef(true);
  const [messageDelModal, setMessageDelModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const router = useRouter();

  const sendMessage = async () => {
    if (!input.trim()) return;
    const data = {
      picture: user?.picture,
      sender: user?.name,
      senderId: user?.uid,
      email: user?.email,
      text: input,
    };
    justSentMessage.current = true;

    await fetch(`${BASE_URL}/api/messages/addMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
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

  const handleLocalMessageDelete = (msgId) => {
    setMessages((prev) => prev.filter((m) => m.msgId !== msgId));
  };

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
              <div className="flex-1 p-2 sm:px-4 md:px-8 lg:px-16 overflow-y-auto custom-scroll">
                <div className="flex flex-col gap-4">
                  {messages.map((msg, i) => {
                    const ownMessage = user.uid === msg.senderId;
                    const currentDate = new Date(
                      msg.messagedAt
                    ).toLocaleDateString([], {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    });
                    const prevDate =
                      i > 0
                        ? new Date(
                            messages[i - 1].messagedAt
                          ).toLocaleDateString([], {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })
                        : null;
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
                            className={`px-4 py-2 min-w-32 max-w-60 md:max-w-90 rounded-2xl ${
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
                              className={`text-xs text-vibe flex ${
                                ownMessage ? "justify-end" : "justify-start"
                              }`}
                            >
                              {(() => {
                                const diffMinutes = dayjs().diff(
                                  dayjs(msg.messagedAt),
                                  "minutes"
                                );
                                if (diffMinutes < 60) {
                                  return dayjs(msg.messagedAt).fromNow();
                                }
                                return new Date(
                                  msg.messagedAt
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                });
                              })()}
                            </p>
                            <p
                              className={`text-base text-normal py-2 flex border-t-1 mt-2 ${
                                ownMessage
                                  ? "justify-end border-[var(--color-panel)]"
                                  : "justify-start border-[var(--color-secondary)]"
                              }`}
                            >
                              {msg.text}
                            </p>
                            <p
                              onClick={() => {
                                setMessageToDelete(msg.msgId);
                                setMessageDelModal(true);
                              }}
                              className={`text-sm text-vibe text-end hover:text-[var(--color-vibe)]/40 opacity-60 cursor-pointer ${
                                ownMessage ? "block" : "hidden"
                              }`}
                            >
                              Delete
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
            <div className="w-full bg-second">
              {messages.file && messages.file.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {Array.from(messages.file).map((file, index) => (
                    <div key={index} className="w-20 h-20 relative">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`preivew-${index}`}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-full object-cover rounded"
                      />
                      <div className="absolute top-1 right-1">
                        <button
                          onClick={() => {
                            const filesArray = Array.from(messages.file);
                            filesArray.splice(index, 1);
                            setPost({
                              ...messages,
                              file: filesArray.length ? filesArray : null,
                            });
                          }}
                          className="cursor-pointer"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="w-full flex items-center gap-2 p-2 bg-second">
              <label htmlFor="fileUploadChat" className="cursor-pointer">
                <RiImageAiFill className="text-2xl text-accent shrink-0" />
              </label>
              <input
                id="fileUploadChat"
                name="file"
                accept="image/*,video/*"
                type="file"
                multiple
                className="hidden"
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
      {messageDelModal && (
        <MessageDelConfirm
          setMessageDelModal={setMessageDelModal}
          messageToDelete={messageToDelete}
          onDelete={handleLocalMessageDelete}
        />
      )}
    </>
  );
}
