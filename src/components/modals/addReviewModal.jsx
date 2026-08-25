"use client";
import { UserContext } from "@/context/userContext";
import { useContext, useState } from "react";
import { MdClose } from "react-icons/md";
import Swal from "sweetalert2";
import RegularButtons from "../buttons/regBtns";
import { LoaderContext } from "@/context/loaderContext";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export default function AddReviewModal({ setShowAddReviewModal, titleId, title }) {
  const { user } = useContext(UserContext);
  const [reviewText, setReviewText] = useState("");
  const { setIsLoading } = useContext(LoaderContext);

  const postReview = async () => {
    if (!reviewText.trim()) return;
    try {
      setIsLoading(true);

      const newReview = {
        titleId,
        title: title.title,
        userId: user.uid,
        textReview: reviewText,
      };

      const res = await fetch(`${BASE_URL}/api/reviews/addReview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });

      const data = await res.json();

      title.reviews = title.reviews
        ? [...title.reviews, data.review]
        : [data.review];

      setReviewText("");
      setShowAddReviewModal(false);

      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Your review is live!",
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
        title: "Something went wrong, please try again later!",
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
      onClick={() => setShowAddReviewModal(false)}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-panel bg-second shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-panel p-4">
          <h1 className="text-base font-bold text-normal">Write a review</h1>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAddReviewModal(false);
            }}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-vibe transition hover:bg-[var(--color-panel)] hover:text-[var(--color-accent)] shrink-0"
          >
            <MdClose className="text-xl" />
          </button>
        </div>
        <div className="p-4">
          <div className="flex py-2 justify-start items-center gap-2">
            <img
              src={user?.picture}
              alt={user?.name}
              loading="lazy"
              decoding="async"
              className="w-10 h-10 rounded-full"
            />
            <p className="text-base text-normal font-bold">{user?.name}</p>
          </div>
          <div className="w-full h-full py-2">
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="inifinity thoughts, one review box..."
              className="bg-text text-base text-brand w-full h-64 rounded p-2"
            />
          </div>
        </div>
        <div className="flex border-t border-panel p-4">
          <RegularButtons onClick={() => postReview()}>
            <p className="font-bold text-normal text-base">Post</p>
          </RegularButtons>
        </div>
      </div>
    </div>
  );
}
