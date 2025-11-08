"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { PostContext } from "@/context/postContext";
import { FaAngleLeft, FaComment, FaRegComment, FaTrash } from "react-icons/fa";
import { AiFillThunderbolt } from "react-icons/ai";
import Image from "next/image";
import Fallback from "@/assets/fallback.png";
import { MdOutlineSensors, MdSend } from "react-icons/md";
import { UserContext } from "@/context/userContext";
import { LoaderContext } from "@/context/loaderContext";
import PostLoader from "@/components/loaders/postLoader";
import { Bs1CircleFill } from "react-icons/bs";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import PostOpt from "@/components/layout/postOpt";
import GoatTitlesStructureMin from "@/components/layout/goatTitlesStructureMin";
import GoatTitlesStructureMax from "@/components/layout/goatTitlesStructureMax";
import CommentDelConfirm from "@/components/modals/commentDelConfirm";
import GoatMinLoader from "@/components/loaders/goatMinLoader";
import GoatMaxLoader from "@/components/loaders/goatMaxLoader";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { RiFileGifFill, RiImageAiFill } from "react-icons/ri";
import CommentLightBox from "@/components/lightBoxes/commentLightBox";
import GifPicker from "@/components/modals/gifPicker";

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

export default function Post() {
  const { postId } = useParams();
  const { user, setShowSignIn } = useContext(UserContext);
  const {
    posts,
    handleEnergize,
    handleEcho,
    handleFileClick,
    selectedPost,
    setSelectedPost,
  } = useContext(PostContext);
  const router = useRouter();
  const [commentText, setCommentText] = useState("");
  const [files, setFiles] = useState([]);
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [replyToCommentUserId, setReplyToCommentUserId] = useState(null);
  const [replyToUserName, setReplyToUserName] = useState(null);
  const [isReplying, setIsReplying] = useState(false);
  const { setIsLoading } = useContext(LoaderContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [commentDelModal, setCommentDelModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const searchParams = useSearchParams();
  const [commentLightBoxOpen, setCommentLightBoxOpen] = useState(false);
  const [commentLightBoxFiles, setCommentLightBoxFiles] = useState([]);
  const [commentLightBoxUserId, setCommentLightBoxUserId] = useState(null);
  const [commentLightBoxUserName, setCommentLightBoxUserName] = useState(null);
  const [commentLightBoxDate, setCommentLightBoxDate] = useState(null);
  const [initialIndex, setInitialIndex] = useState(0);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    setIsLoading(false);
    if (searchParams.get("focus") === "comment" && inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const post = posts.find((p) => p.postId === postId);

  const handleSendComment = async () => {
    try {
      setIsLoading(true);

      if (!commentText.trim() && files.length === 0) return;

      const uploadedFiles = files.filter((file) => typeof file !== "string");
      const gifUrls = files.filter(
        (file) =>
          typeof file === "string" &&
          (file.includes("tenor.com") || file.includes("media.tenor.com"))
      );

      let uploadedUrls = [...gifUrls];

      if (uploadedFiles.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < uploadedFiles.length; i++) {
          formData.append("files", uploadedFiles[i]);
        }

        const uploadRes = await fetch(`${BASE_URL}/api/uploads/commentUpload`, {
          method: "POST",
          body: formData,
        });

        const { urls } = await uploadRes.json();
        uploadedUrls = [...uploadedUrls, ...urls];
      }

      const newComment = {
        postId,
        userId: user.uid,
        userName: user.name,
        userImage: user.picture,
        textComment: commentText,
        files: uploadedUrls,
      };

      const res = await fetch(`${BASE_URL}/api/comments/addComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      });

      const data = await res.json();

      post.comments = post?.comments
        ? [...post?.comments, data.comment]
        : [data.comment];

      setCommentText("");
      setFiles([]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReply = async () => {
    try {
      setIsLoading(true);

      if (!commentText.trim() && files.length === 0) return;

      const uploadedFiles = files.filter((file) => typeof file !== "string");
      const gifUrls = files.filter(
        (file) =>
          typeof file === "string" &&
          (file.includes("tenor.com") || file.includes("media.tenor.com"))
      );

      let uploadedUrls = [...gifUrls];

      if (uploadedFiles.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < uploadedFiles.length; i++) {
          formData.append("files", uploadedFiles[i]);
        }

        const uploadRes = await fetch(`${BASE_URL}/api/uploads/commentUpload`, {
          method: "POST",
          body: formData,
        });

        const { urls } = await uploadRes.json();
        uploadedUrls = [...uploadedUrls, ...urls];
      }

      const newReply = {
        postId,
        postOwner: post.userName,
        postOwnerUserId: post.userId,
        commentId: replyToCommentId,
        commentUserId: replyToCommentUserId,
        userId: user.uid,
        userName: user.name,
        userImage: user.picture,
        textReply: commentText,
        files: uploadedUrls,
      };

      const res = await fetch(`${BASE_URL}/api/comments/addReply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReply),
      });

      const data = await res.json();

      post.comments = post.comments.map((c) =>
        c.commentId === replyToCommentId
          ? { ...c, replies: [...(c.replies || []), data.reply] }
          : c
      );

      setCommentText("");
      setIsReplying(false);
      setReplyToCommentId(null);
      setReplyToCommentUserId(null);
      setReplyToUserName(null);
      setFiles([]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const firstComment = post?.comments?.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  )[0];

  const openCommentLightBox = (files, userId, userName, date, index) => {
    setCommentLightBoxFiles(files);
    setCommentLightBoxUserId(userId);
    setCommentLightBoxUserName(userName);
    setCommentLightBoxDate(date);
    setInitialIndex(index);
    setCommentLightBoxOpen(true);
  };

  return (
    <>
      <div className="bg-brand w-full">
        <div className="relative bg-panel border-b-1 border-[var(--color-secondary)] p-6 flex justify-center items-center">
          <FaAngleLeft
            onClick={() => router.back()}
            className="absolute left-2 sm:left-4 md:left-8 lg:left-16 xl:left-32 text-2xl cursor-pointer"
          />
          <p className="absolute left-1/2 -translate-x-1/2 uppercase font-bold text-normal truncate">
            {post?.userName}'s Post
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[3fr_1.5fr] md:gap-4 items-start md:px-8 lg:px-16 xl:px-32">
          <main className="md:py-2 md:sticky md:top-0">
            <div>
              {!post ? (
                <PostLoader />
              ) : (
                <>
                  <div className="relative bg-gradient-to-b from-[var(--color-panel)] to-[var(--color-secondary)] md:rounded-2xl">
                    {user?.uid === post?.userId ? (
                      <div className="absolute top-4 right-4">
                        <button
                          id={`btn-${post?.postId}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPost(
                              selectedPost === post?.postId
                                ? null
                                : post?.postId
                            );
                          }}
                          className="cursor-pointer"
                        >
                          <BiDotsHorizontalRounded className="text-2xl" />
                        </button>
                        {selectedPost === post?.postId && (
                          <PostOpt postId={post?.postId} />
                        )}
                      </div>
                    ) : null}

                    <div className="flex gap-3 px-4 py-2 items-center">
                      <Image
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsLoading(true);
                          router.push(`/profile/${post?.userId}`);
                        }}
                        src={post?.userImage || Fallback}
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
                            router.push(`/profile/${post?.userId}`);
                          }}
                          className="cursor-pointer text-base mt-2 font-bold leading-3.5 truncate"
                        >
                          {post?.userName}
                        </p>
                        <p className="text-xs text-vibe">
                          {(() => {
                            const diffWeeks = dayjs().diff(
                              dayjs(post.date),
                              "week"
                            );
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
                    <div className="px-2">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsLoading(true);
                          router.push(`/posts/${post?.topic}`);
                        }}
                        className={`h-fit w-fit rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-zeus)] ${
                          post?.topic ? "block" : "hidden"
                        }`}
                      >
                        <p className="font-bold text-sm text-vibe px-2">
                          {post?.topic}
                        </p>
                      </div>
                    </div>
                    <p className="text-base text-normal leading-5 py-1 px-4">
                      {post?.text}
                    </p>
                    {post?.files && post?.files.length > 0 ? (
                      <div className="relative w-full h-[50vh]">
                        {post?.files.length > 1 ? (
                          <div className="absolute top-2 left-4">
                            <p className="text-xs text-vibe">
                              {currentIndex + 1}/{post?.files.length}
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
                          {post?.files.map((file, index) => {
                            const ext =
                              typeof file === "string"
                                ? file.split(".").pop().toLowerCase()
                                : "";

                            return (
                              <div
                                key={index}
                                onClick={(e) => {
                                  handleFileClick(post?.files, index, post);
                                  e.stopPropagation();
                                }}
                                className="flex-shrink-0 w-full h-full snap-center cursor-pointer"
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
                            post?.energized?.includes(user?.uid)
                              ? "text-zeus"
                              : "text-normal"
                          }`}
                        />
                        <p className="text-xs font-light text-vibe opacity-50">
                          {post?.energized ? post?.energized.length : 0}{" "}
                          energized
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
                            post?.echoed?.includes(user?.uid)
                              ? "text-accent"
                              : "text-normal"
                          }`}
                        />
                        <p className="text-xs font-light text-vibe opacity-50">
                          {post?.echoed ? post?.echoed.length : 0} echoed
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
                          {post.comments
                            ? post.comments.length +
                              post.comments.reduce(
                                (total, comment) =>
                                  total + (comment?.replies?.length || 0),
                                0
                              )
                            : 0}{" "}
                          commented
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <aside className="p-2 md:hidden">
                {!post ? (
                  <GoatMinLoader />
                ) : (
                  <div className="overflow-x-auto scrollbar-hide">
                    <GoatTitlesStructureMin />
                  </div>
                )}
              </aside>

              <div className="flex flex-col gap-4 p-2 w-full">
                {post?.comments?.length === 0 ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="flex items-center gap-2">
                      <FaRegComment className="text-2xl" />
                      <p className="text-base text-normal">
                        Be the first to comment
                      </p>
                    </div>
                  </div>
                ) : (
                  post?.comments?.map((comment, index) => (
                    <div key={index} className="flex flex-col">
                      <div className="flex gap-2 relative">
                        <Image
                          onClick={() => {
                            router.push(`/profile/${comment.userId}`);
                            setIsLoading(true);
                          }}
                          src={comment.userImage}
                          alt="user"
                          width={0}
                          height={0}
                          sizes="100vw"
                          className="w-12 h-12 object-cover rounded-full cursor-pointer"
                        />
                        <div className="flex flex-col w-full">
                          <div className="bg-second w-fit max-w-full py-2 px-4 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex flex-col">
                                <p
                                  onClick={() => {
                                    router.push(`/profile/${comment.userId}`);
                                    setIsLoading(true);
                                  }}
                                  className="text-base text-normal font-bold cursor-pointer"
                                >
                                  {comment.userName}
                                </p>
                                <p className="text-xs text-vibe">
                                  {dayjs(comment.date).fromNow()}
                                </p>
                              </div>
                              {comment.date === firstComment.date ? (
                                <div className="flex top-2 right-2">
                                  <Bs1CircleFill className="text-base text-zeus" />
                                </div>
                              ) : null}
                            </div>
                            {comment.textComment && (
                              <p
                                className="text-base text-normal py-2 max-w-full whitespace-pre-wrap"
                                style={{ overflowWrap: "anywhere" }}
                              >
                                {comment.textComment}
                              </p>
                            )}
                          </div>

                          {comment.files && comment.files.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {comment.files.map((file, index) => {
                                const isVideo = /\.(mp4|mov|avi|webm)$/i.test(
                                  file
                                );
                                const isImage =
                                  /\.(jpg|peg|png|gif|webp)$/i.test(file);
                                const isGif =
                                  file.includes("tenor.com") ||
                                  file.includes("media.tenor.com");

                                return (
                                  <div
                                    onClick={() =>
                                      openCommentLightBox(
                                        comment.files,
                                        comment.userId,
                                        comment.userName,
                                        comment.date,
                                        index
                                      )
                                    }
                                    key={index}
                                    className="w-full min-w-auto max-w-full h-auto block relative cursor-pointer"
                                  >
                                    {isVideo ? (
                                      <video
                                        src={file}
                                        controls
                                        className="w-full h-full rounded"
                                      />
                                    ) : isImage || isGif ? (
                                      <Image
                                        src={file}
                                        alt={`sent by ${comment.sender}`}
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        className="w-full h-full object-cover rounded"
                                      />
                                    ) : null}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          <div className="flex items-center justify-start px-2 gap-2">
                            <p
                              onClick={() => {
                                setCommentToDelete(comment.commentId);
                                setCommentDelModal(true);
                              }}
                              className={`text-sm text-vibe hover:text-[var(--color-vibe)]/40 opacity-60 cursor-pointer ${
                                user?.uid === comment.userId
                                  ? "block"
                                  : "hidden"
                              }`}
                            >
                              Delete
                            </p>
                            <p
                              onClick={() => {
                                setIsReplying(true);
                                setReplyToCommentId(comment.commentId);
                                setReplyToCommentUserId(comment.userId);
                                setReplyToUserName(comment.userName);
                                inputRef.current.focus();
                              }}
                              className="text-sm text-vibe hover:text-[var(--color-vibe)]/40 opacity-60 cursor-pointer"
                            >
                              Reply
                            </p>
                          </div>
                        </div>
                      </div>

                      {comment.replies && comment.replies.length > 0 && (
                        <div className="flex flex-col  gap-2 mt-2 ml-12">
                          {comment.replies.map((reply, index) => (
                            <div key={index} className="flex gap-2 relative">
                              <Image
                                onClick={() => {
                                  router.push(`/profile/${reply.userId}`);
                                  setIsLoading(true);
                                }}
                                src={reply.userImage}
                                alt="user"
                                width={0}
                                height={0}
                                sizes="100vw"
                                className="w-12 h-12 object-cover rounded-full cursor-pointer"
                              />
                              <div className="flex flex-col w-full">
                                <div className="bg-panel w-fit max-w-full py-2 px-4 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl">
                                  <div className="flex justify-between items-start gap-4">
                                    <div className="flex flex-col">
                                      <p
                                        onClick={() => {
                                          router.push(
                                            `/profile/${reply.userId}`
                                          );
                                          setIsLoading(true);
                                        }}
                                        className="text-base text-normal font-bold cursor-pointer"
                                      >
                                        {reply.userName}
                                      </p>
                                      <p className="text-xs text-vibe">
                                        {dayjs(reply.date).fromNow()}
                                      </p>
                                    </div>
                                  </div>
                                  {reply.textReply && (
                                    <p
                                      className="text-base text-normal py-2 max-w-full whitespace-pre-wrap"
                                      style={{ overflowWrap: "anywhere" }}
                                    >
                                      {reply.textReply}
                                    </p>
                                  )}
                                </div>

                                {reply.files && reply.files.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {reply.files.map((file, index) => {
                                      const isVideo =
                                        /\.(mp4|mov|avi|webm)$/i.test(file);
                                      const isImage =
                                        /\.(jpg|peg|png|gif|webp)$/i.test(file);
                                      const isGif =
                                        file.includes("tenor.com") ||
                                        file.includes("media.tenor.com");

                                      return (
                                        <div
                                          onClick={() =>
                                            openCommentLightBox(
                                              reply.files,
                                              reply.userId,
                                              reply.userName,
                                              reply.date,
                                              index
                                            )
                                          }
                                          key={index}
                                          className="w-full min-w-auto max-w-full h-auto block relative cursor-pointer"
                                        >
                                          {isVideo ? (
                                            <video
                                              src={file}
                                              controls
                                              className="w-full h-full rounded"
                                            />
                                          ) : isImage || isGif ? (
                                            <Image
                                              src={file}
                                              alt={`sent by ${reply.sender}`}
                                              width={0}
                                              height={0}
                                              sizes="100vw"
                                              className="w-full h-full object-cover rounded"
                                            />
                                          ) : null}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                                <div className="flex items-center justify-start px-2 gap-2">
                                  <p
                                    onClick={() => {
                                      setCommentToDelete(reply.replyId);
                                      setCommentDelModal(true);
                                    }}
                                    className={`text-sm text-vibe hover:text-[var(--color-vibe)]/40 opacity-60 cursor-pointer ${
                                      user?.uid === reply.userId
                                        ? "block"
                                        : "hidden"
                                    }`}
                                  >
                                    Delete
                                  </p>
                                  <p
                                    onClick={() => {
                                      setIsReplying(true);
                                      setReplyToCommentId(reply.commentId);
                                      setReplyToCommentUserId(reply.userId);
                                      setReplyToUserName(reply.userName);
                                      inputRef.current.focus();
                                    }}
                                    className="text-sm text-vibe hover:text-[var(--color-vibe)]/40 opacity-60 cursor-pointer"
                                  >
                                    Reply
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="px-2 sticky bottom-22 md:bottom-24">
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-2 border-1 border-panel py-2 px-4 bg-second rounded-2xl">
                    {files.map((file, index) => {
                      const previewSrc =
                        typeof file === "string"
                          ? file
                          : URL.createObjectURL(file);

                      return (
                        <div key={index} className="w-20 h-20 relative">
                          <Image
                            src={previewSrc}
                            alt={`preivew-${index}`}
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="w-full h-full object-cover rounded"
                          />
                          <div className="absolute top-1 right-1">
                            <button
                              onClick={() => {
                                setFiles((prev) =>
                                  prev.filter((_, i) => i !== index)
                                );
                              }}
                              className="cursor-pointer"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex items-start sticky z-50 bottom-0 md:bottom-2 w-full gap-2 p-2 md:rounded-2xl bg-second">
                <Image
                  src={user?.picture || Fallback}
                  alt="user"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-12 h-12 object-cover rounded-full shrink-0"
                />
                <div className="w-full bg-panel rounded-2xl border-1 border-[var(--color-secondary)] py-2 px-4">
                  <div className="flex items-center w-full gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={async (e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (!user) return setShowSignIn(true);
                          if (isReplying) await handleSendReply();
                          else await handleSendComment();
                        }
                      }}
                      className="w-full text-normal outline-none text-base font-normal truncate"
                      placeholder={
                        user
                          ? isReplying
                            ? `Reply to ${replyToUserName}...`
                            : `Comment as ${user.name}...`
                          : "Kindly signin to comment"
                      }
                    />

                    <button
                      onClick={isReplying ? handleSendReply : handleSendComment}
                    >
                      <MdSend className="text-2xl cursor-pointer shrink-0" />
                    </button>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <label
                      htmlFor="fileUploadComment"
                      className="cursor-pointer"
                    >
                      <RiImageAiFill className="text-xl text-[var(--color-text)]/60 shrink-0" />
                    </label>
                    <input
                      id="fileUploadComment"
                      name="file"
                      accept="image/*,video/*"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const selectedFiles = Array.from(e.target.files);
                        setFiles((prev) => [...prev, ...selectedFiles]);
                      }}
                      onKeyDown={async (e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (!user) return setShowSignIn(true);
                          if (isReplying) await handleSendReply();
                          else await handleSendComment();
                        }
                      }}
                    />
                    <RiFileGifFill
                      onClick={() => setShowGifPicker((prev) => !prev)}
                      className="text-xl text-[var(--color-text)]/60 shrink-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>

          <aside className="w-full h-full hidden md:block">
            {!post ? (
              <GoatMaxLoader />
            ) : (
              <div className="w-full md:py-4">
                <GoatTitlesStructureMax />
              </div>
            )}
          </aside>
        </div>
      </div>

      {commentDelModal && (
        <CommentDelConfirm
          setCommentDelModal={setCommentDelModal}
          commentToDelete={commentToDelete}
          post={post}
          userId={user?.uid}
        />
      )}

      {commentLightBoxOpen && (
        <CommentLightBox
          commentLightBoxFiles={commentLightBoxFiles}
          commentLightBoxUserId={commentLightBoxUserId}
          commentLightBoxUserName={commentLightBoxUserName}
          commentLightBoxDate={commentLightBoxDate}
          initialIndex={initialIndex}
          commentLightBoxOpen={commentLightBoxOpen}
          setCommentLightBoxOpen={setCommentLightBoxOpen}
        />
      )}

      {showGifPicker && (
        <GifPicker
          onSelect={(gifUrl) => {
            setFiles((prev) => [...prev, gifUrl]);
            setShowGifPicker(false);
          }}
          setShowGifPicker={setShowGifPicker}
        />
      )}
    </>
  );
}
