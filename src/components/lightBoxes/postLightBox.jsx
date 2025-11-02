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

export default function PostLightBox() {
  const {
    posts,
    handleEnergize,
    handleEcho,
    currentPost,
    currentPostInfo,
    showDetails,
    setShowDetails,
    initialIndex,
    postLightBoxOpen,
    setPostLightboxOpen,
    postLightboxRef,
  } = useContext(PostContext);
  const { user, setShowSignIn } = useContext(UserContext);
  const { setIsLoading } = useContext(LoaderContext);
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const pathname = usePathname();

  const post = posts.find((p) => p.postId === currentPostInfo.postId);

  const handlePostNav = (id, focusInput = false) => {
    setPostLightboxOpen(false);
    if (pathname == `/post/${id}`) {
      return;
    }
    setIsLoading(true);
    const url = focusInput ? `/post/${id}?focus=comment` : `/post/${id}`;
    router.push(url);
  };

  useEffect(() => {
    if (!postLightBoxOpen) return;

    window.history.pushState(null, "");
    const onPopState = () => {
      setPostLightboxOpen(false);
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [postLightBoxOpen]);

  const handleNext = () => {
    if (!postLightboxRef.current) return;
    if (currentIndex < currentPost.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      postLightboxRef.current.scrollTo({
        left: postLightboxRef.current.clientWidth * newIndex,
        behavior: "smooth",
      });
    }
  };

  const handlePrev = () => {
    if (!postLightboxRef.current) return;
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      postLightboxRef.current.scrollTo({
        left: postLightboxRef.current.clientWidth * newIndex,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="inset-0 z-[100] flex flex-col items-center justify-center fixed">
      <div className="z-50 inset-0">
        {showDetails && currentPost.length > 1 ? (
          <div className="absolute top-5 left-4">
            <p className="text-xs text-vibe">
              {currentIndex + 1}/{currentPost.length}
            </p>
          </div>
        ) : null}
        {showDetails && (
          <button className="absolute cursor-pointer top-4 right-4">
            <MdClose
              onClick={() => setPostLightboxOpen(false)}
              className="text-2xl font-bold duration-200 hover:scale-110 active:scale-110"
            />
          </button>
        )}
        {showDetails && currentPost.length > 1 && (
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
        ref={postLightboxRef}
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
                setPostLightboxOpen(false);
                router.push(`/profile/${post.userId}`);
              }}
              className="cursor-pointer text-base mt-2 font-bold leading-3.5"
            >
              {currentPostInfo.userName}
            </p>
            <p className="text-xs text-vibe">
              {(() => {
                const diffWeeks = dayjs().diff(
                  dayjs(currentPostInfo.date),
                  "week"
                );
                if (diffWeeks < 1) {
                  return dayjs(currentPostInfo.date).fromNow();
                }
                return new Date(currentPostInfo.date).toLocaleDateString([], {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                });
              })()}
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
                setPostLightboxOpen(false);
                router.push(`/posts/${currentPostInfo.topic}`);
              }}
              className={`h-fit w-fit rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-zeus)] ${
                currentPostInfo.topic ? "block" : "hidden"
              }`}
            >
              <p className="font-bold text-sm text-vibe px-2">
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
                  setPostLightboxOpen(false);
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
              <p className="text-xs font-light text-normal opacity-60">
                {post?.energized ? post?.energized.length : 0} energized
              </p>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (user) {
                  handleEcho(post);
                } else {
                  setPostLightboxOpen(false);
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
              <p className="text-xs font-light text-normal opacity-60">
                {post.echoed ? post.echoed.length : 0} echoed
              </p>
            </div>
            <div
              onClick={() => handlePostNav(currentPostInfo.postId, true)}
              className="flex flex-col items-center justify-center bg-[var(--color-panel)]/75 p-2  w-[33%] h-fit transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-[var(--color-secondary)] active:bg-[var(--color-secondary)] cursor-pointer"
            >
              <FaComment className="text-2xl transform -scale-x-100" />
              <p className="text-xs font-light text-normal opacity-60">
                {post.comments
                  ? post.comments.length +
                    post.comments.reduce(
                      (total, comment) =>
                        total + (comment.replies?.length || 0),
                      0
                    )
                  : 0}{" "}
                commented
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
