"use client";
import { useContext, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { TitleContext } from "@/context/titleContext";
import { LoaderContext } from "@/context/loaderContext";
import Swal from "sweetalert2";
import RegularButtons from "../buttons/regBtns";
import { ListContext } from "@/context/listContext";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import SortableList from "../dnd/sortableList";
import { RiArrowDownWideFill, RiArrowUpWideFill } from "react-icons/ri";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export default function FinalizeListOrderModal({
  mode,
  user,
  selected,
  list,
  listTitle,
  listDescription,
  setShowFinalizeListOrderModal,
  setShowAddListModal,
  setShowEditListModal,
}) {
  const { titles } = useContext(TitleContext);
  const { setIsLoading } = useContext(LoaderContext);
  const [items, setItems] = useState(() => selected);
  const { setLists } = useContext(ListContext);
  const scrollRef = useRef(null);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((items) => items.titleId === active.id);
    const newIndex = items.findIndex((items) => items.titleId === over.id);

    setItems(arrayMove(items, oldIndex, newIndex));
  };

  const handleSubmitList = async () => {
    try {
      setIsLoading(true);

      const res = await fetch(`${BASE_URL}/api/lists/addlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          listTitle,
          listDescription,
          titles: items.map((item, index) => ({
            titleId: item.titleId,
            note: item.note,
            order: index + 1,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error("failed to create list");
      }

      const data = await res.json();

      setLists((prev) => [data.list, ...prev]);

      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "List succesfully created!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-hulk)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border !border-(--color-panel) !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title:
            "!text-base !font-semibold !text-(--color-text) !leading-4.5",
        },
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Failed creating list!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-accent)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border !border-(--color-panel) !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title:
            "!text-base !font-semibold !text-(--color-text) !leading-4.5",
        },
      });
    } finally {
      setIsLoading(false);
      setShowFinalizeListOrderModal(false);
      setShowAddListModal(false);
    }
  };

  const handleUpdateList = async () => {
    try {
      setIsLoading(true);

      await fetch(`${BASE_URL}/api/lists/updateList/${list.listId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listTitle,
          listDescription,
          titles: items.map((item, index) => ({
            titleId: item.titleId,
            note: item.note,
            order: index + 1,
          })),
        }),
      });

      setLists((prev) =>
        prev.map((item) =>
          item.listId == list.listId
            ? {
                ...item,
                listTitle,
                listDescription,
                titles: items.map((item, index) => ({
                  titleId: item.titleId,
                  note: item.note,
                  order: index + 1,
                })),
                updatedAt: new Date(),
              }
            : item,
        ),
      );

      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "List succesfully updated!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-hulk)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border !border-(--color-panel) !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title:
            "!text-base !font-semibold !text-(--color-text) !leading-4.5",
        },
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Failed updating list!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-accent)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border !border-(--color-panel) !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title:
            "!text-base !font-semibold !text-(--color-text) !leading-4.5",
        },
      });
    } finally {
      setIsLoading(false);
      setShowFinalizeListOrderModal(false);
      setShowEditListModal(false);
    }
  };

  const handleScrollUp = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        top: -200,
        behavior: "smooth",
      });
    }
  };

  const handleScrollDown = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        top: 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div
        onClick={() => setShowFinalizeListOrderModal(false)}
        className="fixed inset-0 z-150 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative flex flex-col w-full max-w-2xl h-[90vh] overflow-hidden rounded-2xl border border-panel bg-second shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-panel p-4">
            <h1 className="text-base font-bold text-normal">Finalize order</h1>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowFinalizeListOrderModal(false);
              }}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-vibe transition hover:bg-(--color-panel) hover:text-(--color-accent) shrink-0"
            >
              <MdClose className="text-xl" />
            </button>
          </div>
          <div className="flex-1 relative min-h-0">
            <div
              ref={scrollRef}
              className="p-4 h-full overflow-y-auto custom-scroll"
            >
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={items.map((item) => item.titleId)}>
                  <div className="flex flex-col gap-2">
                    {items.map((item, index) => {
                      const title = titles.find(
                        (t) => t.titleId === item.titleId,
                      );

                      if (!title) return null;

                      return (
                        <SortableList
                          key={item.titleId}
                          item={item}
                          index={index}
                          title={title}
                        />
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
            <div className="absolute flex md:hidden flex-col p-2 bg-second border border-panel divide-y divide-(--color-panel) rounded right-6 bottom-4 shadow-2xl">
              <button
                onClick={handleScrollUp}
                className="cursor-pointer active:text-(--color-panel)"
              >
                <RiArrowUpWideFill className="text-2xl shrink-0" />
              </button>
              <button
                onClick={handleScrollDown}
                className="cursor-pointer active:text-(--color-panel)"
              >
                <RiArrowDownWideFill className="text-2xl shrink-0" />
              </button>
            </div>
          </div>

          <div className="flex border-t border-panel p-4">
            <RegularButtons
              onClick={() => {
                if (mode === "add") {
                  handleSubmitList();
                } else {
                  handleUpdateList();
                }
              }}
              disabled={!listTitle.trim() || items.length === 0}
            >
              <p className="font-bold text-normal text-base">
                {mode === "add" ? "Submit List" : "Update List"}
              </p>
            </RegularButtons>
          </div>
        </div>
      </div>
    </>
  );
}
