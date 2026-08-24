"use client";
import { TitleContext } from "@/context/titleContext";
import { useContext } from "react";
import { MdClose } from "react-icons/md";
import CircledButtons from "../buttons/circledBtns";
import Swal from "sweetalert2";
import { LoaderContext } from "@/context/loaderContext";
import { useRouter } from "next/navigation";
import { ListContext } from "@/context/listContext";
import RegularButtons from "../buttons/regBtns";
import SecondaryButtons from "../buttons/secBtns";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export default function DeleteList({ listId, setShowDeleteListModal }) {
  const { setLists } = useContext(ListContext);
  const { setIsLoading } = useContext(LoaderContext);
  const router = useRouter();

  const handleTitleDelete = async (listId) => {
    try {
      setIsLoading(true);
      await fetch(`${BASE_URL}/api/lists/deleteList/${listId}`, {
        method: "DELETE",
      });

      setLists((prev) => prev.filter((list) => list.listId !== listId));

      setShowDeleteListModal(false);

      router.back();

      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "List have been deleted!",
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
        title: "Failed deleting list, please try again later!",
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

  return (
    <div
      onClick={() => setShowDeleteListModal(false)}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-panel bg-second shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-panel p-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold text-normal">Delete list</h1>
            <p className="mt-0.5 text-xs text-vibe opacity-60 truncate">
              This action cannot be undone.
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteListModal(false);
            }}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-vibe transition hover:bg-[var(--color-panel)] hover:text-[var(--color-accent)] shrink-0"
          >
            <MdClose className="text-xl" />
          </button>
        </div>
        <div className="p-4">
          <p className="text-center text-normal font-bold leading-5">
            Are you sure you want to delete this list?
          </p>
        </div>
        <div className="flex gap-2 border-t border-panel p-4">
          <SecondaryButtons
            onClick={() => {
              handleTitleDelete(listId);
              setShowDeleteListModal(false);
            }}
          >
            <p className="font-bold text-normal text-base">Confirm</p>
          </SecondaryButtons>
          <RegularButtons onClick={() => setShowDeleteListModal(false)}>
            <p className="font-bold text-normal text-base">Cancel</p>
          </RegularButtons>
        </div>
      </div>
    </div>
  );
}
