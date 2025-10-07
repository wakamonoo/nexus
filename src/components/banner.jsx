"use client";
import { useContext, useState } from "react";
import { UserContext } from "@/context/userContext";
import ButtonLoader from "./buttonLoader";
import AddPost from "./addPost";

export default function Banner() {
  const { user, loading, setShowSignIn } = useContext(UserContext);
  const [showAddPost, setShowAddPost] = useState(false);
  return (
    <>
      <div className="pt-16">
        <div className="bg-panel flex flex-col justify-center gap-2 w-full py-4 px-2">
          <div className="flex justify-between">
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
                className="text-normal font-extrabold text-base bg-accent px-4 py-2 rounded-full cursor-pointer hover:bg-[var(--color-hulk)] focus:bg-[var(--color-hulk)"
              >
                <p>Sign Up</p>
              </button>
            ) : loading ? (
              <ButtonLoader />
            ) : (
              <button
                onClick={() => setShowAddPost(true)}
                className="text-normal font-extrabold text-base bg-accent px-4 py-2 rounded-full cursor-pointer hover:bg-[var(--color-hulk)] focus:bg-[var(--color-hulk)"
              >
                <p>Assemble</p>
              </button>
            )}
          </div>
        </div>
      </div>
      {showAddPost && <AddPost setShowAddPost={setShowAddPost} />}
    </>
  );
}
