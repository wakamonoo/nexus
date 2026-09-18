"use client";
import { useContext, useState } from "react";
import { MdClose } from "react-icons/md";
import { LuImageUp } from "react-icons/lu";
import Avatar from "@/assets/defaultAvatar.png";
import Swal from "sweetalert2";
import { LoaderContext } from "@/context/loaderContext";
import RegularButtons from "../buttons/regBtns";
import ConfirmAccountDeleteModal from "./confirmAccountDeleteModal";
import SecondaryButtons from "../buttons/secBtns";
import { UserContext } from "@/context/userContext";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export default function EditProfileModal({ setShowEditProfileModal, user }) {
  const { setUser, setAllUsers } = useContext(UserContext);
  const { setIsLoading } = useContext(LoaderContext);
  const [showConfirmAccountDeleteModal, setShowConfirmAccountDeleteModal] =
    useState(false);
  const [data, setData] = useState({
    userImage: user?.picture,
    userName: user?.name,
    userBio: user?.bio || "",
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
          },
        );

        if (!cloudRes.ok) {
          const errorData = await cloudRes.json();

          if (cloudRes.status === 413) {
            Swal.fire({
              toast: true,
              position: "bottom-start",
              title: "file too large, 50 MB maximum per file!",
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
              background: "var(--color-secondary)",
              iconColor: "var(--color-accent)",
              customClass: {
                popup:
                  "!w-full !max-w-xs !inline-flex !items-center !justify-center !border !border-(--color-panel) !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
                title:
                  "!text-base !font-semibold !text-(--color-text) !leading-4.5",
              },
            });
            return;
          }
          throw new Error(errorData.error || "Upload failed");
        }

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

      setUser((prev) => ({
        ...prev,
        picture: imageURL,
        name: data.userName,
        bio: data.userBio,
      }));

      setAllUsers((prev) =>
        prev.map((u) =>
          u.uid === user.uid
            ? {
                ...u,
                picture: imageURL,
                name: data.userName,
                bio: data.userBio,
              }
            : u,
        ),
      );

      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "User info have been updated!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-hulk)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border !border-(--color-panel) !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title:
            "!text-base !font-semibold !text-(--color-text) !leading-4.5",
        },
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Failed updating user info!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-accent)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border !border-(--color-panel) !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title:
            "!text-base !font-semibold !text-(--color-text) !leading-4.5",
        },
      });
    } finally {
      setIsLoading(false);
      setShowEditProfileModal(false);
    }
  };

  return (
    <>
      <div
        onClick={() => setShowEditProfileModal(false)}
        className="fixed inset-0 z-150 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-panel bg-second shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-panel p-4">
            <h1 className="text-base font-bold text-normal">Edit profile</h1>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEditProfileModal(false);
              }}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-vibe transition hover:bg-(--color-panel) hover:text-(--color-accent) shrink-0"
            >
              <MdClose className="text-xl" />
            </button>
          </div>
          <div className="p-4">
            <form
              id="edit-profile-form"
              onSubmit={handleUpdateProfile}
              className="flex flex-col w-full"
            >
              <div className="flex items-start gap-2">
                <div className="w-24 aspect-square relative shrink-0">
                  <img
                    src={
                      data.userImage instanceof File
                        ? URL.createObjectURL(data.userImage)
                        : data.userImage || Avatar.src
                    }
                    alt={data.userName}
                    loading="lazy"
                    decoding="async"
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
                  <div>
                    <label className="text-xs text-vibe opacity-60 uppercase font-semibold tracking-wide mb-0.5">
                      Username
                    </label>
                    <input
                      type="text"
                      name="userName"
                      value={data.userName}
                      onChange={handleChange}
                      placeholder="Enter your Nexus alias..."
                      className="bg-panel p-2 w-full rounded"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="text-xs text-vibe opacity-60 uppercase font-semibold tracking-wide">
                        Bio
                      </label>
                      <span className="text-xs text-vibe opacity-40">
                        {data.userBio?.length}/160
                      </span>
                    </div>
                    <textarea
                      type="text"
                      name="userBio"
                      value={data.userBio}
                      onChange={(e) => {
                        if (e.target.value.length <= 160) {
                          handleChange(e);
                        }
                      }}
                      placeholder="A little about you..."
                      className="bg-panel p-2 w-full h-32 rounded"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="flex flex-col md:flex-row md:gap-2 border-t border-panel p-4">
            <RegularButtons type="submit" form="edit-profile-form">
              <p className="font-bold text-normal text-base">Submit changes</p>
            </RegularButtons>
            <SecondaryButtons
              type="button"
              onClick={() => {
                setShowConfirmAccountDeleteModal(true);
              }}
            >
              <p className="font-bold text-normal text-base">
                Delete your account
              </p>
            </SecondaryButtons>
          </div>
        </div>
      </div>
      {showConfirmAccountDeleteModal && (
        <ConfirmAccountDeleteModal
          setShowConfirmAccountDeleteModal={setShowConfirmAccountDeleteModal}
          user={user}
          setShowEditProfileModal={setShowEditProfileModal}
        />
      )}
    </>
  );
}
