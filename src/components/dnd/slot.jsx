"use client";
import { useDroppable } from "@dnd-kit/core";

export default function Slot({ id, children }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`w-26 h-40 md:w-32 md:h-46 border-1 border-dashed rounded flex justify-center items-center ${
        isOver ? "border-accent bg-[var(--color-accent)]/20" : ""
      }`}
    >
      {children}
    </div>
  );
}
