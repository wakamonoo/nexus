"use client";
import { useContext } from "react";
import { MdClose } from "react-icons/md";
import CircledButtons from "../buttons/circledBtns";
import { LoaderContext } from "@/context/loaderContext";
import Swal from "sweetalert2";
import { usePathname } from "next/navigation";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export default function ReviewDelConfirm({
  setReviewDelModal,
  reviewToDelete,
  title,
  setReviews,
  userId,
}) {
  const { setIsLoading } = useContext(LoaderContext);
  const pathname = usePathname();

  const handleReviwDelete = async (reviewToDelete) => {
    try {
      setIsLoading(true);
      await fetch(`${BASE_URL}/api/reviews/deleteReview/${reviewToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      if (pathname.startsWith("/hex")) {
        title.reviews = title.reviews.filter(
          (r) => r.reviewId !== reviewToDelete
        );
      }

      if (pathname.startsWith("/profile")) {
        setReviews((prev) => prev.filter((r) => r.reviewId !== reviewToDelete));
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Failed deleting review!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-accent)",
        customClass: {
          popup:
            "max-w-xs w-full border-1 border-[var(--color-panel)] text-normal rounded-lg shadow-lg p-4",
          title: "text-lg font-bold !text-[var(--color-accent)]",
        },
      });
    } finally {
      setIsLoading(false);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Review have been deleted!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-hulk)",
        customClass: {
          popup:
            "max-w-xs w-full border-1 border-[var(--color-panel)] text-normal rounded-lg shadow-lg p-4",
          title: "text-lg font-bold !text-[var(--color-hulk)]",
        },
      });
    }
  };
  return (
    <div
      onClick={() => setReviewDelModal(false)}
      className="inset-0 z-[150] backdrop-blur-xs flex items-center justify-center fixed"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex relative justify-center bg-second border-1 border-panel w-84 md:w-96 h-fit rounded-2xl overflow-hidden p-2"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setReviewDelModal(false);
          }}
          className="absolute cursor-pointer top-4 right-4 font-bold duration-200 hover:scale-110 active:scale-110"
        >
          <MdClose className="text-2xl" />
        </button>
        <div className="mt-6 p-2 h-full w-full">
          <p className="text-center text-normal font-bold py-2">
            Are you sure you want to delete this review?
          </p>
          <div className="w-full flex gap-2">
            <CircledButtons
              onClick={() => {
                handleReviwDelete(reviewToDelete);
                setReviewDelModal(false);
              }}
            >
              <p className="font-bold text-normal text-base">Confirm</p>
            </CircledButtons>
            <CircledButtons onClick={() => setReviewDelModal(false)}>
              <p className="font-bold text-normal text-base">Cancel</p>
            </CircledButtons>
          </div>
        </div>
      </div>
    </div>
  );
}
