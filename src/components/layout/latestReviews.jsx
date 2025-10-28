import { TitleContext } from "@/context/titleContext";
import { useContext, useEffect, useState } from "react";
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

  if (!titles || titles.length === 0) {
    return (
      <div className="h-[calc(100vh-6rem)] overflow-y-auto custom-scroll">
        <AsideLoader />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-6rem)] overflow-y-auto custom-scroll">
      <p className="text-base font-bold p-2">Latest Reviews</p>
      {sortedReviews?.length === 0 ? (
        <div className="mt-16">
          <div className="flex flex-col items-center justify-center">
            <MdRateReview className="text-4xl text-vibe opacity-40" />
            <p className="text-xs text-vibe opacity-40">No reviews yet</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sortedReviews?.map((review, index) => (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsLoading(true);
                router.push(`/hex/${review.titleId}`);
              }}
              key={index}
              className="border-1 border-panel rounded-2xl p-2 cursor-pointer group transition-all duration-300 hover:-translate-y-2 hover:bg-[var(--color-panel)]"
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
                    <span className="opacity-60">shared a review</span>
                  </p>
                </div>
                <div className="flex items-start gap-2 text-normal group-hover:font-bold leading-snug">
                  <FaQuoteLeft className="text-xs shrink-0 opacity-50" />
                  <p className="italic">{review.textReview}</p>
                </div>

                <div className="flex items-center justify-between gap-2 text-sm text-vibe pt-2 border-t border-panel group-hover:border-[var(--color-secondary)] w-full">
                  <p className="text-xs w-[70%] truncate">
                    for{" "}
                    <span className="text-vibe text-base font-semibold">
                      {review.title}
                    </span>
                  </p>
                  <p className="text-xs opacity-50 w-[30%]">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
