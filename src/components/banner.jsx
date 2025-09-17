import { useState } from "react";
import SignIn from "./signIn";

export default function Banner() {
  const [showSignIn, setShowSignIn] = useState(false);
  return (
    <>
      <div className="bg-panel flex justify-center gap-2 w-full py-4 px-2">
        <div className="flex">
          <h1 className="text-5xl">THERE</h1>
          <div className="flex flex-col items-center justify-center mt-3">
            <h1 className="text-2xl leading-1">WAS</h1>
            <h1 className="text-2xl">AN</h1>
          </div>
          <h1 className="text-5xl">IDEA...</h1>
        </div>

        <button
          onClick={() => setShowSignIn(true)}
          className="text-normal font-normal text-base bg-accent px-4 py-2 rounded-full"
        >
          Sign Up
        </button>
      </div>

      {showSignIn && (
        <SignIn setShowSignIn={setShowSignIn} />
      )}
    </>
  );
}
