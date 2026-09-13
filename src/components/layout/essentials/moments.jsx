"use client";
import AddMomenttModal from "@/components/modals/addMomentModal";
import { TitleContext } from "@/context/titleContext";
import { UserContext } from "@/context/userContext";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { FaPlus, FaRegFileAlt } from "react-icons/fa";
import { RiArrowLeftWideFill, RiArrowRightWideFill } from "react-icons/ri";
import Avatar from "@/assets/defaultAvatar.png";
import MomentLightbox from "@/components/lightBoxes/momentLightbox";
import MomentLoader from "@/components/loaders/momentLoader";
import { FaDiamond } from "react-icons/fa6";
import { MomentContext } from "@/context/momentContext";

export default function Moments() {
  const { user, allUsers, allUsersLoading } = useContext(UserContext);
  const { moments, momentLoading } = useContext(MomentContext);
  const { titles } = useContext(TitleContext);
  const [showAddMomentModal, setShowAddMomentModal] = useState(false);
  const [showMomentLightbox, setShowMomentLightbox] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const [selectedMoment, setSelectedMoment] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const current = scrollRef.current;
    if (!current) return;

    const handleScroll = () => {
      setIsScrolled(current.scrollLeft > 50);
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
            className={`pointer-events-none absolute z-40 top-0 left-0 w-16 h-full bg-gradient-to-r from-[var(--color-bg)]/80  ${
              showArrows && isScrolled ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            className={`pointer-events-none absolute z-40 top-0 right-0 w-16 h-full bg-gradient-to-l from-[var(--color-bg)]/80 ${
              showArrows ? "opacity-100" : "opacity-0"
            }`}
          />

          {showArrows && isScrolled && (
            <button
              onClick={handleScrollLeft}
              className="cursor-pointer absolute z-50 top-1/2 -translate-y-1/2 left-1"
            >
              <RiArrowLeftWideFill className="text-2xl" />
            </button>
          )}
          {showArrows && moments && (
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

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
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="relative w-28 h-40 md:w-35 md:h-49 rounded bg-[var(--color-panel)]/40 border border-panel shrink-0 flex items-center justify-center"
                    >
                      <FaDiamond className="text-xl text-vibe opacity-10" />
                    </div>
                  ))}
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
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
                        <p className="text-xs font-semibold truncate min-w-0">{owner?.name}</p>
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
