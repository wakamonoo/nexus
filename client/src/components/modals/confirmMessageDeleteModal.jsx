"use client";
import { useContext } from "react";
import { MdClose } from "react-icons/md";
import CircledButtons from "../buttons/circledBtns";
import { LoaderContext } from "@/context/loaderContext";
import Swal from "sweetalert2";
import SecondaryButtons from "../buttons/secBtns";
import RegularButtons from "../buttons/regBtns";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export default function ConfirmMessageDeleteModal({
  setShowConfirmMessageDeleteModal,
  messageToDelete,
  onDelete,
}) {
  const { setIsLoading } = useContext(LoaderContext);

  const handleMessageDelete = async () => {
    try {
      setIsLoading(true);
      await fetch(`${BASE_URL}/api/messages/deleteMessage/${messageToDelete}`, {
        method: "DELETE",
      });
      onDelete(messageToDelete);

      setShowConfirmMessageDeleteModal(false);

      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Message have been deleted!",
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
        title: "Failed deleting message!",
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
    }
  };
  return (
    <div
      onClick={() => setShowConfirmMessageDeleteModal(false)}
      className="fixed inset-0 z-150 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-panel bg-second shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-panel p-4">
          <h1 className="text-base font-bold text-normal">Delete message</h1>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirmMessageDeleteModal(false);
            }}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-vibe transition hover:bg-(--color-panel) hover:text-(--color-accent) shrink-0"
          >
            <MdClose className="text-xl" />
          </button>
        </div>
        <div className="p-4">
          <p className="text-center text-normal font-bold leading-5">
            Are you sure you want to delete this message?
          </p>
        </div>
        <div className="flex gap-2 border-t border-panel p-4">
          <SecondaryButtons
            onClick={handleMessageDelete}
          >
            <p className="font-bold text-normal text-base">Confirm</p>
          </SecondaryButtons>
          <RegularButtons
            onClick={() => setShowConfirmMessageDeleteModal(false)}
          >
            <p className="font-bold text-normal text-base">Cancel</p>
          </RegularButtons>
        </div>
      </div>
    </div>
  );
}
