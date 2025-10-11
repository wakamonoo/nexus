import { PostContext } from "@/context/postContext";
import { UserContext } from "@/context/userContext";
import { useContext, useState } from "react";
import { AiFillThunderbolt } from "react-icons/ai";
import { FaComment, FaTrash } from "react-icons/fa";
import { MdOutlineSensors, MdSensorsOff } from "react-icons/md";
import Image from "next/image";

export default function ProfileEchoes({ profileUser }) {
  const { user } = useContext(UserContext);
  const {
    posts,
    handleEnergize,
    handleEcho,
    handleFileClick,
    setDelModal,
    setSelectedPost,
    handlePostNavMain,
  } = useContext(PostContext);
  const [showFull, setShowFull] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const profileUserEchoes = posts?.filter((p) =>
    p.echoed?.includes(profileUser.uid)
  );

  return (
    <div className="p-2">
      {profileUserEchoes.length === 0 ? (
        <div className="mt-16">
          <div className="flex flex-col items-center justify-center">
            <MdSensorsOff className="text-4xl text-vibe opacity-40" />
            <p className="text-xs text-vibe opacity-40">
              You have no echoed posts yet
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1 py-4">
          {profileUserEchoes.map((post, index) => (
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
                  className={`cursor-pointer ${
                    user?.uid === post.userId ? "flex" : "hidden"
                  }`}
                >
                  <FaTrash />
                </button>
              </div>
              <div className="flex gap-3 px-4 items-center py-2">
                <Image
                  onClick={(e) => {
                    e.stopPropagation();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  src={post.userImage}
                  alt="profileUser"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-12 h-12 object-cover rounded-full"
                />
                <div className="flex flex-col">
                  <p
                    onClick={(e) => {
                      e.stopPropagation();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-base mt-2 font-bold leading-3.5"
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

              <div className="flex justify-between items-center py-4 border-t border-panel  mt-2">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (profileUser) {
                      handleEnergize(post);
                    } else {
                      setShowSignIn(true);
                    }
                  }}
                  className="flex flex-col items-center justify-center bg-[var(--color-panel)]/75 p-2  w-[33%] h-fit transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-[var(--color-secondary)] active:bg-[var(--color-secondary)] cursor-pointer"
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
                  className="flex flex-col items-center justify-center bg-[var(--color-panel)]/75 p-2  w-[33%] h-fit transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-[var(--color-secondary)] active:bg-[var(--color-secondary)] cursor-pointer"
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
                    handlePostNavMain(post.postId);
                  }}
                  className="flex flex-col items-center justify-center bg-[var(--color-panel)]/75 p-2  w-[33%] h-fit transition-all duration-200 hover:w-[45%] active:w-[45%] hover:bg-[var(--color-secondary)] active:bg-[var(--color-secondary)] cursor-pointer"
                >
                  <FaComment className="text-2xl transform -scale-x-100" />
                  <p className="text-xs font-light text-vibe opacity-50">
                    {post.comments ? post.comments.length : 0} commented
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
