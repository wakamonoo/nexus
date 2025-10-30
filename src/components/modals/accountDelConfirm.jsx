"use client";
import { TitleContext } from "@/context/titleContext";
import { useContext } from "react";
import { MdClose } from "react-icons/md";
import CircledButtons from "../buttons/circledBtns";
import { LoaderContext } from "@/context/loaderContext";
import { UserContext } from "@/context/userContext";
import Swal from "sweetalert2";
import { GoogleAuthProvider, reauthenticateWithPopup } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export default function AccountDelConfirm({
  setAccountDelModal,
  setEditProfile,
  user,
}) {
  const { setIsLoading } = useContext(LoaderContext);
  const { firebaseUser } = useContext(UserContext);
  const userId = user?.uid;
  const router = useRouter();

  const handleAccountDelete = async (userId) => {
    try {
      setIsLoading(true);

      const provider = new GoogleAuthProvider();
      await reauthenticateWithPopup(auth.currentUser, provider);

      await fetch(`${BASE_URL}/api/users/deleteUser/${userId}`, {
        method: "DELETE",
      });

      await firebaseUser.delete();
      router.push("/");
      setEditProfile(false);
    } catch (err) {
      console.error(err);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Failed deleting account!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-accent)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !p-4",
          title: "!text-base !font-semibold !text-[var(--color-text)]",
        },
      });
    } finally {
      setIsLoading(false);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Account and its data have been deleted!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-hulk)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !p-4",
          title: "!text-base !font-semibold !text-[var(--color-text)]",
        },
      });
    }
  };

  return (
    <div
      onClick={() => setAccountDelModal(false)}
      className="inset-0 z-[150] backdrop-blur-xs flex items-center justify-center fixed"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex relative justify-center bg-second border-1 border-panel w-84 md:w-96 h-fit rounded-2xl overflow-hidden p-2"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setAccountDelModal(false);
          }}
          className="absolute cursor-pointer top-4 right-4 font-bold duration-200 hover:scale-110 active:scale-110"
        >
          <MdClose className="text-2xl" />
        </button>
        <div className="mt-6 p-2 h-full w-full">
          <p className="text-center text-normal font-bold py-2">
            Are you sure you want to permanently delete your account?
            <br />
            <span className="text-sm text-vibe opacity-80">
              All data associated with this account will also be deleted,
              including your posts, comments, reviews, reactions (Energized and
              Echoed), and your watch count in the database. Do you still wish
              to continue?
            </span>
          </p>
          <div className="w-full flex gap-2">
            <CircledButtons
              onClick={() => {
                handleAccountDelete(userId);
                setAccountDelModal(false);
              }}
            >
              <p className="font-bold text-normal text-base">Confirm</p>
            </CircledButtons>
            <CircledButtons onClick={() => setAccountDelModal(false)}>
              <p className="font-bold text-normal text-base">Cancel</p>
            </CircledButtons>
          </div>
        </div>
      </div>
    </div>
  );
}
