"use client";
import { useContext, useEffect } from "react";
import { PostContext } from "@/context/postContext";
import { MdClose } from "react-icons/md";
import { FaBolt, FaComment, FaShare } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/userContext";
import { LoaderContext } from "@/context/loaderContext";

export default function LightBox() {
  const {
    posts,
    handleLike,
    currentPost,
    currentPostInfo,
    showDetails,
    setShowDetails,
    initialIndex,
    lightboxOpen,
    setLightboxOpen,
    lightboxRef,
  } = useContext(PostContext);
  const { user, setShowSignIn } = useContext(UserContext);
  const { setIsLoading } = useContext(LoaderContext);
  const router = useRouter();

  const post = posts.find((p) => p.postId === currentPostInfo.postId);

  const handlePostNav = (id) => {
    router.push(`/post/${id}`);
    setIsLoading(true);
    setLightboxOpen(false);
  };

  useEffect(() => {
    if (!lightboxOpen) return;

    window.history.pushState(null, "");
    const onPopState = () => {
      setLightboxOpen(false);
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [lightboxOpen]);

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
        <div className="absolute bg-[var(--color-secondary)]/50 w-full bottom-0 left-0">
          <div className="flex flex-col p-2">
            <p className="text-base mt-2 font-bold leading-3.5">
              {currentPostInfo.userName}
            </p>
            <p className="text-xs text-vibe">{currentPostInfo.date}</p>
          </div>
          <div className="p-2">
            <p
              onClick={() => handlePostNav(currentPostInfo.postId)}
              className="cursor-pointer text-base text-normal leading-5 line-clamp-3"
            >
              {currentPostInfo.text}
            </p>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-panel gap-4 mt-2 p-2">
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (user) {
                  handleLike(post);
                } else {
                  setLightboxOpen(false);
                  setShowSignIn(true);
                }
              }}
              className="flex items-center justify-center gap-2 bg-[var(--color-panel)]/75 p-4 rounded-4xl w-[33%] h-12 transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-[var(--color-accent)] active:bg-[var(--color-accent)] cursor-pointer"
            >
              <FaBolt
                className={`text-2xl ${
                  post?.energized?.includes(user?.uid)
                    ? "text-zeus"
                    : "text-normal"
                }`}
              />
              <p className="text-xs font-light text-vibe">
                {post?.energized ? post?.energized.length : 0}
              </p>
            </div>
            <div
              onClick={() => handlePostNav(currentPostInfo.postId)}
              className="flex items-center justify-center gap-2 bg-[var(--color-panel)]/75 p-4 rounded-4xl w-[33%] h-12 transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-[var(--color-accent)] active:bg-[var(--color-accent)] cursor-pointer"
            >
              <FaComment className="text-xl" />
              <p className="text-xs font-light text-vibe">
                {post?.comments ? post?.comments.length : 0}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 bg-[var(--color-panel)]/75 p-4 rounded-4xl w-[33%] h-12 transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-[var(--color-accent)] active:bg-[var(--color-accent)] cursor-pointer">
              <FaShare className="text-xl" />
              <p className="text-xs font-light text-vibe">21</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
