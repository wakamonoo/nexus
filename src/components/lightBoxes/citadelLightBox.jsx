"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { PostContext } from "@/context/postContext";
import { MdClose, MdOutlineSensors } from "react-icons/md";
import { FaComment, FaShare } from "react-icons/fa";
import { AiFillThunderbolt } from "react-icons/ai";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { UserContext } from "@/context/userContext";
import { LoaderContext } from "@/context/loaderContext";
import { RiArrowLeftWideFill, RiArrowRightWideFill } from "react-icons/ri";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function CitadelLightBox({
  citadelLightBoxFiles,
  citadelLightBoxSenderId,
  citadelLightBoxSenderName,
  citadelLightBoxSentDate,
  initialIndex,
  citadelLightBoxOpen,
  setCitadelLightBoxOpen,
}) {
  const [showDetails, setShowDetails] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const citadelLightBoxRef = useRef();
  const router = useRouter();

  useEffect(() => {
    if (!citadelLightBoxOpen) return;

    window.history.pushState(null, "");
    const onPopState = () => {
      setCitadelLightBoxOpen(false);
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [citadelLightBoxOpen]);

  useEffect(() => {
    if (!citadelLightBoxOpen || !citadelLightBoxRef.current) return;

    const scrollToIndex = () => {
      citadelLightBoxRef.current.scrollTo({
        left: citadelLightBoxRef.current.clientWidth * initialIndex,
        behavior: "instant",
      });
    };

    const timeout = setTimeout(() => {
      scrollToIndex();
    }, 0);

    return () => clearTimeout(timeout);
  }, [citadelLightBoxOpen, initialIndex]);

  const handleNext = () => {
    if (!citadelLightBoxRef.current) return;
    if (currentIndex < citadelLightBoxFiles.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      citadelLightBoxRef.current.scrollTo({
        left: citadelLightBoxRef.current.clientWidth * newIndex,
        behavior: "smooth",
      });
    }
  };

  const handlePrev = () => {
    if (!citadelLightBoxRef.current) return;
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      citadelLightBoxRef.current.scrollTo({
        left: citadelLightBoxRef.current.clientWidth * newIndex,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="inset-0 z-[100] flex flex-col items-center justify-center fixed">
      <div className="z-50 inset-0">
        {showDetails && citadelLightBoxFiles.length > 1 ? (
          <div className="absolute top-5 left-4">
            <p className="text-xs text-vibe">
              {currentIndex + 1}/{citadelLightBoxFiles.length}
            </p>
          </div>
        ) : null}
        {showDetails && (
          <button className="absolute cursor-pointer top-4 right-4">
            <MdClose
              onClick={() => setCitadelLightBoxOpen(false)}
              className="text-2xl font-bold duration-200 hover:scale-110 active:scale-110"
            />
          </button>
        )}
        {showDetails && citadelLightBoxFiles.length > 1 && (
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
        ref={citadelLightBoxRef}
        className="flex items-center bg-brand overflow-x-auto snap-x snap-mandatory scroll-smooth relative w-[100%] h-[100%] scrollbar-hide"
      >
        {citadelLightBoxFiles.map((file, index) => {
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
                setPostLightboxOpen(false);
                router.push(`/profile/${citadelLightBoxSenderId}`);
              }}
              className="cursor-pointer text-base mt-2 font-bold leading-3.5"
            >
              {citadelLightBoxSenderName}
            </p>
            <p className="text-xs text-vibe">
              {(() => {
                const diffWeeks = dayjs().diff(
                  dayjs(citadelLightBoxSentDate),
                  "week"
                );
                if (diffWeeks < 1) {
                  return dayjs(citadelLightBoxSentDate).fromNow();
                }
                return new Date(citadelLightBoxSentDate).toLocaleDateString(
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
