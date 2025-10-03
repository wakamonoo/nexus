import Image from "next/image";
import wkmn from "@/assets/wkmn.webp";

export default function Funding() {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-panel">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex items-center justify-center bg-second w-16 h-20 rounded-tl-4xl rounded-tr-4xl p-2">
          <div className="relative w-12 h-16 rounded-tl-4xl rounded-tr-4xl bg-accent">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-second w-4 h-12 rounded-tl-2xl rounded-tr-2xl" />
          </div>
        </div>
        <div class="flex justify-center flex-row gap-2">
          <div class="w-2 h-2 rounded-full bg-second animate-bounce"></div>
          <div class="w-2 h-2 rounded-full bg-second animate-bounce [animation-delay:-.3s]"></div>
          <div class="w-2 h-2 rounded-full bg-second animate-bounce [animation-delay:-.5s]"></div>
        </div>
      </div>

      <div className="fixed bottom-12 w-full opacity-60">
        <div className="flex justify-center items-center">
          <Image
            src={wkmn}
            alt="wkmn"
            priority
            width={0}
            height={0}
            sizes="100vw"
            className="w-6 h-6"
          />
          <p className="font-tall text-xl text-brand">WKMN</p>
        </div>
      </div>
    </div>
  );
}
