"use client";
import { TitleContext } from "@/context/titleContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import {
  FaAngleLeft,
  FaBoxOpen,
  FaCaretLeft,
  FaCaretRight,
  FaRegSave,
  FaSearch,
} from "react-icons/fa";
import { BiReset } from "react-icons/bi";
import SortableRank from "@/components/sortableRank";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import Slot from "@/components/slot";
import Image from "next/image";
import { GiTrophy } from "react-icons/gi";
import RankLoader from "@/components/rankLoader";
import { MdSearchOff } from "react-icons/md";
import { UserContext } from "@/context/userContext";
import Swal from "sweetalert2";
import { LoaderContext } from "@/context/loaderContext";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export default function Rank() {
  const { titles } = useContext(TitleContext);
  const { user, setShowSignIn } = useContext(UserContext);
  const { setIsLoading } = useContext(LoaderContext);
  const [items, setItems] = useState([]);
  const [slots, setSlots] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (titles && titles.length > 0) {
      const sorted = [...titles].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setItems(sorted);
    }
  }, [titles]);

  const handleDragEnd = ({ active, over }) => {
    setDraggedItem(null);

    if (!over) return;
    const draggedItemIndex = items.findIndex((i) => i.titleId === active.id);
    if (draggedItemIndex === -1) return;

    const dragged = items[draggedItemIndex];

    const previous = slots[over.id];
    setSlots((prev) => ({
      ...prev,
      [over.id]: dragged,
    }));

    setItems((prev) => {
      const filtered = prev.filter((i) => i.titleId !== active.id);
      return previous ? [...filtered, previous] : filtered;
    });
  };

  const filteredItems = items.filter((unit) =>
    unit.title?.toLowerCase().includes(searchInput.toLowerCase())
  );

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

  const buildRankings = () => {
    return Object.keys(slots)
      .map((slotId, index) => {
        const item = slots[slotId];
        if (!items) return null;

        const slotNumber = parseInt(slotId.split("-")[1], 10);

        return {
          titleId: item.titleId,
          poster: item.image,
          rank: slotNumber,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.rank - b.rank);
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const rankings = buildRankings();

      if (rankings.length === 0) {
        Swal.fire({
          title: "Oops",
          text: "Atleast rank 1 before saving",
          icon: "warning",
          timer: 2000,
          showConfirmButton: false,
          background: "var(--color-text)",
          color: "var(--color-bg)",
          iconColor: "var(--color-zeus)",
          customClass: {
            popup: "rounded-2xl shadow-lg",
            title: "text-lg font-bold !text-[var(--color-zeus)]",
            htmlContainer: "text-sm",
          },
        });
        return;
      }
      await fetch(`${BASE_URL}/api/rankings/saveRanking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          rankings,
        }),
      });

      Swal.fire({
        title: "Success",
        text: "Your ranking was saved!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-text)",
        color: "var(--color-bg)",
        iconColor: "var(--color-hulk)",
        customClass: {
          popup: "rounded-2xl shadow-lg",
          title: "text-lg font-bold !text-[var(--color-hulk)]",
          htmlContainer: "text-sm",
        },
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Ranking not saved, try again later!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-text)",
        color: "var(--color-bg)",
        iconColor: "var(--color-accent)",
        customClass: {
          popup: "rounded-2xl shadow-lg",
          title: "text-lg font-bold !text-[var(--color-accent)]",
          htmlContainer: "text-sm",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.uid) return;

    const restoredSlots = {};
    user.rankings?.forEach((r) => {
      restoredSlots[`slot-${r.rank}`] = {
        titleId: r.titleId,
        image: r.poster,
      };
    });

    setSlots(restoredSlots);

    setItems((prev) =>
      prev.filter((i) => !user.rankings?.some((r) => r.titleId === i.titleId))
    );
  }, [user]);

  return (
    <div className="p-2 bg-brand">
      <div className="flex justify-between py-4">
        <FaAngleLeft
          onClick={() => router.back()}
          className="text-2xl cursor-pointer"
        />
        <h4 className="text-2xl">RANK'EM</h4>
      </div>
      <div className="flex justify-between items-center gap-2 bg-text px-4 py-2 rounded-full">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for your favorite marvel titles.."
          className="w-full p-2 outline-none text-base text-panel"
        />
        <button>
          <FaSearch className="text-2xl text-accent" />
        </button>
      </div>
      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={({ active }) => {
          const item = items.find((i) => i.titleId === active.id);
          setDraggedItem(item || null);
        }}
        onDragCancel={() => setDraggedItem(null)}
      >
        <div className="relative">
          <button
            onClick={handleScrollLeft}
            className={`absolute left-1 top-1/2 p-1 bg-accent rounded-full opacity-70 cursor-pointer ${
              titles.length === 0 || filteredItems.length < 5
                ? "hidden"
                : "block"
            }`}
          >
            <FaCaretLeft />
          </button>
          <button
            onClick={handleScrollRight}
            className={`absolute right-1 top-1/2 p-1 bg-accent rounded-full opacity-70 cursor-pointer ${
              titles.length === 0 || filteredItems.length < 5
                ? "hidden"
                : "block"
            }`}
          >
            <FaCaretRight />
          </button>
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide mt-8"
          >
            {titles.length > 0 ? (
              filteredItems.length > 0 ? (
                filteredItems.map((unit) => (
                  <SortableRank
                    key={unit.titleId}
                    id={unit.titleId}
                    image={unit.image}
                  />
                ))
              ) : searchInput ? (
                <div className="py-4 w-full flex justify-center">
                  <div className="flex items-center gap-1">
                    <MdSearchOff className="text-2xl text-vibe" />
                    <p className="text-normal text-vibe">
                      No search results for{" "}
                      <span className="font-bold">{searchInput}</span>
                    </p>
                  </div>
                </div>
              ) : null
            ) : (
              <RankLoader />
            )}
          </div>
        </div>
        <div>
          <div className="py-4">
            <div className="flex w-full bg-second justify-center p-2">
              <p className="font-bold text-base text-normal uppercase">
                Who is your uno?
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {Array.from({ length: 15 }).map((_, index) => {
              const slotId = `slot-${index + 1}`;
              return (
                <Slot key={slotId} id={slotId}>
                  {slots[slotId] ? (
                    <Image
                      src={slots[slotId].image}
                      alt="image"
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-full h-full object-fill rounded"
                    />
                  ) : (
                    <p className="text-5xl text-vibe opacity-25">
                      {index === 0 ? <GiTrophy /> : index + 1}
                    </p>
                  )}
                </Slot>
              );
            })}
          </div>
        </div>
        <DragOverlay>
          {draggedItem ? (
            <div className="w-26 h-40 flex-shrink-0 cursor-pointer">
              <Image
                src={draggedItem.image}
                alt="image"
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-full object-fill rounded"
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <div className="py-4 flex flex-col gap-2 justify-center items-center">
        <button
          onClick={() => {
            setSlots({});
            setItems(
              [...titles].sort((a, b) => new Date(b.date) - new Date(a.date))
            );
          }}
          className="cursor-pointer bg-accent w-full p-2 rounded flex justify-center items-center gap-1"
        >
          <BiReset className="text-2xl" />
          <p className="text-base text-normal font-bold">Reset Ranking</p>
        </button>
        <button
          onClick={() => {
            user ? handleSave() : setShowSignIn(true);
          }}
          className="cursor-pointer bg-accent w-full p-2 rounded flex justify-center items-center gap-1"
        >
          <FaRegSave className="text-2xl" />
          <p className="text-base text-normal font-bold">Save Rankings</p>
        </button>
      </div>
    </div>
  );
}
