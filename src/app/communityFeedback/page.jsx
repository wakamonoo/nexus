"use client";
import NavBar from "@/components/layout/essentials/navBar";
import { UserContext } from "@/context/userContext";
import Avatar from "@/assets/defaultAvatar.png";
import { useContext, useEffect, useMemo, useState } from "react";
import RegularButtons from "@/components/buttons/regBtns";
import { BiSolidStar } from "react-icons/bi";
import Swal from "sweetalert2";
import { LoaderContext } from "@/context/loaderContext";
import { FaRegRectangleList } from "react-icons/fa6";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FaQuoteLeft } from "react-icons/fa";
import RatingLoader from "@/components/loaders/ratingLoader";
import NexusReviewLoader from "@/components/loaders/nexusReviewLoader";
import FeedbackFormLoader from "@/components/loaders/feedbackFormLoader";

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

const listItemClass =
  "relative pl-5 before:absolute before:left-1 before:top-[0.75em] before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-accent/60";

const sections = [
  {
    number: "01",
    title: "Ratings & Reviews",
    content: (
      <>
        <p>
          Nexus allows users to rate the platform and share their experience
          through written reviews. Ratings may be combined to display an overall
          community rating, while reviews may be publicly displayed on Nexus.
        </p>
        <ul className="space-y-2">
          <li className={listItemClass}>
            Users may submit a rating with an optional written review
          </li>
          <li className={listItemClass}>
            Reviews may appear alongside your Nexus profile
          </li>
          <li className={listItemClass}>
            You may update or remove your review where supported
          </li>
        </ul>
      </>
    ),
  },
  {
    number: "02",
    title: "Community Contributions",
    content: (
      <>
        <p>
          Reviews and ratings are considered community content. By submitting a
          review, you understand that your contribution may be visible to other
          Nexus users and may be used to help understand how the community
          experiences the platform.
        </p>
        <p>
          Please avoid including sensitive personal information or anything you
          would not want publicly associated with your review.
        </p>
      </>
    ),
  },
  {
    number: "03",
    title: "Nexus Showcase",
    content: (
      <>
        <p>
          By submitting a review, you agree that your review may be featured on{" "}
          <strong>wakamonoo.site</strong> as part of the Nexus portfolio
          showcase.
        </p>
        <p>
          When featured, your{" "}
          <strong>username, profile picture, rating, and review</strong> may be
          displayed alongside the review. Aggregate community information, such
          as the overall rating or number of ratings, may also be showcased
          separately.
        </p>
      </>
    ),
  },
];

