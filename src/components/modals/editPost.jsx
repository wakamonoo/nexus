import { MdClose } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/userContext";
import Image from "next/image";
import { FaFlag, FaImage, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { TitleContext } from "@/context/titleContext";
import { LoaderContext } from "@/context/loaderContext";
import SecondaryButtons from "../buttons/secBtns";
import { RiImageAiFill } from "react-icons/ri";
import Fallback from "../../assets/fallback.png";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export default function EditPost({ setShowEditModal, postToEdit }) {
  const { user } = useContext(UserContext);
  const [post, setPost] = useState({
    userImage: null,
    userName: null,
    topic: "",
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
        userImage: postToEdit.userImage || null,
        userName: postToEdit.userName || null,
        topic: postToEdit.topic || "",
        text: postToEdit.text || "",
      });

      setExistingFiles(Array.isArray(postToEdit.file) ? postToEdit.file : []);
      setNewFiles([]);
    }
  }, [postToEdit]);

  const editPost = async () => {
    try {
      setIsLoading(true);
      let uploadedUrls = [];

      if (post.file && post.file.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < post.file.length; i++) {
          formData.append("files", post.file[i]);
        }

        const uploadRes = await fetch(`${BASE_URL}/api/uploads/postUpload}`, {
          method: "POST",
          body: formData,
        });

        const data = await uploadRes.json();
        uploadedUrls = data.urls || [];
      }

      const finalFiles = [ ...existingFiles, ...uploadedUrls ];
      await fetch(`${BASE_URL}/api/posts/editPost/${postToEdit.postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: post.topic,
          text: post.text,
          userId: user.uid,
          userName: user.name,
          userImage: user.picture,
          files: finalFiles,
        }),
      });

      setShowEditModal(false);
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
    }
  };

  return (
    <>
      <div
        onClick={() => setShowEditModal(false)}
        className="inset-0 z-[100] backdrop-blur-xs flex items-center justify-center fixed"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex relative justify-center bg-second border-1 border-panel w-84 md:w-96 h-fit rounded-2xl overflow-hidden p-2"
        >
          <button
            onClick={() => setShowEditModal(false)}
            className="absolute cursor-pointer top-4 right-4 font-bold duration-200 hover:scale-110 active:scale-110"
          >
            <MdClose className="text-2xl" />
          </button>

          <div className="mt-4 p-2 h-full w-full">
            <div className="flex py-2 justify-start items-center gap-2">
              <Image
                src={post?.userImage || Fallback}
                alt="user"
                width={0}
                height={0}
                sizes="100vw"
                className="w-10 h-10 rounded-full"
              />
              <p className="text-base text-normal font-bold">{post.userName}</p>
            </div>
            <div className="pb-2">
              <div className="relative">
                <p className="font-bold px-4 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-zeus)]">
                  {post.topic ? post.topic : "No topic assigned"}
                </p>
                <MdClose
                  onClick={() => setPost({ ...post, topic: "" })}
                  className="absolute cursor-pointer top-1/2 -translate-y-1/2 right-2 text-2xl"
                />
              </div>
            </div>
            <div>
              <textarea
                name="text"
                value={post.text}
                onChange={(e) => setPost({ ...post, text: e.target.value })}
                placeholder="share your thoughts"
                className="bg-text text-brand w-full h-32 rounded p-2"
              />
              <div className="flex gap-2">
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

              {newFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newFiles.map((file, index) => (
                    <div key={index} className="w-20 h-20 relative">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`preview-${index}`}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-full object-cover rounded"
                      />
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

              {existingFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {existingFiles.map((url, index) => (
                    <div key={index} className="w-20 h-20 relative">
                      <Image
                        src={url}
                        alt={`existing-${index}`}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-full object-cover rounded"
                      />
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
                  ))}
                </div>
              )}

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
                        className="cursor-pointer h-fit w-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-zeus)] px-4"
                      >
                        <p className="font-bold text-base truncate w-full">
                          {title.title}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={editPost}
                disabled={!(post.text.trim() || newFiles.length > 0)}
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
      </div>
    </>
  );
}
