import { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";

export default function Nav({ setShowNav, setShowSignIn }) {
  const divRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if(divRef.current && !divRef.current.contains(e.target)) {
        setShowNav(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return() => {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [])
  return (
    <>
      <div ref={divRef} className="fixed right-0 top-0 w-[50%] h-screen bg-red-400 z-10 px-8 py-4">
        <MdClose onClick={() => setShowNav(false)} />
        <div className="p-4 mt-4">
          <ul>
            <li>home</li>
            <li
              onClick={() => {
                setShowSignIn(true);
                setShowNav(false);
              }}
            >
              login
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
