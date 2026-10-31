import { useContext, useEffect, useRef, useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { MdSearchOff } from "react-icons/md";
import Loader from "@/components/loaders/searchLoader";
import Avatar from "@/assets/defaultAvatar.png";
import { useRouter } from "next/navigation";
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
    <div className="fixed inset-0 z-150 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm overflow-y-auto">
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
              placeholder="Locate variants across timelines..."
              className="w-full outline-none text-base text-normal truncate"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 py-4">
          {loading ? (
            <Loader />
          ) : searchResults.length > 0 ? (
            searchResults?.map((profile) => (
              <div
                key={profile.uid}
                onClick={() => {
                  router.push(`profile/${profile.uid}`);
                }}
                className="w-full rounded-full bg-second hover:bg-(--color-panel) border border-panel p-2"
              >
                <div className="flex gap-2 items-center cursor-pointer">
                  <img
                    src={profile.picture || Avatar.src}
                    alt={profile.name}
                    loading="lazy"
                    decoding="async"
                    className="w-12 h-12 object-fill rounded-full shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <p className="text-normal text-base font-bold truncate leading-tight">
                      {profile.name}
                    </p>
                    <p className="text-vibe opacity-60 text-xs truncate">
                      {profile.bio}
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
