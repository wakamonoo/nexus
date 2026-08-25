"use client";
import { TitleContext } from "@/context/titleContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import ConfirmTitleDeleteModal from "@/components/modals/confirmTitleDeleteModal";
import AdminGuard from "@/components/guard/adminGuard";
import CircledButtons from "@/components/buttons/circledBtns";
import { HiOutlineSearch } from "react-icons/hi";
import { MdSearchOff } from "react-icons/md";
import Loader from "@/components/loaders/searchLoader";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export default function EditTitleMain() {
  const { titles } = useContext(TitleContext);
  const [showConfirmTitleDeleteModal, setShowConfirmTitleDeleteModal] = useState(false);
  const [selectedTitleId, setSelectedTitleId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const openDelModal = (titleId) => {
    setSelectedTitleId(titleId);
    setShowConfirmTitleDeleteModal(true);
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
      <AdminGuard>
        {showConfirmTitleDeleteModal && (
          <ConfirmTitleDeleteModal
            titleId={selectedTitleId}
            setShowConfirmTitleDeleteModal={setShowConfirmTitleDeleteModal}
          />
        )}
        <div className="p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
          <div className="flex justify-between items-center">
            <FaAngleLeft
              onClick={() => router.back()}
              className="text-2xl cursor-pointer"
              title="Back"
            />
            <h1 className="text-xl">Edit Titles</h1>
          </div>

          <div className="flex flex-1 items-center gap-2 bg-panel px-4 py-2 my-4 rounded-full">
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
              placeholder="Locate titles accross Marvel Sagas..."
              className="w-full outline-none text-base text-normal truncate"
            />
            <button onClick={handleTitleSearch} className="cursor-pointer">
              <HiOutlineSearch className="text-2xl text-normal" />
            </button>
          </div>
          {loading ? (
            <Loader />
          ) : searchResults.length > 0 ? (
            <div>
              <div className="p-2 py-2">
                <p className="text-sm text-vibe w-full line-clamp-1">
                  Search results for{" "}
                  <span className="font-bold">"{searchInput}"</span>
                </p>
              </div>
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 p-2">
                  {searchResults
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((title, index) => (
                      <div key={index} className="flex gap-4 items-center">
                        <img
                          src={
                            title.poster
                              ? `https://image.tmdb.org/t/p/w500${title.poster}`
                              : "/fallback.png"
                          }
                          alt={title.title}
                          loading="lazy"
                          decoding="async"
                          className="w-26 h-40 md:w-32 md:h-46 object-fill rounded"
                        />
                        <div className="w-full flex flex-col gap-2">
                          <h4 className="leading-3.5">{title.title}</h4>
                          <div className="flex flex-col gap-2 w-full">
                            <CircledButtons
                              onClick={() =>
                                router.push(
                                  `/admin/editTitles/${title.titleId}`,
                                )
                              }
                            >
                              <p className="font-bold text-normal text-base">
                                Edit title
                              </p>
                            </CircledButtons>
                            <CircledButtons
                              onClick={() => openDelModal(title.titleId)}
                              className="px-4 bg-accent rounded-2xl"
                            >
                              <p className="font-bold text-normal text-base">
                                Delete title
                              </p>
                            </CircledButtons>
                          </div>
                        </div>
                      </div>
                    ))}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 p-2">
              {titles.map((title, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <img
                    src={
                      title.poster
                        ? `https://image.tmdb.org/t/p/w500${title.poster}`
                        : "/fallback.png"
                    }
                    alt={title.title}
                    loading="lazy"
                    decoding="async"
                    className="w-26 h-40 md:w-32 md:h-46 object-fill rounded"
                  />
                  <div className="w-full flex flex-col gap-2">
                    <h4 className="leading-3.5">{title.title}</h4>
                    <div className="flex flex-col gap-2 w-full">
                      <CircledButtons
                        onClick={() =>
                          router.push(`/admin/editTitles/${title.titleId}`)
                        }
                      >
                        <p className="font-bold text-normal text-base">
                          Edit title
                        </p>
                      </CircledButtons>
                      <CircledButtons
                        onClick={() => openDelModal(title.titleId)}
                        className="px-4 bg-accent rounded-2xl"
                      >
                        <p className="font-bold text-normal text-base">
                          Delete title
                        </p>
                      </CircledButtons>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AdminGuard>
    </>
  );
}
