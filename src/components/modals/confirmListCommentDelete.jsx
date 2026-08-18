import { MdClose } from "react-icons/md";
import Swal from "sweetalert2";
import RegularButtons from "../buttons/regBtns";
import { useContext, useEffect, useState } from "react";
import { LoaderContext } from "@/context/loaderContext";
import { ListContext } from "@/context/listContext";
import { createPortal } from "react-dom";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export default function ConfirmListCommentDelete({
  setShowDeleteCommentModal,
  comment,
  listId,
}) {
  const { setIsLoading } = useContext(LoaderContext);
  const { setLists } = useContext(ListContext);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCommentDelete = async (commentToDelete) => {
    try {
      setIsLoading(true);

      await fetch(`${BASE_URL}/api/lists/deleteComment/${commentToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: comment.userId }),
      });

      setLists((prev) =>
        prev.map((list) =>
          list.listId === listId
            ? {
                ...list,
                comments: list.comments.filter(
                  (item) => item.commentId !== commentToDelete,
                ),
              }
            : list,
        ),
      );

      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Comment have been deleted!",
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
        title: "Failed deleting comment!",
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
      setShowDeleteCommentModal(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      onClick={() => setShowDeleteCommentModal(false)}
      className="fixed inset-0 z-[150] backdrop-blur-xs flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex relative justify-center bg-second border-1 border-panel w-84 md:w-96 h-fit rounded-2xl overflow-hidden p-2"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteCommentModal(false);
          }}
          className="absolute cursor-pointer top-4 right-4 font-bold duration-200 hover:scale-110 active:scale-110"
        >
          <MdClose className="text-2xl" />
        </button>
        <div className="mt-6 p-2 h-full w-full">
          <p className="text-center text-normal font-bold py-2">
            Are you sure you want to delete this comment?
          </p>
          <div className="w-full flex gap-2">
            <RegularButtons
              onClick={() => handleCommentDelete(comment.commentId)}
            >
              <p className="font-bold text-normal text-base">Confirm</p>
            </RegularButtons>
            <RegularButtons onClick={() => setShowDeleteCommentModal(false)}>
              <p className="font-bold text-normal text-base">Cancel</p>
            </RegularButtons>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
