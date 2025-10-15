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

export default function LightBox() {
  const {
    posts,
    handleEnergize,
    handleEcho,
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const pathname = usePathname();

  const post = posts.find((p) => p.postId === currentPostInfo.postId);

  const handlePostNav = (id, focusInput = false) => {
    setLightboxOpen(false);
    if (pathname == `/post/${id}`) {
      return;
    }
    setIsLoading(true);
    const url = focusInput ? `/post/${id}?focus=comment` : `/post/${id}`;
    router.push(url);
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
      <div className="z-50">
        {currentPost.length > 1 ? (
          <div className="absolute top-5 left-4">
            <p className="text-xs text-vibe">
              {currentIndex + 1}/{currentPost.length}
            </p>
          </div>
        ) : null}
        {showDetails && (
          <button className="absolute cursor-pointer top-4 right-4 text-2xl sm:text-3xl md:text-4xl font-bold duration-200 hover:scale-110 active:scale-110">
            <MdClose onClick={() => setLightboxOpen(false)} />
          </button>
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
            <p
              onClick={(e) => {
                e.stopPropagation();
                setIsLoading(true);
                setLightboxOpen(false);
                router.push(`/profile/${post.userId}`);
              }}
              className="cursor-pointer text-base mt-2 font-bold leading-3.5"
            >
              {currentPostInfo.userName}
            </p>
            <p className="text-xs text-vibe">
              {new Date(currentPostInfo.date)
                .toLocaleString("en-us", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })
                .replace(/^(\w{3})/, "$1.")}
            </p>
          </div>
          <div
            onClick={() => handlePostNav(currentPostInfo.postId)}
            className="px-1"
          >
            <div
              onClick={(e) => {
                setIsLoading(true);
                e.stopPropagation();
                setLightboxOpen(false);
                router.push(`/postings/${currentPostInfo.topic}`);
              }}
              className={`h-fit w-fit rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-zeus)] p-1 ${
                currentPostInfo.topic ? "block" : "hidden"
              }`}
            >
              <p className="font-bold text-vibe px-2">
                {currentPostInfo.topic}
              </p>
            </div>
          </div>
          <div className="px-2 py-1">
            <p
              onClick={() => handlePostNav(currentPostInfo.postId)}
              className="cursor-pointer text-base text-normal leading-5 line-clamp-3"
            >
              {currentPostInfo.text}
            </p>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-panel mt-2 py-4">
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (user) {
                  handleEnergize(post);
                } else {
                  setLightboxOpen(false);
                  setShowSignIn(true);
                }
              }}
              className="flex flex-col items-center justify-center bg-[var(--color-panel)]/75 p-2  w-[33%] h-fit transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-[var(--color-secondary)] active:bg-[var(--color-secondary)] cursor-pointer"
            >
              <AiFillThunderbolt
                className={`text-2xl ${
                  post?.energized?.includes(user?.uid)
                    ? "text-zeus"
                    : "text-normal"
                }`}
              />
              <p className="text-xs font-light text-vibe opacity-50">
                {post?.energized ? post?.energized.length : 0} energized
              </p>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (user) {
                  handleEcho(post);
                } else {
                  setLightboxOpen(false);
                  setShowSignIn(true);
                }
              }}
              className="flex flex-col items-center justify-center bg-[var(--color-panel)]/75 p-2  w-[33%] h-fit transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-[var(--color-secondary)] active:bg-[var(--color-secondary)] cursor-pointer"
            >
              <MdOutlineSensors
                className={`text-2xl ${
                  post.echoed?.includes(user?.uid)
                    ? "text-accent"
                    : "text-normal"
                }`}
              />
              <p className="text-xs font-light text-vibe opacity-50">
                {post.echoed ? post.echoed.length : 0} echoed
              </p>
            </div>
            <div
              onClick={() => handlePostNav(currentPostInfo.postId, true)}
              className="flex flex-col items-center justify-center bg-[var(--color-panel)]/75 p-2  w-[33%] h-fit transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-[var(--color-secondary)] active:bg-[var(--color-secondary)] cursor-pointer"
            >
              <FaComment className="text-2xl transform -scale-x-100" />
              <p className="text-xs font-light text-vibe opacity-50">
                {post?.comments ? post?.comments.length : 0} commented
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
