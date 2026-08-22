"use client";
import { useContext, useEffect, useState } from "react";
import { MdClose, MdSearchOff } from "react-icons/md";
import { HiOutlineSearch } from "react-icons/hi";
import GifLoader from "../loaders/gifLoader";
import Masonry from "react-masonry-css";
import { TitleContext } from "@/context/titleContext";
import { IoRadioButtonOff, IoRadioButtonOn } from "react-icons/io5";
import { UserContext } from "@/context/userContext";
import CircledButtons from "../buttons/circledBtns";
import Loader from "@/components/loaders/searchLoader";
import TitleCard from "../layout/title/titleCard";
import { LoaderContext } from "@/context/loaderContext";
import Swal from "sweetalert2";
import { ListContext } from "@/context/listContext";

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
      className={`flex gap-4 items-start cursor-pointer px-2 py-4 border rounded-lg  ${isSelected ? "border-[var(--color-accent)] bg-accent/10" : "border-[var(--color-panel)] hover:bg-[var(--color-panel)] focus:bg-[var(--color-panel)]"}`}
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

export default function EditList({ list, setShowEditListModal }) {
  const { setLists } = useContext(ListContext);
  const { titles } = useContext(TitleContext);
  const [listTitle, setListTitle] = useState(list?.listTitle || "");
  const [listDescription, setListDescription] = useState(
    list?.listDescription || "",
  );
  const [selected, setSelected] = useState(
    (list?.titles || []).map((item) => ({
      titleId: item.titleId,
      note: item.note || "",
    })),
  );
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setIsLoading } = useContext(LoaderContext);

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
          titles: selected.map((item, index) => ({
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
                titles: selected.map((item, index) => ({
                  titleId: item.titleId,
                  note: item.note,
                  order: index + 1,
                })),
                updatedAt: new Date(),
              }
            : item,
        ),
      );

      setShowEditListModal(false);

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
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title:
            "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
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
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title:
            "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
        },
      });
    } finally {
      setIsLoading(false);
      setShowEditListModal(false);
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
        onClick={() => setShowEditListModal(false)}
        className="inset-0 z-50 backdrop-blur-xs flex items-center justify-center fixed"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex relative justify-center bg-second border-1 border-panel w-[90%] md:w-[50%] h-[90vh] rounded-2xl overflow-hidden p-2"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowEditListModal(false);
            }}
            className="absolute cursor-pointer top-4 right-4 font-bold duration-200 hover:scale-110 active:scale-110"
          >
            <MdClose className="text-2xl" />
          </button>
          <div className="mt-10 flex flex-col w-full overflow-y-auto custom-scroll">
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
                onKeyDown={(e) => {
                  if ((e.key === "Enter") & !e.shiftKey) {
                    e.preventDefault();
                    handleTitleSearch();
                  }
                }}
                placeholder="Search title"
                className="w-full outline-none text-base text-normal"
              />
              <button onClick={handleTitleSearch} className="cursor-pointer">
                <HiOutlineSearch className="text-2xl text-normal" />
              </button>
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

            <div className="sticky bottom-2 mt-6">
              <CircledButtons
                onClick={handleUpdateList}
                disabled={!listTitle.trim() || selected.length === 0}
              >
                Update list
              </CircledButtons>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
