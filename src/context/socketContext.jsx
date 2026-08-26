"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./userContext";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const SocketContext = createContext();

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

const showBrowserNotification = ({ title, body, icon }) => {
  if (
    typeof window === "undefined" ||
    !("Notification" in window) ||
    Notification.permission !== "granted"
  ) {
    return;
  }

  if (document.visibilityState === "visible") {
    return;
  }

  new Notification(title, {
    body,
    icon,
  });
};

export const SocketProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [chatLoad, setChatLoad] = useState(true);
  const { allUsers, user, socket } = useContext(UserContext);
  const [sortedReviews, setSortedReviews] = useState([]);
  const [reviewsLoad, setReviewsLoad] = useState(true);
  const [reviewVotes, setReviewVotes] = useState({});
  const [listVotes, setListVotes] = useState({});
  const [pings, setPings] = useState([]);
  const [activities, setActivities] = useState(null);
  const [latestSeenMessages, setLatestSeenMessages] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

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

    const fetchLatestSeenMessages = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/messages/citadelSeenGet`);
        const data = await res.json();

        const mapped = {};

        data.forEach((item) => {
          mapped[item.uid] = {
            messageId: item.latestCitadelSeenMessageId,
            seenAt: item.latestCitadelSeenAt,
          };
        });

        setLatestSeenMessages(mapped);
      } catch (err) {
        console.error("failed to fetch messages", err);
      }
    };

    fetchLatestSeenMessages();

    socket.on("messageSent", (data) => {
      setMessages((prev) => [...prev, data]);

      const isReplyToYou = data.replyTo?.senderId === user?.uid;

      const sender = allUsers?.find((u) => u.uid === data.senderId);

      showBrowserNotification({
        title: isReplyToYou
          ? `${sender?.name} replied to your message`
          : `New message from ${sender?.name}`,
        body: data.text,
        icon: sender?.picture,
      });
    });

    socket.on("messageEdited", (updatedMessage) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.msgId === updatedMessage.msgId
            ? {
                ...msg,
                text: updatedMessage.text,
                edited: true,
                editedAt: updatedMessage.editedAt,
              }
            : msg,
        ),
      );
    });

    socket.on("messageDeleted", ({ msgId }) => {
      setMessages((prev) => prev.filter((msg) => msg.msgId !== msgId));
    });

    socket.on("messageSeen", (data) => {
      setLatestSeenMessages((prev) => ({
        ...prev,

        [data.userId]: {
          messageId: data.messageId,
          seenAt: data.seenAt,
        },
      }));
    });

    return () => {
      socket.off("messageSent");
      socket.off("messageEdited");
      socket.off("messageDeleted");
      socket.off("messageSeen");
    };
  }, [socket, user]);

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

      const sender =
        pingData.senderId === "system"
          ? {
              name: pingData.senderName,
              picture: pingData.senderImage,
            }
          : allUsers.find((u) => u.uid === pingData.senderId);

      const recipient = allUsers.find((u) => u.uid === pingData.userId);

      setPings((prev) => [...prev, pingData]);

      toast.custom(
        (t) => (
          <div
            onClick={() => {
              {
                if (
                  pingData.type === "postComment" ||
                  pingData.type === "reply" ||
                  pingData.type === "energize" ||
                  pingData.type === "echo"
                ) {
                  router.push(`/post/${pingData.postId}`);
                } else if (pingData.type === "sigil") {
                  router.push(`/profile/${pingData.userId}`);
                } else if (pingData.type === "reviewUpvote") {
                  router.push(`/hex/${pingData.titleId}`);
                } else if (pingData.type === "listComment") {
                  router.push(`/hex/lists/${pingData.listId}`);
                }
              }
              toast.dismiss(t.id);
            }}
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-xs w-full bg-second border-1 border-panel text-normal rounded-lg shadow-lg px-4 py-2 flex items-center justify-center gap-4 cursor-pointer`}
          >
            <Image
              src={sender.picture || "/defaultAvatar.png"}
              alt="icon"
              width={0}
              height={0}
              sizes="100vw"
              className={`cursor-pointer w-12 h-12 shrink-0 object-cover ${
                pingData.type === "sigil" ? "rounded-none" : "rounded-full "
              }`}
            />
            <div className="flex-1">
              <p className="text-base text-normal font-semibold">
                {pingData.type === "reviewUpvote" ||
                pingData.type === "listUpvote"
                  ? recipient?.name
                  : sender?.name}{" "}
                {pingData.message}
              </p>
            </div>
          </div>
        ),
        { duration: 5000 },
      );
      showBrowserNotification({
        title:
          pingData.type === "reviewUpvote" || pingData.type === "listUpvote"
            ? recipient?.name
            : sender?.name,
        body: pingData.message,
        icon: sender?.picture,
      });
    });

    return () => {
      socket.off("ping");
    };
  }, [user]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/activities/activitiesGet`);
        const activityData = await res.json();

        setActivities(activityData || []);
      } catch (err) {
        console.error("failed to fetch activities", err);
      }
    };

    fetchActivities();

    socket.on("activity", (activityData) => {
      console.log("Received activity:", activityData);

      setActivities((prev) => [activityData, ...prev]);
    });

    return () => {
      socket.off("activity");
    };
  }, []);

  useEffect(() => {
    const fetchLatestReviews = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/reviews/latestReviewsGet`);
        const data = await res.json();

        setSortedReviews(data);
      } catch (err) {
        console.error("failed to fetch pings", err);
      } finally {
        setReviewsLoad(false);
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

  useEffect(() => {
    if (!socket) return;

    socket.on("reviewVoteUpdated", (data) => {
      setReviewVotes((prev) => ({
        ...prev,
        [data.reviewId]: {
          upvotes: data.upvotes,
          downvotes: data.downvotes,
        },
      }));
    });

    return () => {
      socket.off("reviewVoteUpdated");
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on("listVoteUpdated", (data) => {
      setListVotes((prev) => ({
        ...prev,
        [data.listId]: {
          upvotes: data.upvotes,
          downvotes: data.downvotes,
        },
      }));
    });

    return () => {
      socket.off("listVoteUpdated");
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
        reviewsLoad,
        reviewVotes,
        listVotes,
        latestSeenMessages,
        activities,
      }}
    >
      {children}
      <Toaster position="bottom-left" toastOptions={{ duration: 5000 }} />
    </SocketContext.Provider>
  );
};
