"use client";
import { TitleContext } from "@/context/titleContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FaAngleLeft, FaBoxOpen, FaSearch } from "react-icons/fa";
import SortableRank from "@/components/sortableRank";
import { DndContext, useDraggable, DragOverlay } from "@dnd-kit/core";
import Slot from "@/components/slot";
import Image from "next/image";
import { GiTrophy } from "react-icons/gi";
import RankLoader from "@/components/rankLoader";
import { MdSearchOff } from "react-icons/md";

export default function Rank() {
  const { titles } = useContext(TitleContext);
  const [items, setItems] = useState([]);
  const [slots, setSlots] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();

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
    unit.title.toLowerCase().includes(searchInput.toLowerCase())
  );

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
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-8">
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
    </div>
  );
}
