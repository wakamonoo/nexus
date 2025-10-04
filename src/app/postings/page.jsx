"use client";
import Loader from "@/components/loader";
import { PostContext } from "@/context/postContext";
import { UserContext } from "@/context/userContext";
import { useContext, useState } from "react";
import { AiFillThunderbolt } from "react-icons/ai";
import { FaComment, FaShare } from "react-icons/fa";
import Image from "next/image";
import { LoaderContext } from "@/context/loaderContext";
import { useRouter } from "next/navigation";

export default function Posting() {
  const { user } = useContext(UserContext);
  const { posts, handleLike, handleFileClick } = useContext(PostContext);
  const [showFull, setShowFull] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { setIsLoading } = useContext(LoaderContext);
  const router = useRouter();

  const handlePostNavMain = (id) => {
    router.push(`/post/${id}`);
    setIsLoading(true);
  };

  const isLoading = !user || !posts;

  if (isLoading) {
    return <Loader />;
  }

  const userPosts = posts.filter((p) => p.userId === user?.uid);
  return (
    <div>
      {userPosts.length === 0 ? (
        <div></div>
      ) : (
        userPosts.map((post, index) => (
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
              <div className="relative w-full h-[50vh]">
                {post.files.length > 1 ? (
                  <div className="absolute bottom-2 right-2">
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
              </div>
            ) : (
              <div />
            )}

            <div className="flex justify-between items-center p-4 border-t border-panel gap-4 mt-2">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  if (user) {
                    handleLike(post);
                  } else {
                    setShowSignIn(true);
                  }
                }}
                className="flex items-center justify-center gap-2 bg-[var(--color-panel)]/75 p-4 rounded-4xl w-[33%] h-12 transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-[var(--color-accent)] active:bg-[var(--color-accent)] cursor-pointer"
              >
                <AiFillThunderbolt
                  className={`text-2xl ${
                    post.energized?.includes(user?.uid)
                      ? "text-zeus"
                      : "text-normal"
                  }`}
                />
                <p className="text-xs font-light text-vibe">
                  {post.energized ? post.energized.length : 0}
                </p>
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handlePostNavMain(post.postId);
                }}
                className="flex items-center justify-center gap-2 bg-[var(--color-panel)]/75 p-4 rounded-4xl w-[33%] h-12 transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-[var(--color-accent)] active:bg-[var(--color-accent)] cursor-pointer"
              >
                <FaComment className="text-2xl transform -scale-x-100" />
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
        ))
      )}
    </div>
  );
}
