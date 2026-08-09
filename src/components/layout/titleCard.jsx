import { UserContext } from "@/context/userContext";
import { WatchContext } from "@/context/watchContext";
import { useContext, useEffect, useRef, useState } from "react";
import { FaEye, FaEyeSlash, FaRegEyeSlash } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import { MdOutlineReviews } from "react-icons/md";
import AddReview from "../modals/addReview";
import { GiTrophy } from "react-icons/gi";

export default function TitleCard({
  unit,
  isWatched,
  onOpen,
  continuum,
  goat,
  popular,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const { handleWatch } = useContext(WatchContext);
  const [showAddReview, setShowAddReview] = useState(false);
  const { user, setShowSignIn } = useContext(UserContext);
  const timer = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const doneReview = unit?.reviews?.some(
    (review) => review.userId === user?.uid,
  );

  const mcu = unit.category === "mcu";
  const legacy = unit.category === "legacy";

  return (
    <>
      <div
        onClick={onOpen}
        ref={cardRef}
        onMouseEnter={() => setShowMenu(true)}
        onMouseLeave={() => setShowMenu(false)}
        onTouchStart={() => {
          timer.current = setTimeout(() => {
            setShowMenu(true);
          }, 500);
        }}
        onTouchEnd={() => clearTimeout(timer.current)}
        onTouchCancel={() => clearTimeout(timer.current)}
        className="w-26 h-40 md:w-32 md:h-46 flex-shrink-0 cursor-pointer relative"
      >
        {showMenu && unit.status !== "upcoming" && (
          <div className="absolute inset-0 flex items-end justify-end z-10 bg-[var(--color-secondary)]/50">
            <div className="flex gap-3 px-4 py-2 mb-1 bg-[var(--color-panel)]/95 rounded-tl-2xl rounded-bl-2xl">
              {isWatched ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!user) {
                      setShowSignIn(true);
                      return;
                    } else {
                      handleWatch(unit.titleId);
                    }
                  }}
                  className="cursor-pointer transition-all transform duration-200 hover:scale-125"
                >
                  <FaEyeSlash className="text-base text-[var(--color-hulk)]" />
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!user) {
                      setShowSignIn(true);
                      return;
                    } else {
                      handleWatch(unit.titleId);
                    }
                  }}
                  className="cursor-pointer transition-all transform duration-200 hover:scale-125"
                >
                  <FaEye className="text-base" />
                </button>
              )}
              {doneReview ? (
                <button>
                  <FiCheckCircle className="text-base text-zeus" />
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!user) {
                      setShowSignIn(true);
                      return;
                    } else {
                      setShowAddReview(true);
                    }
                  }}
                  className="cursor-pointer transition-all transform duration-200 hover:scale-125"
                >
                  <MdOutlineReviews className="text-base" />
                </button>
              )}
            </div>
          </div>
        )}
        <img
          src={
            unit.poster
              ? `https://image.tmdb.org/t/p/w500${unit.poster}`
              : "/fallback.png"
          }
          alt={unit.title}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-fill rounded ${
            isWatched ? "grayscale-0" : "grayscale-90"
          }`}
        />
        {continuum && (
          <div
            className={`absolute opacity-80 top-0 right-1 p-2 h-4 w-8 flex items-center justify-center rounded-b-full ${
              mcu
                ? "bg-accent"
                : legacy
                  ? "bg-hulk"
                  : "bg-[var(--color-infinity)]"
            }`}
          />
        )}
        {(goat || popular) && (
          <div
            className={`absolute opacity-80 top-0 right-1 p-2 h-8 w-6 flex items-center justify-center rounded-bl-2xl rounded-br-2xl ${
              unit.rank === 1 ? "bg-hulk" : "bg-accent"
            }`}
          >
            <p
              className={`font-bold text-sm ${
                unit.rank === 1 ? "text-zeus" : "text-normal"
              }`}
            >
              {unit.rank === 1 ? <GiTrophy /> : unit.rank}
            </p>
          </div>
        )}
      </div>
      {showAddReview && (
        <AddReview
          setShowAddReview={setShowAddReview}
          titleId={unit.titleId}
          title={unit}
        />
      )}
    </>
  );
}
