"use client";
import Loader from "@/components/loader";
import { PostContext } from "@/context/postContext";
import { UserContext } from "@/context/userContext";
import { WatchContext } from "@/context/watchContext";
import { TitleContext } from "@/context/titleContext";
import { LoaderContext } from "@/context/loaderContext";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AiFillThunderbolt } from "react-icons/ai";
import { FaAngleLeft, FaComment, FaPen, FaRegFileAlt, FaShare, FaTrash } from "react-icons/fa";
import { LuImageUp } from "react-icons/lu";
import { GiTrophy } from "react-icons/gi";
import DelConfirm from "@/components/delConfirmation";

export default function Profile() {
  const { user } = useContext(UserContext);
  const { posts, handleLike, handleFileClick } = useContext(PostContext);
  const { titles } = useContext(TitleContext);
  const { watchInfo, watchFetch } = useContext(WatchContext);
  const { setIsLoading } = useContext(LoaderContext);
  const router = useRouter();

  const [showFull, setShowFull] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [delModal, setDelModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    setIsLoading(false);
    if (user?.uid) {
      watchFetch(user.uid); // fetch all watched items
    }
  }, [user]);

  const handlePostNavMain = (id) => {
    router.push(`/post/${id}`);
    setIsLoading(true);
  };

  const isLoading = !user || !posts;
  if (isLoading) return <Loader />;

  const topRanks = user.rankings ? [...user.rankings].sort((a, b) => a.rank - b.rank).slice(0, 3) : [];
  const showNum = titles.length;
  const userPosts = posts.filter((p) => p.userId === user?.uid);

  const userWatch = watchInfo?.filter((w) => w.userId === user?.uid) || [];
  const latestWatch = [...userWatch]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 3);

  return (
    <>
      {delModal && <DelConfirm setDelModal={setDelModal} postId={selectedPost} />}
      <div className="p-2">
        <div className="flex justify-between items-center py-4 w-full">
          <FaAngleLeft onClick={() => router.back()} className="text-2xl cursor-pointer" />
          <h4 className="text-2xl">Profile</h4>
        </div>

        <div className="flex items-center w-full gap-2 py-4">
          <div className="w-16 h-16 relative">
            <Image
              src={user.picture}
              alt="user"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-full object-cover rounded-full"
            />
            <LuImageUp className="absolute bottom-1 right-1 text-2xl" />
          </div>
          <div className="flex flex-col justify-center items-start">
            <div className="flex justify-between gap-1">
              <p className="font-bold text-base text-normal">{user.name}</p>
              <FaPen className="text-xs text-vibe opacity-70" />
            </div>
            <p className="text-xs text-vibe">
              {user.totalWatched || 0}/<span>{showNum}</span> watched
            </p>
          </div>
        </div>

        {/* Top Ranks */}
        {user.rankings ? (
          <div className="w-full h-full p-2">
            <h4 className="font-bold text-base">Your holy trinity</h4>
            <div className="flex gap-2 justify-center">
              {topRanks.map((rank, index) => (
                <div key={index} className="w-26 h-40 relative">
                  <Image src={rank?.poster} alt="rank" width={0} height={0} sizes="100vw" className="w-full h-full object-fill rounded" />
                  <div
                    className={`absolute opacity-80 top-0 right-1 p-2 h-8 w-6 flex items-center justify-center rounded-bl-2xl rounded-br-2xl ${
                      rank?.rank === 1 ? "bg-hulk" : "bg-accent"
                    }`}
                  >
                    <p className={`font-bold text-sm ${rank?.rank === 1 ? "text-zeus" : "text-normal"}`}>
                      {rank?.rank === 1 ? <GiTrophy /> : rank?.rank}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>no ranked</div>
        )}

        {/* Recently Watched */}
        {latestWatch.length > 0 ? (
          <div className="w-full h-full p-2">
            <h4 className="font-bold text-base">Recently Watched</h4>
            <div className="flex gap-2 justify-center">
              {latestWatch.map((item, index) => (
                <div key={index} className="w-26 h-40 relative">
                  <Image src={item?.poster} alt="watched" width={0} height={0} sizes="100vw" className="w-full h-full object-fill rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>no watched</div>
        )}

        {/* User Posts */}
        {userPosts.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center">
            <FaRegFileAlt className="text-4xl text-vibe opacity-40" />
            <p className="text-xs text-vibe opacity-40">You have no posts yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1 py-4">
            {userPosts.map((post, index) => (
              <div
                key={index}
                onClick={() => handlePostNavMain(post.postId)}
                className="w-full relative h-auto cursor-pointer bg-gradient-to-b from-[var(--color-panel)] to-[var(--color-secondary)] rounded-tl-2xl rounded-br-2xl"
              >
                <div className="absolute top-4 right-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDelModal(true);
                      setSelectedPost(post.postId);
                    }}
                    className="cursor-pointer"
                  >
                    <FaTrash />
                  </button>
                </div>
                <div className="flex gap-3 px-4 items-center py-2">
                  <Image src={post.userImage} alt="user" width={0} height={0} sizes="100vw" className="w-12 h-12 object-cover rounded-full" />
                  <div className="flex flex-col">
                    <p className="text-base mt-2 font-bold leading-3.5">{post.userName}</p>
                    <p className="text-xs text-vibe">{post.date}</p>
                  </div>
                </div>

                <div className="p-4">
                  <p
                    onClick={(e) => {
                      setShowFull(!showFull);
                      e.stopPropagation();
                    }}
                    className={`text-base text-justify leading-5 cursor-pointer ${!showFull ? "line-clamp-5" : ""}`}
                  >
                    {post.text}
                  </p>
                </div>

                {post.files && post.files.length > 0 && (
                  <div className="relative w-full h-[50vh]">
                    {post.files.length > 1 && (
                      <div className="absolute bottom-2 right-2">
                        <p className="text-xs text-vibe">{currentIndex + 1}/{post.files.length}</p>
                      </div>
                    )}
                    <div
                      onScroll={(e) => {
                        const width = e.target.clientWidth;
                        const scrollLeft = e.target.scrollLeft;
                        setCurrentIndex(Math.round(scrollLeft / width));
                      }}
                      className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
                    >
                      {post.files.map((file, index) => {
                        const ext = typeof file === "string" ? file.split(".").pop().toLowerCase() : "";
                        return (
                          <div
                            key={index}
                            onClick={(e) => {
                              handleFileClick(post.files, index, post);
                              e.stopPropagation();
                            }}
                            className="flex-shrink-0 w-full h-full snap-center"
                          >
                            {["jpg","jpeg","png","gif","webp"].includes(ext) ? (
                              <Image src={file} alt="file" width={0} height={0} sizes="100vw" className="w-full h-full object-cover" />
                            ) : ["mp4","webm","ogg"].includes(ext) ? (
                              <video key={index} src={file} controls className="w-full h-full object-cover" />
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center p-4 border-t border-panel gap-4 mt-2">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(post);
                    }}
                    className="flex items-center justify-center gap-2 bg-[var(--color-panel)]/75 p-4 rounded-4xl w-[33%] h-12 transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-[var(--color-accent)] active:bg-[var(--color-accent)] cursor-pointer"
                  >
                    <AiFillThunderbolt className={`text-2xl ${post.energized?.includes(user?.uid) ? "text-zeus" : "text-normal"}`} />
                    <p className="text-xs font-light text-vibe">{post.energized?.length || 0}</p>
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePostNavMain(post.postId);
                    }}
                    className="flex items-center justify-center gap-2 bg-[var(--color-panel)]/75 p-4 rounded-4xl w-[33%] h-12 transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-[var(--color-accent)] active:bg-[var(--color-accent)] cursor-pointer"
                  >
                    <FaComment className="text-2xl transform -scale-x-100" />
                    <p className="text-xs font-light text-vibe">{post.comments?.length || 0}</p>
                  </div>
                  <div className="flex items-center justify-center gap-2 bg-[var(--color-panel)]/75 p-4 rounded-4xl w-[33%] h-12 transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-[var(--color-accent)] active:bg-[var(--color-accent)] cursor-pointer">
                    <FaShare className="text-2xl" />
                    <p className="text-xs font-light text-vibe">21</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
