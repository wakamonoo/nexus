import { MdClose } from "react-icons/md";
import { useContext, useState } from "react";
import { UserContext } from "@/context/userContext";
import { FaFlag, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { TitleContext } from "@/context/titleContext";
import { LoaderContext } from "@/context/loaderContext";
import SecondaryButtons from "../buttons/secBtns";
import { RiImageAiFill } from "react-icons/ri";
import { LuCodeXml } from "react-icons/lu";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export default function AddPostModal({ setShowAddPostModal }) {
  const { user } = useContext(UserContext);
  const [post, setPost] = useState({
    topic: "",
    text: "",
    embed: "",
    file: null,
  });
  const { titles } = useContext(TitleContext);
  const { setIsLoading } = useContext(LoaderContext);
  const [showTopics, setShowTopics] = useState(false);

  const submitPost = async () => {
    try {
      setIsLoading(true);

      let uploadedUrls = [];

      if (post.file && post.file.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < post.file.length; i++) {
          formData.append("files", post.file[i]);
        }

        const uploadRes = await fetch(`${BASE_URL}/api/uploads/postUpload`, {
          method: "POST",
          body: formData,
        });

        const { urls } = await uploadRes.json();
        uploadedUrls = urls;
      }

      const getYoutubeId = (url) => {
        const regex =
          /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtu\.be\/)([\w-]{11})/;

        return url.match(regex)?.[1] || null;
      };

      let embed = null;

      if (post.embed.trim()) {
        const id = getYoutubeId(post.embed);

        if (!id) {
          Swal.fire({
            toast: true,
            position: "bottom-start",
            title: "Invalid YouTube link!",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
            background: "var(--color-secondary)",
            iconColor: "var(--color-accent)",
            customClass: {
              popup:
                "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
              title:
                "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
            },
          });
          setIsLoading(false);
          return;
        }
        embed = {
          provider: "youtube",
          id,
          url: post.embed.trim(),
        };
      }

      await fetch(`${BASE_URL}/api/posts/addPost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          topic: post.topic,
          text: post.text,
          embed: embed,
          files: uploadedUrls,
        }),
      });

      setShowAddPostModal(false);

      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Your post is live!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-hulk)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title:
            "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
        },
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Something went wrong, please try again later!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-accent)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title:
            "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentTopic = titles.find((t) => t.title === post?.topic);

  return (
    <>
      <div
        onClick={() => setShowAddPostModal(false)}
        className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-panel bg-second shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-panel p-4">
            <h1 className="text-base font-bold text-normal">Create post</h1>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAddPostModal(false);
              }}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-vibe transition hover:bg-[var(--color-panel)] hover:text-[var(--color-accent)] shrink-0"
            >
              <MdClose className="text-xl" />
            </button>
          </div>
          <div className="p-4">
            <div className="flex justify-start items-center gap-2">
              <img
                src={user?.picture}
                alt={user.name}
                loading="lazy"
                decoding="async"
                className="w-10 h-10 rounded-full"
              />
              <p className="text-base text-normal font-bold">{user?.name}</p>
            </div>
            <div className="py-2">
              <div className="relative">
                <div
                  className={`rounded-full bg-gradient-to-r ${currentTopic?.category === "mcu" ? "from-[var(--color-accent)]" : currentTopic?.category === "legacy" ? "from-[var(--color-hulk)]" : "from-[var(--color-infinity)]"} to-[var(--color-zeus)]`}
                >
                  <p className="font-bold text-vibe text-base px-2">
                    {post.topic ? post.topic : "No topic assigned"}
                  </p>
                </div>
                <MdClose
                  onClick={() => setPost({ ...post, topic: "" })}
                  className="absolute cursor-pointer top-1/2 -translate-y-1/2 right-2 text-2xl"
                />
              </div>
            </div>
            {post.file && post.file.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {Array.from(post.file).map((file, index) => (
                  <div key={index} className="w-20 h-20 relative">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preivew-${index}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <video
                        src={URL.createObjectURL(file)}
                        alt={`preivew-${index}`}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                    <div className="absolute top-1 right-1">
                      <button
                        onClick={() => {
                          const filesArray = Array.from(post.file);
                          filesArray.splice(index, 1);
                          setPost({
                            ...post,
                            file: filesArray.length ? filesArray : null,
                          });
                        }}
                        className="cursor-pointer"
                      >
                        <FaTrash className="text-base" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div>
              <textarea
                name="text"
                value={post.text}
                onChange={(e) => setPost({ ...post, text: e.target.value })}
                placeholder="share your thoughts"
                className="bg-text text-brand w-full h-32 rounded p-2"
              />
              <div className="flex items-center justify-center rounded bg-zeus p-2 gap-2">
                <div className="bg-panel p-2 rounded">
                  <LuCodeXml className="text-2xl" />
                </div>
                <input
                  value={post.embed}
                  onChange={(e) => setPost({ ...post, embed: e.target.value })}
                  placeholder="embed youtube post..."
                  className="bg-text text-brand w-full  rounded p-2"
                />
              </div>
              <div className="flex flex-col md:flex-row md:gap-2">
                <SecondaryButtons htmlFor="fileUploadPost">
                  <RiImageAiFill className="text-2xl" />
                  <p className="font-bold text-normal text-base">Add Media</p>
                </SecondaryButtons>
                <input
                  id="fileUploadPost"
                  name="file"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files);
                    setPost({
                      ...post,
                      file: post.file ? [...post.file, ...newFiles] : newFiles,
                    });
                  }}
                  type="file"
                  multiple
                  className="hidden"
                />
                <SecondaryButtons
                  onClick={() => setShowTopics((prev) => !prev)}
                >
                  <FaFlag className="text-2xl" />
                  <p className="font-bold text-normal text-base">
                    Choose Topic
                  </p>
                </SecondaryButtons>
              </div>

              <div className="py-2">
                {showTopics && (
                  <div className="w-full h-32 bg-second rounded p-2 overflow-y-auto custom-scroll flex flex-col gap-2">
                    {titles?.map((title, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setPost({
                            ...post,
                            topic: `${title.title}`,
                          });
                          setShowTopics(false);
                        }}
                        className={`cursor-pointer h-fit w-full rounded-full bg-gradient-to-r ${title?.category === "mcu" ? "from-[var(--color-accent)]" : title?.category === "legacy" ? "from-[var(--color-hulk)]" : "from-[var(--color-infinity)]"} to-[var(--color-zeus)] px-4`}
                      >
                        <p className="font-bold text-base text-vibe truncate w-full">
                          {title.title}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex border-t border-panel p-4">
            <button
              onClick={submitPost}
              disabled={
                !(
                  post.text.trim() ||
                  post.embed.trim() ||
                  (post.file && post.file.length > 0)
                )
              }
              className={`bg-accent hover:bg-[var(--color-accent)]/80 w-full p-2 rounded flex justify-center items-center gap-1 ${
                !(post.text.trim() || (post.file && post.file.length > 0))
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <p className="font-bold text-normal text-base">Post</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
