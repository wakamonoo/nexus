"use client";
import { UserContext } from "@/context/userContext";
import { useContext, useState } from "react";
import { MdClose } from "react-icons/md";
import Image from "next/image";
import { LuImageUp } from "react-icons/lu";
import Fallback from "@/assets/fallback.png";
import Swal from "sweetalert2";
import { LoaderContext } from "@/context/loaderContext";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export default function EditProfile({ setEditProfile }) {
  const { user } = useContext(UserContext);
  const { setIsLoading } = useContext(LoaderContext);
  const [data, setData] = useState({
    userImage: user.picture,
    userName: user.name,
    userBio: user.bio || "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      let imageURL = data.userImage;

      if (data.userImage instanceof File) {
        const formData = new FormData();
        formData.append("file", data.userImage);

        const cloudRes = await fetch(
          `${BASE_URL}/api/uploads/userImageUpload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const cloudData = await cloudRes.json();
        imageURL = cloudData.url;
      }

      await fetch(`${BASE_URL}/api/users/updateUser/${user.uid}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          picture: imageURL,
          name: data.userName,
          bio: data.userBio,
        }),
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Failed updating user!",
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
      setEditProfile(false);
      Swal.fire({
        title: "Success",
        text: "User have been updated!",
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
    <div
      onClick={() => setEditProfile(false)}
      className="inset-0 z-[150] backdrop-blur-xs flex items-center justify-center fixed"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex relative justify-center bg-panel w-[95%] h-fit rounded-2xl overflow-hidden"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditProfile(false);
          }}
          className="absolute cursor-pointer top-4 right-4 text-2xl sm:text-3xl md:text-4xl font-bold duration-200 hover:scale-110 active:scale-110"
        >
          <MdClose />
        </button>
        <div className="w-full mt-8 p-4">
          <p className="py-2 text-center font-bold text-xl">Edit your profile</p>
          <form onSubmit={handleUpdateProfile} className="flex flex-col w-full">
            <div className="flex items-center gap-2">
              <div className="w-24 aspect-square relative flex-shrink-0">
                <Image
                  src={
                    data.userImage instanceof File
                      ? URL.createObjectURL(data.userImage)
                      : data.userImage || Fallback
                  }
                  alt="user"
                  width={0}
                  height={0}
                  sizes="100vw"
                  name="userImage"
                  className="object-cover w-full h-full rounded-full"
                />
                <label htmlFor="userImageUpload">
                  <LuImageUp className="absolute cursor-pointer bottom-1 right-1 text-2xl" />
                </label>
                <input
                  type="file"
                  id="userImageUpload"
                  accept="image/*"
                  name="userImage"
                  onChange={handleChange}
                  className="hidden"
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <input
                  type="text"
                  name="userName"
                  value={data.userName}
                  onChange={handleChange}
                  placeholder="Edit username.."
                  className="bg-second p-2 w-full rounded"
                />
                <textarea
                  type="text"
                  name="userBio"
                  value={data.userBio}
                  onChange={handleChange}
                  placeholder="Add bio.."
                  className="bg-second p-2 w-full rounded"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-2 p-2 w-full bg-accent rounded cursor-pointer"
            >
              <p className="font-bold text-normal text-base">Submit Changes</p>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
