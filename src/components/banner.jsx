import { useState } from "react";
import SignIn from "./signIn";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";

export default function Banner() {
  const [showSignIn, setShowSignIn] = useState(false);
  const { user } = useContext(UserContext);
  const router = useRouter();

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

        {!user ? (
          <button
            onClick={() => setShowSignIn(true)}
            className="text-normal font-extrabold text-base bg-accent px-4 py-2 rounded-full"
          >
            <p>Sign Up</p>
          </button>
        ) : (
          <button
            onClick={() => setShowSignIn(true)}
            className="text-normal font-extrabold text-base bg-accent px-4 py-2 rounded-full"
          >
            <p>Assemble</p>
          </button>
        )}
      </div>

      {showSignIn && <SignIn setShowSignIn={setShowSignIn} />}
    </>
  );
}
