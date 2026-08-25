"use client";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/userContext";
import ButtonLoader from "../../loaders/buttonLoader";
import AddPostModal from "../../modals/addPostModal";
import UserSearch from "./userSearch";
import CircledButtons from "../../buttons/circledBtns";

export default function Banner() {
  const { user, loading, setShowSignInModal } = useContext(UserContext);
  const [showAddPostModal, setShowAddPostModal] = useState(false);
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
      {showAddPostModal && (
        <AddPostModal setShowAddPostModal={setShowAddPostModal} />
      )}
      {showSearch && (
        <UserSearch showSearch={showSearch} setShowSearch={setShowSearch} />
      )}
      <div className="pt-16">
        <div className="bg-gradient-to-b from-[var(--color-secondary)] to-[var(--color-panel)] flex flex-col justify-center gap-2 w-full md:rounded-2xl p-2">
          <div className="w-full">
            <div
              onClick={() => setShowSearch(true)}
              className="bg-panel cursor-text px-4 py-2 rounded-full flex "
            >
              <p className="text-vibe opacity-70">Search for a user..</p>
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
              <CircledButtons onClick={() => setShowSignInModal(true)}>
                <p className="font-bold text-normal text-base">Sign Up</p>
              </CircledButtons>
            ) : loading ? (
              <ButtonLoader />
            ) : (
              <CircledButtons onClick={() => setShowAddPostModal(true)}>
                <p className="font-bold text-normal text-base">Assemble</p>
              </CircledButtons>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
