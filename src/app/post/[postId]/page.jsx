"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { PostContext } from "@/context/postContext";
import {
  FaAngleLeft,
  FaAngleRight,
  FaBolt,
  FaBoxOpen,
  FaComment,
  FaMedal,
  FaRegComment,
  FaReply,
  FaShare,
  FaTrash,
} from "react-icons/fa";
import { AiFillThunderbolt } from "react-icons/ai";
import Image from "next/image";
import Tony from "@/assets/tony.jpg";
import { MdOutlineSensors, MdSend } from "react-icons/md";
import { UserContext } from "@/context/userContext";
import { LoaderContext } from "@/context/loaderContext";
import PostLoader from "@/components/loaders/postLoader";
import { Bs1CircleFill } from "react-icons/bs";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import PostOpt from "@/components/layout/postOpt";
import { TitleContext } from "@/context/titleContext";
import { WatchContext } from "@/context/watchContext";
import { GiTrophy } from "react-icons/gi";
import { TitleNavContext } from "@/context/titlesNavContext";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export default function Post() {
  const { postId } = useParams();
  const { user, setShowSignIn } = useContext(UserContext);
  const {
    posts,
    handleEnergize,
    handleEcho,
    handleFileClick,
    setDelModal,
    selectedPost,
    setSelectedPost,
  } = useContext(PostContext);
  const router = useRouter();
  const [commentText, setCommentText] = useState("");
  const { setIsLoading } = useContext(LoaderContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const searchParams = useSearchParams();
  const inputRef = useRef();
  const { titles } = useContext(TitleContext);
  const { isTitleWatched, watchedInfoFetch } = useContext(WatchContext);
  const { handleShowNav, handleShowListNav } = useContext(TitleNavContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    setIsLoading(false);
    if (searchParams.get("focus") === "comment" && inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const post = posts.find((p) => p.postId === postId);

  useEffect(() => {
    const fetchWathced = async () => {
      if (user?.uid) {
        await watchedInfoFetch(user?.uid);
      }
    };

    fetchWathced();
  }, [user]);

  useEffect(() => {
    const current = scrollRef.current;
    if (!current) return;

    const handleScroll = () => {
      setIsScrolled(current.scrollLeft > 50);
    };

    current.addEventListener("scroll", handleScroll);
    return () => {
      current.removeEventListener("scroll", handleScroll);
    };
  }, [titles]);

  const rankedTitles = titles
    ?.filter((t) => t.totalPoints > 0)
    .sort((a, b) => b.totalPoints - a.totalPoints);

  let previousPoints = null;
  let currentRank = 0;

  const ranked = rankedTitles.map((t, index) => {
    if (t.totalPoints !== previousPoints) {
      currentRank = index + 1;
      previousPoints = t.totalPoints;
    }
    return { ...t, rank: currentRank };
  });

  const handleSendComment = async () => {
    try {
      if (!commentText.trim()) return;

      const newComment = {
        postId,
        userId: user.uid,
        userName: user.name,
        userImage: user.picture,
        textComment: commentText,
      };

      await fetch(`${BASE_URL}/api/comments/addComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      });

      post.comments = post.comments
        ? [...post.comments, newComment]
        : [newComment];
      setCommentText("");
    } catch (er) {}
  };

  if (!post) {
    return <PostLoader />;
  }

  const firstComment = post.comments?.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  )[0];

  return (
    <div className="bg-brand">
      <div className="relative bg-panel border-b-1 border-[var(--color-secondary)] p-6 flex justify-center items-center">
        <FaAngleLeft
          onClick={() => router.back()}
          className="absolute left-2 sm:left-4 md:left-8 lg:left-16 xl:left-32 text-2xl cursor-pointer"
        />
        <p className="absolute left-1/2 -translate-x-1/2 uppercase font-bold text-normal">
          {post.userName}'s Post
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[3fr_1.5fr] md:gap-4 items-start md:px-8 lg:px-16 xl:px-32">
        <main className="md:py-2 md:sticky md:top-0">
          <div>
            <div className="relative bg-gradient-to-b from-[var(--color-panel)] to-[var(--color-secondary)] md:rounded-2xl">
              {user?.uid === post.userId ? (
                <div className="absolute top-4 right-4">
                  <button
                    id={`btn-${post.postId}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPost(
                        selectedPost === post.postId ? null : post.postId
                      );
                    }}
                    className="cursor-pointer"
                  >
                    <BiDotsHorizontalRounded className="text-2xl" />
                  </button>
                  {selectedPost === post.postId && (
                    <PostOpt postId={post.postId} />
                  )}
                </div>
              ) : null}

              <div className="flex gap-3 px-4 py-2 items-center">
                <Image
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLoading(true);
                    router.push(`/profile/${post.userId}`);
                  }}
                  src={post.userImage || Tony}
                  alt="user"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="cursor-pointer w-12 h-12 object-cover rounded-full"
                />
                <div className="flex flex-col">
                  <p
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLoading(true);
                      router.push(`/profile/${post.userId}`);
                    }}
                    className="cursor-pointer text-base mt-2 font-bold leading-3.5"
                  >
                    {post.userName}
                  </p>
                  <p className="text-xs text-vibe">
                    {new Date(post.date)
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
              </div>
              <div className="px-2">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLoading(true);
                    router.push(`/posts/${post.topic}`);
                  }}
                  className={`h-fit w-fit rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-zeus)] ${
                    post.topic ? "block" : "hidden"
                  }`}
                >
                  <p className="font-bold text-sm text-vibe px-2">
                    {post.topic}
                  </p>
                </div>
              </div>
              <p className="text-base text-normal leading-5 py-1 px-4">
                {post.text}
              </p>
              {post.files && post.files.length > 0 ? (
                <div className="relative w-full h-[50vh]">
                  {post.files.length > 1 ? (
                    <div className="absolute top-2 left-4">
                      <p className="text-xs text-vibe">
                        {currentIndex + 1}/{post.files.length}
                      </p>
                    </div>
                  ) : null}
                  <div
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
                          className="flex-shrink-0 w-full h-full snap-center"
                        >
                          {["jpg", "jpeg", "png", "gif", "webp"].includes(
                            ext
                          ) ? (
                            <Image
                              src={file}
                              alt="file"
                              width={0}
                              height={0}
                              sizes="100vw"
                              className="w-full h-full object-cover"
                            />
                          ) : ["mp4", "webm", "ogg"].includes(ext) ? (
                            <video
                              key={index}
                              src={file}
                              controls
                              className="w-full h-full object-cover"
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
              <div className="flex justify-between items-center py-4 border-t border-panel mt-2">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (user) {
                      handleEnergize(post);
                    } else {
                      setShowSignIn(true);
                    }
                  }}
                  className="flex flex-col items-center justify-center bg-[var(--color-panel)] p-2 w-[33%] h-fit transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-[var(--color-panel)]/75 active:bg-[var(--color-panel)]/75 cursor-pointer"
                >
                  <AiFillThunderbolt
                    className={`text-2xl ${
                      post.energized?.includes(user?.uid)
                        ? "text-zeus"
                        : "text-normal"
                    }`}
                  />
                  <p className="text-xs font-light text-vibe opacity-50">
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
                  className="flex flex-col items-center justify-center bg-[var(--color-panel)] p-2 w-[33%] h-fit transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-[var(--color-panel)]/75 active:bg-[var(--color-panel)]/75 cursor-pointer"
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
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current.focus();
                  }}
                  className="flex flex-col items-center justify-center bg-[var(--color-panel)] p-2 w-[33%] h-fit transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-[var(--color-panel)]/75 active:bg-[var(--color-panel)]/75 cursor-pointer"
                >
                  <FaComment className="text-2xl transform -scale-x-100" />
                  <p className="text-xs font-light text-vibe opacity-50">
                    {post.comments ? post.comments.length : 0} commented
                  </p>
                </div>
              </div>
            </div>

            <aside className="p-2 md:hidden">
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-2">
                  {titles.length > 0 ? (
                    ranked.map((unit) => (
                      <div
                        key={unit.titleId}
                        onClick={() => handleShowNav(unit.titleId)}
                        className="relative w-26 h-40 md:w-32 md:h-46 flex-shrink-0 cursor-pointer"
                      >
                        <Image
                          src={unit.image || Fallback}
                          alt="image"
                          width={0}
                          height={0}
                          sizes="100vw"
                          className={`w-full h-full object-fill rounded ${
                            isTitleWatched(unit.titleId)
                              ? "grayscale-0"
                              : "grayscale-90"
                          }`}
                        />
                        <div
                          className={`absolute opacity-80 top-0 right-1 p-2 h-8 w-6 flex items-center justify-center rounded-bl-2xl rounded-br-2xl ${
                            unit.rank === 1 ? "bg-hulk" : "bg-accent"
                          }`}
                        >
                          <p
                            className={`font-bold text-sm ${
                              unit.rank === 1 ? "text-zeus" : "text-normal"
                            }`}
                          >
                            {unit.rank === 1 ? <GiTrophy /> : unit.rank}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col justify-center items-center">
                      <FaBoxOpen className="w-[32vw] sm:w-[24vw] md:w-[16vw] h-auto text-panel" />
                      <p className="text-sm sm:text-base md:text-xl text-panel font-normal">
                        Sorry, no data to display!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            <div className="flex flex-col gap-4 p-4">
              {post.comments?.length === 0 ? (
                <div className="flex items-center justify-center py-16">
                  <div className="flex items-center gap-2">
                    <FaRegComment className="text-2xl" />
                    <p className="text-base text-normal">
                      Be the first to comment
                    </p>
                  </div>
                </div>
              ) : (
                post.comments?.map((comment, index) => (
                  <div key={index} className="flex gap-2">
                    <Image
                      src={comment.userImage}
                      alt="user"
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-12 h-12 object-cover rounded-full"
                    />
                    <div className="bg-second relative w-fit py-2 px-4 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex flex-col">
                          <p className="text-base text-normal font-bold">
                            {comment.userName}
                          </p>
                          <p className="text-xs text-vibe">
                            {comment.date &&
                            !isNaN(new Date(comment.date).getTime())
                              ? new Date(comment.date)
                                  .toLocaleString("en-us", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                  })
                                  .replace(/^(\w{3})/, "$1.")
                              : "Just now "}
                          </p>
                        </div>
                        {comment.date === firstComment.date ? (
                          <div className="flex top-2 right-2">
                            <Bs1CircleFill className="text-base text-zeus" />
                          </div>
                        ) : null}
                      </div>

                      <p className="text-base text-normal py-2">
                        {comment.textComment}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex sticky z-50 bottom-0 md:bottom-2 w-full gap-2 items-center p-2 md:rounded-full bg-second">
              <Image
                src={user?.picture || null}
                alt="user"
                width={0}
                height={0}
                sizes="100vw"
                className="w-12 h-12 object-cover rounded-full"
              />
              <div className="flex items-center w-full gap-2 bg-panel rounded-full border-1 border-[var(--color-secondary)] py-2 px-4">
                <input
                  ref={inputRef}
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (user) {
                        handleSendComment();
                      } else {
                        setShowSignIn(true);
                      }
                    }
                  }}
                  className="w-full text-normal px-2 outline-none rounded-full text-base font-normal truncate"
                  placeholder={
                    user
                      ? `Comment as ${user.name}...`
                      : "Kindly signin to comment"
                  }
                />
                <button onClick={handleSendComment}>
                  <MdSend className="text-2xl cursor-pointer shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </main>

        <aside className="w-full h-full hidden md:block">
          <div className="w-full md:py-4">
            <div className="flex flex-wrap justify-start gap-2">
              {...ranked.map((unit) => (
                <div
                  key={unit.titleId}
                  onClick={() => handleShowNav(unit.titleId)}
                  className="relative w-26 h-40 md:w-32 md:h-46 flex-shrink-0 cursor-pointer"
                >
                  <Image
                    src={unit.image || Fallback}
                    alt="image"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className={`w-full h-full object-fill rounded ${
                      isTitleWatched(unit.titleId)
                        ? "grayscale-0"
                        : "grayscale-90"
                    }`}
                  />
                  <div
                    className={`absolute opacity-80 top-0 right-1 p-2 h-8 w-6 flex items-center justify-center rounded-bl-2xl rounded-br-2xl ${
                      unit.rank === 1 ? "bg-hulk" : "bg-accent"
                    }`}
                  >
                    <p
                      className={`font-bold text-sm ${
                        unit.rank === 1 ? "text-zeus" : "text-normal"
                      }`}
                    >
                      {unit.rank === 1 ? <GiTrophy /> : unit.rank}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
