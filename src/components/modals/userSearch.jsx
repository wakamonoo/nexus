import { useContext, useEffect, useRef, useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { HiOutlineSearch } from "react-icons/hi";
import Image from "next/image";
import { MdSearchOff } from "react-icons/md";
import Loader from "@/components/loaders/searchLoader";
import Fallback from "@/assets/fallback.png";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/userContext";
import { LoaderContext } from "@/context/loaderContext";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export default function UserSearch({ showSearch, setShowSearch }) {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setIsLoading } = useContext(LoaderContext);
  const inputRef = useRef();
  const router = useRouter();

  useEffect(() => {
    if (showSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearch]);

  const handleUserSearch = async () => {
    if (!searchInput) return setSearchResults([]);
    try {
      setLoading(true);
      const res = await fetch(
        `${BASE_URL}/api/users/allUsersGet?query=${encodeURIComponent(
          searchInput
        )}`
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
    if (showSearch) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  });

  useEffect(() => {
    if (!searchInput) {
      setSearchResults([]);
      return;
    }

    const debounce = setTimeout(() => {
      handleUserSearch();
    }, 300);

    return () => {
      clearTimeout(debounce);
    };
  }, [searchInput]);

  return (
    <div className="inset-0 z-[100] backdrop-blur-xs flex justify-center fixed overflow-y-auto">
      <div className="w-full h-full md:w-[65%] lg:w-[42%] p-2 py-6 md:absolute md:right-6 lg:right-1/2 lg:translate-x-1/2 lg:mr-3">
        <div className="flex items-center justify-between w-full">
          <FaAngleLeft
            onClick={() => setShowSearch(false)}
            className="text-2xl cursor-pointer"
          />
          <div className="flex w-full justify-between items-center gap-2 bg-panel px-4 py-2 rounded-full">
            <input
              ref={inputRef}
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if ((e.key === "Enter") & !e.shiftKey) {
                  e.preventDefault();
                  handleUserSearch();
                }
              }}
              placeholder="Locate variants across timelines..."
              className="w-full outline-none text-base text-normal truncate"
            />
            <button onClick={handleUserSearch}>
              <HiOutlineSearch className="text-2xl text-normal" />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2 py-4">
          {loading ? (
            <Loader />
          ) : searchResults.length > 0 ? (
            searchResults?.map((profile, index) => (
              <div
                key={index}
                onClick={() => {
                  setIsLoading(true);
                  router.push(`profile/${profile.uid}`);
                }}
                className="w-full rounded-full bg-second border-1 border-panel p-2"
              >
                <div className="flex gap-2 items-center cursor-pointer">
                  <Image
                    src={profile.picture || Fallback}
                    alt="image"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-12 h-12 object-fill rounded-full"
                  />
                  <div className="flex flex-col">
                    <p className="text-normal text-base font-bold truncate">
                      {profile.name}
                    </p>
                    <p className="text-vibe text-sm truncate w-64">
                      {profile.bio || null}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            searchInput.trim() !== "" && (
              <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex flex-col items-center justify-center">
                  <MdSearchOff className="text-4xl text-vibe opacity-40" />
                  <p className="text-xs text-vibe opacity-40">
                    Codename <span className="font-bold">{searchInput}</span>{" "}
                    doesn't exist
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
