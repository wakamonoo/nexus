"use client";
import { useContext, useEffect, useState } from "react";
import { TitleContext } from "@/context/titleContext";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  FaAngleLeft,
  FaCheckCircle,
  FaClipboardList,
  FaCrown,
  FaEye,
  FaFileAlt,
  FaMedal,
  FaPlay,
  FaRegComment,
  FaRegCommentAlt,
  FaRegCommentDots,
  FaRegComments,
  FaUser,
} from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiCheckCircle, FiMessageSquare } from "react-icons/fi";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { LoaderContext } from "@/context/loaderContext";
import ShowLoader from "@/components/showLoader";
import AddReview from "@/components/addReview";
import { UserContext } from "@/context/userContext";
import { MdOutlineReviews, MdRateReview } from "react-icons/md";
import TitleMenu from "@/components/titleMenu";
import { WatchContext } from "@/context/watchContext";

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
      {showTitleMenu && (
        <TitleMenu
          setShowTitleMenu={setShowTitleMenu}
          title={title.title}
          titleId={title.titleId}
          poster={title.image}
        />
      )}
      <div className="p-4 bg-gradient-to-b from-[var(--color-secondary)] to-[var(--color-bg)]">
        <div className="flex justify-between py-4">
          <FaAngleLeft
            onClick={() => router.back()}
            className="text-2xl cursor-pointer"
          />
          <BsThreeDotsVertical
            onClick={() => setShowTitleMenu(true)}
            className="text-2xl cursor-pointer"
          />
        </div>
        <div className="flex justify-between w-full">
          <div className="w-[50%]">
            <div>
              <h4 className="text-2xl font-bold text-normal leading-5">
                {title.title}
              </h4>
              <p className="text-sm text-vibe">
                {title.duration
                  ? `${title.duration} minutes`
                  : `${title.episode} episodes`}
              </p>
            </div>
            <div className="flex flex-col mt-2">
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
              <p className="text-sm text-vibe mt-2">
                Release{" "}
                <span className="font-bold text-base capitalize">
                  {format(new Date(title.date), "yyyy")}
                </span>
              </p>
              <p className="text-sm text-vibe">
                MCU{" "}
                <span className="font-bold text-base capitalize">
                  {title.timeline}
                </span>
              </p>
              <p className="text-sm text-vibe">
                Chronological{" "}
                <span className="font-bold text-base capitalize">
                  {title.order}
                </span>
              </p>
              <p className="text-sm text-vibe">
                <span className="font-bold text-base capitalize">
                  {title.watchCount ? title.watchCount : 0}
                </span>{" "}
                have watched
              </p>
            </div>
          </div>
          <div className="flex relative items-center w-[40%] h-full">
            <Image
              src={title.image}
              alt="poster"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto rounded"
            />
            <div className="absolute top-1 right-1 bg-second py-[1px] px-[4px] opacity-60 rounded-full">
              <p className="text-[4px] text-vibe font-heading">
                poster: <span className="font-heading">joven bataller</span>
              </p>
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
              <div key={index} className="flex gap-2">
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
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex relative flex-col bg-panel p-2 rounded w-full">
                  {review.date === firstReview.date ? (
                    <div className="flex absolute top-2 right-2 gap-1 p-2 rounded-full bg-zeus items-center">
                      <FaMedal className="text-sm" />
                    </div>
                  ) : null}
                  <p
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLoading(true);
                      router.push(`/profile/${review.userId}`);
                    }}
                    className="font-bold text-base"
                  >
                    {review.userName}
                  </p>
                  <p className="text-base text-vibe">{review.textReview}</p>
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