function StarRating({
  value,
  onChange,
  interactive = false,
  size = "text-xl",
}) {
  return (
    <div className={`flex items-center ${size}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= value;

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange(star)}
            className={`leading-none transition-opacity ${interactive ? "cursor-pointer hover:opacity-60" : "cursor-default"} ${active ? "text-accent" : "text-vibe/20"}`}
          >
            <BiSolidStar />
          </button>
        );
      })}
    </div>
  );
}

export default function CommunityFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const { user, allUsers, allUsersLoading, setShowSignInModal } =
    useContext(UserContext);
  const [feedbackLoad, setFeedbackLoad] = useState(true);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [consent, setConsent] = useState(false);
  const { setIsLoading } = useContext(LoaderContext);

  useEffect(() => {
    const handleGetFeedbacks = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/feedbacks/feedbacksGet`, {
          method: "GET",
        });

        const data = await res.json();

        setFeedbacks(data);
      } catch (err) {
        console.error("failed to fetch feedbacks", err);
        setFeedbacks([]);
      } finally {
        setFeedbackLoad(false);
      }
    };
    handleGetFeedbacks();
  }, []);

  const ratingCounts = useMemo(() => {
    return {
      5: feedbacks.filter((feedback) => feedback.rating === 5).length,
      4: feedbacks.filter((feedback) => feedback.rating === 4).length,
      3: feedbacks.filter((feedback) => feedback.rating === 3).length,
      2: feedbacks.filter((feedback) => feedback.rating === 2).length,
      1: feedbacks.filter((feedback) => feedback.rating === 1).length,
    };
  }, [feedbacks]);

  const averageRating = useMemo(() => {
    if (!feedbacks.length) return;

    const total = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);

    return (total / feedbacks.length).toFixed(1);
  }, [feedbacks]);

  const postFeedback = async (e) => {
    e.preventDefault();

    if (!consent || !rating || !reviewText.trim()) return;

    try {
      setIsLoading(true);

      const res = await fetch(`${BASE_URL}/api/feedbacks/addFeedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.uid,
          rating,
          review: reviewText,
        }),
      });

      const data = await res.json();

      setFeedbacks((prev) => [data.feedback, ...prev]);

      setReviewText("");

      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Thank you so much for the feedback!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-hulk)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title:
            "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
        },
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Something went wrong, please try again later!",
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
    } finally {
      setIsLoading(false);
    }
  };

  const hasFeedback = feedbacks.some((f) => f.userId === user?.uid);

  return (
    <>
      <NavBar />
      <div className="bg-brand w-full pt-22 p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
        <header className="mb-12 border-b border-panel pb-10">
          <h1 className="text-2xl font-bold tracking-tight text-vobe">
            Review & Rate Nexus
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 opacity-60">
            Share your experience with Nexus and see what the community thinks.
          </p>
        </header>
        <div className="mb-10 rounded-xl border border-accent/15 bg-accent/[0.04] p-4">
          <p className="text-sm leading-7 opacity-60">
            Rate Nexus, share your thoughts, and help shape the future of the
            platform.
          </p>
        </div>
        <div className="divide-y divide-[var(--color-panel)] mb-16">
          {sections.map((section) => (
            <section
              key={section.number}
              className="grid grid-cols-[110px_1fr] py-8"
            >
              <div>
                <span className="text-sm font-bold tracking-[0.2em] text-accent/60">
                  {section.number}
                </span>
              </div>
              <div className="min-w-0">
                <h2 className="mb4 text-lg font-semibold tracking-tight text-vibe">
                  {section.title}
                </h2>
                <div className="space-y-4 text-base leading-tight text-vibe">
                  {section.content}
                </div>
              </div>
            </section>
          ))}
        </div>
        <section className="mb-16">
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-tight text-vibe">
              Community rating
            </h2>
            <p className="mt-1 text-sm opacity-60">
              Based on ratings submitted by the community.
            </p>
          </div>
          {feedbackLoad || allUsersLoading ? (
            <RatingLoader />
          ) : (
            <div className="rounded-xl border border-panel bg-second p-6">
              <div className="grid gap-8 md:grid-cols-[180px_1fr] md:items-center">
                <div className="text-center md:border-r md:border-panel md:pr-8">
                  <p className="text-5xl font-bold tracking-tight text-vibe">
                    {averageRating || 0}
                  </p>
                  <div className="mt-2 flex justify-center">
                    <StarRating value={Math.round(averageRating)} />
                  </div>
                  <p className="mt-2 text-xs text-vibe opacity-60">
                    {feedbacks.length}{" "}
                    {feedbacks.length === 1 ? "rating" : "ratings"}
                  </p>
                </div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((ratingNumber) => {
                    const count = ratingCounts[ratingNumber];

                    const percentage = feedbacks.length
                      ? (count / feedbacks.length) * 100
                      : 0;

                    return (
                      <div
                        key={ratingNumber}
                        className="flex items-center gap-2"
                      >
                        <span className="text-xs text-right opacity-60">
                          {ratingNumber}
                        </span>
                        <BiSolidStar className="text-xs text-accent" />
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-panel">
                          <div
                            className="h-full rounded-full bg-accent transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-vibe opacity-60">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>
        <section className="mb-16">
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-tight text-vibe">
              Share your experience
            </h2>
            <p className="mt-1 text-sm opacity-60">
              Tell the community what you think about Nexus
            </p>
          </div>
          {!user ? (
            <div className="w-fit">
              <RegularButtons onClick={() => setShowSignInModal(true)}>
                <p className="font-bold text-normal text-base uppercase">
                  Sign in to submit feedback
                </p>
              </RegularButtons>
            </div>
          ) : hasFeedback ? (
            <div className="rounded-xl border border-panel bg-second p-4">
              <p className="text-sm font-semibold">
                You've already submitted your feedback.
              </p>
              <p className="mt-1 text-sm text-vibe opacity-60">
                Thank your for sharing your experience with Nexus.
              </p>
            </div>
          ) : (
            <form
              onSubmit={postFeedback}
              className="rounded-xl border border-panel bg-second p-4"
            >
              {allUsersLoading ? (
                <FeedbackFormLoader />
              ) : (
                <div className="mb-6 flex items-center gap-2">
                  <img
                    src={user?.picture || Avatar}
                    alt={user?.name}
                    loading="lazy"
                    decoding="async"
                    className="w-10 h-10 object-cover rounded-full shrink-0"
                  />
                  <p className="text-sm font-semibold text-vibe">
                    {user?.name}
                  </p>
                </div>
              )}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-vibe opacity-60">
                  How would your rate Nexus?
                </label>
                <StarRating
                  value={rating}
                  onChange={setRating}
                  interactive
                  size="text-2xl"
                />
                {rating > 0 && (
                  <p className="mt-2 text-xs text-vibe opacity-60">
                    {rating === 1 && "Not a great experience"}
                    {rating === 2 && "Could be better"}
                    {rating === 3 && "It's alright"}
                    {rating === 4 && "Really good"}
                    {rating === 5 && "Love it"}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label
                  htmlFor="review"
                  className="mb-2 block text-sm font-medium text-vibe opacity-60"
                >
                  Your review
                </label>
                <textarea
                  id="review"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  maxLength={1000}
                  rows={6}
                  placeholder="What do you think about Nexus?"
                  className="w-full resize-none rounded-lg border border-panel bg-brand p-2 text-sm text-vibe outline-none transition placeholder:opacity-30 focos:border-accent/50"
                />
                <span className="mt-2 text-right text-xs opacity-40">
                  {reviewText.length}/1000
                </span>
              </div>
              <label className="mb-6 flex cursor-pointer items-start gap-2 rounded-lg border border-panel p-4">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 accent-accent"
                />
                <p className="text-sm text-vibe">
                  I agree that my review, rating, username, and profile picture
                  may be displayed on{" "}
                  <a href="https://wakamonoo.site/#highlight">
                    <span className="font-bold transition-all duration-200 hover:text-accent active:text-accent">
                      wakamonoo.site
                    </span>
                  </a>{" "}
                  as part of Nexus portfolio showcase.
                </p>
              </label>
              <RegularButtons
                type="submit"
                disabled={!consent || !rating || !reviewText.trim()}
              >
                <p className="font-bold text-normal text-base uppercase">
                  Submit Feedback
                </p>
              </RegularButtons>
            </form>
          )}
        </section>
        <section className="mb-16">
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-tight text-vibe">
              Community reviews
            </h2>
            <p className="mt-1 text-sm opacity-60">
              See what other users have to say.
            </p>
          </div>

          {feedbacks?.length === 0 ? (
            <div className="flex h-full w-full justify-center items-center my-16">
              <div className="flex flex-col items-center justify-center">
                <FaRegRectangleList className="text-4xl text-vibe opacity-40" />
                <p className="text-xs text-vibe opacity-40">no feedbacks yet</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-panel)] border-y border-panel">
              {feedbackLoad || allUsersLoading ? (
                <NexusReviewLoader />
              ) : (
                feedbacks?.map((review) => {
                  const reviewer = allUsers.find(
                    (u) => u.uid === review.userId,
                  );
                  return (
                    <div key={review.feedbackId} className="py-7">
                      <div className="flex gap-4">
                        <img
                          src={reviewer?.picture || Avatar}
                          alt={reviewer?.name}
                          loading="lazy"
                          decoding="async"
                          className="w-10 h-10 shrink-0 object-cover rounded-full"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <p className="text-sm font-bold text-vibe">
                              {reviewer?.name}
                            </p>
                            <StarRating value={review.rating} size="text-sm" />
                          </div>
                          <p className="text-xs text-vibe">
                            {(() => {
                              const diffWeeks = dayjs().diff(
                                dayjs(review.createdAt),
                                "week",
                              );
                              if (diffWeeks < 1) {
                                return dayjs(review.createdAt).fromNow();
                              }
                              return new Date(
                                review.createdAt,
                              ).toLocaleDateString([], {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              });
                            })()}
                          </p>
                          <div className="flex items-start -ml-2">
                            <div className="flex items-center justify-center w-8 h-8 shrink-0">
                              <FaQuoteLeft className="text-xs opacity-60" />
                            </div>
                            <p className="text-base text-vibe leading-tight mt-2">
                              {review.review}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
