"use client";
import AddMomenttModal from "@/components/modals/addMomentModal";
import { TitleContext } from "@/context/titleContext";
import { UserContext } from "@/context/userContext";
import { useContext, useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { RiArrowLeftWideFill, RiArrowRightWideFill } from "react-icons/ri";
import Avatar from "@/assets/defaultAvatar.png";
import MomentLightbox from "@/components/lightBoxes/momentLightbox";
import MomentLoader from "@/components/loaders/momentLoader";
import { FaDiamond } from "react-icons/fa6";
import { MomentContext } from "@/context/momentContext";
import { FiAperture, FiCamera, FiCopy, FiStar } from "react-icons/fi";
import { TbSparkles } from "react-icons/tb";

export default function Moments() {
  const { user, allUsers, allUsersLoading } = useContext(UserContext);
  const { moments, momentLoading } = useContext(MomentContext);
  const { titles } = useContext(TitleContext);
  const [showAddMomentModal, setShowAddMomentModal] = useState(false);
  const [showMomentLightbox, setShowMomentLightbox] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const [selectedMoment, setSelectedMoment] = useState(null);
  const [canScroll, setCanScroll] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const current = scrollRef.current;
    if (!current) return;

    const handleScroll = () => {
      setIsScrolled(current.scrollLeft > 0);
    };

    current.addEventListener("scroll", handleScroll);
    return () => {
      current.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkOverflow = () => {
      setCanScroll(el.scrollWidth > el.clientWidth);
    };

    checkOverflow();

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [moments]);

  return (
    <>
      <div className="mt-2 w-full">
        <div className="flex items-center gap-2 pb-2">
          <p className="text-base font-bold text-vibe opacity-60">Moments</p>
          <div className="flex-1 border-t-2 border-panel" />
        </div>
        <div
          className="relative"
          onMouseEnter={() => setShowArrows(true)}
          onMouseLeave={() => setShowArrows(false)}
        >
          <div
            className={`pointer-events-none absolute z-40 top-0 left-0 w-16 h-full bg-linear-to-r from-(--color-bg)/80  ${
              showArrows && isScrolled && canScroll
                ? "opacity-100"
                : "opacity-0"
            }`}
          />
          <div
            className={`pointer-events-none absolute z-40 top-0 right-0 w-16 h-full bg-linear-to-l from-(--color-bg)/80 ${
              showArrows && canScroll ? "opacity-100" : "opacity-0"
            }`}
          />

          {showArrows && isScrolled && canScroll && (
            <button
              onClick={handleScrollLeft}
              className="cursor-pointer absolute z-50 top-1/2 -translate-y-1/2 left-1"
            >
              <RiArrowLeftWideFill className="text-2xl" />
            </button>
          )}
          {showArrows && canScroll && (
            <button
              onClick={handleScrollRight}
              className="cursor-pointer absolute z-50 top-1/2 -translate-y-1/2 right-1"
            >
              <RiArrowRightWideFill className="text-2xl" />
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide"
          >
            {user && (
              <div
                onClick={() => setShowAddMomentModal(true)}
                className="cursor-pointer group relative w-28 h-40 md:w-35 md:h-49 rounded bg-panel overflow-hidden shrink-0 text-left transition-transform duration-200 hover:scale-[1.02] active:scale-[1.02]"
              >
                <div className="absolute inset-0">
                  <img
                    src={user?.picture || Avatar.src}
                    alt={user?.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover opacity-20 transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="bg-accent rounded-full p-2 transition-transform duration-200 group-hover:scale-110 group-active:scale-110">
                    <FaPlus className="text-2xl shrink-0" />
                  </div>
                  <p className="mt-4 text-sm font-bold text-vibe">Add Moment</p>
                  <p className="px-2 text-center text-xs text-vibe opacity-60">
                    Share what you're watching
                  </p>
                </div>
              </div>
            )}
            <div className="flex gap-2 w-full">
              {momentLoading || allUsersLoading ? (
                <>
                  <MomentLoader />
                  <MomentLoader />
                  <MomentLoader />
                  <MomentLoader />
                  <MomentLoader />
                  <MomentLoader />
                </>
              ) : moments.length === 0 ? (
                <div className="flex gap-2">
                  <div className="relative w-28 h-40 md:w-35 md:h-49 rounded bg-(--color-panel)/40 border border-panel shrink-0 flex flex-col gap-4 items-center justify-center p-4">
                    <FiCamera className="text-4xl text-vibe opacity-10" />
                    <div className="flex flex-col items-center">
                      <p className="text-xs font-bold text-vibe leading-2.5 text-center">
                        Your next moment
                      </p>
                      <span className="text-xs text-center leading-2.5 text-vibe opacity-60">
                        Waiting to be captured
                      </span>
                    </div>
                  </div>
                  <div className="relative w-28 h-40 md:w-35 md:h-49 rounded bg-(--color-panel)/40 border border-panel shrink-0 flex flex-col gap-4 items-center justify-center p-4">
                    <FiCopy className="text-4xl text-vibe opacity-10" />
                    <div className="flex flex-col items-center">
                      <p className="text-xs font-bold text-vibe leading-2.5 text-center">
                        Capture a scene
                      </p>
                      <span className="text-xs text-center leading-2.5 text-vibe opacity-60">
                        Worth remembering
                      </span>
                    </div>
                  </div>
                  <div className="relative w-28 h-40 md:w-35 md:h-49 rounded bg-(--color-panel)/40 border border-panel shrink-0 flex flex-col gap-4 items-center justify-center p-4">
                    <FiAperture className="text-4xl text-vibe opacity-10" />
                    <div className="flex flex-col items-center">
                      <p className="text-xs font-bold text-vibe leading-2.5 text-center">
                        Small moments
                      </p>
                      <span className="text-xs text-center leading-2.5 text-vibe opacity-60">
                        Big memories
                      </span>
                    </div>
                  </div>
                  <div className="relative w-28 h-40 md:w-35 md:h-49 rounded bg-(--color-panel)/40 border border-panel shrink-0 flex flex-col gap-4 items-center justify-center p-4">
                    <TbSparkles className="text-4xl text-vibe opacity-10" />
                    <div className="flex flex-col items-center">
                      <p className="text-xs font-bold text-vibe leading-2.5 text-center">
                        More moments
                      </p>
                      <span className="text-xs text-center leading-2.5 text-vibe opacity-60">
                        Coming your way
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                moments?.map((moment) => {
                  const owner = allUsers.find((u) => u.uid === moment?.userId);
                  const title = titles.find(
                    (t) => t.titleId === moment?.titleId,
                  );

                  return (
                    <div
                      key={moment?.momentId}
                      onClick={() => {
                        setSelectedMoment({
                          moment,
                          owner,
                          title,
                        });
                        setShowMomentLightbox(true);
                      }}
                      className="group relative cursor-pointer w-28 h-40 md:w-35 md:h-49 rounded bg-panel overflow-hidden shrink-0"
                    >
                      <img
                        src={moment?.image}
                        alt="Moment Image"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105 group-active:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute top-2 left-2 right-2 flex items-center gap-1">
                        <div className="h-6 w-6 overflow-hidden rounded-full border border-accent shrink-0">
                          <img
                            src={owner?.picture || Avatar.src}
                            alt="user"
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-xs font-semibold truncate min-w-0">
                          {owner?.name}
                        </p>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-xs font-medium uppercase tracking-wide leading-2 text-vibe opacity-60">
                          Watching
                        </p>
                        <p className="truncate text-sm font-bold">
                          {title?.title}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
      {showAddMomentModal && (
        <AddMomenttModal setShowAddMomentModal={setShowAddMomentModal} />
      )}
      {showMomentLightbox && (
        <MomentLightbox
          setShowMomentLightbox={setShowMomentLightbox}
          moment={selectedMoment.moment}
          owner={selectedMoment.owner}
          title={selectedMoment.title}
        />
      )}
    </>
  );
}
