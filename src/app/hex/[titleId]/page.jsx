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
import { GiGoat, GiTrophy } from "react-icons/gi";
import CircledButtons from "@/components/buttons/circledBtns";
import SecondaryCircledButtons from "@/components/buttons/secCircledBtns";
import ReviewDelConfirm from "@/components/modals/reviewDelConfirm";

export default function Title() {
  const { titles, reviewToDelete, setReviewToDelete } =
    useContext(TitleContext);
  const { titleId } = useParams();
  const router = useRouter();
  const [showFull, setShowFull] = useState(false);
  const [showSum, setShowSum] = useState(false);
  const { setIsLoading } = useContext(LoaderContext);
  const [showAddReview, setShowAddReview] = useState(false);
  const [showTitleMenu, setShowTitleMenu] = useState(false);
  const { user, allUsers } = useContext(UserContext);
  const [reviewDelModal, setReviewDelModal] = useState(false);

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

  const topRankedNumber =
    allUsers
      ?.flatMap((user) => user.rankings || [])
      .filter((r) => r.titleId === title.titleId && r.rank === 1).length || 0;

  const currentTitleRank = ranked.find((t) => t.titleId === titleId)?.rank;

  return (
    <>
      <div
        onClick={() => setShowTitleMenu(false)}
        className="p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32 bg-gradient-to-b from-[var(--color-secondary)] to-[var(--color-bg)]"
      >
        <div className="flex justify-between py-4 ">
          <FaAngleLeft
            onClick={() => router.back()}
            className="text-2xl cursor-pointer"
          />
          <div className="relative">
            <BsThreeDotsVertical
              onClick={(e) => {
                e.stopPropagation();
                setShowTitleMenu((prev) => !prev);
              }}
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

        <div className="grid md:grid-cols-[3fr_1fr] md:gap-8 md:h-[calc(100vh-6rem)]">
          <div className="md:sticky md:top-0">
            <div className="flex justify-between gap-2 w-full">
              <div className="w-full">
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
              <div className="w-48 md:w-56 lg:w-72 h-full">
                <div className="flex relative items-center">
                  <Image
                    src={title.image}
                    alt="poster"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto rounded"
                  />
                  <div
                    onClick={() => {
                      setIsLoading(true);
                      router.push("/trustAndLegality");
                    }}
                    className="absolute top-2 right-2 cursor-pointer opacity-70"
                  >
                    <BsInfoCircle className="text-normal" />
                  </div>
                  <div className="flex flex-col absolute top-2 left-2 gap-2 opacity-70">
                    <div className="flex items-center gap-1">
                      <GiTrophy className="text-xs" />
                      <p className="text-xs text-vibe font-extralight">
                        {topRankedNumber}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <TbEyeSpark className="text-xs" />
                      <p className="text-xs text-vibe font-extralight">
                        {title.watchCount ? title.watchCount.length : 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between gap-2 mt-2 items-center">
              <div className="w-44">
                <CircledButtons>
                  <FaPlay className="text-2xl" />
                  <span className="font-bold text-normal text-base">
                    Watch Trailer
                  </span>
                </CircledButtons>
              </div>
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

            <div className="flex gap-2 justify-between py-2 border-t-1 border-[var(--color-vibranium)]/20 border-b-1">
              <SecondaryCircledButtons
                onClick={() => setShowAddReview(true)}
                disabled={doneReview}
              >
                {doneReview ? (
                  <FiCheckCircle className="text-2xl" />
                ) : (
                  <MdOutlineReviews className="text-2xl" />
                )}
                <p className="font-bold text-normal text-base">
                  {doneReview ? "Reviewed" : "Add Review"}
                </p>
              </SecondaryCircledButtons>
              <SecondaryCircledButtons
                onClick={() => {
                  setIsLoading(true);
                  router.push("/powerboard");
                }}
              >
                <FaCrown className="text-2xl" />
                <p className="font-bold text-normal text-base">Rank It</p>
              </SecondaryCircledButtons>
            </div>
          </div>
          <div className="flex flex-col gap-4 py-4 md:pt-0 md:overflow-y-auto scrollbar-hide">
            {!title.reviews || title.reviews?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-4 h-full">
                <MdRateReview className="text-4xl text-vibe opacity-40" />
                <p className="text-xs text-vibe opacity-40">
                  claim the first review
                </p>
              </div>
            ) : (
              title.reviews?.map((review, index) => (
                <div
                  key={index}
                  className="bg-second rounded-2xl border-1 border-panel p-2 relative"
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
                    <div className="flex items-start gap-2 text-normal leading-snug">
                      <FaQuoteLeft className="text-xs shrink-0 opacity-50" />
                      <p className="italic">{review.textReview}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end px-2 gap-2">
                    <p
                      onClick={() => {
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
              ))
            )}
          </div>
        </div>
      </div>
      {showAddReview && (
        <AddReview
          setShowAddReview={setShowAddReview}
          titleId={titleId}
          title={title}
        />
      )}
      {reviewDelModal && (
        <ReviewDelConfirm
          setReviewDelModal={setReviewDelModal}
          reviewToDelete={reviewToDelete}
          title={title}
        />
      )}
    </>
  );
}
