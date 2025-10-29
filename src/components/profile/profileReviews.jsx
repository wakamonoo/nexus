"use client";
import { TitleContext } from "@/context/titleContext";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { FaQuoteLeft } from "react-icons/fa";
import { MdRateReview } from "react-icons/md";
import { useRouter } from "next/navigation";
import { LoaderContext } from "@/context/loaderContext";
import { UserContext } from "@/context/userContext";
import ReviewDelConfirm from "../modals/reviewDelConfirm";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function ProfileReviews({ profileUser }) {
  const { titles, reviewToDelete, setReviewToDelete } =
    useContext(TitleContext);
  const { setIsLoading } = useContext(LoaderContext);
  const { user } = useContext(UserContext);
  const [reviewDelModal, setReviewDelModal] = useState(false);

  const [reviews, setReviews] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (titles) {
      const profileUserReviews = titles?.flatMap(
        (t) =>
          t.reviews
            ?.filter((r) => r.userId === profileUser.uid)
            .map((r) => ({
              ...r,
              title: t.title,
              titleId: t.titleId,
              type: t.type,
              timeline: t.timeline,
            })) || []
      );
      setReviews(profileUserReviews);
    }
  }, [titles, profileUser.uid]);

  return (
    <>
      <div className="w-full">
        {reviews?.length === 0 ? (
          <div className="mt-16">
            <div className="flex flex-col items-center justify-center">
              <MdRateReview className="text-4xl text-vibe opacity-40" />
              <p className="text-xs text-vibe opacity-40">
                You have no reviews yet
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 py-4 px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
            {reviews?.map((review, index) => (
              <div
                onClick={() => {
                  setIsLoading(true);
                  router.push(`/hex/${review.titleId}`);
                }}
                key={index}
                className="bg-second w-full rounded-2xl border-1 border-panel cursor-pointer p-2"
              >
                <div className="flex gap-2 items-center py-2">
                  <Image
                    onClick={(e) => {
                      e.stopPropagation();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    src={review.userImage}
                    alt="user"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="cursor-pointer w-12 h-12 object-cover rounded-full"
                  />
                  <div className="flex flex-col">
                    <p
                      onClick={(e) => {
                        e.stopPropagation();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="cursor-pointer text-base mt-2 font-bold leading-3.5"
                    >
                      {review.userName}
                    </p>
                    <p className="text-xs text-vibe">
                      {(() => {
                        const diffWeeks = dayjs().diff(
                          dayjs(review.date),
                          "week"
                        );
                        if (diffWeeks < 1) {
                          return dayjs(review.date).fromNow();
                        }
                        return new Date(review.date).toLocaleDateString([], {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        });
                      })()}
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
                  <div className="flex items-start gap-2 text-normal leading-snug">
                    <FaQuoteLeft className="text-xs shrink-0 opacity-50" />
                    <p className="italic">{review.textReview}</p>
                  </div>
                </div>
                <div className="flex items-center justify-end px-2 gap-2">
                  <p
                    onClick={(e) => {
                      e.stopPropagation();
                      setReviewToDelete(review.reviewId);
                      setReviewDelModal(true);
                    }}
                    className={`text-sm text-vibe hover:text-[var(--color-vibe)]/40 opacity-60 cursor-pointer ${
                      user?.uid === review.userId ? "block" : "hidden"
                    }`}
                  >
                    Delete
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {reviewDelModal && (
        <ReviewDelConfirm
          setReviewDelModal={setReviewDelModal}
          reviewToDelete={reviewToDelete}
          setReviews={setReviews}
          userId={user?.uid}
        />
      )}
    </>
  );
}
