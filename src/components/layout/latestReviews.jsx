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
      className="bg-gradient-to-b from-[var(--color-panel)] to-[var(--color-secondary)] border-1 border-[var(--color-secondary)] rounded-2xl p-2 cursor-pointer transition-all duration-300 hover:-translate-y-2"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-1">
          <Image
            onClick={(e) => {
              e.stopPropagation();
              setIsLoading(true);
              router.push(`/profile/${review.userId}`);
            }}
            src={review.userImage}
            alt="user"
            width={0}
            height={0}
            sizes="100vw"
            className="cursor-pointer w-6 h-6 rounded-full"
          />
          <p className="text-sm text-vibe">
            <span
              onClick={(e) => {
                e.stopPropagation();
                setIsLoading(true);
                router.push(`/profile/${review.userId}`);
              }}
              className="font-semibold text-normal"
            >
              {review.userName}
            </span>{" "}
            <span className="text-xs opacity-50">shared a review</span>{" "}
            <span className="text-xs opacity-50 shrink-0 whitespace-nowrap">
              {(() => {
                const diffWeeks = dayjs().diff(dayjs(review.date), "week");
                if (diffWeeks < 1) {
                  return dayjs(review.date).fromNow();
                }
                return `on ${new Date(review.date).toLocaleDateString([], {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}`;
              })()}
            </span>
          </p>
        </div>
        <div className="flex-1 border-t-2 border-panel" />
        <div className="flex gap-2">
          <img
            src={
              title.poster
                ? `https://image.tmdb.org/t/p/w500${title.poster}`
                : "/fallback.png"
            }
            alt={title.title}
            loading="lazy"
            decoding="async"
            className="w-20 h-30 object-fill rounded"
          />
          <div>
            <p className="text-vibe text-base font-semibold line-clamp-2">{review.title}</p>
            <div className="flex items-start gap-2 text-normal leading-snug mt-1">
              <FaQuoteLeft className="text-xs shrink-0 opacity-50" />
              <p className="italic line-clamp-4 text-sm text-vibe">{review.textReview}</p>
            </div>
          </div>
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
