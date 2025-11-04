"use client";
import { MdOutlineChatBubbleOutline, MdSend } from "react-icons/md";
import ironman from "@/assets/tony.jpg";
import Image from "next/image";
import NavBar from "@/components/layout/navBar";
import { UserContext } from "@/context/userContext";
import { useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {
  FaArrowDown,
  FaRegComments,
  FaTrash,
  FaUserSlash,
} from "react-icons/fa";
import ChatLoader from "@/components/loaders/chatLoder";
import { useRouter } from "next/navigation";
import { LoaderContext } from "@/context/loaderContext";
import MessageDelConfirm from "@/components/modals/messageDelConfirm";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { SocketContext } from "@/context/socketContext";
import { RiFileGifFill, RiImageAiFill } from "react-icons/ri";
import CitadelLightBox from "@/components/lightBoxes/citadelLightBox";
import GifPicker from "@/components/modals/gifPicker";

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
  const [files, setFiles] = useState([]);
  const msgEndRef = useRef();
  const justSentMessage = useRef(false);
  const initialLoad = useRef(true);
  const [messageDelModal, setMessageDelModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [citadelLightBoxOpen, setCitadelLightBoxOpen] = useState(false);
  const [citadelLightBoxFiles, setCitadelLightBoxFiles] = useState([]);
  const [citadelLightBoxSenderId, setCitadelLightBoxSenderId] = useState(null);
  const [citadelLightBoxSenderName, setCitadelLightBoxSenderName] =
    useState(null);
  const [citadelLightBoxSentDate, setCitadelLightBoxSentDate] = useState(null);
  const [initialIndex, setInitialIndex] = useState(0);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const router = useRouter();

  const sendMessage = async () => {
    try {
      setIsLoading(true);

      if (!input.trim() && files.length === 0) return;

      justSentMessage.current = true;

      const uploadedFiles = files.filter((file) => typeof file !== "string");
      const gifUrls = files.filter(
        (file) =>
          typeof file === "string" &&
          (file.includes("tenor.com") || file.includes("media.tenor.com"))
      );

      let uploadedUrls = [...gifUrls];

      if (uploadedFiles.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < uploadedFiles.length; i++) {
          formData.append("files", uploadedFiles[i]);
        }

        const uploadRes = await fetch(`${BASE_URL}/api/uploads/citadelUpload`, {
          method: "POST",
          body: formData,
        });

        const { urls } = await uploadRes.json();
        uploadedUrls = [...uploadedUrls, ...urls];
      }

      const data = {
        picture: user?.picture,
        sender: user?.name,
        senderId: user?.uid,
        email: user?.email,
        text: input,
        files: uploadedUrls,
      };

      await fetch(`${BASE_URL}/api/messages/addMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setInput("");
      setFiles([]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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

  const openCitadelLightBox = (
    files,
    senderId,
    senderName,
    sentDate,
    index
  ) => {
    setCitadelLightBoxFiles(files);
    setCitadelLightBoxSenderId(senderId);
    setCitadelLightBoxSenderName(senderName);
    setCitadelLightBoxSentDate(sentDate);
    setInitialIndex(index);
    setCitadelLightBoxOpen(true);
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
                            className={`flex flex-col ${
                              ownMessage ? "items-end" : "items-start"
                            }`}
                          >
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
                              {msg.text && (
                                <p
                                  className={`text-base text-normal py-2 flex border-t-1 mt-2 ${
                                    ownMessage
                                      ? "justify-end border-[var(--color-panel)]"
                                      : "justify-start border-[var(--color-secondary)]"
                                  }`}
                                >
                                  {msg.text}
                                </p>
                              )}
                            </div>

                            {msg.files && msg.files.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {msg.files.map((file, index) => {
                                  const isVideo = /\.(mp4|mov|avi|webm)$/i.test(
                                    file
                                  );
                                  const isImage =
                                    /\.(jpg|peg|png|gif|webp)$/i.test(file);
                                  const isGif =
                                    file.includes("tenor.com") ||
                                    file.includes("media.tenor.com");

                                  return (
                                    <div
                                      onClick={() =>
                                        openCitadelLightBox(
                                          msg.files,
                                          msg.senderId,
                                          msg.sender,
                                          msg.messagedAt,
                                          index
                                        )
                                      }
                                      key={index}
                                      className="w-48 h-48 block relative cursor-pointer"
                                    >
                                      {isVideo ? (
                                        <video
                                          src={file}
                                          controls
                                          className="w-full h-full rounded"
                                        />
                                      ) : isImage || isGif ? (
                                        <Image
                                          src={file}
                                          alt={`sent by ${msg.sender}`}
                                          width={0}
                                          height={0}
                                          sizes="100vw"
                                          className="w-full h-full object-cover rounded"
                                        />
                                      ) : null}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                            <div className="flex items-center justify-end px-2">
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

            <div className="px-2 mb-2">
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 border-1 border-panel py-2 px-4 bg-second rounded-2xl">
                  {files.map((file, index) => {
                    const previewSrc =
                      typeof file === "string"
                        ? file
                        : URL.createObjectURL(file);

                    return (
                      <div key={index} className="w-20 h-20 relative">
                        <Image
                          src={previewSrc}
                          alt={`preivew-${index}`}
                          width={0}
                          height={0}
                          sizes="100vw"
                          className="w-full h-full object-cover rounded"
                        />
                        <div className="absolute top-1 right-1">
                          <button
                            onClick={() => {
                              setFiles((prev) =>
                                prev.filter((_, i) => i !== index)
                              );
                            }}
                            className="cursor-pointer"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="w-full flex items-start gap-2 p-2 bg-second">
              <Image
                src={user?.picture || Fallback}
                alt="user"
                width={0}
                height={0}
                sizes="100vw"
                className="w-12 h-12 object-cover rounded-full shrink-0"
              />
              <div className="w-full bg-panel rounded-2xl border-1 border-[var(--color-secondary)] py-2 px-4">
                <div className="flex items-center w-full gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder={`Chat as ${user.name}...`}
                    className="w-full text-normal outline-none text-base font-normal truncate"
                  />
                  <MdSend
                    className="text-2xl cursor-pointer shrink-0"
                    onClick={sendMessage}
                  />
                </div>
                <div className="flex gap-2 mt-1">
                  <label htmlFor="fileUploadChat" className="cursor-pointer">
                    <RiImageAiFill className="text-xl text-[var(--color-text)]/60 shrink-0" />
                  </label>
                  <input
                    id="fileUploadChat"
                    name="file"
                    accept="image/*,video/*"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const selectedFiles = Array.from(e.target.files);
                      setFiles((prev) => [...prev, ...selectedFiles]);
                    }}
                  />
                  <RiFileGifFill
                    onClick={() => setShowGifPicker((prev) => !prev)}
                    className="text-xl text-[var(--color-text)]/60 shrink-0 cursor-pointer"
                  />
                </div>
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
      {citadelLightBoxOpen && (
        <CitadelLightBox
          citadelLightBoxFiles={citadelLightBoxFiles}
          citadelLightBoxSenderId={citadelLightBoxSenderId}
          citadelLightBoxSenderName={citadelLightBoxSenderName}
          citadelLightBoxSentDate={citadelLightBoxSentDate}
          initialIndex={initialIndex}
          citadelLightBoxOpen={citadelLightBoxOpen}
          setCitadelLightBoxOpen={setCitadelLightBoxOpen}
        />
      )}
      {showGifPicker && (
        <GifPicker
          onSelect={(gifUrl) => {
            setFiles((prev) => [...prev, gifUrl]);
            setShowGifPicker(false);
          }}
          setShowGifPicker={setShowGifPicker}
        />
      )}
    </>
  );
}
