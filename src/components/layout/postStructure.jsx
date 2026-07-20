import { PostContext } from "@/context/postContext";
import { UserContext } from "@/context/userContext";
import { useContext, useEffect, useRef, useState } from "react";
import { AiFillThunderbolt } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { MdOutlineSensors } from "react-icons/md";
import Image from "next/image";
import Fallback from "@/assets/fallback.png";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import PostOpt from "./postOpt";
import { LoaderContext } from "@/context/loaderContext";
import { usePathname, useRouter } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import AutoPlay from "./autoPlay";
import { RiArrowLeftWideFill, RiArrowRightWideFill } from "react-icons/ri";
import { TitleContext } from "@/context/titleContext";

dayjs.extend(relativeTime);

export default function PostStructure({ post }) {
  const { user, setShowSignIn } = useContext(UserContext);
  const { titles } = useContext(TitleContext);
  const {
    selectedPost,
    handleEnergize,
    handleEcho,
    handleFileClick,
    setSelectedPost,
  } = useContext(PostContext);
  const [showFull, setShowFull] = useState(false);
  const { setIsLoading } = useContext(LoaderContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const postCarouselRef = useRef(null);

  const handlePostNavMain = (id, focusInput = false) => {
    setIsLoading(true);
    const url = focusInput ? `/post/${id}?focus=comment` : `/post/${id}`;
    router.push(url);
  };

  const handleNext = () => {
    if (attachments.length === 0) return;

    if (currentIndex < attachments.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);

      postCarouselRef.current?.scrollTo({
        left: postCarouselRef.current?.clientWidth * newIndex,
        behavior: "smooth",
      });
    }
  };

  const handlePrev = () => {
    if (attachments.length === 0) return;

    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);

      postCarouselRef.current?.scrollTo({
        left: postCarouselRef.current?.clientWidth * newIndex,
        behavior: "smooth",
      });
    }
  };

  const currentTopic = titles.find((t) => t.title === post?.topic);

  const attachments = [];

  if (post.embed) {
    attachments.push({
      type: "embed",
      ...post.embed,
    });
  }

  if (post.files?.length) {
    post.files.forEach((file) => {
      attachments.push({
        type: "file",
        url: file,
      });
    });
  }

  return (
    <div
      onClick={() => handlePostNavMain(post.postId)}
      className="relative w-full h-auto cursor-pointer bg-gradient-to-b from-[var(--color-panel)] to-[var(--color-secondary)] rounded-tl-2xl rounded-br-2xl"
    >
      {attachments.length > 1 && (
        <>
          {currentIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="hidden md:block cursor-pointer absolute z-50 top-1/2 -translate-y-1/2 left-1"
            >
              <RiArrowLeftWideFill className="text-2xl" />
            </button>
          )}
          {currentIndex < attachments.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="hidden md:block cursor-pointer absolute z-50 top-1/2 -translate-y-1/2 right-1"
            >
              <RiArrowRightWideFill className="text-2xl" />
            </button>
          )}
        </>
      )}
      {user?.uid === post.userId ? (
        <div className="absolute top-4 right-4">
          <button
            id={`btn-${post.postId}`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPost(
                selectedPost === post.postId ? null : post.postId,
              );
            }}
            className="cursor-pointer"
          >
            <BiDotsHorizontalRounded className="text-2xl" />
          </button>
          {selectedPost === post.postId && <PostOpt postId={post.postId} />}
        </div>
      ) : null}

      <div className="flex gap-3 px-4 items-center py-2">
        <Image
          onClick={(e) => {
            e.stopPropagation();
            if (pathname.startsWith("/profile")) {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            } else {
              setIsLoading(true);
              router.push(`/profile/${post.userId}`);
            }
          }}
          src={post.userImage || Fallback}
          alt="user"
          width={0}
          height={0}
          sizes="100vw"
          className="w-12 h-12 object-cover rounded-full"
        />
        <div className="flex flex-col">
          <p
            onClick={(e) => {
              e.stopPropagation();
              if (pathname.startsWith("/profile")) {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              } else {
                setIsLoading(true);
                router.push(`/profile/${post.userId}`);
              }
            }}
            className="text-base mt-2 font-bold leading-3.5 truncate"
          >
            {post.userName}
          </p>
          <p className="text-xs text-vibe">
            {(() => {
              const diffWeeks = dayjs().diff(dayjs(post.date), "week");
              if (diffWeeks < 1) {
                return dayjs(post.date).fromNow();
              }
              return new Date(post.date).toLocaleDateString([], {
                month: "short",
                day: "2-digit",
                year: "numeric",
              });
            })()}
          </p>
        </div>
      </div>

      <div className="px-4">
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (pathname.startsWith("/posts")) {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            } else {
              setIsLoading(true);
              router.push(`/posts/${post.topic}`);
            }
          }}
          className={`h-fit w-fit rounded-full bg-gradient-to-r ${currentTopic?.category === "mcu" ? "from-[var(--color-accent)]" : "from-[var(--color-hulk)]"} to-[var(--color-zeus)] ${
            post.topic ? "block" : "hidden"
          }`}
        >
          <p className="font-bold text-vibe text-sm px-2">{post.topic}</p>
        </div>
      </div>

      <div className="px-4 py-2">
        <p className="text-base text-justify leading-5 whitespace-pre-wrap">
          {!showFull ? (
            <>
              {post.text.split(" ").slice(0, 40).join(" ")}{" "}
              {post.text.split(" ").length > 40 && (
                <>
                  ...{" "}
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowFull(true);
                    }}
                    className="cursor-pointer text-base font-light text-normal opacity-60"
                  >
                    see more
                  </span>
                </>
              )}
            </>
          ) : (
            <>
              {post.text}{" "}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFull(false);
                }}
                className="cursor-pointer text-base font-light text-normal opacity-60"
              >
                see less
              </span>
            </>
          )}
        </p>
      </div>

      {attachments.length > 0 ? (
        <div
          className="relative w-full overflow-hidden"
          style={aspectRatio ? { aspectRatio: aspectRatio } : {}}
        >
          {attachments.length > 1 ? (
            <div className="absolute top-2 left-4">
              <p className="text-xs text-vibe">
                {currentIndex + 1}/{attachments.length}
              </p>
            </div>
          ) : null}
          <div
            ref={postCarouselRef}
            onScroll={(e) => {
              const width = e.target.clientWidth;
              const scrollLeft = e.target.scrollLeft;
              const index = Math.round(scrollLeft / width);
              setCurrentIndex(index);
            }}
            className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
          >
            {attachments.map((attachment, index) => {
              if (attachment.type === "embed") {
                return (
                  <div
                    key={index}
                    className="flex-shrink-0 w-full snap-center snap-always"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <iframe
                      className="w-full h-full aspect-video"
                      src={`https://www.youtube.com/embed/${attachment.id}`}
                      title="YouTube Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                );
              }

              const ext = attachment.url.split(".").pop().toLowerCase();

              return (
                <div
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();

                    if (attachment.type === "file") {
                      handleFileClick(
                        post.files,
                        index - (post.embed ? 1 : 0),
                        post,
                      );
                    }
                  }}
                  className="flex-shrink-0 w-full h-full snap-center snap-always"
                >
                  {["jpg", "jpeg", "png", "gif", "webp"].includes(ext) ? (
                    <Image
                      src={attachment.url || Fallback}
                      alt="file"
                      width={0}
                      height={0}
                      sizes="100vw"
                      onLoadingComplete={(img) => {
                        if (index === 0 && !aspectRatio) {
                          setAspectRatio(img.naturalWidth / img.naturalHeight);
                        }
                      }}
                      className="w-full h-full object-cover"
                    />
                  ) : ["mp4", "webm", "ogg"].includes(ext) ? (
                    <AutoPlay
                      key={index}
                      src={attachment.url}
                      onLoadedMetadata={(e) => {
                        if (index === 0 && !aspectRatio) {
                          const video = e.target;
                          setAspectRatio(video.videoWidth / video.videoHeight);
                        }
                      }}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div />
      )}

      <div className="flex justify-between items-center py-4 border-t border-panel  mt-2">
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (user) {
              handleEnergize(post);
            } else {
              setShowSignIn(true);
            }
          }}
          className="flex flex-col items-center justify-center bg-[var(--color-panel)] p-2  w-[33%] h-fit transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-[var(--color-panel)]/75 active:bg-[var(--color-panel)]/75 cursor-pointer"
        >
          <AiFillThunderbolt
            className={`text-2xl ${
              post.energized?.includes(user?.uid) ? "text-zeus" : "text-normal"
            }`}
          />
          <p className="text-xs font-light text-normal opacity-60">
            {post.energized ? post.energized.length : 0} energized
          </p>
        </div>

        <div
          onClick={(e) => {
            e.stopPropagation();
            if (user) {
              handleEcho(post);
            } else {
              setShowSignIn(true);
            }
          }}
          className="flex flex-col items-center justify-center bg-[var(--color-panel)] p-2  w-[33%] h-fit transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-[var(--color-panel)]/75 active:bg-[var(--color-panel)]/75 cursor-pointer"
        >
          <MdOutlineSensors
            className={`text-2xl ${
              post.echoed?.includes(user?.uid) ? "text-accent" : "text-normal"
            }`}
          />
          <p className="text-xs font-light text-normal opacity-60">
            {post.echoed ? post.echoed.length : 0} echoed
          </p>
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            handlePostNavMain(post.postId, true);
          }}
          className="flex flex-col items-center justify-center bg-[var(--color-panel)] p-2  w-[33%] h-fit transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-[var(--color-panel)]/75 active:bg-[var(--color-panel)]/75 cursor-pointer"
        >
          <FaComment className="text-2xl transform -scale-x-100" />
          <p className="text-xs font-light text-normal opacity-60">
            {post.comments
              ? post.comments.length +
                post.comments.reduce(
                  (total, comment) => total + (comment.replies?.length || 0),
                  0,
                )
              : 0}{" "}
            commented
          </p>
        </div>
      </div>
    </div>
  );
}
