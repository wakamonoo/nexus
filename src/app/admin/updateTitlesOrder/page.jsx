"use client";
import { TitleContext } from "@/context/titleContext";
import { useContext, useEffect, useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import SortableItem from "@/components/dnd/sortableItem";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { MdAutorenew, MdUpdate } from "react-icons/md";
import Swal from "sweetalert2";
import { LoaderContext } from "@/context/loaderContext";
import AdminGuard from "@/components/guard/adminGuard";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export default function UpdateOrder() {
  const { titles } = useContext(TitleContext);
  const [items, setItems] = useState([]);
  const [rotate, setRotate] = useState(false);
  const { setIsLoading } = useContext(LoaderContext);
  const router = useRouter();

  useEffect(() => {
    if (titles && titles.length > 0) {
      const sorted = [...titles].sort((a, b) => a.order - b.order);
      setItems(sorted);
    }
  }, [titles]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((items) => items.titleId === active.id);
    const newIndex = items.findIndex((items) => items.titleId === over.id);

    const newItems = arrayMove(items, oldIndex, newIndex).map(
      (item, index) => ({
        ...item,
        order: index + 1,
      })
    );

    setItems(newItems);
  };

  const handleUpdateOrder = async () => {
    setRotate(true);
    setIsLoading(true);
    try {
      await fetch(`${BASE_URL}/api/titles/updateOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          updates: items.map((item) => ({
            titleId: item.titleId,
            order: item.order,
          })),
        }),
      });
    } catch (err) {
      console.error("failed to update order", err);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Update failed!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-accent)",
        customClass: {
          popup:
            "max-w-xs w-full border-1 border-[var(--color-panel)] text-normal rounded-lg shadow-lg p-4",
          title: "text-lg font-bold !text-[var(--color-accent)]",
        },
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setRotate(false);
      }, 1500);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "MCU choronological order updated",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-hulk)",
        customClass: {
          popup:
            "max-w-xs w-full border-1 border-[var(--color-panel)] text-normal rounded-lg shadow-lg p-4",
          title: "text-lg font-bold !text-[var(--color-hulk)]",
        },
      });
    }
  };

  return (
    <AdminGuard>
      <div className="p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
        <div className="flex justify-between items-center">
          <FaAngleLeft
            onClick={() => router.back()}
            className="text-2xl cursor-pointer"
            title="Back"
          />
          <h1 className="text-xl">Update Order</h1>
          <div>
            <button
              onClick={handleUpdateOrder}
              className={`cursor-pointer transition-transform duration-500 ${
                rotate ? "rotate-720" : ""
              }`}
              title="Sync"
            >
              <MdAutorenew className="text-2xl" />
            </button>
          </div>
        </div>

        <div className="w-full py-4">
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items.map((t) => t.titleId)}>
              <div className="flex flex-wrap justify-center gap-2">
                {items.map((unit) => (
                  <SortableItem
                    key={unit.titleId}
                    id={unit.titleId}
                    image={unit.image}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </AdminGuard>
  );
}
