import { useEffect, useRef } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { HiOutlineSearch } from "react-icons/hi";

export default function UserSearch({ showSearch, setShowSearch }) {
  const inputRef = useRef();

  useEffect(() => {
    if (showSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearch]);

  return (
    <div className="inset-0 z-[100] backdrop-blur-xs flex justify-center fixed">
      <div className="w-full p-2">
        <div className="flex items-center justify-between w-full">
          <FaAngleLeft
            onClick={() => setShowSearch(false)}
            className="text-2xl"
          />
          <div className="flex justify-between w-full items-center gap-2 bg-panel px-4 py-2 rounded-full">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search an agent..."
              className="w-full outline-none text-base text-normal"
            />
            <button>
              <HiOutlineSearch className="text-2xl text-normal" />
            </button>
          </div>
        </div>
        <div className="py-4">
          <div className="w-full rounded-2xl bg-panel p-2">asd</div>
        </div>
      </div>
    </div>
  );
}
