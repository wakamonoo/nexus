"use client";
import { TitleContext } from "@/context/titleContext";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { FaQuoteLeft } from "react-icons/fa";
import { MdClose, MdRateReview } from "react-icons/md";
import { useRouter } from "next/navigation";
import { LoaderContext } from "@/context/loaderContext";
import { UserContext } from "@/context/userContext";
import ConfirmReviewDeleteModal from "../../modals/confirmReviewDeleteModal";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { BiDotsHorizontal, BiDotsHorizontalRounded } from "react-icons/bi";
import CircledButtons from "../../buttons/circledBtns";
import { SocketContext } from "@/context/socketContext";
import RegularButtons from "@/components/buttons/regBtns";
import ReviewsLoader from "@/components/loaders/reviewsLoader";
import ReviewOptions from "@/components/options/reviewOptions";

dayjs.extend(relativeTime);

export default function ProfileReviews({ profileUser }) {
  const { titles, titlesLoad, reviewToDelete, setReviewToDelete } =
    useContext(TitleContext);
  const { setIsLoading } = useContext(LoaderContext);
  const { allUsers, allUsersLoading, user } = useContext(UserContext);
  const [showConfirmReviewDeleteModal, setShowConfirmReviewDeleteModal] =
    useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { reviewVotes } = useContext(SocketContext);
  const router = useRouter();

  const isLoading = titlesLoad || allUsersLoading || !profileUser;

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
  }, [titles, profileUser?.uid]);

  return (
    <>
      <div className="w-full">
        {isLoading ? (
          <div className="flex flex-col gap-4 py-4 px-2 sm:px-4 md:px-8 lg:px-16">
            <ReviewsLoader />
          </div>
        ) : reviews?.length === 0 ? (
          <div className="flex h-full w-full justify-center items-center my-16">
            <div className="flex flex-col gap-2 items-center justify-center">
              <div className="w-14 h-14 rounded-full border border-panel flex items-center justify-center">
                <MdRateReview className="text-5xl text-vibe opacity-60 p-2" />
              </div>
              <div className="w-40 text-center">
                <p className="text-xs text-vibe opacity-60 leading-tight">
                  {`${profileUser?.uid === user?.uid ? "You" : profileUser.name} have no reviews yet`}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 py-4 px-2 sm:px-4 md:px-8 lg:px-16">
            {reviews
              ?.sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((review) => {
                const title = titles.find((t) => t.titleId === review.titleId);
                const reviewOwner = allUsers.find(
                  (u) => u.uid === review.userId,
                );
                const realtimeVote = reviewVotes[review.reviewId];

                const upvotes = realtimeVote?.upvotes ?? review.upvotes ?? [];
                const downvotes =
                  realtimeVote?.downvotes ?? review.downvotes ?? [];

                return (
                  <div key={review.reviewId}>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsLoading(true);
                        router.push(`/hex/${review.titleId}`);
                      }}
                      className="group relative overflow-hidden rounded-3xl border border-panel bg-second cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
                    >
                      {review.userId === user?.uid && (
                        <div className="absolute top-2 right-4 z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReview(review.reviewId);
                            }}
                            className="cursor-pointer"
                          >
                            <BiDotsHorizontalRounded className="text-base " />
                          </button>
                          {selectedReview === review.reviewId && (
                            <ReviewOptions
                              review={review}
                              setSelectedReview={setSelectedReview}
                              setReviewToDelete={setReviewToDelete}
                              setShowConfirmReviewDeleteModal={
                                setShowConfirmReviewDeleteModal
                              }
                            />
                          )}
                        </div>
                      )}
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

                        <div className="absolute inset-0 bg-linear-to-t from-(--color-secondary) to transparent" />
                        <div className="absolute bottom-2 left-4 right-4">
                          <p className="text-vibe text-base font-semibold leading-tight line-clamp-2">
                            {review.title}
                          </p>
                        </div>

                        <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-(--color-panel)/60 px-2 py-1.5">
                          <img
                            onClick={(e) => {
                              e.stopPropagation();
                              window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                              });
                            }}
                            src={reviewOwner.picture}
                            alt={reviewOwner.name}
                            loading="lazy"
                            decoding="async"
                            className="w-8 h-8 rounded-full object-cover cursor-pointer"
                          />
                          <div className="pr-2">
                            <p
                              onClick={(e) => {
                                e.stopPropagation();
                                window.scrollTo({
                                  top: 0,
                                  behavior: "smooth",
                                });
                              }}
                              className="max-w-32 truncate text-sm font-bold leading-none cursor-pointer"
                            >
                              {reviewOwner.name}
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
                        <div className="p-2 flex justify-end">
                          <span className="text-xs opacity-60">
                            {upvotes.length - downvotes.length}{" "}
                            {upvotes.length - downvotes.length === 1
                              ? "vote"
                              : "votes"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
      {showConfirmReviewDeleteModal && (
        <ConfirmReviewDeleteModal
          setShowConfirmReviewDeleteModal={setShowConfirmReviewDeleteModal}
          reviewToDelete={reviewToDelete}
          setReviews={setReviews}
          userId={user?.uid}
        />
      )}
    </>
  );
}
