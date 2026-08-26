import { TitleContext } from "@/context/titleContext";
import { useContext, useEffect, useRef } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { LoaderContext } from "@/context/loaderContext";
import { MdRateReview } from "react-icons/md";
import AsideLoader from "../../loaders/asideLoader";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { SocketContext } from "@/context/socketContext";
import { UserContext } from "@/context/userContext";

dayjs.extend(relativeTime);

export default function LatestReviews() {
  const { sortedReviews, reviewsLoad, reviewVotes } = useContext(SocketContext);
  const { titles } = useContext(TitleContext);
  const { setIsLoading } = useContext(LoaderContext);
  const { allUsers } = useContext(UserContext);
  const router = useRouter();
  const carouselRef = useRef(null);

  useEffect(() => {
    if (!sortedReviews || sortedReviews.length <= 1) return;

    const carousel = carouselRef.current;
    if (!carousel) return;

    const interval = setInterval(() => {
      const cardWidth = carousel.clientWidth;

      const isAtEnd =
        carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 5;

      if (isAtEnd) {
        carousel.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        carousel.scrollBy({
          left: cardWidth,
          behavior: "smooth",
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [sortedReviews]);

  const reviewCard = (
    review,
    index,
    reviewOwner,
    title,
    upvotes,
    downvotes,
  ) => (
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
            title?.backdrop
              ? `https://image.tmdb.org/t/p/w500${title?.backdrop}`
              : "/fallback.png"
          }
          alt={title?.title}
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
              router.push(`/profile/${reviewOwner?.uid}`);
            }}
            src={reviewOwner?.picture}
            alt={reviewOwner?.name}
            loading="lazy"
            decoding="async"
            className="w-8 h-8 rounded-full object-cover cursor-pointer"
          />
          <div className="pr-2">
            <p
              onClick={(e) => {
                e.stopPropagation();
                setIsLoading(true);
                router.push(`/profile/${reviewOwner.uid}`);
              }}
              className="max-w-32 truncate text-sm font-bold leading-none cursor-pointer hover:underline"
            >
              {reviewOwner?.name}
            </p>

            <p className="text-xs text-vibe">
              {(() => {
                const diffWeeks = dayjs().diff(dayjs(review.date), "week");
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
            {upvotes?.length - downvotes?.length}{" "}
            {upvotes?.length - downvotes?.length === 1 ? "upvote" : "upvotes"}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="block lg:hidden mt-2 lg:mt-0">
        <div className="flex items-center gap-2 pb-2">
          <p className="text-base font-bold text-vibe opacity-60">Reviews</p>
          <div className="flex-1 border-t-2 border-panel" />
        </div>
        {reviewsLoad || !titles?.length || !allUsers?.length ? (
          <AsideLoader />
        ) : sortedReviews?.length === 0 ? (
          <div className="rounded-lg border border-panel bg-second px-4 py-2 text-center">
            <p className="text-sm text-vibe opacity-60">No Activities Yet</p>
          </div>
        ) : (
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          >
            {sortedReviews?.map((review, index) => {
              const title = titles.find((t) => t.titleId === review.titleId);
              const reviewOwner = allUsers.find((u) => u.uid === review.userId);
              const realtimeVote = reviewVotes[review.reviewId];

              const upvotes = realtimeVote?.upvotes ?? review.upvotes ?? [];
              const downvotes =
                realtimeVote?.downvotes ?? review.downvotes ?? [];
              return (
                <div key={index} className="min-w-full snap-start">
                  {reviewCard(
                    review,
                    index,
                    reviewOwner,
                    title,
                    upvotes,
                    downvotes,
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="hidden lg:block h-[calc(100vh-6rem)] overflow-y-auto custom-scroll">
        <div className="flex items-center gap-2 pb-2">
          <p className="text-base font-bold text-vibe opacity-60">Reviews</p>
          <div className="flex-1 border-t-2 border-panel" />
        </div>
        {reviewsLoad || !titles?.length || !allUsers?.length ? (
          <AsideLoader />
        ) : sortedReviews?.length === 0 ? (
          <div className="rounded-lg border border-panel bg-second px-4 py-2 text-center">
            <p className="text-sm text-vibe opacity-60">No Activities Yet</p>
          </div>
        ) : (
          <div className="flex gap-4 flex-col">
            {sortedReviews?.map((review, index) => {
              const title = titles.find((t) => t.titleId === review.titleId);
              const reviewOwner = allUsers.find((u) => u.uid === review.userId);
              const realtimeVote = reviewVotes[review.reviewId];

              const upvotes = realtimeVote?.upvotes ?? review.upvotes ?? [];
              const downvotes =
                realtimeVote?.downvotes ?? review.downvotes ?? [];
              return (
                <div key={index} className="min-w-full snap-start">
                  {reviewCard(
                    review,
                    index,
                    reviewOwner,
                    title,
                    upvotes,
                    downvotes,
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
