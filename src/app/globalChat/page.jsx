import { MdSend } from "react-icons/md";
import cap from "@/assets/steve.jpg";
import thor from "@/assets/thor.jpg";
import ironman from "@/assets/tony.jpg";
import Image from "next/image";

export default function GlobalChat() {
  return (
    <>
      <div className="h-screen flex flex-col pt-16">
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Image
                src={ironman}
                alt="user"
                className="w-8 h-8 rounded-full"
              />
              <div className="bg-panel px-4 rounded-2xl">
                <div className="py-2">
                  <p className="text-base font-bold">Tony Stark</p>
                  <p className="text-xs text-vibe">06-17-2003</p>
                </div>
                <p className="text-base text-normal py-2">
                  Look, I don’t mean to brag, but if we’re talking strategy,
                  charm, and sheer genius in a single room, you’re looking at
                  your guy. I’ve basically saved the world in three different
                  suits while juggling sarcasm and a caffeine addiction.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Image src={cap} alt="user" className="w-8 h-8 rounded-full" />
              <div className="bg-panel px-4 rounded-2xl">
                <div className="py-2">
                  <p className="text-base font-bold">Cap</p>
                  <p className="text-xs text-vibe">06-17-2003</p>
                </div>
                <p className="text-base text-normal py-2">
                  Tony, one of us plans, fights, and actually thinks about the
                  consequences of our actions instead of turning everything into
                  a tech demo or a punchline, and that’s me. Someone has to be
                  the responsible one while you play dress-up with lasers.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Image src={thor} alt="user" className="w-8 h-8 rounded-full" />
              <div className="bg-panel px-4 rounded-2xl">
                <div className="py-2">
                  <p className="text-base font-bold">Thor</p>
                  <p className="text-xs text-vibe">06-17-2003</p>
                </div>
                <p className="text-base text-normal py-2">
                  You mortals amuse me. I have wielded hammers, battled frost
                  giants, and eaten entire feasts in one sitting, yet you
                  quarrel over gadgets and rules. Let us simply fight, eat, and
                  declare glory upon ourselves!
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-second">
          <input
            type="text"
            placeholder="enter message ..."
            className="w-full bg-panel p-2 rounded text-base text-normal font-normal"
          />
          <MdSend className="text-2xl cursor-pointer" />
        </div>
      </div>
    </>
  );
}
