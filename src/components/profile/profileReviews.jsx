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
            })) || [],
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
                {`${profileUser?.uid === user?.uid ? "you" : profileUser.name} have no reviews yet`}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 py-4 px-2 sm:px-4 md:px-8 lg:px-16">
            {reviews?.map((review, index) => {
              const title = titles.find((t) => t.titleId === review.titleId);

              return (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLoading(true);
                    router.push(`/hex/${review.titleId}`);
                  }}
                  key={index}
                  className="group relative overflow-hidden rounded-3xl border border-panel bg-second cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative h-30 overflow-hidden">
                    <img
                      src={
                        title.backdrop
                          ? `https://image.tmdb.org/t/p/w500${title.backdrop}`
                          : "/fallback.png"
                      }
                      alt={title.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-secondary)] to transparent" />
                    <div className="absolute bottom-2 left-4 right-4">
                      <p className="text-vibe text-base font-semibold leading-tight line-clamp-2">
                        {review.title}
                      </p>
                    </div>

                    <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-panel px-2 py-1.5">
                      <img
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsLoading(true);
                          router.push(`/profile/${review.userId}`);
                        }}
                        src={review.userImage}
                        alt={review.userName}
                        loading="lazy"
                        decoding="async"
                        className="w-8 h-8 rounded-full object-cover cursor-pointer"
                      />
                      <div className="pr-2">
                        <p
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsLoading(true);
                            router.push(`/profile/${review.userId}`);
                          }}
                          className="max-w-32 truncate text-sm font-bold leading-none cursor-pointer hover:underline"
                        >
                          {review.userName}
                        </p>

                        <p className="text-xs text-vibe">
                          {(() => {
                            const diffWeeks = dayjs().diff(
                              dayjs(review.date),
                              "week",
                            );
                            if (diffWeeks < 1) {
                              return dayjs(review.date).fromNow();
                            }
                            return new Date(review.date).toLocaleDateString(
                              [],
                              {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              },
                            );
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="flex items-start">
                      <div className="flex items-center justify-center w-8 h-8 shrink-0">
                        <FaQuoteLeft className="text-xs opacity-60" />
                      </div>
                      <p className="text-base text-vibe leading-tight line-clamp-2 mt-2">
                        {review.textReview}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end px-4 py-2 gap-2">
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
              );
            })}
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
