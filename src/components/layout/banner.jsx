"use client";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/userContext";
import ButtonLoader from "../loaders/buttonLoader";
import AddPost from "../modals/addPost";
import { HiOutlineSearch } from "react-icons/hi";
import UserSearch from "../modals/userSearch";

export default function Banner() {
  const { user, loading, setShowSignIn } = useContext(UserContext);
  const [showAddPost, setShowAddPost] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (showSearch) {
      window.scrollTo({ top: 50, behavior: "smooth" });
    } else if (!showSearch) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showSearch]);

  return (
    <>
      {showAddPost && <AddPost setShowAddPost={setShowAddPost} />}
      {showSearch && (
        <UserSearch showSearch={showSearch} setShowSearch={setShowSearch} />
      )}
      <div className="pt-16">
        <div className="bg-gradient-to-b from-[var(--color-secondary)] to-[var(--color-panel)] flex flex-col justify-center gap-2 w-full md:rounded-2xl p-2">
          <div className="w-full">
            <div
              onClick={() => setShowSearch(true)}
              className="bg-panel cursor-text px-4 py-2 rounded-full flex items-center justify-between"
            >
              <p className="text-vibe opacity-70">Search for a user..</p>
              <HiOutlineSearch className="text-2xl text-normal" />
            </div>
          </div>
          <div className="flex gap-2 justify-center p-2">
            <div className="flex">
              <h1 className="text-5xl">THERE</h1>
              <div className="flex flex-col items-center justify-center mt-3">
                <h1 className="text-2xl leading-1">WAS</h1>
                <h1 className="text-2xl">AN</h1>
              </div>
              <h1 className="text-5xl">IDEA...</h1>
            </div>

            {!user ? (
              <button
                onClick={() => setShowSignIn(true)}
                className="text-normal font-extrabold text-base bg-accent flex-1 px-4 py-2 rounded-full cursor-pointer hover:bg-[var(--color-hulk)] focus:bg-[var(--color-hulk)"
              >
                <p>Sign Up</p>
              </button>
            ) : loading ? (
              <ButtonLoader />
            ) : (
              <button
                onClick={() => setShowAddPost(true)}
                className="text-normal font-extrabold text-base bg-accent flex-1 px-4 py-2 rounded-full cursor-pointer hover:bg-[var(--color-hulk)] focus:bg-[var(--color-hulk)"
              >
                <p>Assemble</p>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
