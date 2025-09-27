"use client";
import { useParams, useRouter } from "next/navigation";
import { useContext } from "react";
import { PostContext } from "@/context/postContext";
import {
  FaAngleLeft,
  FaAngleRight,
  FaBolt,
  FaComment,
  FaShare,
} from "react-icons/fa";
import Image from "next/image";
import Tony from "@/assets/tony.jpg";

export default function Post() {
  const { postId } = useParams();
  const { posts } = useContext(PostContext);
  const router = useRouter();

  const post = posts.find((p) => p.postId === postId);

  return (
    <div className="bg-brand">
      <div className="bg-panel p-2 flex justify-between">
        <FaAngleLeft onClick={() => router.back()} className="text-2xl" />
        <p className="uppercase font-bold text-normal">Post</p>
        <div />
      </div>
      <div className="bg-second p-2">
        <div className="flex gap-3 items-center py-2">
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
        <p className="text-base text-normal leading-5">{post?.text}</p>
        {post?.files && post.files.length > 0 ? (
          <div className="flex w-full h-80 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide">
            {post.files.map((file, index) => {
              const ext =
                typeof file === "string"
                  ? file.split(".").pop().toLowerCase()
                  : "";

              return (
                <div
                  key={index}
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
    </div>
  );
}
