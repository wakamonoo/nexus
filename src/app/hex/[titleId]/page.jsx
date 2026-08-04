"use client";
import { Fragment, useContext, useEffect, useState } from "react";
import { TitleContext } from "@/context/titleContext";
import { useParams } from "next/navigation";
import {
  FaAngleLeft,
  FaArrowUp,
  FaCrown,
  FaHourglassHalf,
  FaPen,
  FaPlay,
  FaQuoteLeft,
  FaTrash,
  FaVideoSlash,
} from "react-icons/fa";
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
import { MdClose, MdOutlineReviews, MdRateReview } from "react-icons/md";
import TitleMenu from "@/components/layout/titleMenu";
import { GiTrophy } from "react-icons/gi";
import SecondaryCircledButtons from "@/components/buttons/secCircledBtns";
import ReviewDelConfirm from "@/components/modals/reviewDelConfirm";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { RiLockFill } from "react-icons/ri";
import ScrollContainer from "react-indiana-drag-scroll";
import {
  BiDotsHorizontal,
  BiDotsHorizontalRounded,
  BiDownvote,
  BiSolidDownvote,
  BiSolidUpvote,
  BiUpvote,
} from "react-icons/bi";
import Swal from "sweetalert2";
import { SocketContext } from "@/context/socketContext";
import CircledButtons from "@/components/buttons/circledBtns";

