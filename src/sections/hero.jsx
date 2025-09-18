import Banner from "@/components/banner.jsx";
import { FaBolt, FaComment, FaShare } from "react-icons/fa";
import Fallback from "@/assets/fallback.png";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="bg-brand w-full pt-12">
      <Banner />

      <div className="p-4 flex flex-col gap-4">
        <div className="w-full h-auto bg-second rounded p-4">
          <div className="flex gap-2 items-center py-2">
            <Image
              src={Fallback}
              alt="user"
              width={0}
              height={0}
              sizes="100vw"
              className="w-8 h-auto rounded-full"
            />
            <div className="flex flex-col">
              <p className="text-base mt-2 font-bold leading-2.5">
                Joven Bataller
              </p>
              <p className="text-xs text-gray-400">06-17-2003</p>
            </div>
          </div>
          <p className="text-base text-justify">
            The proper way to fix this is to give your content a top padding
            equal to the NavBar’s height (or a bit more if you want extra
            space), rather than adding margin to the Banner. This keeps the
            NavBar fixed and independent of the content.
          </p>
          <div className="flex justify-between items-center p-2 border-t mt-2">
            <FaBolt className="text-xl" />
            <FaComment className="text-xl" />
            <FaShare className="text-xl" />
          </div>
        </div>

        <div className="w-full h-auto bg-second rounded p-4">
          <div className="flex gap-2 items-center py-2">
            <Image
              src={Fallback}
              alt="user"
              width={0}
              height={0}
              sizes="100vw"
              className="w-8 h-auto rounded-full"
            />
            <div className="flex flex-col">
              <p className="text-base mt-2 font-bold leading-2.5">
                Joven Bataller
              </p>
              <p className="text-xs text-gray-400">06-17-2003</p>
            </div>
          </div>
          <p className="text-base text-justify">
            The proper way to fix this is to give your content a top padding
            equal to the NavBar’s height (or a bit more if you want extra
            space), rather than adding margin to the Banner. This keeps the
            NavBar fixed and independent of the content.
          </p>
          <div className="flex justify-between items-center p-2 border-t mt-2">
            <FaBolt className="text-xl" />
            <FaComment className="text-xl" />
            <FaShare className="text-xl" />
          </div>
        </div>

        <div className="w-full h-auto bg-second rounded p-4">
          <div className="flex gap-2 items-center py-2">
            <Image
              src={Fallback}
              alt="user"
              width={0}
              height={0}
              sizes="100vw"
              className="w-8 h-auto rounded-full"
            />
            <div className="flex flex-col">
              <p className="text-base mt-2 font-bold leading-2.5">
                Joven Bataller
              </p>
              <p className="text-xs text-gray-400">06-17-2003</p>
            </div>
          </div>
          <p className="text-base text-justify">
            The proper way to fix this is to give your content a top padding
            equal to the NavBar’s height (or a bit more if you want extra
            space), rather than adding margin to the Banner. This keeps the
            NavBar fixed and independent of the content.
          </p>
          <div className="flex justify-between items-center p-2 border-t mt-2">
            <FaBolt className="text-xl" />
            <FaComment className="text-xl" />
            <FaShare className="text-xl" />
          </div>
        </div>

        <div className="w-full h-auto bg-second rounded p-4">
          <div className="flex gap-2 items-center py-2">
            <Image
              src={Fallback}
              alt="user"
              width={0}
              height={0}
              sizes="100vw"
              className="w-8 h-auto rounded-full"
            />
            <div className="flex flex-col">
              <p className="text-base mt-2 font-bold leading-2.5">
                Joven Bataller
              </p>
              <p className="text-xs text-gray-400">06-17-2003</p>
            </div>
          </div>
          <p className="text-base text-justify">
            The proper way to fix this is to give your content a top padding
            equal to the NavBar’s height (or a bit more if you want extra
            space), rather than adding margin to the Banner. This keeps the
            NavBar fixed and independent of the content.
          </p>
          <div className="flex justify-between items-center p-2 border-t mt-2">
            <FaBolt className="text-xl" />
            <FaComment className="text-xl" />
            <FaShare className="text-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
