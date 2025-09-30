"use client";
import { useContext, useEffect, useState } from "react";
import { TitleContext } from "@/context/titleContext";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loader from "@/components/loader";
import {
  FaAngleLeft,
  FaClipboardList,
  FaCrown,
  FaEye,
  FaPlay,
  FaUser,
} from "react-icons/fa";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import Alt from "@/assets/fallback.png";
import { LoaderContext } from "@/context/loaderContext";
import ShowLoader from "@/components/showLoader";
import { MdPostAdd, MdSend } from "react-icons/md";
import { UserContext } from "@/context/userContext";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export default function Title() {
  const { titles } = useContext(TitleContext);
  const { titleId } = useParams();
  const router = useRouter();
  const [showFull, setShowFull] = useState(false);
  const [showSum, setShowSum] = useState(false);
  const { setIsLoading } = useContext(LoaderContext);
  const [reviewText, setReviewText] = useState("");
  const { user, setShowSignIn } = useContext(UserContext);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const title = titles.find((t) => t.titleId === titleId);

  if (!title) {
    return <ShowLoader />;
  }

  const postReview = async () => {
    try {
      if (!reviewText.trim()) return;

      const newReview = {
        titleId,
        userId: user.uid,
        userName: user.name,
        userImage: user.picture,
        textReview: reviewText,
      };
      await fetch(`${BASE_URL}/api/reviews/addReview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });

      title.reviews = title.reviews
        ? [...title.reviews, newReview]
        : [newReview];
      setReviewText("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="px-8 py-2 bg-gradient-to-b from-[var(--color-secondary)] to-[var(--color-bg)]">
        <div className="flex justify-between py-4">
          <FaAngleLeft
            onClick={() => router.back()}
            className="text-2xl cursor-pointer"
          />
          <p className="text-sm text-vibe">
            Chronological Order:{" "}
            <span className="font-bold capitalize">{title.order}</span>
          </p>
        </div>
        <div className="flex justify-between w-full">
          <div className="w-[50%]">
            <div>
              <h4 className="text-2xl font-bold text-normal leading-5">
                {title.title}
              </h4>
              <p className="text-sm text-vibe">
                {title.duration
                  ? `${title.duration} minutes`
                  : `${title.episode} episodes`}
              </p>
            </div>
            <div className="flex flex-col mt-2">
              <p className="text-sm text-vibe">
                Directed by{" "}
                <span
                  className={`font-bold text-base capitalize cursor-pointer leading-4.5 ${
                    !showFull ? "line-clamp-1" : ""
                  }`}
                  onClick={() => setShowFull(!showFull)}
                >
                  {title.director}
                </span>
              </p>
              <p className="text-sm text-vibe">
                Release{" "}
                <span className="font-bold text-base capitalize">
                  {format(new Date(title.date), "yyyy")}
                </span>
              </p>
              <p className="text-sm text-vibe">
                MCU{" "}
                <span className="font-bold text-base capitalize">
                  {title.timeline}
                </span>
              </p>
            </div>
          </div>
          <div className="w-[40%]">
            <Image
              src={title.image}
              alt="poster"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto rounded"
            />
          </div>
        </div>
        <div className="flex justify-between gap-2 mt-2 items-center">
          <button className="bg-accent py-2 px-4 rounded-full flex items-center gap-2 font-bold cursor-pointer">
            <FaPlay className="text-xl" />
            <span className="text-base text-normal">Watch Trailer</span>
          </button>
          <h1 className="text-base uppercase">
            <span className="text-2xl font-bold">#1</span>Ranked
          </h1>
        </div>
        <div className="py-4">
          <p
            onClick={() => setShowSum(!showSum)}
            className={`leading-4.5 text-base text-normal text-vibe text-justify cursor-pointer ${
              !showSum ? "line-clamp-4" : ""
            }`}
          >
            {title.summary}
          </p>
        </div>
      </div>
      <div className="px-4 pb-16">
        <div className="flex flex-col gap-4 py-8 px-4 border-t-1 border-[var(--color-vibranium)]/20">
          {title.reviews?.length === 0 ? (
            <div>no rev</div>
          ) : (
            title.reviews?.map((review, index) => (
              <div key={index} className="flex gap-2">
                <Image
                  src={review.userImage}
                  alt="user"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex flex-col bg-panel p-2 rounded-2xl">
                  <p className="font-bold text-base">{review.userName}</p>
                  <p className="text-base text-vibe">{review.textReview}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="fixed flex gap-2 items-center bottom-0 w-full bg-second p-4">
        <input
          type="text"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (user) {
                postReview();
              } else {
                setShowSignIn(true);
              }
            }
          }}
          placeholder="type your review here..."
          className="p-2 bg-text text-brand w-full rounded"
        />
        <MdPostAdd onClick={postReview} className="text-4xl cursor-pointer" />
      </div>
    </div>
  );
}
