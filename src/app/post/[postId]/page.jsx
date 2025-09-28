"use client";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { PostContext } from "@/context/postContext";
import {
  FaAngleLeft,
  FaAngleRight,
  FaBolt,
  FaComment,
  FaRegComment,
  FaReply,
  FaShare,
} from "react-icons/fa";
import Image from "next/image";
import Tony from "@/assets/tony.jpg";
import { MdSend } from "react-icons/md";
import { UserContext } from "@/context/userContext";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export default function Post() {
  const { postId } = useParams();
  const { user } = useContext(UserContext);
  const { posts, handleLike, handleFileClick } = useContext(PostContext);
  const router = useRouter();
  const [commentText, setCommentText] = useState("");
  const [comment, setComment] = useState([]);

  const post = posts.find((p) => p.postId === postId);

  const handleSendComment = async () => {
    try {
      if (!commentText.trim()) return;

      const newComment = {
        postId,
        userId: user.uid,
        userName: user.name,
        userImage: user.picture,
        textComment: commentText,
        date: new Date().toLocaleString(),
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

  return (
    <div className="bg-brand">
      <div className="bg-panel p-4 flex justify-between">
        <FaAngleLeft
          onClick={() => router.back()}
          className="text-2xl cursor-pointer"
        />
        <p className="uppercase font-bold text-normal">Post</p>
        <div />
      </div>
      <div className="pb-24">
        <div className="bg-second">
          <div className="flex gap-3 p-4 items-center">
            <Image
              src={post?.userImage || Tony}
              alt="user"
              width={0}
              height={0}
              sizes="100vw"
              className="w-12 h-12 object-cover rounded-full"
            />
            <div className="flex flex-col">
              <p className="text-base mt-2 font-bold leading-3.5">
                {post?.userName}
              </p>
              <p className="text-xs text-vibe">{post?.date}</p>
            </div>
          </div>
          <p className="text-base text-normal leading-5 py-2 px-4">
            {post?.text}
          </p>
          {post?.files && post.files.length > 0 ? (
            <div className="flex w-full h-[50vh] overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide">
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
                    {["jpg", "jpeg", "png", "gif", "webp"].includes(ext) ? (
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
          ) : (
            <div />
          )}
          <div className="flex justify-between items-center p-4 border-t border-panel gap-4 mt-2">
            <div
              onClick={(e) => {
                handleLike(post);
                e.stopPropagation();
              }}
              className="flex items-center justify-center gap-2 bg-[var(--color-panel)]/75 p-4 rounded-4xl w-[33%] h-12 transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-[var(--color-accent)] active:bg-[var(--color-accent)] cursor-pointer"
            >
              <FaBolt
                className={`text-2xl ${
                  post?.energized?.includes(user?.uid)
                    ? "text-amber-600"
                    : "text-normal"
                }`}
              />
              <p className="text-xs font-light text-vibe">
                {post?.energized ? post.energized.length : 0}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 bg-[var(--color-panel)]/75 p-4 rounded-4xl w-[33%] h-12 transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-[var(--color-accent)] active:bg-[var(--color-accent)] cursor-pointer">
              <FaComment className="text-2xl" />
              <p className="text-xs font-light text-vibe">
                {post?.comments ? post?.comments.length : 0}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 bg-[var(--color-panel)]/75 p-4 rounded-4xl w-[33%] h-12 transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-[var(--color-accent)] active:bg-[var(--color-accent)] cursor-pointer">
              <FaShare className="text-2xl" />
              <p className="text-xs font-light text-vibe">21</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 p-4">
          {post?.comments.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center gap-2">
                <FaRegComment className="text-2xl" />
                <p className="text-base text-normal">Be the first to comment</p>
              </div>
            </div>
          ) : (
            post?.comments.map((c, index) => (
              <div key={index} className="flex gap-2">
                <Image
                  src={c.userImage}
                  alt="user"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-12 h-12 object-cover rounded-full"
                />
                <div className="bg-second py-2 px-4 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl">
                  <p className="text-base text-normal font-bold">
                    {c.userName}
                  </p>
                  <p className="text-xs text-vibe">{c.date}</p>
                  <p className="text-base text-normal py-2">{c.textComment}</p>
                  <div className="py-2 flex justify-end gap-2">
                    <div className="flex items-center justify-center gap-2 bg-panel p-4 rounded-4xl w-24 h-12">
                      <FaBolt className="text-xl" />
                      <p className="text-xs font-light text-vibe">21</p>
                    </div>
                    <div className="flex items-center justify-center gap-2 bg-panel p-4 rounded-4xl w-24 h-12">
                      <FaReply className="text-xl" />
                      <p className="text-xs font-light text-vibe">21</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex fixed bottom-0 w-full gap-2 items-center bg-second p-4">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendComment();
            }
          }}
          className="bg-text text-brand p-2 w-full rounded"
          placeholder="type your marvelous comment..."
        />
        <button onClick={handleSendComment}>
          <MdSend className="text-2xl" />
        </button>
      </div>
    </div>
  );
}
