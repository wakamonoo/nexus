import { MdClose } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/userContext";
import { FaFlag, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { TitleContext } from "@/context/titleContext";
import { LoaderContext } from "@/context/loaderContext";
import SecondaryButtons from "../buttons/secBtns";
import { RiImageAiFill } from "react-icons/ri";
import Avatar from "@/assets/defaultAvatar.png";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export default function EditPostModal({ setShowEditPostModal, postToEdit }) {
  const { user } = useContext(UserContext);
  const [post, setPost] = useState({
    topicId: "",
    text: "",
  });
  const { titles } = useContext(TitleContext);
  const { setIsLoading } = useContext(LoaderContext);
  const [showTopics, setShowTopics] = useState(false);
  const [existingFiles, setExistingFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  useEffect(() => {
    if (postToEdit) {
      setPost({
        topicId: postToEdit.topicId || "",
        text: postToEdit.text || "",
      });

      setExistingFiles(Array.isArray(postToEdit.files) ? postToEdit.files : []);
      setNewFiles([]);
    }
  }, [postToEdit]);

  const editPost = async () => {
    try {
      setIsLoading(true);
      let uploadedUrls = [];

      if (newFiles.length > 0) {
        const formData = new FormData();

        newFiles.forEach((file) => {
          formData.append("files", file);
        });

        const uploadRes = await fetch(`${BASE_URL}/api/uploads/postUpload`, {
          method: "POST",
          body: formData,
        });

        const data = await uploadRes.json();
        uploadedUrls = data.urls || [];
      }

      const finalFiles = [...existingFiles, ...uploadedUrls];
      await fetch(`${BASE_URL}/api/posts/editPost/${postToEdit.postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topicId: post.topicId,
          text: post.text,
          userId: user.uid,
          files: finalFiles,
        }),
      });

      setShowEditPostModal(false);

      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Your post is was updated!",
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

  const currentTopic = titles.find((t) => t.titleId === post?.topicId);

  return (
    <>
      <div
        onClick={() => setShowEditPostModal(false)}
        className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-panel bg-second shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-panel p-4">
            <h1 className="text-base font-bold text-normal">Edit post</h1>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEditPostModal(false);
              }}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-vibe transition hover:bg-[var(--color-panel)] hover:text-[var(--color-accent)] shrink-0"
            >
              <MdClose className="text-xl" />
            </button>
          </div>
          <div className="p-4">
            <div className="flex justify-start items-center gap-2">
              <img
                src={user?.picture || Avatar.src}
                alt={user?.name}
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
                    {currentTopic?.title || "No topic assigned"}
                  </p>
                </div>
                <MdClose
                  onClick={() => setPost({ ...post, topicId: "" })}
                  className="absolute cursor-pointer top-1/2 -translate-y-1/2 right-2 text-2xl"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {existingFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {existingFiles.map((file, index) => {
                    const isImage =
                      file.includes(".jpg") ||
                      file.includes(".jpeg") ||
                      file.includes(".png") ||
                      file.includes(".webp");
                    return (
                      <div key={index} className="w-20 h-20 relative">
                        {isImage ? (
                          <img
                            src={file}
                            alt={`preivew-${index}`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <video
                            src={file}
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
                              setExistingFiles((prev) =>
                                prev.filter((_, i) => i !== index),
                              );
                            }}
                            className="cursor-pointer"
                          >
                            <FaTrash className="text-base" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {newFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {newFiles.map((file, index) => (
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
                            setNewFiles((prev) =>
                              prev.filter((_, i) => i !== index),
                            );
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
            </div>
            <div>
              <textarea
                name="text"
                value={post.text}
                onChange={(e) => setPost({ ...post, text: e.target.value })}
                placeholder="share your thoughts"
                className="bg-text text-brand w-full h-32 rounded p-2"
              />
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
                    const files = Array.from(e.target.files);
                    setNewFiles((prev) => [...prev, ...files]);
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
                            topicId: title.titleId,
                          });
                          setShowTopics(false);
                        }}
                        className={`cursor-pointer h-fit w-full rounded-full bg-gradient-to-r ${title?.category === "mcu" ? "from-[var(--color-accent)]" : title?.category === "legacy" ? "from-[var(--color-hulk)]" : "from-[var(--color-infinity)]"} to-[var(--color-zeus)] px-4`}
                      >
                        <p className="font-bold text-base truncate w-full">
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
              onClick={editPost}
              disabled={!(post.text.trim() || newFiles.length > 0)}
              className={`bg-accent hover:bg-[var(--color-accent)]/80 w-full p-2 rounded flex justify-center items-center gap-1 ${
                !(post.text.trim() || newFiles.length > 0)
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <p className="font-bold text-normal text-base">Update</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
