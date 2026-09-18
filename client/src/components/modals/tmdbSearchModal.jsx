"use client";
import { useEffect, useState } from "react";
import { MdClose, MdSearchOff } from "react-icons/md";
import { HiOutlineSearch } from "react-icons/hi";
import Fallback from "@/assets/fallback.png";
import TMDBTitlesLoader from "../loaders/tmdbTitlesLoader";

export default function TMDBSearchModal({
  BASE_URL,
  setShowTMDBSearchModal,
  setData,
}) {
  const [query, setQuery] = useState("Avengers");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQuery(inputValue.trim() || "Avengers");
    }, 300);

    return () => clearTimeout(debounce);
  }, [inputValue]);

  useEffect(() => {
    const searchMetadata = async () => {
      if (!query.trim()) return;

      try {
        setIsLoading(true);

        const res = await fetch(
          `${BASE_URL}/api/tmdb/search?q=${encodeURIComponent(query)}`,
        );
        const data = await res.json();

        setSearchResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    searchMetadata();
  }, [query]);

  return (
    <>
      <div
        onClick={() => setShowTMDBSearchModal(false)}
        className="fixed inset-0 z-150 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative flex flex-col w-full max-w-md max-h-[60vh] overflow-hidden rounded-2xl border border-panel bg-second shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-panel p-4">
            <h1 className="text-base font-bold text-normal">Find a title</h1>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTMDBSearchModal(false);
              }}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-vibe transition hover:bg-(--color-panel) hover:text-(--color-accent) shrink-0"
            >
              <MdClose className="text-xl" />
            </button>
          </div>
          <div className="p-4">
            <div className="flex w-full justify-between items-center gap-2 bg-panel px-4 py-2 rounded-full">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search TMDB"
                className="w-full outline-none text-base text-normal"
              />
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto custom-scroll p-4">
            {isLoading ? (
              <div className="w-full mt-2">
                <TMDBTitlesLoader />
              </div>
            ) : searchResults.length === 0 ? (
              <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex flex-col items-center justify-center">
                  <MdSearchOff className="text-4xl text-vibe opacity-40" />
                  <p className="text-xs text-vibe opacity-40">
                    No results for <span className="font-bold">{query}</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {searchResults.map((item) => {
                  const isSeason = item.type === "season";
                  return (
                    <button
                      key={
                        isSeason
                          ? `tv-${item.id}-season-${item.seasonNumber}`
                          : `${item.media_type}-${item.id}`
                      }
                      onClick={() => {
                        setData((prev) => ({
                          ...prev,

                          tmdbId: item.id,
                          mediaType: item.media_type,
                          seasonNumber: isSeason ? item.seasonNumber : null,
                          parentSeriesId: isSeason ? item.parentSeriesId : null,
                        }));
                        setShowTMDBSearchModal(false);
                      }}
                      type="button"
                      className="flex items-center gap-3 rounded-lg bg-panel p-3 text-left transition hover:bg-(--color-panel)/80 cursor-pointer"
                    >
                      <img
                        src={
                          item.poster_path
                            ? `https://image.tmdb.org/t/p/w154${item.poster_path}`
                            : Fallback.src
                        }
                        alt={item.title || item.name}
                        loading="lazy"
                        decoding="async"
                        className="w-24 h-32 object-cover rounded"
                      />
                      <div className="flex flex-col">
                        <p className="font-bold text-base">
                          {isSeason
                            ? `${item.title} - ${item.seasonName}`
                            : item.title || item.name}
                        </p>
                        <p className="text-xs text-vibe">
                          {isSeason
                            ? `TV Series • Season ${item.seasonNumber}`
                            : `${item.media_type} • ${item.release_date || item.first_air_date || ""}`}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
