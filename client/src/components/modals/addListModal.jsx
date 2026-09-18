"use client";
import { useContext, useEffect, useState } from "react";
import { MdClose, MdSearchOff } from "react-icons/md";
import { TitleContext } from "@/context/titleContext";
import { IoRadioButtonOff, IoRadioButtonOn } from "react-icons/io5";
import { UserContext } from "@/context/userContext";
import CircledButtons from "../buttons/circledBtns";
import Loader from "@/components/loaders/searchLoader";
import TitleCard from "../layout/title/titleCard";
import { LoaderContext } from "@/context/loaderContext";
import Swal from "sweetalert2";
import RegularButtons from "../buttons/regBtns";
import { ListContext } from "@/context/listContext";
import FinalizeListOrderModal from "./finalizeListOrderModal";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

const SelectionCard = ({
  title,
  selectedItem,
  isSelected,
  selectedIndex,
  setSelected,
}) => {
  return (
    <div
      onClick={() => {
        setSelected((prev) => {
          const exists = prev.some((item) => item.titleId === title.titleId);

          if (exists) {
            return prev.filter((item) => item.titleId !== title.titleId);
          }

          return [
            ...prev,
            {
              titleId: title.titleId,
              note: "",
            },
          ];
        });
      }}
      className={`flex gap-4 items-start cursor-pointer px-2 py-4 border rounded-lg  ${isSelected ? "border-(--color-accent) bg-accent/10" : "border-(--color-panel) hover:bg-(--color-panel) focus:bg-(--color-panel)"}`}
    >
      {isSelected ? (
        <IoRadioButtonOn className="text-xl text-zeus mt-2 shrink-0" />
      ) : (
        <IoRadioButtonOff className="text-xl text-zeus mt-2 shrink-0" />
      )}
      <div className="relative shrink-0 w-26 h-40">
        <img
          src={
            title.poster
              ? `https://image.tmdb.org/t/p/w500${title.poster}`
              : "/fallback.png"
          }
          alt={title.title}
          loading="lazy"
          decoding="async"
          className="object-fill rounded"
        />
        {isSelected && (
          <div className="absolute opacity-80 -top-2 -right-2 p-2 h-8 w-8 flex items-center justify-center rounded-full bg-accent">
            <p className="font-bold text-lg">{selectedIndex + 1}</p>
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        <p className="text-sm line-clamp-2">{title.title} </p>
        <div className="flex items-center gap-2 my-2 text-xs opacity-60">
          <span>
            {new Date(
              title.release_date ? title.release_date : title.first_air_date,
            ).toLocaleDateString([], {
              year: "numeric",
            })}
          </span>
          <span>•</span>
          <span className="uppercase">{title.category}</span>
        </div>
        {isSelected && (
          <input
            type="text"
            onClick={(e) => e.stopPropagation()}
            value={selectedItem.note}
            onChange={(e) => {
              setSelected((prev) =>
                prev.map((item) =>
                  item.titleId === title.titleId
                    ? { ...item, note: e.target.value }
                    : item,
                ),
              );
            }}
            placeholder="add note..."
            className="bg-panel p-2 rounded w-full outline-none text-base text-normal"
          />
        )}
      </div>
    </div>
  );
};

export default function AddListModal({ user, setShowAddListModal }) {
  const { titles } = useContext(TitleContext);
  const [listTitle, setListTitle] = useState("");
  const [listDescription, setListDescription] = useState("");
  const [selected, setSelected] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setIsLoading } = useContext(LoaderContext);
  const { setLists } = useContext(ListContext);
  const [showFinalizeListOrderModal, setShowFinalizeListOrderModal] =
    useState(false);

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
          titles: selected.map((item, index) => ({
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
      setShowAddListModal(false);
    }
  };

  const handleTitleSearch = async () => {
    if (!searchInput) return setSearchResults([]);
    try {
      setLoading(true);
      const res = await fetch(
        `${BASE_URL}/api/titles/titleGet?query=${encodeURIComponent(
          searchInput,
        )}`,
      );
      const data = await res.json();
      setSearchResults(data.result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchInput) {
      setSearchResults([]);
      return;
    }

    const debounce = setTimeout(() => {
      handleTitleSearch();
    }, 300);

    return () => {
      clearTimeout(debounce);
    };
  }, [searchInput]);

  return (
    <>
      <div
        onClick={() => setShowAddListModal(false)}
        className="fixed inset-0 z-150 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative flex flex-col w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-panel bg-second shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-panel p-4">
            <h1 className="text-base font-bold text-normal">Create a list</h1>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAddListModal(false);
              }}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-vibe transition hover:bg-(--color-panel) hover:text-(--color-accent) shrink-0"
            >
              <MdClose className="text-xl" />
            </button>
          </div>
          <div className="p-4 flex-1 overflow-y-auto custom-scroll">
            <div className="py-2 w-full">
              <h4>Give your list a name</h4>
              <input
                type="text"
                value={listTitle}
                onChange={(e) => setListTitle(e.target.value)}
                placeholder="e.g. Doomsday prep"
                className="bg-panel p-2 rounded w-full outline-none text-base text-normal"
              />
            </div>
            <div className="py-2 w-full">
              <h4>Description</h4>
              <input
                type="text"
                value={listDescription}
                onChange={(e) => setListDescription(e.target.value)}
                placeholder="Titles to watch before Avengers: Doomsday"
                className="bg-panel p-2 rounded w-full outline-none text-base text-normal"
              />
            </div>
            <h4>Add titles</h4>
            <div className="flex w-full justify-between items-center gap-2 bg-panel px-4 py-2 rounded-full">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search title"
                className="w-full outline-none text-base text-normal"
              />
            </div>
            {loading ? (
              <Loader />
            ) : searchResults.length > 0 ? (
              <div>
                <div className="px-4 py-8">
                  <p className="text-sm text-vibe w-full line-clamp-1">
                    Search results for{" "}
                    <span className="font-bold">"{searchInput}"</span>
                  </p>
                </div>
                <div>
                  <div className="mt-4 flex flex-col gap-2 ">
                    {searchResults
                      .sort((a, b) => {
                        const dateA =
                          a.mediaType === "tv"
                            ? a.first_air_date
                            : a.release_date;

                        const dateB =
                          b.mediaType === "tv"
                            ? b.first_air_date
                            : b.release_date;

                        return new Date(dateA) - new Date(dateB);
                      })
                      .map((title) => {
                        const selectedItem = selected.find(
                          (item) => item.titleId === title.titleId,
                        );
                        const isSelected = !!selectedItem;
                        const selectedIndex = selected.findIndex(
                          (item) => item.titleId === title.titleId,
                        );
                        return (
                          <SelectionCard
                            key={title.titleId}
                            title={title}
                            selectedItem={selectedItem}
                            isSelected={isSelected}
                            selectedIndex={selectedIndex}
                            setSelected={setSelected}
                          />
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : searchInput ? (
              <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex flex-col items-center justify-center">
                  <MdSearchOff className="text-4xl text-vibe opacity-40" />
                  <p className="text-xs text-vibe opacity-40">
                    No results for{" "}
                    <span className="font-bold">{searchInput}</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-2 ">
                {titles
                  .sort((a, b) => {
                    const dateA =
                      a.mediaType === "tv" ? a.first_air_date : a.release_date;

                    const dateB =
                      b.mediaType === "tv" ? b.first_air_date : b.release_date;

                    return new Date(dateA) - new Date(dateB);
                  })
                  .map((title) => {
                    const selectedItem = selected.find(
                      (item) => item.titleId === title.titleId,
                    );
                    const isSelected = !!selectedItem;
                    const selectedIndex = selected.findIndex(
                      (item) => item.titleId === title.titleId,
                    );
                    return (
                      <SelectionCard
                        key={title.titleId}
                        title={title}
                        selectedItem={selectedItem}
                        isSelected={isSelected}
                        selectedIndex={selectedIndex}
                        setSelected={setSelected}
                      />
                    );
                  })}
              </div>
            )}
          </div>
          <div className="flex flex-col md:flex-row md:gap-2 border-t border-panel p-4">
            <RegularButtons
              onClick={() => {
                setShowFinalizeListOrderModal(true);
              }}
              disabled={!listTitle.trim() || selected.length === 0}
            >
              <p className="font-bold text-normal text-base">Finalize Order</p>
            </RegularButtons>
            <RegularButtons
              onClick={handleSubmitList}
              disabled={!listTitle.trim() || selected.length === 0}
            >
              <p className="font-bold text-normal text-base">Submit List</p>
            </RegularButtons>
          </div>
        </div>
      </div>
      {showFinalizeListOrderModal && (
        <FinalizeListOrderModal
          mode="add"
          user={user}
          selected={selected}
          listTitle={listTitle}
          listDescription={listDescription}
          setShowFinalizeListOrderModal={setShowFinalizeListOrderModal}
          setShowAddListModal={setShowAddListModal}
        />
      )}
    </>
  );
}
