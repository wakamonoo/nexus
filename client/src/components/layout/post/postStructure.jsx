import { PostContext } from "@/context/postContext";
import { UserContext } from "@/context/userContext";
import { useContext, useRef, useState } from "react";
import { AiFillThunderbolt } from "react-icons/ai";
import { FaComment, FaPlay } from "react-icons/fa";
import { MdOutlineSensors } from "react-icons/md";
import Fallback from "@/assets/fallback.png";
import Avatar from "@/assets/defaultAvatar.png";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import PostOptions from "../../options/postOptions";
import { usePathname } from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import AutoPlay from "./autoPlay";
import { RiArrowLeftWideFill, RiArrowRightWideFill } from "react-icons/ri";
import { TitleContext } from "@/context/titleContext";
import { SocketContext } from "@/context/socketContext";
import { LoaderContext } from "@/context/loaderContext";

dayjs.extend(relativeTime);

export default function PostStructure({ post }) {
  const { allUsers, user, setShowSignInModal } = useContext(UserContext);
  const { titles } = useContext(TitleContext);
  const {
    selectedPost,
    handleEnergize,
    handleEcho,
    handleFileClick,
    setSelectedPost,
  } = useContext(PostContext);
  const { postEnergizes, postEchoes } = useContext(SocketContext);
  const { setIsLoading } = useContext(LoaderContext);
  const energized = postEnergizes[post?.postId] ?? post?.energized ?? [];
  const echoed = postEchoes[post?.postId] ?? post?.echoed ?? [];
  const [showFull, setShowFull] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(null);
  const pathname = usePathname();
  const postCarouselRef = useRef(null);

  const postOwner = allUsers.find((user) => user.uid === post?.userId);

  const handleNext = () => {
    if (!post?.files) return;

    if (currentIndex < post.files.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);

      postCarouselRef.current?.scrollTo({
        left: postCarouselRef.current?.clientWidth * newIndex,
        behavior: "smooth",
      });
    }
  };

  const handlePrev = () => {
    if (!post?.files) return;

    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);

      postCarouselRef.current?.scrollTo({
        left: postCarouselRef.current?.clientWidth * newIndex,
        behavior: "smooth",
      });
    }
  };

  const currentTopic = titles.find((t) => t.titleId === post?.topicId);

  return (
    <div className="relative w-full h-auto cursor-pointer bg-linear-to-b from-(--color-panel) to-(--color-secondary) rounded-tl-2xl rounded-br-2xl">
      {post.files?.length > 1 && (
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
          {currentIndex < post.files.length - 1 && (
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
      {user?.uid === postOwner?.uid ? (
        <div className="absolute top-4 right-4 z-20">
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
            <BiDotsHorizontalRounded className="text-2xl shrink-0" />
          </button>
          {selectedPost === post.postId && <PostOptions postId={post.postId} />}
        </div>
      ) : null}

      <div className="flex gap-3 px-4 items-center py-2">
        <Link
          href={`/profile/${postOwner?.uid}`}
          onClick={(e) => {
            e.stopPropagation();
            if (pathname.startsWith("/profile")) {
              e.preventDefault();
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
             } else {
               setIsLoading(true);
            }
          }}
          className="relative z-20"
        >
          <img
            src={postOwner?.picture || Avatar.src}
            alt={postOwner?.name}
            loading="lazy"
            decoding="async"
            className="w-12 h-12 object-cover rounded-full"
          />
        </Link>
        <div className="flex flex-col">
          <Link
            href={`/profile/${postOwner?.uid}`}
            onClick={(e) => {
              e.stopPropagation();
              if (pathname.startsWith("/profile")) {
                e.preventDefault();
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
               } else {
                 setIsLoading(true);
              }
            }}
            className="relative z-20 text-base mt-2 font-bold leading-3.5 truncate"
          >
            {postOwner?.name}
          </Link>
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

      {currentTopic && (
        <div className="px-4">
          <Link
            href={`/posts/${post.topicId}`}
            onClick={(e) => {
              e.stopPropagation();
              if (pathname.startsWith("/posts")) {
                e.preventDefault();
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
               } else {
                 setIsLoading(true);
              }
            }}
            className={`relative z-20 block h-fit w-fit rounded-full bg-linear-to-r ${currentTopic?.category === "mcu" ? "from-(--color-accent)" : currentTopic?.category === "legacy" ? "from-(--color-hulk)" : "from-(--color-infinity)"} to-(--color-zeus)`}
          >
            <p className="font-bold text-vibe text-sm px-2">
              {currentTopic?.title}
            </p>
          </Link>
        </div>
      )}

      {post.text && (
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
                      className="relative z-20 cursor-pointer text-base font-light text-normal opacity-60"
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
                  className="relative z-20 cursor-pointer text-base font-light text-normal opacity-60"
                >
                  see less
                </span>
              </>
            )}
          </p>
        </div>
      )}

      {post.embed?.id && post.files && post.files.length > 0 ? (
        <div className="mx-4 mb-2 flex items-center justify-between rounded-xl border bg-second px-4 py-3 transition hover:bg-(--color-secondary)/80 active:bg-(--color-secondary)/80">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex p-2 shrink-0 items-center justify-center rounded-full bg-red-500">
              <FaPlay className="text-lg text-white" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium">YouTube Video</p>
              <p className="truncate text-xs opacity-60">{post.embed?.url}</p>
            </div>
          </div>
          <a
            href={post.embed?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-20 ml-3 rounded-lg bg-blue-500 px-3 py-1.5 text-sm text-normal transition hover:bg-blue-600 active:bg-blue-600"
          >
            Open
          </a>
        </div>
      ) : post.embed?.id ? (
        <iframe
          className="relative z-20 w-full h-full aspect-video"
          src={`https://www.youtube.com/embed/${post.embed?.id}`}
          title="YouTube Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : null}

      {post.files && post.files.length > 0 ? (
        <div
          className="relative z-20 w-full overflow-hidden"
          style={aspectRatio ? { aspectRatio: aspectRatio } : {}}
        >
          {post.files.length > 1 ? (
            <div className="absolute top-2 left-4">
              <p className="text-xs text-vibe">
                {currentIndex + 1}/{post.files.length}
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
            {post.files.map((file, index) => {
              const ext =
                typeof file === "string"
                  ? file.split(".").pop().toLowerCase()
                  : "";

              return (
                <div
                  key={index}
                  onClick={(e) => {
                    handleFileClick(post.files, index, post);
                    e.stopPropagation();
                  }}
                  className="shrink-0 w-full h-full snap-center snap-always"
                >
                  {["jpg", "jpeg", "png", "gif", "webp"].includes(ext) ? (
                    <img
                      src={file || Fallback}
                      alt="file"
                      loading="lazy"
                      decoding="async"
                      onLoad={(img) => {
                        if (index === 0 && !aspectRatio) {
                          setAspectRatio(
                            img.currentTarget.naturalWidth /
                              img.currentTarget.naturalHeight,
                          );
                        }
                      }}
                      className="w-full h-full object-cover"
                    />
                  ) : ["mp4", "webm", "ogg"].includes(ext) ? (
                    <AutoPlay
                      key={index}
                      src={file}
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
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (user) {
              handleEnergize(post);
            } else {
              setShowSignInModal(true);
            }
          }}
          className="relative z-20 flex flex-col items-center justify-center bg-(--color-panel) p-2  w-[33%] h-fit transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-(--color-panel)/75 active:bg-(--color-panel)/75 cursor-pointer select-none"
        >
          <AiFillThunderbolt
            className={`text-2xl ${
              energized?.includes(user?.uid) ? "text-zeus" : "text-normal"
            }`}
          />
          <p className="text-xs font-light text-vibe opacity-60">
            {energized ? energized.length : 0} energized
          </p>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (user) {
              handleEcho(post);
            } else {
              setShowSignInModal(true);
            }
          }}
          className="relative z-20 flex flex-col items-center justify-center bg-(--color-panel) p-2  w-[33%] h-fit transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-(--color-panel)/75 active:bg-(--color-panel)/75 cursor-pointer  select-none"
        >
          <MdOutlineSensors
            className={`text-2xl ${
              echoed?.includes(user?.uid) ? "text-accent" : "text-normal"
            }`}
          />
          <p className="text-xs font-light text-vibe opacity-60">
            {echoed ? echoed.length : 0} echoed
          </p>
        </button>
        <Link
          href={`/post/${post.postId}?focus=comment`}
          onClick={() => {
            if (pathname !== `/post/${post.postId}`) setIsLoading(true);
          }}
          className="relative z-20 flex flex-col items-center justify-center bg-(--color-panel) p-2  w-[33%] h-fit transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-(--color-panel)/75 active:bg-(--color-panel)/75 cursor-pointer select-none"
        >
          <FaComment className="text-2xl transform -scale-x-100" />
          <p className="text-xs font-light text-vibe opacity-60">
            {post.comments
              ? post.comments.length +
                post.comments.reduce(
                  (total, comment) => total + (comment.replies?.length || 0),
                  0,
                )
              : 0}{" "}
            commented
          </p>
        </Link>
      </div>
      <Link
        href={`/post/${post.postId}`}
        onClick={() => {
          if (pathname !== `/post/${post.postId}`) setIsLoading(true);
        }}
        aria-label="View Post"
        className="absolute inset-0 z-10"
      />
    </div>
  );
}
