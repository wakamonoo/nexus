"use client";
import Banner from "@/components/banner.jsx";
import { FaBolt, FaComment, FaShare } from "react-icons/fa";
import Image from "next/image";
import { useEffect, useRef, useState, useContext } from "react";
import { PostContext } from "@/context/postContext";
import { MdClose } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function Hero() {
  const { posts } = useContext(PostContext);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState([]);
  const [currentPostInfo, setCurrentPostInfo] = useState(null);
  const [showDetails, setShowDetails] = useState(true);
  const [initialIndex, setInitialIndex] = useState(0);
  const [showFull, setShowFull] = useState(false);
  const lightboxRef = useRef();
  const router = useRouter();

  const handleFileClick = (files, index, post) => {
    setCurrentPost(files);
    setInitialIndex(index);
    setCurrentPostInfo(post);
    setLightboxOpen(true);

    setTimeout(() => {
      if (lightboxRef.current) {
        const fileWidth = lightboxRef.current.children[0].offsetWidth;
        lightboxRef.current.scrollLeft = fileWidth * index;
      }
    }, 50);
  };

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  return (
    <>
      <div className="bg-brand w-full pt-16">
        <div className="pb-4">
          <Banner />
        </div>

        <div className="p-2 flex flex-col gap-4">
          {posts.map((post, index) => (
            <div
              key={index}
              onClick={() => router.push(`/post/${post.postId}`)}
              className="w-full h-auto bg-second rounded-tl-4xl border-t-2 border-accent p-4"
            >
              <div className="flex gap-3 items-center py-2">
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

              <p
                onClick={(e) => {
                  setShowFull(!showFull);
                  e.stopPropagation();
                }}
                className={`text-base text-justify leading-5 cursor-pointer py-4 ${
                  !showFull ? "line-clamp-5" : ""
                }`}
              >
                {post.text}
              </p>

              {post.files && post.files.length > 0 ? (
                <div className="flex w-full h-80 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide">
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
          ))}
        </div>
        <div className="flex justify-center py-8">
          <p className="text-xs text-vibe text-normal opacity-25">
            you've reached the bottom of the page
          </p>
        </div>
      </div>
      {lightboxOpen && (
        <div className="inset-0 z-[100] flex flex-col items-center justify-center fixed">
          {showDetails && (
            <button className="absolute cursor-pointer z-[120] top-4 right-4 text-2xl sm:text-3xl md:text-4xl font-bold duration-200 hover:scale-110 active:scale-110">
              <MdClose onClick={() => setLightboxOpen(false)} />
            </button>
          )}
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails((prev) => !prev);
            }}
            ref={lightboxRef}
            className="flex items-center bg-brand overflow-x-auto snap-x snap-mandatory scroll-smooth relative w-[100%] h-[100%] scrollbar-hide"
          >
            {currentPost.map((file, index) => {
              const ext = file.split(".").pop().toLowerCase();

              return (
                <div
                  key={index}
                  className="flex-shrink-0 w-full h-full snap-center flex items-center justify-center relative"
                >
                  {["jpg", "jpeg", "png", "gif", "webp"].includes(ext) && (
                    <Image
                      src={file}
                      alt="file"
                      fill
                      className="object-contain"
                    />
                  )}
                  {["mp4", "webm", "ogg"].includes(ext) && (
                    <video
                      src={file}
                      controls
                      autoPlay={index === initialIndex}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              );
            })}
          </div>
          {showDetails && (
            <div className="absolute bg-[var(--color-secondary)]/50 w-full p-2 bottom-0 left-0">
              <div className="flex flex-col">
                <p className="text-base mt-2 font-bold leading-3.5">
                  {currentPostInfo.userName}
                </p>
                <p className="text-xs text-vibe">{currentPostInfo.date}</p>
              </div>
              <div>
                <p className="text-base text-normal">{currentPostInfo.text}</p>
              </div>
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
          )}
        </div>
      )}
    </>
  );
}
