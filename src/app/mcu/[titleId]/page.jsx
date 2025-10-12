"use client";
import { useContext, useEffect, useState } from "react";
import { TitleContext } from "@/context/titleContext";
import Image from "next/image";
import { useParams } from "next/navigation";
import { FaAngleLeft, FaCrown, FaPlay, FaQuoteLeft } from "react-icons/fa";
import {
  Bs1CircleFill,
  BsInfoCircle,
  BsThreeDotsVertical,
} from "react-icons/bs";
import { TbEyeSpark } from "react-icons/tb";
import { FiCheckCircle } from "react-icons/fi";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { LoaderContext } from "@/context/loaderContext";
import ShowLoader from "@/components/loaders/showLoader";
import AddReview from "@/components/modals/addReview";
import { UserContext } from "@/context/userContext";
import { MdOutlineReviews, MdRateReview } from "react-icons/md";
import TitleMenu from "@/components/layout/titleMenu";
import { GoDotFill } from "react-icons/go";

export default function Title() {
  const { titles } = useContext(TitleContext);
  const { titleId } = useParams();
  const router = useRouter();
  const [showFull, setShowFull] = useState(false);
  const [showSum, setShowSum] = useState(false);
  const { setIsLoading } = useContext(LoaderContext);
  const [showAddReview, setShowAddReview] = useState(false);
  const [showTitleMenu, setShowTitleMenu] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const title = titles.find((t) => t.titleId === titleId);

  if (!title) {
    return <ShowLoader />;
  }

  const doneReview = title.reviews?.some(
    (review) => review.userId === user?.uid
  );

  const firstReview = title.reviews?.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  )[0];

  const rankedTitles = titles
    .filter((t) => t.totalPoints > 0)
    .sort((a, b) => b.totalPoints - a.totalPoints);

  let previousPoints = null;
  let currentRank = 0;

  const ranked = rankedTitles.map((t, index) => {
    if (t.totalPoints !== previousPoints) {
      currentRank = index + 1;
      previousPoints = t.totalPoints;
    }
    return { ...t, rank: currentRank };
  });

  const currentTitleRank = ranked.find((t) => t.titleId === titleId)?.rank;

  return (
    <>
      <div className="p-4 bg-gradient-to-b from-[var(--color-secondary)] to-[var(--color-bg)]">
        <div className="flex justify-between py-4 ">
          <FaAngleLeft
            onClick={() => router.back()}
            className="text-2xl cursor-pointer"
          />
          <div className="relative">
            <BsThreeDotsVertical
              onClick={() => setShowTitleMenu(true)}
              className="text-2xl cursor-pointer"
            />
            {showTitleMenu && (
              <TitleMenu
                setShowTitleMenu={setShowTitleMenu}
                title={title.title}
                titleId={title.titleId}
                poster={title.image}
              />
            )}
          </div>
        </div>

        <div className="flex justify-between w-full">
          <div className="w-[50%]">
            <div>
              <h4 className="text-xl font-bold text-normal leading-4.5 max-w-[80%]">
                {title.title}{" "}
                <span className="font-normal text-sm">
                  {format(new Date(title.date), "yyyy")}
                </span>
              </h4>
              <p className="text-sm text-vibe">
                {title.duration
                  ? `${title.duration} minutes`
                  : `${title.episode} episodes`}{" "}
                | {title.type}
              </p>
            </div>

            <div className="flex flex-col mt-2 border-t-1 border-[var(--color-vibranium)]/20 py-2">
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
              <div className="flex flex-col py-2">
                <p className="text-xs text-vibe">
                  MCU Timeline{" "}
                  <span className="font-bold text-sm capitalize">
                    {title.timeline}
                  </span>
                </p>
                <p className="text-xs text-vibe">
                  Chronological Order{" "}
                  <span className="font-bold text-sm capitalize">
                    {title.order}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="w-[40%] h-full">
            <div className="flex relative items-center">
              <Image
                src={title.image}
                alt="poster"
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto rounded"
              />
              <div className="flex absolute top-2 left-2">
                <GoDotFill className="text-xs text-[var(--color-hulk)]" />
                <p className="text-xs text-vibe font-extralight">
                  {title.watchCount ? title.watchCount : 0}
                </p>
              </div>
              <div
                onClick={() => {
                  setIsLoading(true);
                  router.push("/trustAndLegality");
                }}
                className="absolute top-2 right-2 cursor-pointer"
              >
                <BsInfoCircle className="text-normal" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-2 mt-2 items-center">
          <button className="bg-accent py-2 px-4 rounded-full flex items-center gap-2 font-bold cursor-pointer">
            <FaPlay className="text-xl" />
            <span className="text-base text-normal">Watch Trailer</span>
          </button>
          {currentTitleRank ? (
            <h1 className="text-base uppercase">
              Ranked
              <span className="text-2xl font-bold">{currentTitleRank}</span>
            </h1>
          ) : (
            <h1 className="text-base uppercase">Unranked</h1>
          )}
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
      <div className="px-4">
        <div className="flex gap-2 justify-between py-2 border-t-1 border-[var(--color-vibranium)]/20 border-b-1">
          <button
            onClick={() => setShowAddReview(true)}
            disabled={doneReview}
            className={`flex flex-1 justify-center gap-2 items-center px-4 py-2 rounded-full ${
              doneReview
                ? "bg-zeus cursor-not-allowed"
                : "bg-second cursor-pointer"
            }`}
          >
            {doneReview ? (
              <FiCheckCircle className="text-2xl" />
            ) : (
              <MdOutlineReviews className="text-2xl" />
            )}
            <p className="text-normal font-bold text-base">
              {doneReview ? "Reviewed" : "Add Review"}
            </p>
          </button>
          <button
            onClick={() => {
              setIsLoading(true);
              router.push("/rank");
            }}
            className="flex flex-1 justify-center gap-2 items-center px-4 py-2 bg-second rounded-full cursor-pointer"
          >
            <FaCrown className="text-2xl" />
            <p className="text-normal font-bold text-base">Rank It</p>
          </button>
        </div>
        <div className="flex flex-col gap-1 py-4">
          {!title.reviews || title.reviews?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-4">
              <MdRateReview className="text-4xl text-vibe opacity-40" />
              <p className="text-xs text-vibe opacity-40">
                claim the first review
              </p>
            </div>
          ) : (
            title.reviews?.map((review, index) => (
              <div
                key={index}
                className="bg-panel rounded-2xl border p-2 relative"
              >
                {review.date === firstReview.date ? (
                  <div className="flex absolute top-2 right-2">
                    <Bs1CircleFill className="text-base text-zeus" />
                  </div>
                ) : null}
                <div className="flex items-center gap-2">
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
                    className="cursor-pointer w-12 h-12 rounded-full"
                  />
                  <div className="flex flex-col">
                    <p
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsLoading(true);
                        router.push(`/profile/${review.userId}`);
                      }}
                      className="cursor-pointer text-base mt-2 font-bold leading-3.5"
                    >
                      {review.userName}
                    </p>
                    <p className="text-xs text-vibe">
                      {review.date && !isNaN(new Date(review.date).getTime())
                        ? new Date(review.date)
                            .toLocaleString("en-us", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })
                            .replace(/^(\w{3})/, "$1.")
                        : "Just now "}
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
            ))
          )}
        </div>
      </div>
      {showAddReview && (
        <AddReview
          setShowAddReview={setShowAddReview}
          titleId={titleId}
          title={title}
        />
      )}
    </>
  );
}
