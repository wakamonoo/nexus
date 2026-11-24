"use client";
import RegularLinks from "@/components/links/regLinks";
import { FeedbackContext } from "@/context/feedbackContext";
import { UserContext } from "@/context/userContext";
import { useContext, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";

const feedbackDelay = 30 * 1000;
const feedbackCoolDown = 2 * 24 * 60 * 60 * 1000;

export default function FeedbackPopUp() {
  const { user } = useContext(UserContext);
  const { feedbacks } = useContext(FeedbackContext);
  const [isOpen, setIsOpen] = useState(false);

  const doneFeedback = feedbacks.find((u) => u.userId === user?.uid);

  useEffect(() => {
    if (!user || doneFeedback) return;

    const lastShown = localStorage.getItem("feedbackLastShown");

    if (lastShown && Date.now() - Number(lastShown) < feedbackCoolDown) {
      return;
    }

    const timer = setTimeout(() => {
      setIsOpen(true);

      localStorage.setItem("feedbackLastShown", Date.now().toString());
    }, feedbackDelay);

    return () => clearTimeout(timer);
  }, [user, doneFeedback]);

  if (doneFeedback || !user || !isOpen) return;

  return (
    <div className="fixed bottom-4 right-4 z-150 w-[320px]">
      <div className="relative overflow-hidden rounded-lg border border-panel bg-second shadow-xl">
        <div className="h-px w-full bg-accent" />
        <div className="p-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-vibe transition hover:bg-(--color-panel) hover:text-(--color-accent) shrink-0"
            >
              <MdClose className="text-xl" />
            </button>
          </div>

          <p className="text-base font-semibold text-header">
            What do you think of Nexus
          </p>
          <p className="text-sm leading-relaxed text-muted">
            You've been exploring Nexus. We'd love to hear what you think.
          </p>
          <RegularLinks
            href="/communityFeedback"
            onClick={() => setIsOpen(false)}
          >
            <p className="font-bold text-normal text-base">Share Feedback</p>
          </RegularLinks>
        </div>
      </div>
    </div>
  );
}
