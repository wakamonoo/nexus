"use client";
import Banner from "@/components/banner.jsx";
import {
  FaBolt,
  FaComment,
  FaMehBlank,
  FaRegFileAlt,
  FaShare,
  FaUserAlt,
  FaUserSlash,
} from "react-icons/fa";
import Image from "next/image";
import { useEffect, useRef, useState, useContext } from "react";
import { PostContext } from "@/context/postContext";
import { MdClose } from "react-icons/md";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/userContext";
import Loader from "@/components/loader";
import HeroLoader from "@/components/heroLoader";
import { LoaderContext } from "@/context/loaderContext";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export default function Hero() {
  const { posts, handleLike, handleFileClick, coldLoad } =
    useContext(PostContext);
  const { user } = useContext(UserContext);
  const [showFull, setShowFull] = useState(false);
  const { setIsLoading, splashLoading } = useContext(LoaderContext);
  const router = useRouter();

  const handlePostNavMain = (id) => {
    router.push(`/post/${id}`);
    setIsLoading(true);
  };

  return (
    <>
      <div className="bg-brand w-full pt-16">
        <div>
          <Banner />
        </div>

        {coldLoad ? (
          <HeroLoader />
        ) : !user ? (
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-col items-center justify-center">
              <FaUserSlash className="text-4xl text-vibe opacity-40" />
              <p className="text-xs text-vibe opacity-40">
                You're not logged in
              </p>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-col items-center justify-center">
              <FaRegFileAlt className="text-4xl text-vibe opacity-40" />
              <p className="text-xs text-vibe opacity-40">no posts yets</p>
            </div>
          </div>
        ) : (
          <div className="p-2 flex flex-col gap-1">
            {posts.map((post, index) => (
              <div
                key={index}
                onClick={() => handlePostNavMain(post.postId)}
                className="w-full h-auto cursor-pointer bg-gradient-to-b from-[var(--color-panel)] to-[var(--color-secondary)] rounded-tl-2xl rounded-br-2xl"
              >
                <div className="flex gap-3 px-4 items-center py-2">
                  <Image
                    src={post.userImage}
                    alt="user"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  <div className="flex flex-col">
                    <p className="text-base mt-2 font-bold leading-3.5">
                      {post.userName}
                    </p>
                    <p className="text-xs text-vibe">{post.date}</p>
                  </div>
                </div>

                <div className="p-4">
                  <p
                    onClick={(e) => {
                      setShowFull(!showFull);
                      e.stopPropagation();
                    }}
                    className={`text-base text-justify leading-5 cursor-pointer ${
                      !showFull ? "line-clamp-5" : ""
                    }`}
                  >
                    {post.text}
                  </p>
                </div>

                {post.files && post.files.length > 0 ? (
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
                        post.energized?.includes(user?.uid)
                          ? "text-amber-600"
                          : "text-normal"
                      }`}
                    />
                    <p className="text-xs font-light text-vibe">
                      {post.energized ? post.energized.length : 0}
                    </p>
                  </div>
                  <div
                    onClick={(e) => {
                      router.push(`/post/${post.postId}`);
                      e.stopPropagation();
                    }}
                    className="flex items-center justify-center gap-2 bg-[var(--color-panel)]/75 p-4 rounded-4xl w-[33%] h-12 transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-[var(--color-accent)] active:bg-[var(--color-accent)] cursor-pointer"
                  >
                    <FaComment className="text-2xl" />
                    <p className="text-xs font-light text-vibe">
                      {post.comments ? post.comments.length : 0}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 bg-[var(--color-panel)]/75 p-4 rounded-4xl w-[33%] h-12 transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-[var(--color-accent)] active:bg-[var(--color-accent)] cursor-pointer">
                    <FaShare className="text-2xl" />
                    <p className="text-xs font-light text-vibe">21</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-center py-8">
              <p className="text-xs text-vibe text-normal opacity-25">
                oopss, that's the end of time.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
