import { MdClose } from "react-icons/md";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";
import Image from "next/image";
import { FaFlag, FaImage } from "react-icons/fa";

export default function AddPost({ setShowAddPost }) {
  const { user } = useContext(UserContext);
  return (
    <div
      onClick={() => setShowAddPost(false)}
      className="inset-0 z-50 backdrop-blur-xs flex items-center justify-center fixed"
    >
      <div className="flex relative justify-center bg-panel w-[95%] sm:w-[400px] md:w-[450px] h-[70%] sm:h-[400px] md:h-[450px] rounded-2xl overflow-hidden">
        <button className="absolute cursor-pointer top-4 right-4 text-2xl sm:text-3xl md:text-4xl font-bold duration-200 hover:scale-110 active:scale-110">
          <MdClose onClick={() => setShowAddPost(false)} />
        </button>

        <div className="mt-12 p-2 h-full w-full">
          <div className="flex py-2 justify-start items-center gap-2">
            <Image
              src={user?.picture}
              alt="user"
              width={0}
              height={0}
              sizes="100vw"
              className="w-10 h-10 rounded-full"
            />
            <p className="text-base text-normal font-bold">{user?.name}</p>
          </div>
          <div>
            <textarea
              placeholder="share your thoughts"
              className="bg-second w-full h-32 rounded p-2"
            />
            <div className="flex gap-2">
              <button className="flex flex-1 justify-center bg-blue-600 p-2 rounded items-center gap-2">
                <FaImage className="text-2xl" />
                <p className="font-bold text-normal text-base">Add Image</p>
              </button>
              <button className="flex flex-1 justify-center bg-hulk p-2 rounded items-center gap-2">
                <FaFlag className="text-2xl" />
                <p className="font-bold text-normal text-base">Choose Topic</p>
              </button>
            </div>
            <div className="py-2">
              <button className="bg-accent p-2 rounded w-full">
                <p className="font-bold text-norma; text-base uppercase">
                  Post
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
