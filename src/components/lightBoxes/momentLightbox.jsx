"use client";
import Fallback from "@/assets/fallback.png";
import Avatar from "@/assets/defaultAvatar.png";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FaHeart } from "react-icons/fa6";
import { useContext, useState } from "react";
import { UserContext } from "@/context/userContext";
import { SocketContext } from "@/context/socketContext";
import { TitleNavContext } from "@/context/titleNavContext";
import { FaTrash } from "react-icons/fa";
import ConfirmMomentDeleteModal from "../modals/confirmMomentDeleteModal";

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

export default function MomentLightbox({
  setShowMomentLightbox,
  moment,
  owner,
  title,
}) {
  const { user, setShowSignInModal } = useContext(UserContext);
  const { handleShowNav } = useContext(TitleNavContext);
  const { momentLoves } = useContext(SocketContext);
  const [showConfirmMomentDeleteModal, setShowConfirmMomentDeleteModal] =
    useState(false);

  const loved = momentLoves[moment?.momentId] ?? moment?.loved ?? [];

  const handleLove = async () => {
    try {
      await fetch(`${BASE_URL}/api/reacts/momentLove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          momentId: moment.momentId,
          ownerId: owner.uid,
          userId: user?.uid,
          title: title.title,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div
        onClick={() => setShowMomentLightbox(false)}
        className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative aspect-[5/7] w-[min(90vw,57.14vh)] overflow-hidden rounded-2xl border border-panel bg-second shadow-2xl"
        >
          <div className="absolute inset-0 z-0">
            <img
              src={moment.image || Fallback.src}
              alt="Moment Image"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-3 flex items-center justify-between w-full px-4">
            <div className="flex items-center gap-2 rounded-full bg-[var(--color-panel)]/60 px-2 py-1.5">
              <img
                src={owner.picture || Avatar.src}
                alt={owner.name}
                loading="lazy"
                decoding="async"
                className="w-8 h-8 rounded-full object-cover cursor-pointer"
              />
              <div className="pr-2">
                <p className="max-w-32 truncate text-sm font-bold leading-none cursor-pointer hover:underline">
                  {owner.name}
                </p>

                <p className="text-xs text-vibe">
                  {(() => {
                    const diffWeeks = dayjs().diff(
                      dayjs(moment.createdAt),
                      "week",
                    );
                    if (diffWeeks < 1) {
                      return dayjs(moment.createdAt).fromNow();
                    }
                    return new Date(moment.createdAt).toLocaleDateString([], {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    });
                  })()}
                </p>
              </div>
            </div>
            <div
              onClick={() => {
                if (!user) {
                  setShowSignInModal(true);
                } else {
                  handleLove();
                }
              }}
              className="flex items-center gap-2 cursor-pointer transition-all duration-200 group"
            >
              <span className="text-xs text-vibe opacity-60">
                {loved ? loved.length : 0}
              </span>
              <FaHeart
                className={`text-xl group-hover:scale-110 group-active:scale-110 ${loved?.includes(user?.uid) ? "text-accent" : "text-vibe"}`}
              />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pb-4 pt-20 flex items-end justify-between">
            <div className="flex flex-col">
              {moment.caption && (
                <p className="mb-3 text-sm leading-relaxed">{moment.caption}</p>
              )}
              <div
                onClick={() => handleShowNav(title.titleId)}
                className="cursor-pointer flex items-center gap-2"
              >
                <img
                  src={
                    title.poster
                      ? `https://image.tmdb.org/t/p/w500${title.poster}`
                      : Fallback.src
                  }
                  alt={title.title}
                  loading="lazy"
                  decoding="async"
                  className="h-10 w-7 rounded object-cover"
                />
                <div className="min-w-0">
                  <p className="text-xs text-vibe opacity-60 leading-2">watching</p>
                  <p className="truncate text-sm font-bold">{title.title}</p>
                </div>
              </div>
            </div>

            {user?.uid === owner.uid && (
              <button
                onClick={() => setShowConfirmMomentDeleteModal(true)}
                className="cursor-pointer"
              >
                <FaTrash className="text-xl transition-all duration-200 hover:text-accent active:text-accent" />
              </button>
            )}
          </div>
        </div>
      </div>
      {showConfirmMomentDeleteModal && (
        <ConfirmMomentDeleteModal
          momentId={moment.momentId}
          setShowConfirmMomentDeleteModal={setShowConfirmMomentDeleteModal}
          setShowMomentLightbox={setShowMomentLightbox}
        />
      )}
    </>
  );
}
