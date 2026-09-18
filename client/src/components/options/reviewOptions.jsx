import { FaTrash } from "react-icons/fa";

export default function ReviewOptions({
  review,
  setSelectedReview,
  setReviewToDelete,
  setShowConfirmReviewDeleteModal,
}) {
  return (
    <div className="flex flex-col absolute top-full right-0 w-60 border-1 border-panel bg-second rounded shadow-2xl p-2 z-50">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setSelectedReview(null);
          setReviewToDelete(review.reviewId);
          setShowConfirmReviewDeleteModal(true);
        }}
        className="flex w-full items-center gap-2 hover:bg-[var(--color-panel)] focus:bg-[var(--color-panel)] p-4 rounded cursor-pointer"
      >
        <FaTrash className="text-xl shrink-0" />
        <p className="text-base font-bold">Delete review</p>
      </button>
    </div>
  );
}
