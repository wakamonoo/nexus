"use client";
import { TitleContext } from "@/context/titleContext";
import { useContext } from "react";
import { MdClose } from "react-icons/md";
import CircledButtons from "../buttons/circledBtns";
import Swal from "sweetalert2";
import { LoaderContext } from "@/context/loaderContext";
import { useRouter } from "next/navigation";
import { ListContext } from "@/context/listContext";

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
    }
  };

  return (
    <div
      onClick={() => setShowDeleteListModal(false)}
      className="inset-0 z-[150] backdrop-blur-xs flex items-center justify-center fixed"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex relative justify-center bg-second border-1 border-panel w-84 md:w-96 h-fit rounded-2xl overflow-hidden p-2"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteListModal(false);
          }}
          className="absolute cursor-pointer top-4 right-4 font-bold duration-200 hover:scale-110 active:scale-110"
        >
          <MdClose className="text-2xl" />
        </button>
        <div className="mt-6 p-2 h-full w-full">
          <p className="text-center text-normal font-bold py-2">
            Are you sure you want to delete this list?
          </p>
          <div className="w-full flex gap-2">
            <CircledButtons
              onClick={() => {
                handleTitleDelete(listId);
                setShowDeleteListModal(false);
              }}
            >
              <p className="font-bold text-normal text-base">Confirm</p>
            </CircledButtons>
            <CircledButtons onClick={() => setShowDeleteListModal(false)}>
              <p className="font-bold text-normal text-base">Cancel</p>
            </CircledButtons>
          </div>
        </div>
      </div>
    </div>
  );
}
