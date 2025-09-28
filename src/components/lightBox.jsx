"use client";
import { useContext } from "react";
import { PostContext } from "@/context/postContext";
import { MdClose } from "react-icons/md";
import { FaBolt, FaComment, FaShare } from "react-icons/fa";
import Image from "next/image";

export default function LightBox() {
  const {
    currentPost,
    currentPostInfo,
    showDetails,
    setShowDetails,
    initialIndex,
    setLightboxOpen,
    lightboxRef,
  } = useContext(PostContext);
  return (
    <div className="inset-0 z-[100] flex flex-col items-center justify-center fixed">
      {showDetails && (
        <button className="absolute cursor-pointer z-[120] top-4 right-4 text-2xl sm:text-3xl md:text-4xl font-bold duration-200 hover:scale-110 active:scale-110">
          <MdClose onClick={() => setLightboxOpen(false)} />
        </button>
      )}
      <div
        onClick={(e) => {
          e.stopPropagation();
          setShowDetails((prev) => !prev);
        }}
        ref={lightboxRef}
        className="flex items-center bg-brand overflow-x-auto snap-x snap-mandatory scroll-smooth relative w-[100%] h-[100%] scrollbar-hide"
      >
        {currentPost.map((file, index) => {
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
        <div className="absolute bg-[var(--color-secondary)]/50 w-full p-2 bottom-0 left-0">
          <div className="flex flex-col">
            <p className="text-base mt-2 font-bold leading-3.5">
              {currentPostInfo.userName}
            </p>
            <p className="text-xs text-vibe">{currentPostInfo.date}</p>
          </div>
          <div>
            <p className="text-base text-normal">{currentPostInfo.text}</p>
          </div>
          <div className="flex justify-between items-center pt-4 border-t gap-4 mt-2">
            <div className="flex items-center justify-center gap-2 border-1 p-4 rounded-4xl w-[33%] h-12">
              <FaBolt className="text-xl" />
              <p className="text-xs font-light text-vibe">21</p>
            </div>
            <div className="flex items-center justify-center gap-2 border-1 p-4 rounded-4xl w-[33%] h-12">
              <FaComment className="text-xl" />
              <p className="text-xs font-light text-vibe">21</p>
            </div>
            <div className="flex items-center justify-center gap-2 border-1 p-4 rounded-4xl w-[33%] h-12">
              <FaShare className="text-xl" />
              <p className="text-xs font-light text-vibe">21</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