dayjs.extend(relativeTime);

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export default function Title() {
  const { titles, reviewToDelete, setReviewToDelete } =
    useContext(TitleContext);
  const { titleId } = useParams();
  const router = useRouter();
  const [activeReview, setActiveReview] = useState(null);
  const [showSum, setShowSum] = useState(false);
  const { setIsLoading } = useContext(LoaderContext);
  const [showAddReview, setShowAddReview] = useState(false);
  const [showTitleMenu, setShowTitleMenu] = useState(false);
  const { user, allUsers, setShowSignIn } = useContext(UserContext);
  const [reviewDelModal, setReviewDelModal] = useState(false);
  const [showReviewOption, setShowReviewOption] = useState(false);
  const { reviewVotes } = useContext(SocketContext);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const title = titles.find((t) => t.titleId === titleId);

  const doneReview = title?.reviews?.some(
    (review) => review.userId === user?.uid,
  );

  const firstReview = title?.reviews?.sort(
    (a, b) => new Date(a.date) - new Date(b.date),
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
      .filter((r) => r.titleId === title?.titleId && r.rank === 1).length || 0;

  const currentTitleRank = ranked.find((t) => t.titleId === titleId)?.rank;

  const handleVote = async (reviewId, vote) => {
    try {
      if (!user?.uid) {
        setShowSignIn();
      }

      await fetch(`${BASE_URL}/api/reviews/vote/${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          vote,
        }),
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Vote failed!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-accent)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title:
            "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
        },
      });
    }
  };

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
              className={`text-2xl cursor-pointer ${title?.status === "released" ? "flex" : "hidden"}`}
            />
            {showTitleMenu && (
              <TitleMenu
                setShowTitleMenu={setShowTitleMenu}
                titleId={title.titleId}
              />
            )}
          </div>
        </div>

        {!title ? (
          <ShowLoader />
        ) : (
          <div className="grid md:grid-cols-[3fr_1fr] md:gap-8 md:h-[calc(100vh-6rem)]">
            <div className="md:sticky md:top-0 min-w-0">
              <div className="flex justify-between items-start md:items-center gap-2 w-full">
                <div className="w-56 md:w-56 lg:w-72 h-full float-right">
                  <div className="flex relative items-center">
                    <img
                      src={
                        title.poster
                          ? `https://image.tmdb.org/t/p/w500${title.poster}`
                          : "/fallback.png"
                      }
                      alt={title.title}
                      loading="lazy"
                      decoding="async"
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
                <div className="w-full">
                  <div>
                    <h4 className="text-xl font-bold text-normal leading-4.5 max-w-[80%]">
                      {title.title}{" "}
                      <span className="font-normal text-sm">
                        {title.mediaType === "tv"
                          ? title.first_air_date && title.last_air_date
                            ? new Date(title.first_air_date).getFullYear() ===
                              new Date(title.last_air_date).getFullYear()
                              ? format(new Date(title.first_air_date), "yyyy")
                              : `${format(new Date(title.first_air_date), "yyyy")} - ${format(new Date(title.last_air_date), "yyyy")}`
                            : title.first_air_date
                              ? format(new Date(title.first_air_date), "yyyy")
                              : ""
                          : title.release_date
                            ? format(new Date(title.release_date), "yyyy")
                            : ""}
                      </span>
                    </h4>
                    <p className="text-sm text-vibe">
                      {title.duration
                        ? `${title.duration} minutes`
                        : title.episode
                          ? `${title.episode} episodes`
                          : "No data"}{" "}
                      | {title.type || "Unknown"}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {title?.genres?.length > 0 ? (
                        title?.genres.map((genre) => (
                          <span
                            key={genre.id}
                            className="px-2 py-1 text-xs border border-panel text-vibe whitespace-nowrap rounded-full"
                          >
                            {genre.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-vibe opacity-60">
                          No genres available
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2 items-center">
                    {title.trailer ? (
                      <a
                        href={
                          title.trailer.startsWith("http")
                            ? title.trailer
                            : `https://www.youtube.com/watch?v=${title.trailer}`
                        }
                      >
                        <SecondaryCircledButtons>
                          <FaPlay className="text-xs" />
                          <span className="font-bold text-normal text-xs">
                            Watch Trailer
                          </span>
                        </SecondaryCircledButtons>
                      </a>
                    ) : (
                      <SecondaryCircledButtons disabled>
                        <FaVideoSlash className="text-xs" />
                        <span className="font-bold text-normal text-xs">
                          Unavailable
                        </span>
                      </SecondaryCircledButtons>
                    )}
                    <SecondaryCircledButtons
                      onClick={() => setShowAddReview(true)}
                      disabled={doneReview || title?.status === "upcoming"}
                    >
                      {doneReview ? (
                        <FiCheckCircle className="text-xs" />
                      ) : (
                        <MdOutlineReviews className="text-xs" />
                      )}
                      <p className="font-bold text-normal text-xs">
                        {title?.status === "upcoming"
                          ? "Unavailable"
                          : doneReview
                            ? "Reviewed"
                            : "Add Review"}
                      </p>
                    </SecondaryCircledButtons>
                    <SecondaryCircledButtons
                      disabled={
                        title?.category === "legacy" ||
                        title?.category === "adjacent" ||
                        title?.status === "upcoming"
                      }
                      onClick={() => {
                        setIsLoading(true);
                        router.push("/powerboard");
                      }}
                    >
                      {title?.category === "mcu" ? (
                        <FaCrown className="text-xs" />
                      ) : (
                        <RiLockFill className="text-xs" />
                      )}
                      <p className="font-bold text-normal text-xs">
                        {title?.status === "upcoming"
                          ? "Unavailable"
                          : title?.category === "mcu"
                            ? "Rank It"
                            : title?.category === "legacy"
                              ? "Legacy Title"
                              : "Adjacent Title"}
                      </p>
                    </SecondaryCircledButtons>
                  </div>

                  {currentTitleRank && (
                    <div className="flex items-center gap-2 bg-zeus w-fit px-2 py-1 my-2 rounded-lg">
                      <GiTrophy className="text-sm text-vibe opacity-70" />
                      <span className="text-xs uppercase tracking-[0.2em] text-vibe">
                        #{currentTitleRank} Ranked
                      </span>
                    </div>
                  )}

                  <div
                    className={`gap-2 py-2  items-center  ${title?.status === "released" ? "flex" : "hidden"}`}
                  ></div>
                </div>
              </div>

              <div className="py-2">
                {title.category === "mcu" ? (
                  <p className="text-base text-normal text-vibe">
                    Takes place during{" "}
                    <span className="font-bold">{title.timeline}</span>, within{" "}
                    <span className="font-bold">{title.universe}</span>
                  </p>
                ) : title.category === "legacy" ? (
                  <p className="text-base text-normal text-vibe">
                    Connected to{" "}
                    <span className="font-bold">{title.connections}</span>{" "}
                    through <span className="font-bold">{title.universe}</span>
                  </p>
                ) : (
                  <p className="text-base text-normal text-vibe">
                    Universe not yet confirmed
                  </p>
                )}
                <p
                  onClick={() => setShowSum(!showSum)}
                  className={`leading-4.5 mt-4 text-base text-normal text-vibe text-justify cursor-pointer ${
                    !showSum ? "line-clamp-4" : ""
                  }`}
                >
                  {title.summary}
                </p>
              </div>
              <div className="mt-2 mb-4">
                <p className="text-sm font-bold p-2 text-vibe">
                  {title.mediaType === "tv"
                    ? title.creators?.length > 0
                      ? "Created by"
                      : "Executive Producers"
                    : "Directed by"}
                </p>
                <ScrollContainer
                  className="flex overflow-x-auto cursor-grab active:cursor-grabbing select-none scrollbar-hide md:scrollbar w-full"
                  vertical
                  horizontal
                >
                  {(title.mediaType === "tv"
                    ? title.creators?.length > 0
                      ? title.creators
                      : title.execProducers
                    : title.directors
                  )?.length > 0 ? (
                    <div className="flex gap-4 w-max">
                      {(title.mediaType === "tv"
                        ? title.creators?.length > 0
                          ? title.creators
                          : title.execProducers
                        : title.directors
                      )?.map((unit) => (
                        <div
                          key={unit.tmdbId}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsLoading(true);
                            router.push(`/titles/${unit.tmdbId}`);
                          }}
                          className="flex flex-col w-24 flex-shrink-0 gap-2 bg-second rounded"
                        >
                          <img
                            src={
                              unit.profilePath
                                ? `https://image.tmdb.org/t/p/w500${unit.profilePath}`
                                : "/fallback.png"
                            }
                            alt={unit.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-24 object-cover rounded"
                          />
                          <div className="px-2 pb-2">
                            <p className="text-sm truncate">{unit.name}</p>
                            <p className="text-xs text-vibe opacity-60 line-clamp-2">
                              {unit.character}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col w-full justify-center items-center bg-second p-4 rounded">
                      <p className="text-sm text-panel font-normal">
                        No {title.mediaType === "tv" ? "creator" : "director"}{" "}
                        information available
                      </p>
                    </div>
                  )}
                </ScrollContainer>
              </div>

              <div className="mt-2 mb-4 ">
                <p className="text-sm font-bold p-2 text-vibe">Cast</p>
                <ScrollContainer
                  className="flex overflow-x-auto cursor-grab active:cursor-grabbing select-none scrollbar-hide md:scrollbar w-full"
                  vertical
                  horizontal
                >
                  {title.cast?.length > 0 ? (
                    <div className="flex gap-4 w-max">
                      {title.cast?.map((unit) => (
                        <div
                          key={unit.tmdbId}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsLoading(true);
                            router.push(`/titles/${unit.tmdbId}`);
                          }}
                          className="flex flex-col w-24 flex-shrink-0 gap-2 cursor-pointer bg-second rounded"
                        >
                          <img
                            src={
                              unit.profilePath
                                ? `https://image.tmdb.org/t/p/w500${unit.profilePath}`
                                : "/fallback.png"
                            }
                            alt={unit.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-24 object-cover rounded"
                          />
                          <div className="px-2 pb-2">
                            <p className="text-sm truncate">{unit.name}</p>
                            <p className="text-xs text-vibe opacity-60 line-clamp-2">
                              {unit.character}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col w-full justify-center items-center bg-second p-4 rounded">
                      <p className="text-sm text-panel font-normal">
                        No cast information available
                      </p>
                    </div>
                  )}
                </ScrollContainer>
              </div>
            </div>
            <div className="flex flex-col gap-4 py-4 md:pt-0 md:overflow-y-auto scrollbar-hide border-t-1 border-panel md:border-none mt-4 md:mt-0">
              {!title.reviews || title.reviews?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-4 h-full">
                  <>
                    {title?.status === "released" ? (
                      <>
                        <MdRateReview className="text-4xl text-vibe opacity-40" />
                        <p className="text-xs text-vibe opacity-40">
                          claim the first review
                        </p>
                      </>
                    ) : (
                      <>
                        <FaHourglassHalf className="text-4xl text-vibe opacity-40" />
                        <p className="text-xs text-vibe opacity-40">
                          title coming soon
                        </p>
                      </>
                    )}
                  </>
                </div>
              ) : (
                title.reviews?.map((review) => {
                  const realtimeVote = reviewVotes[review.reviewId];

                  const upvotes = realtimeVote?.upvotes ?? review.upvotes ?? [];
                  const downvotes =
                    realtimeVote?.downvotes ?? review.downvotes ?? [];
                  return (
                    <Fragment key={review.reviewId}>
                      <div className="bg-gradient-to-b from-[var(--color-panel)] to-[var(--color-secondary)] border-1 border-[var(--color-secondary)] rounded-2xl p-2 relative ">
                        {review.userId === user.uid && (
                          <div
                            onClick={() => setShowReviewOption(true)}
                            className="flex absolute top-2 right-2"
                          >
                            <BiDotsHorizontalRounded className="text-base cursor-pointer" />
                          </div>
                        )}
                        {review.date === firstReview.date && (
                          <div className="flex absolute top-2 left-10">
                            <Bs1CircleFill className="text-xl text-zeus" />
                          </div>
                        )}

                        <div className="flex items-center gap-2">
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
                            className="w-12 h-12 object-cover rounded-full cursor-pointer"
                          />
                          <div className="flex flex-col">
                            <p
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsLoading(true);
                                router.push(`/profile/${review.userId}`);
                              }}
                              className="cursor-pointer text-base mt-2 font-bold leading-none"
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
                        <div className="border-t border-[var(--color-vibranium)]/20 mt-2">
                          <div className="flex items-start">
                            <div className="flex items-center justify-center w-8 h-8 shrink-0">
                              <FaQuoteLeft className="text-xs opacity-60" />
                            </div>
                            <p className="text-base text-vibe leading-tight mt-2">
                              {review.textReview}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end  mt-4 px-2 gap-2">
                          <div className="flex items-center rounded-full bg-panel py-2 px-4 gap-2">
                            {upvotes.includes(user?.uid) ? (
                              <BiSolidUpvote
                                onClick={() =>
                                  handleVote(review.reviewId, "up")
                                }
                                className={`text-base text-accent cursor-pointer transition-all duration-200 hover:scale-125 active:scale-125}`}
                              />
                            ) : (
                              <BiUpvote
                                onClick={() =>
                                  handleVote(review.reviewId, "up")
                                }
                                className={`text-base cursor-pointer transition-all duration-200 hover:scale-125 active:scale-125}`}
                              />
                            )}
                            <span className="text-xs opacity-60">
                              {upvotes.length - downvotes.length}
                            </span>
                            {downvotes.includes(user?.uid) ? (
                              <BiSolidDownvote
                                onClick={() =>
                                  handleVote(review.reviewId, "down")
                                }
                                className={`text-base text-accent cursor-pointer transition-all duration-200 hover:scale-125 active:scale-125}`}
                              />
                            ) : (
                              <BiDownvote
                                onClick={() =>
                                  handleVote(review.reviewId, "down")
                                }
                                className={`text-base cursor-pointer transition-all duration-200 hover:scale-125 active:scale-125}`}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      {showReviewOption && (
                        <div className="inset-0 z-50 backdrop-blur-xs flex items-center justify-center fixed">
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="flex relative justify-center bg-second border-1 border-panel w-84 md:w-96 h-auto rounded-2xl overflow-hidden p-2"
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowReviewOption(false);
                              }}
                              className="absolute cursor-pointer top-4 right-4 font-bold duration-200 hover:scale-110 active:scale-110"
                            >
                              <MdClose className="text-2xl" />
                            </button>
                            <div className="mt-8 p-2 h-full w-full">
                              <div className="w-full flex flex-col gap-2">
                                <CircledButtons
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowReviewOption(false);
                                    setReviewToDelete(review.reviewId);
                                    setReviewDelModal(true);
                                  }}
                                >
                                  <p className="font-bold text-normal text-base">
                                    Delete Review
                                  </p>
                                </CircledButtons>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Fragment>
                  );
                })
              )}
            </div>
          </div>
        )}
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
          userId={user?.uid}
        />
      )}
    </>
  );
}
