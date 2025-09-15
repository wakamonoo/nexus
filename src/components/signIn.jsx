import { useState } from "react";
import { MdClose } from "react-icons/md";

export default function SignIn({ setShowSignIn }) {
  return (
    <div
      onClick={() => setShowSignIn(false)}
      className="inset-0 z-50 backdrop-blur-xs flex items-center justify-center fixed"
    >
      <div className="flex relative justify-center bg-red-600 w-[350px] sm:w-[400px] md:w-[450px] h-[350px] sm:h-[400px] md:h-[450px] rounded-2xl overflow-hidden">
        <button className="absolute cursor-pointer top-4 right-4 text-2xl sm:text-3xl md:text-4xl font-bold duration-200 hover:scale-110 active:scale-110">
          <MdClose onClick={() => setShowSignIn(false)} />
        </button>
        <div className="flex items-center justify-center">
          <button className="bg-accent px-4 py-2 rounded-full">Sign In With Google</button>
        </div>
      </div>
    </div>
  );
}
