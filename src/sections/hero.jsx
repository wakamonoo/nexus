import Banner from "@/components/banner.jsx";
import { FaBolt, FaComment, FaShare } from "react-icons/fa";
import Fallback from "@/assets/fallback.png";
import Tony from "@/assets/tony.jpg";
import Steve from "@/assets/steve.jpg";
import Thor from "@/assets/thor.jpg";
import Wanda from "@/assets/wanda.jpeg";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="bg-brand w-full pt-16">
      <div className="pb-4">
        <Banner />
      </div>

      <div className="p-2 flex flex-col gap-4">
        <div className="w-full h-auto bg-second rounded-tl-4xl border-t-2 border-r-1 border-accent p-4">
          <div className="flex gap-3 items-center py-2">
            <Image
              src={Tony}
              alt="user"
              width={0}
              height={0}
              sizes="100vw"
              className="w-12 h-12 object-cover rounded-full"
            />
            <div className="flex flex-col">
              <p className="text-base mt-2 font-bold leading-3.5">Tony Stark</p>
              <p className="text-xs text-vibe">06-17-2003</p>
            </div>
          </div>

          <p className="text-base text-justify py-4">
            Just finished tinkering with a new suit upgrade — let’s just say
            Friday might need a bigger hard drive. Who’s up for a test flight
            over Wakanda?
          </p>
          <div className="flex justify-between items-center pt-4 border-t gap-4 mt-2">
            <div className="flex items-center justify-center gap-2 border-1 p-4 rounded-4xl w-[33%] h-12">
              <FaBolt className="text-xl" />
              <p className="text-xs font-light text-vibe">21</p>
            </div>
            <div className="flex items-center justify-center gap-2 border-1 p-4 rounded-4xl w-[33%] h-12">
              <FaComment className="text-xl" />
              <p className="text-xs font-light text-vibe">21</p>
            </div>
            <div className="flex items-center justify-center gap-2 border-1 p-4 rounded-4xl w-[33%] h-12">
              <FaShare className="text-xl" />
              <p className="text-xs font-light text-vibe">21</p>
            </div>
          </div>
        </div>

        <div className="w-full h-auto bg-second rounded-tl-4xl border-t-2 border-r-1 border-accent p-4">
          <div className="flex gap-3 items-center py-2">
            <Image
              src={Steve}
              alt="user"
              width={0}
              height={0}
              sizes="100vw"
              className="w-12 h-12 object-cover rounded-full"
            />
            <div className="flex flex-col">
              <p className="text-base mt-2 font-bold leading-3.5">Cap</p>
              <p className="text-xs text-vibe">06-17-2003</p>
            </div>
          </div>

          <p className="text-base text-justify py-4">
            Morning run complete. Remember: strength comes from unity. Grab your
            shield and stand for what’s right, friends.
          </p>
          <div className="flex justify-between items-center pt-4 border-t gap-4 mt-2">
            <div className="flex items-center justify-center gap-2 border-1 p-4 rounded-4xl w-[33%] h-12">
              <FaBolt className="text-xl" />
              <p className="text-xs font-light text-vibe">101</p>
            </div>
            <div className="flex items-center justify-center gap-2 border-1 p-4 rounded-4xl w-[33%] h-12">
              <FaComment className="text-xl" />
              <p className="text-xs font-light text-vibe">211</p>
            </div>
            <div className="flex items-center justify-center gap-2 border-1 p-4 rounded-4xl w-[33%] h-12">
              <FaShare className="text-xl" />
              <p className="text-xs font-light text-vibe">501</p>
            </div>
          </div>
        </div>

        <div className="w-full h-auto bg-second rounded-tl-4xl border-t-2 border-r-1 border-accent p-4">
          <div className="flex gap-3 items-center py-2">
            <Image
              src={Thor}
              alt="user"
              width={0}
              height={0}
              sizes="100vw"
              className="w-12 h-12 object-cover rounded-full"
            />
            <div className="flex flex-col">
              <p className="text-base mt-2 font-bold leading-3.5">Stronest Avenger</p>
              <p className="text-xs text-vibe">06-17-2003</p>
            </div>
          </div>

          <p className="text-base text-justify py-4">
            A thunderous storm approaches! I suggest all Asgardians and Midgardians brace themselves. Perhaps someone fancies a flight across the Bifrost?
          </p>
          <div className="flex justify-between items-center pt-4 border-t gap-4 mt-2">
            <div className="flex items-center justify-center gap-2 border-1 p-4 rounded-4xl w-[33%] h-12">
              <FaBolt className="text-xl" />
              <p className="text-xs font-light text-vibe">311</p>
            </div>
            <div className="flex items-center justify-center gap-2 border-1 p-4 rounded-4xl w-[33%] h-12">
              <FaComment className="text-xl" />
              <p className="text-xs font-light text-vibe">451</p>
            </div>
            <div className="flex items-center justify-center gap-2 border-1 p-4 rounded-4xl w-[33%] h-12">
              <FaShare className="text-xl" />
              <p className="text-xs font-light text-vibe">59</p>
            </div>
          </div>
        </div>

        <div className="w-full h-auto bg-second rounded-tl-4xl border-t-2 border-r-1 border-accent p-4">
          <div className="flex gap-3 items-center py-2">
            <Image
              src={Wanda}
              alt="user"
              width={0}
              height={0}
              sizes="100vw"
              className="w-12 h-12 object-cover rounded-full"
            />
            <div className="flex flex-col">
              <p className="text-base mt-2 font-bold leading-3.5">Wanda</p>
              <p className="text-xs text-vibe">06-17-2003</p>
            </div>
          </div>

          <p className="text-base text-justify py-4">
            Magic is only as dangerous as the heart that wields it… and mine is on fire. 🔥 Anyone else feel the chaos tonight?
          </p>
          <div className="flex justify-between items-center pt-4 border-t gap-4 mt-2">
            <div className="flex items-center justify-center gap-2 border-1 p-4 rounded-4xl w-[33%] h-12">
              <FaBolt className="text-xl" />
              <p className="text-xs font-light text-vibe">1023</p>
            </div>
            <div className="flex items-center justify-center gap-2 border-1 p-4 rounded-4xl w-[33%] h-12">
              <FaComment className="text-xl" />
              <p className="text-xs font-light text-vibe">981</p>
            </div>
            <div className="flex items-center justify-center gap-2 border-1 p-4 rounded-4xl w-[33%] h-12">
              <FaShare className="text-xl" />
              <p className="text-xs font-light text-vibe">789</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
