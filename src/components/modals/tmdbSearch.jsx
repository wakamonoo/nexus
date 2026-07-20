"use client";
import { useEffect, useState } from "react";
import { MdClose, MdSearchOff } from "react-icons/md";
import Image from "next/image";
import { HiOutlineSearch } from "react-icons/hi";
import GifLoader from "../loaders/gifLoader";
import Fallback from "@/assets/fallback.png";

export default function TMDBSearch({ BASE_URL, setShowTMDBSearch, setData }) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

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

  return (
    <>
      <div
        onClick={() => setShowTMDBSearch(false)}
        className="inset-0 z-50 backdrop-blur-xs flex items-center justify-center fixed"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative flex flex-col justify-center bg-second border-1 border-panel w-84 md:w-96 h-[60vh] rounded-2xl overflow-hidden p-2"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTMDBSearch(false);
            }}
            className="absolute cursor-pointer top-4 right-4 font-bold duration-200 hover:scale-110 active:scale-110"
          >
            <MdClose className="text-2xl" />
          </button>
          <div className="mt-10 flex gap-2 rounded-full bg-panel px-4 py-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search TMDB"
              className="w-full outline-none text-base text-normal"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  searchMetadata(query);
                }
              }}
            />
            <button
              onClick={() => {
                searchMetadata(query);
              }}
              className="cursor-pointer"
            >
              <HiOutlineSearch className="text-2xl text-normal" />
            </button>
          </div>
          <div className="mt-4 flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="w-full mt-2">
                <GifLoader />
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
                  return (
                    <button
                      key={`${item.media_type}-${item.id}`}
                      onClick={() => {
                        setData((prev) => ({
                          ...prev,

                          tmdbId: item.id,
                          mediaType: item.media_type,
                        }));
                        setShowTMDBSearch(false);
                      }}
                      type="button"
                      className="flex items-center gap-3 rounded-lg bg-panel p-3 text-left transition hover:bg-[var(--color-panel)]/80 cursor-pointer"
                    >
                      <Image
                        src={
                          item.poster_path
                            ? `https://image.tmdb.org/t/p/w154${item.poster_path}`
                            : Fallback
                        }
                        alt={item.title || item.name}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-24 h-32 object-cover rounded"
                      />
                      <div className="flex flex-col">
                        <p className="font-bold text-base">
                          {item.title || item.name}
                        </p>
                        <p className="text-xs text-vibe">
                          {item.media_type} •{" "}
                          {item.release_date || item.first_air_date}
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
