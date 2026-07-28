import { TitleContext } from "@/context/titleContext";
import { useContext, useEffect, useRef, useState } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LoaderContext } from "@/context/loaderContext";
import { MdRateReview } from "react-icons/md";
import AsideLoader from "../loaders/asideLoader";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { SocketContext } from "@/context/socketContext";

dayjs.extend(relativeTime);

export default function LatestReviews() {
  const { sortedReviews } = useContext(SocketContext);
  const { titles } = useContext(TitleContext);
  const { setIsLoading } = useContext(LoaderContext);
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

  if (!titles || titles.length === 0) {
    return (
      <div className="h-[calc(100vh-6rem)] overflow-y-auto custom-scroll">
        <AsideLoader />
      </div>
    );
  }

  const reviewCard = (review, index, title) => (
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
          <p className="text-vibe text-lg font-semibold leading-tight line-clamp-2">
            {review.title}
          </p>
        </div>

          
        <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-panel px-2 py-1.5">
          <Image
            onClick={(e) => {
              e.stopPropagation();
              setIsLoading(true);
              router.push(`/profile/${review.userId}`);
            }}
            src={review.userImage}
            alt={review.userName}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover cursor-pointer transition-transform hover:scale-110"
          />
          <div className="pr-2">
            <p
              onClick={(e) => {
                e.stopPropagation();
                setIsLoading(true);
                router.push(`/profile/${review.userId}`);
              }}
              className="max-w-32 truncate text-xs font-bold cursor-pointer hover:underline"
            >
              {review.userName}
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
      <div className="px-2 pb-4">
        <div className="flex items-start">
          <div className="flex items-center justify-center w-8 h-8 shrink-0 rounded-full bg-[var(--color-secondary)]">
            <FaQuoteLeft className="text-xs opacity-60" />
          </div>
          <p className="text-base text-vibe leading-tight line-clamp-2 mt-2">
            {review.textReview}
          </p>
        </div>
      </div>
    </div>
  );

  if (sortedReviews?.length === 0) {
    return (
      <div className="mt-16">
        <div className="flex flex-col items-center justify-center">
          <MdRateReview className="text-4xl text-vibe opacity-40" />
          <p className="text-xs text-vibe opacity-40">No reviews yet</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="block lg:hidden">
        <div className="flex items-center gap-2 pb-2">
          <p className="text-base font-bold text-vibe opacity-60">Reviews</p>
          <div className="flex-1 border-t-2 border-panel" />
        </div>

        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        >
          {sortedReviews?.map((review, index) => {
            const title = titles.find((t) => t.titleId === review.titleId);
            return (
              <div key={index} className="min-w-full snap-start">
                {reviewCard(review, index, title)}
              </div>
            );
          })}
        </div>
      </div>

      <div className="hidden lg:block h-[calc(100vh-6rem)] overflow-y-auto custom-scroll">
        <div className="flex items-center gap-2 pb-2">
          <p className="text-base font-bold text-vibe opacity-60">Reviews</p>
          <div className="flex-1 border-t-2 border-panel" />
        </div>
        <div className="flex gap-4 flex-col">
          {sortedReviews?.map((review, index) => {
            const title = titles.find((t) => t.titleId === review.titleId);
            return (
              <div key={index} className="min-w-full snap-start">
                {reviewCard(review, index, title)}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
