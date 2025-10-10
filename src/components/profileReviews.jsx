"use client";
import { TitleContext } from "@/context/titleContext";
import { UserContext } from "@/context/userContext";
import { useContext } from "react";
import Image from "next/image";
import { FaQuoteLeft } from "react-icons/fa";
import { MdRateReview } from "react-icons/md";

export default function ProfileReviews() {
  const { user } = useContext(UserContext);
  const { titles } = useContext(TitleContext);

  const userReviews = titles.flatMap(
    (t) =>
      t.reviews
        ?.filter((r) => r.userId === user.uid)
        .map((r) => ({
          ...r,
          title: t.title,
          type: t.type,
          timeline: t.timeline,
        })) || []
  );

  return (
    <div className="p-2 pb-32">
      {userReviews.length === 0 ? (
        <div className="mt-16">
          <div className="flex flex-col items-center justify-center">
            <MdRateReview className="text-4xl text-vibe opacity-40" />
            <p className="text-xs text-vibe opacity-40">
              You have no reviews yet
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {userReviews.map((review, index) => (
            <div key={index} className="bg-panel rounded-2xl border p-2">
              <div className="flex gap-2 items-center py-2">
                <Image
                  src={review.userImage}
                  alt="user"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-12 h-12 object-cover rounded-full"
                />
                <div className="flex flex-col">
                  <p className="text-base mt-2 font-bold leading-3.5">
                    {review.userName}
                  </p>
                  <p className="text-xs text-vibe">
                    {new Date(review.date)
                      .toLocaleString("en-us", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: "true",
                      })
                      .replace(/^(\w{3})/, "$1.")}
                  </p>
                </div>
              </div>
              <div className="flex flex-col">
                <p className="font-bold text-base">{review.title}</p>
                <div>
                  <p className="text-xs text-vibe">
                    {review.type} | {review.timeline}
                  </p>
                </div>
              </div>
              <div className="border-t border-[var(--color-vibranium)]/20 mt-4 py-4">
                <p className="flex gap-1 text-base">
                  <FaQuoteLeft className="text-xs" />
                  {review.textReview}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
