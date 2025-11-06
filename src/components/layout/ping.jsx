import { useContext, useEffect, useState } from "react";
import { ScrollContext } from "@/context/scrollContext";
import { UserContext } from "@/context/userContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LoaderContext } from "@/context/loaderContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { PiBellSimpleSlash } from "react-icons/pi";
import { SocketContext } from "@/context/socketContext";
import { BiDotsHorizontal, BiDotsHorizontalRounded } from "react-icons/bi";
import PingOpt from "./pingOpt";
import SecondaryButtons from "../buttons/secBtns";
import RegularButtons from "../buttons/regBtns";
import Swal from "sweetalert2";

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

export default function Ping({ setShowPing }) {
  const { navHide } = useContext(ScrollContext);
  const { setIsLoading } = useContext(LoaderContext);
  const { pings, setPings } = useContext(SocketContext);
  const [selectedPing, setSelectedPing] = useState(null);
  const { user } = useContext(UserContext);
  const router = useRouter();

  const handlePingClick = async (ping) => {
    try {
      setIsLoading(true);
      await fetch(`${BASE_URL}/api/pings/isReadPatch/${ping.pingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRead: true }),
      });

      setPings((prev) =>
        prev.map((p) => (p.pingId === ping.pingId ? { ...p, isRead: true } : p))
      );

      if (ping.type === "comment" || ping.type === "reply") {
        router.push(`/post/${ping.postId}`);
      } else if (ping.type === "sigil") {
        router.push(`/profile/${ping.userId}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAll = async (userId) => {
    try {
      setIsLoading(true);
      await fetch(`${BASE_URL}/api/pings/deleteAll/${userId}`, {
        method: "DELETE",
      });

      setPings((prev) => prev.filter((p) => p.userId !== userId));
    } catch (err) {
      console.error(err);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Failed deleting pings!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-accent)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title:
            "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
        },
      });
    } finally {
      setIsLoading(false);
      setSelectedPing(null);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "All pings have been deleted!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-hulk)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title:
            "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
        },
      });
    }
  };

  const handleReadAllPing = async (userId) => {
    try {
      setIsLoading(true);
      await fetch(`${BASE_URL}/api/pings/markAllAsRead/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRead: true }),
      });

      setPings((prev) =>
        prev.map((p) => (p.userId === userId ? { ...p, isRead: true } : p))
      );
    } catch (err) {
      console.error(err);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Failed marking pings as read!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-accent)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title:
            "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
        },
      });
    } finally {
      setIsLoading(false);
      setSelectedPing(null);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "All pings have been marked as read!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-hulk)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title:
            "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
        },
      });
    }
  };
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
          {pings.length > 0 && (
            <div className="p-2">
              <RegularButtons onClick={() => handleDeleteAll(user.uid)}>
                <p className="font-bold text-normal text-base">Delete all</p>
              </RegularButtons>
              <RegularButtons onClick={() => handleReadAllPing(user.uid)}>
                <p className="font-bold text-normal text-base">
                  Mark all as read
                </p>
              </RegularButtons>
            </div>
          )}
          {pings.length === 0 ? (
            <div className="flex flex-col items-center justify-center">
              <PiBellSimpleSlash className="text-4xl text-vibe opacity-40 mt-16" />
              <p className="text-xs text-vibe opacity-40">No pings yet</p>
            </div>
          ) : (
            pings
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((ping) => (
                <div
                  key={ping.date}
                  onClick={() => handlePingClick(ping)}
                  className={`relative flex border-b-1 p-4 cursor-pointer ${
                    ping.isRead
                      ? "bg-second border-panel"
                      : "bg-panel border-[var(--color-secondary)]"
                  }`}
                >
                  <div className="flex gap-2 items-start">
                    <Image
                      src={ping.senderImage}
                      alt="user"
                      width={0}
                      height={0}
                      sizes="100vw"
                      className={`cursor-pointer w-12 h-12 shrink-0 object-cover ${ping.type === "sigil" ? "rounded-none" : "rounded-full "}`}
                    />
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-2">
                        <p className="leading-4 text-base font-bold">
                          {ping.senderName}{" "}
                          <span className="font-normal text-sm">
                            {ping.message}
                          </span>
                        </p>
                      </div>
                      <p className="text-xs text-vibe">
                        {(() => {
                          const diffWeeks = dayjs().diff(
                            dayjs(ping.date),
                            "week"
                          );
                          if (diffWeeks < 1) {
                            return dayjs(ping.date).fromNow();
                          }
                          return new Date(ping.date).toLocaleDateString([], {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          });
                        })()}
                      </p>
                    </div>
                  </div>
                  <BiDotsHorizontalRounded
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPing(
                        selectedPing === ping.pingId ? null : ping.pingId
                      );
                    }}
                    className="text-2xl shrink-0"
                  />
                  {selectedPing === ping.pingId && (
                    <PingOpt
                      pingId={ping.pingId}
                      setSelectedPing={setSelectedPing}
                    />
                  )}
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
