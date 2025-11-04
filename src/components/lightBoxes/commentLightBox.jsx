"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LoaderContext } from "@/context/loaderContext";
import { RiArrowLeftWideFill, RiArrowRightWideFill } from "react-icons/ri";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function CommentLightBox({
  commentLightBoxFiles,
  commentLightBoxUserId,
  commentLightBoxUserName,
  commentLightBoxDate,
  initialIndex,
  commentLightBoxOpen,
  setCommentLightBoxOpen,
}) {
  const [showDetails, setShowDetails] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { setIsLoading } = useContext(LoaderContext);
  const commentLightBoxRef = useRef();
  const router = useRouter();

  useEffect(() => {
    if (!commentLightBoxOpen) return;

    window.history.pushState(null, "");
    const onPopState = () => {
      setCommentLightBoxOpen(false);
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [commentLightBoxOpen]);

  useEffect(() => {
    if (!commentLightBoxOpen || !commentLightBoxRef.current) return;

    const scrollToIndex = () => {
      commentLightBoxRef.current.scrollTo({
        left: commentLightBoxRef.current.clientWidth * initialIndex,
        behavior: "instant",
      });
    };

    const timeout = setTimeout(() => {
      scrollToIndex();
    }, 0);

    return () => clearTimeout(timeout);
  }, [commentLightBoxOpen, initialIndex]);

  const handleNext = () => {
    if (!commentLightBoxRef.current) return;
    if (currentIndex < commentLightBoxFiles.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      commentLightBoxRef.current.scrollTo({
        left: commentLightBoxRef.current.clientWidth * newIndex,
        behavior: "smooth",
      });
    }
  };

  const handlePrev = () => {
    if (!commentLightBoxRef.current) return;
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      commentLightBoxRef.current.scrollTo({
        left: commentLightBoxRef.current.clientWidth * newIndex,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="inset-0 z-[100] flex flex-col items-center justify-center fixed">
      <div className="z-50 inset-0">
        {showDetails && commentLightBoxFiles.length > 1 ? (
          <div className="absolute top-5 left-4">
            <p className="text-xs text-vibe">
              {currentIndex + 1}/{commentLightBoxFiles.length}
            </p>
          </div>
        ) : null}
        {showDetails && (
          <button className="absolute cursor-pointer top-4 right-4">
            <MdClose
              onClick={() => setCommentLightBoxOpen(false)}
              className="text-2xl font-bold duration-200 hover:scale-110 active:scale-110"
            />
          </button>
        )}
        {showDetails && commentLightBoxFiles.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="cursor-pointer absolute z-50 top-1/2 -translate-y-1/2 left-1"
            >
              <RiArrowLeftWideFill className="text-2xl" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="cursor-pointer absolute z-50 top-1/2 -translate-y-1/2 right-1"
            >
              <RiArrowRightWideFill className="text-2xl" />
            </button>
          </>
        )}
      </div>
      <div
        onScroll={(e) => {
          const width = e.target.clientWidth;
          const scrollLeft = e.target.scrollLeft;
          const index = Math.round(scrollLeft / width);
          setCurrentIndex(index);
        }}
        onClick={(e) => {
          e.stopPropagation();
          setShowDetails((prev) => !prev);
        }}
        ref={commentLightBoxRef}
        className="flex items-center bg-brand overflow-x-auto snap-x snap-mandatory scroll-smooth relative w-[100%] h-[100%] scrollbar-hide"
      >
        {commentLightBoxFiles.map((file, index) => {
          const ext = file.split(".").pop().toLowerCase();

          return (
            <div
              key={index}
              className="flex-shrink-0 w-full h-full snap-center flex items-center justify-center relative"
            >
              {["jpg", "jpeg", "png", "gif", "webp"].includes(ext) && (
                <Image src={file} alt="file" fill className="object-contain" />
              )}
              {["mp4", "webm", "ogg"].includes(ext) && (
                <video
                  src={file}
                  controls
                  autoPlay={index === initialIndex}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          );
        })}
      </div>
      {showDetails && (
        <div className="absolute bg-[var(--color-secondary)]/50 w-full bottom-0 left-0">
          <div className="flex flex-col p-2">
            <p
              onClick={(e) => {
                e.stopPropagation();
                setIsLoading(true);
                setCommentLightBoxOpen(false);
                router.push(`/profile/${commentLightBoxUserId}`);
              }}
              className="cursor-pointer text-base mt-2 font-bold leading-3.5"
            >
              {commentLightBoxUserName}
            </p>
            <p className="text-xs text-vibe">
              {(() => {
                const diffWeeks = dayjs().diff(
                  dayjs(commentLightBoxDate),
                  "week"
                );
                if (diffWeeks < 1) {
                  return dayjs(commentLightBoxDate).fromNow();
                }
                return new Date(commentLightBoxDate).toLocaleDateString(
                  [],
                  {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  }
                );
              })()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
