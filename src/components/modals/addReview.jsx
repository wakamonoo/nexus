"use client";
import { UserContext } from "@/context/userContext";
import { useContext, useState } from "react";
import { MdClose } from "react-icons/md";
import Image from "next/image";
import Loader from "../loaders/loader";
import Swal from "sweetalert2";
import RegularButtons from "../buttons/regBtns";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export default function AddReview({ setShowAddReview, titleId, title }) {
  const { user, setShowSignIn } = useContext(UserContext);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);

  const postReview = async () => {
    if (!reviewText.trim()) return;
    try {
      setLoading(true);

      const newReview = {
        titleId,
        title: title.title,
        poster: title.image,
        userId: user.uid,
        userName: user.name,
        userImage: user.picture,
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
      setShowAddReview(false);
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Something went wrong, try again!",
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
      setLoading(false);
      Swal.fire({
        title: "Success",
        text: "Your review is live!",
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
    <>
      {loading && <Loader />}
      <div
        onClick={() => setShowAddReview(false)}
        className="inset-0 z-50 backdrop-blur-xs flex items-center justify-center fixed"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex relative justify-center bg-second border-1 border-panel w-84 md:w-96 h-fit rounded-2xl overflow-hidden p-2"
        >
          <button
            onClick={() => setShowAddReview(false)}
            className="absolute cursor-pointer top-4 right-4 font-bold duration-200 hover:scale-110 active:scale-110"
          >
            <MdClose className="text-2xl" />
          </button>
          <div className="mt-4 p-2 h-full w-full">
            <div className="flex py-2 justify-start items-center gap-2">
              <Image
                src={user?.picture}
                alt="user"
                width={0}
                height={0}
                sizes="100vw"
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
              <RegularButtons
                onClick={() => {
                  if (user) {
                    postReview();
                  } else {
                    setShowSignIn(true);
                  }
                }}
              >
                <p className="font-bold text-normal text-base">Post</p>
              </RegularButtons>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
