"use client";
import { MdClose, MdSend } from "react-icons/md";
import Avatar from "@/assets/defaultAvatar.png";
import { UserContext } from "@/context/userContext";
import { useContext, useEffect, useRef, useState } from "react";
import { FaRegComments, FaReply, FaTrash, FaUserSlash } from "react-icons/fa";
import ChatLoader from "@/components/loaders/chatLoder";
import { useRouter } from "next/navigation";
import { LoaderContext } from "@/context/loaderContext";
import ConfirmMessageDeleteModal from "@/components/modals/confirmMessageDeleteModal";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { SocketContext } from "@/context/socketContext";
import { RiFileGifFill, RiImageAiFill } from "react-icons/ri";
import CitadelLightBox from "@/components/lightBoxes/citadelLightBox";
import GifPickerModal from "@/components/modals/gifPickerModal";
import { BiDotsVerticalRounded } from "react-icons/bi";
import CircledButtons from "@/components/buttons/circledBtns";
import NavBar from "@/components/layout/essentials/navBar";
import RegularButtons from "@/components/buttons/regBtns";

dayjs.extend(relativeTime);

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export default function Citadel() {
  const { allUsers, user, setUser, setShowSignInModal } = useContext(UserContext);
  const { setIsLoading } = useContext(LoaderContext);
  const { messages, setMessages, chatLoad, latestSeenMessages } =
    useContext(SocketContext);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState([]);
  const msgEndRef = useRef();
  const justSentMessage = useRef(false);
  const initialLoad = useRef(true);
  const [showConfirmMessageDeleteModal, setShowConfirmMessageDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [citadelLightBoxOpen, setCitadelLightBoxOpen] = useState(false);
  const [citadelLightBoxFiles, setCitadelLightBoxFiles] = useState([]);
  const [citadelLightBoxSenderId, setCitadelLightBoxSenderId] = useState(null);
  const [citadelLightBoxSenderName, setCitadelLightBoxSenderName] =
    useState(null);
  const [citadelLightBoxSentDate, setCitadelLightBoxSentDate] = useState(null);
  const [initialIndex, setInitialIndex] = useState(0);
  const [showGifPickerModal, setShowGifPickerModal] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [activeMessage, setActiveMessage] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const router = useRouter();
  const inputRef = useRef(null);
  const replyRef = useRef({});
  const bubbleRef = useRef({});
  const seenMessageRequests = useRef(new Set());
  const seenMessageRefs = useRef({});

  const markMessageSeen = async (msg) => {
    if (!user) return;

    if (msg.senderId === user.uid) return;

    const alreadyProcessing = seenMessageRequests.current.has(msg.msgId);

    if (alreadyProcessing) return;

    seenMessageRequests.current.add(msg.msgId);

    try {
      await fetch(`${BASE_URL}/api/messages/seenMessage/${msg.msgId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
        }),
      });
    } catch (err) {
      console.error("failed to mark message as seen", err);

      seenMessageRequests.current.delete(msg.msgId);
    }
  };

  useEffect(() => {
    if (!user || !messages.length) return;

    const observers = [];

    messages.forEach((msg) => {
      if (msg.senderId === user.uid) return;

      const element = seenMessageRefs.current[msg.msgId];

      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            markMessageSeen(msg);

            observer.disconnect();
          }
        },
        {
          threshold: 0.6,
        },
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [messages, user]);

  const handleInputChange = (e) => {
    const value = e.target.value;

    {
      if (editingMessage) {
        setEditInput(value);
      } else {
        setInput(value);
      }
    }

    e.target.style.height = "auto";

    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const sendMessage = async () => {
    try {
      if (!input.trim() && files.length === 0) return;

      setIsLoading(true);

      justSentMessage.current = true;

      const uploadedFiles = files.filter((file) => typeof file !== "string");
      const gifUrls = files.filter(
        (file) =>
          typeof file === "string" &&
          (file.includes("tenor.com") ||
            file.includes("media.tenor.com") ||
            file.includes("static.klipy.com")),
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
        senderId: user?.uid,
        text: input,
        files: uploadedUrls,
        replyTo: replyingTo
          ? {
              msgId: replyingTo.msgId,
              senderId: replyingTo.senderId,
              text: replyingTo.text,
              files: replyingTo.files || [],
            }
          : null,
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
      setReplyingTo(null);

      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const editMessage = async (msgId) => {
    try {
      setIsLoading(true);

      await fetch(`${BASE_URL}/api/messages/editMessage/${msgId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: editInput,
        }),
      });

      setEditingMessage(null);
      setEditInput("");

      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = (msg) => {
    setReplyingTo(msg);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  useEffect(() => {
    if (!messages.length || chatLoad) return;

    if (initialLoad.current || justSentMessage.current) {
      requestAnimationFrame(() => {
        msgEndRef.current?.scrollIntoView({
          behavior: initialLoad.current ? "auto" : "smooth",
          block: "end",
        });
        initialLoad.current = false;
        justSentMessage.current = false;
      });
    }
  }, [messages, chatLoad]);

  const handleLocalMessageDelete = (msgId) => {
    setMessages((prev) => prev.filter((m) => m.msgId !== msgId));
  };

  const openCitadelLightBox = (
    files,
    senderId,
    senderName,
    sentDate,
    index,
  ) => {
    setCitadelLightBoxFiles(files);
    setCitadelLightBoxSenderId(senderId);
    setCitadelLightBoxSenderName(senderName);
    setCitadelLightBoxSentDate(sentDate);
    setInitialIndex(index);
    setCitadelLightBoxOpen(true);
  };

  const scrollToReply = (msgId) => {
    const container = replyRef.current[msgId];
    const bubble = bubbleRef.current[msgId];

    if (!container) return;

    container.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    setTimeout(() => {
      bubble.classList.add("reply-highlight");

      setTimeout(() => {
        bubble.classList.remove("reply-highlight");
      }, 3500);
    }, 2000);
  };

  const replyingToOwner = replyingTo
    ? allUsers.find((u) => u.uid === replyingTo.senderId)
    : null;

  return (
    <>
      <NavBar />
      <div>
        {!user ? (
          <div
            className="relative flex w-full items-center justify-center overflow-hidden px-4"
            style={{ height: "100dvh" }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(237,29,36,0.12),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_45%)]" />
            <div className="absolute inset-x-8 top-1/2 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/35 to-transparent" />

            <div className="relative flex w-full max-w-sm flex-col items-center justify-center rounded-lg border border-panel bg-[var(--color-secondary)]/60 p-8 text-center shadow-2xl backdrop-blur-md">
              <div className="mb-4 grid h-16 w-16 place-items-center rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 shadow-[0_0_32px_rgba(237,29,36,0.18)]">
                <FaUserSlash className="text-4xl text-accent" />
              </div>

              <p className="font-bold text-base uppercase text-vibe border-b border-panel">
                Citadel Access
              </p>

              <h1 className="text-2xl">Login Required</h1>
              <p className="mt-2 text-sm opacity-60">
                Sign in to enter the Citadel and start your conversations.
              </p>

              <div className="mt-2">
                <CircledButtons onClick={() => setShowSignInModal(true)}>
                  <p className="text-base font-bold text-normal">
                    Continue to login
                  </p>
                </CircledButtons>
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
                  <p className="text-xs text-vibe opacity-40">no chats yet</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 p-2 sm:px-4 md:px-8 lg:px-16 overflow-y-auto custom-scroll">
                <div className="flex flex-col gap-4">
                  {messages.map((msg, i) => {
                    const messageOwner = allUsers.find(
                      (u) => u.uid === msg.senderId,
                    );

                    const seenUsers = allUsers.filter(
                      (viewer) =>
                        viewer.uid !== msg.senderId &&
                        latestSeenMessages[viewer.uid]?.messageId === msg.msgId,
                    );

                    const visibleSeenUsers = seenUsers.filter(
                      (viewer) => viewer.uid !== user?.uid,
                    );

                    const replyOwner = msg.replyTo
                      ? allUsers.find((u) => u.uid === msg.replyTo.senderId)
                      : null;

                    const ownMessage = user.uid === msg.senderId;

                    const prevMessage = i > 0 ? messages[i - 1] : null;

                    const currentDate = dayjs(msg.messagedAt).format(
                      "MMM DD, YYYY",
                    );
                    const showTimeStamp =
                      !prevMessage ||
                      currentDate !==
                        dayjs(prevMessage.messagedAt).format("MMM DD, YYYY") ||
                      dayjs(msg.messagedAt).diff(
                        dayjs(prevMessage.messagedAt),
                        "minute",
                      ) >= 30;

                    return (
                      <div
                        key={msg.msgId}
                        ref={(element) =>
                          (seenMessageRefs.current[msg.msgId] = element)
                        }
                      >
                        {showTimeStamp && (
                          <p className="text-xs text-vibe font-extralight text-center py-2">
                            {dayjs(msg.messagedAt).format(
                              "MMM DD, YYYY [at] h:mm A",
                            )}
                          </p>
                        )}

                        <div
                          className={`flex flex-col ${ownMessage ? "items-end" : "items-start"}`}
                        >
                          <div
                            className={`flex gap-2 items-end ${
                              ownMessage ? "justify-end" : "justify-start"
                            }`}
                          >
                            {!ownMessage && (
                              <img
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsLoading(true);
                                  router.push(`/profile/${msg.senderId}`);
                                }}
                                src={messageOwner?.picture || Avatar.src}
                                alt="user"
                                loading="lazy"
                                decoding="async"
                                className="cursor-pointer w-8 h-8 rounded-full"
                              />
                            )}
                            <div
                              className={`flex flex-col ${
                                ownMessage ? "items-end" : "items-start"
                              }`}
                            >
                              <p className="text-sm items-center py-1 px-2 opacity-60 flex justify-start">
                                {!ownMessage && !msg.replyTo && (
                                  <span>{messageOwner?.name}</span>
                                )}
                                {msg.edited === true && (
                                  <>
                                    {!ownMessage && (
                                      <span className="flex text-sm px-1">
                                        •
                                      </span>
                                    )}
                                    <span className="flex text-sm text-accent opacity-60">
                                      Edited
                                    </span>
                                  </>
                                )}
                              </p>

                              {msg.replyTo && (
                                <div
                                  className={`flex flex-col px-2 ${ownMessage ? "items-end" : "items-start"}`}
                                >
                                  <p className="text-sm opacity-60 py-1">
                                    {ownMessage ? "You" : messageOwner.name}{" "}
                                    replied to{" "}
                                    {user.uid === msg.replyTo.senderId
                                      ? "yourself"
                                      : replyOwner?.name}
                                  </p>
                                  <div
                                    onClick={() =>
                                      scrollToReply(msg.replyTo.msgId)
                                    }
                                    className={`mb-2 cursor-pointer bg-second border-accent opacity-80 px-4 py-2 w-fit max-w-60 md:max-w-90 rounded-2xl ${ownMessage ? "border-l-2" : "border-r-2"}`}
                                  >
                                    <p className="text-base text-normal whitespace-pre-wrap max-w-full line-clamp-3">
                                      {msg.replyTo.text ||
                                        (msg.replyTo.files?.length
                                          ? "Attachment"
                                          : "message")}
                                    </p>
                                  </div>
                                </div>
                              )}
                              <div
                                className="flex group"
                                onClick={() => {
                                  if (window.innerWidth < 768) {
                                    setActiveMessage((prev) =>
                                      prev === msg.msgId ? null : msg.msgId,
                                    );
                                  }
                                }}
                              >
                                {ownMessage && (
                                  <div
                                    className={`mr-2 ${!msg.text && msg.files?.length > 0 ? "flex md:hidden md:group-hover:flex" : activeMessage === msg.msgId ? "flex" : "hidden md:group-hover:flex"}`}
                                  >
                                    <BiDotsVerticalRounded
                                      onClick={() => setSelectedMessage(msg)}
                                      className="text-xl opacity-60 mt-2 cursor-pointer"
                                    />
                                    <FaReply
                                      onClick={() => handleReply(msg)}
                                      className="text-xl opacity-60 mt-2 cursor-pointer"
                                    />
                                  </div>
                                )}

                                <div
                                  ref={(e) => {
                                    if (e) replyRef.current[msg.msgId] = e;
                                  }}
                                  className={`flex flex-col ${ownMessage ? "items-end" : "items-start"}`}
                                >
                                  {msg.text && (
                                    <div
                                      ref={(e) => {
                                        if (e) bubbleRef.current[msg.msgId] = e;
                                      }}
                                      className={`px-4 py-2 w-fit max-w-60 md:max-w-90 rounded-2xl cursor-pointer transition-all duration-200 md:group-hover:bg-accent ${
                                        activeMessage === msg.msgId
                                          ? "bg-accent"
                                          : ownMessage
                                            ? "bg-second"
                                            : "bg-panel"
                                      }`}
                                    >
                                      <p
                                        className={`text-base text-normal flex whitespace-pre-wrap max-w-full ${
                                          ownMessage
                                            ? "justify-end border-[var(--color-panel)]"
                                            : "justify-start border-[var(--color-secondary)]"
                                        }`}
                                        style={{ overflowWrap: "anywhere" }}
                                      >
                                        {msg.text}
                                      </p>
                                    </div>
                                  )}

                                  {msg.files && msg.files.length > 0 && (
                                    <div
                                      ref={(e) => {
                                        if (e) bubbleRef.current[msg.msgId] = e;
                                      }}
                                      className={`flex flex-wrap gap-2 mt-2 rounded ${
                                        ownMessage
                                          ? "justify-end"
                                          : "justify-start"
                                      }`}
                                    >
                                      {msg.files.map((file, index) => {
                                        const isVideo =
                                          /\.(mp4|mov|avi|webm)$/i.test(file);
                                        const isImage =
                                          /\.(jpg|peg|png|gif|webp)$/i.test(
                                            file,
                                          );
                                        const isGif =
                                          file.includes("tenor.com") ||
                                          file.includes("media.tenor.com") ||
                                          file.includes("static.klipy.com");

                                        return (
                                          <div
                                            onClick={() =>
                                              openCitadelLightBox(
                                                msg.files,
                                                msg.senderId,
                                                messageOwner.name,
                                                msg.messagedAt,
                                                index,
                                              )
                                            }
                                            key={index}
                                            className="w-full min-w-32 max-w-60 md:max-w-90 h-auto block relative cursor-pointer"
                                          >
                                            {isVideo ? (
                                              <video
                                                src={file}
                                                controls
                                                className="w-full h-full rounded"
                                              />
                                            ) : isImage || isGif ? (
                                              <img
                                                src={file}
                                                alt={`sent by ${messageOwner.name}`}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-full object-cover rounded"
                                              />
                                            ) : null}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>

                                {!ownMessage && (
                                  <div
                                    className={`ml-2 ${!msg.text && msg.files?.length > 0 ? "flex md:hidden md:group-hover:flex" : activeMessage === msg.msgId ? "flex" : "hidden md:group-hover:flex"}`}
                                  >
                                    <FaReply
                                      onClick={() => handleReply(msg)}
                                      className="text-xl opacity-60 mt-2 cursor-pointer"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          {visibleSeenUsers.length > 0 && (
                            <div
                              className={`flex gap-0.5 mt-1 ${ownMessage ? "mr-2" : "ml-12"}`}
                            >
                              {visibleSeenUsers.slice(-5).map((viewer) => (
                                <img
                                  key={viewer.uid}
                                  src={viewer.picture || Avatar.src}
                                  alt={viewer.name}
                                  className="w-4 h-4 rounded-full object-cover"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={msgEndRef} />
                </div>
              </div>
            )}

            <div className="px-2 mb-2 flex flex-col gap-2">
              {replyingTo && !editingMessage && (
                <div className="flex justify-between items-center p-2 bg-second rounded-lg border-l-2 border-accent">
                  <div className="flex-1 min-w-0 w-0">
                    <p className="text-xs text-accent font-bold">
                      replying to{" "}
                      {user.uid === replyingTo.senderId
                        ? "yourself"
                        : replyingToOwner?.name}
                    </p>
                    <p className="text-sm opacity-60 truncate">
                      {replyingTo.text ||
                        (replyingTo.files?.length ? "Attachment" : "Message")}
                    </p>
                  </div>
                  <MdClose
                    onClick={cancelReply}
                    className="text-xl cursor-pointer shrink-0 ml-2"
                  />
                </div>
              )}
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 border-1 border-panel py-2 px-4 bg-second rounded-lg">
                  {files.map((file, index) => {
                    const previewSrc =
                      typeof file === "string"
                        ? file
                        : URL.createObjectURL(file);

                    return (
                      <div key={index} className="w-20 h-20 relative">
                        <img
                          src={previewSrc}
                          alt={`preivew-${index}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover rounded"
                        />
                        <div className="absolute top-1 right-1">
                          <button
                            onClick={() => {
                              setFiles((prev) =>
                                prev.filter((_, i) => i !== index),
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
              <img
                src={user?.picture || Avatar.src}
                alt={user.name}
                loading="lazy"
                decoding="async"
                className="w-12 h-12 object-cover rounded-full shrink-0"
              />
              <div className="w-full bg-panel rounded-2xl border-1 border-[var(--color-secondary)] py-2 px-4">
                <div className="flex items-center w-full gap-2">
                  <textarea
                    ref={inputRef}
                    value={editingMessage ? editInput : input}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();

                        editingMessage
                          ? editMessage(editingMessage)
                          : sendMessage();
                      }
                    }}
                    placeholder={
                      editingMessage
                        ? "Edit your message"
                        : `Chat as ${user.name}...`
                    }
                    rows={1}
                    style={{ maxHeight: "120px" }}
                    className="w-full resize-none overflow-y-auto text-normal outline-none text-base font-normal bg-transparent"
                  />
                  <MdSend
                    className="text-2xl cursor-pointer shrink-0"
                    onClick={() =>
                      editingMessage
                        ? editMessage(editingMessage)
                        : sendMessage()
                    }
                  />
                </div>
                {!editingMessage && (
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
                      onClick={() => setShowGifPickerModal((prev) => !prev)}
                      className="text-xl text-[var(--color-text)]/60 shrink-0 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {showConfirmMessageDeleteModal && (
        <ConfirmMessageDeleteModal
          setShowConfirmMessageDeleteModal={setShowConfirmMessageDeleteModal}
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
      {showGifPickerModal && (
        <GifPickerModal
          onSelect={(gifUrl) => {
            setFiles((prev) => [...prev, gifUrl]);
            setShowGifPickerModal(false);
          }}
          setShowGifPickerModal={setShowGifPickerModal}
        />
      )}
      {selectedMessage && (
        <div
          onClick={() => setSelectedMessage(null)}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-panel bg-second shadow-2xl"
          >
            <div className="flex items-center justify-end px-4 pt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMessage(null);
                }}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-vibe transition hover:bg-[var(--color-panel)] hover:text-[var(--color-accent)] shrink-0"
              >
                <MdClose className="text-xl" />
              </button>
            </div>
            <div className="px-4 pb-4">
              <div className="flex flex-col md:flex-row md:gap-2">
                <RegularButtons
                  onClick={() => {
                    setEditingMessage(selectedMessage.msgId);
                    setEditInput(selectedMessage.text);
                    setSelectedMessage(null);
                  }}
                >
                  <p className="font-bold text-normal text-base">
                    Edit Message
                  </p>
                </RegularButtons>
                <RegularButtons
                  onClick={() => {
                    setMessageToDelete(selectedMessage.msgId);
                    setShowConfirmMessageDeleteModal(true);
                    setSelectedMessage(null);
                  }}
                >
                  <p className="font-bold text-normal text-base">
                    Delete Message
                  </p>
                </RegularButtons>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
