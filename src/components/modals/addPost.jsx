import { MdClose } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/userContext";
import Image from "next/image";
import { FaFlag, FaImage, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { TitleContext } from "@/context/titleContext";
import { LoaderContext } from "@/context/loaderContext";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export default function AddPost({ setShowAddPost }) {
  const { user } = useContext(UserContext);
  const [post, setPost] = useState({ topic: "", text: "", file: null });
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
      await fetch(`${BASE_URL}/api/posts/addPost`, {
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
          files: uploadedUrls,
        }),
      });

      setShowAddPost(false);
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Something went wrong, try again!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-text)",
        color: "var(--color-bg)",
        iconColor: "var(--color-accent)",
        customClass: {
          popup: "rounded-2xl shadow-lg",
          title: "text-lg font-bold !text-[var(--color-accent)]",
          htmlContainer: "text-sm",
        },
      });
    } finally {
      setIsLoading(false);
      Swal.fire({
        title: "Success",
        text: "Your post is live!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-text)",
        color: "var(--color-bg)",
        iconColor: "var(--color-hulk)",
        customClass: {
          popup: "rounded-2xl shadow-lg",
          title: "text-lg font-bold !text-[var(--color-hulk)]",
          htmlContainer: "text-sm",
        },
      });
    }
  };

  return (
    <>
      <div
        onClick={() => setShowAddPost(false)}
        className="inset-0 z-50 backdrop-blur-xs flex items-center justify-center fixed"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex relative justify-center bg-panel w-[95%] sm:w-[400px] md:w-[450px] h-fit rounded-2xl overflow-hidden"
        >
          <button className="absolute cursor-pointer top-4 right-4 text-2xl sm:text-3xl md:text-4xl font-bold duration-200 hover:scale-110 active:scale-110">
            <MdClose onClick={() => setShowAddPost(false)} />
          </button>

          <div className="mt-12 p-2 h-full w-full">
            <div className="flex py-2 justify-start items-center gap-2">
              <Image
                src={user?.picture}
                alt="user"
                width={0}
                height={0}
                sizes="100vw"
                className="w-10 h-10 rounded-full"
              />
              <p className="text-base text-normal font-bold">{user?.name}</p>
            </div>
            <div className="pb-2">
              <div className="relative">
                <p className="font-bold px-4 py-2 bg-zeus rounded-2xl">
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
                className="bg-second w-full h-32 rounded p-2"
              />
              <div className="flex gap-2">
                <label
                  htmlFor="fileUpload"
                  className="cursor-pointer flex flex-1 bg-blue-600 p-2 rounded  justify-center items-center gap-2"
                >
                  <FaImage className="text-2xl" />
                  <p className="font-bold text-normal text-base">Add Media</p>
                </label>
                <input
                  id="fileUpload"
                  name="file"
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
                <button
                  onClick={() => setShowTopics((prev) => !prev)}
                  className="cursor-pointer flex flex-1 justify-center bg-hulk p-2 rounded items-center gap-2"
                >
                  <FaFlag className="text-2xl" />
                  <p className="font-bold text-normal text-base">
                    Choose Topic
                  </p>
                </button>
              </div>

              {post.file && post.file.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {Array.from(post.file).map((file, index) => (
                    <div key={index} className="w-20 h-20 relative">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`preivew-${index}`}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-full object-cover rounded"
                      />
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
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="py-2">
                {showTopics && (
                  <div className="w-fit h-32 bg-second rounded p-2 overflow-y-auto">
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
                        className="cursor-pointer"
                      >
                        <p>{title.title}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="py-2">
                <button
                  onClick={submitPost}
                  disabled={
                    !(post.text.trim() || (post.file && post.file.length > 0))
                  }
                  className={`bg-accent p-2 rounded w-full ${
                    !(post.text.trim() || (post.file && post.file.length > 0))
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <p className="font-bold text-norma; text-base uppercase">
                    Post
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
