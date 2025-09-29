import wkmn from "@/assets/wkmn.webp";
import Image from "next/image";

export default function Splash() {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-panel">
      <div className="flex items-center justify-center bg-second w-16 h-20 rounded-tl-4xl rounded-tr-4xl p-2">
        <div className="relative w-12 h-16 rounded-tl-4xl rounded-tr-4xl bg-accent">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-second w-4 h-12 rounded-tl-2xl rounded-tr-2xl" />
        </div>
      </div>
      <div className="fixed bottom-12 w-full">
        <p className="flex justify-center text-xs text-[var(--color-vibranium)]/50">
          made by
        </p>
        <div className="flex gap-1 justify-center items-center">
          <Image
            src={wkmn}
            alt="wkmn"
            priority
            width={0}
            height={0}
            sizes="100vw"
            className="w-12 h-12"
          />
          <p className="font-tall text-5xl text-brand">WKMN</p>
        </div>
      </div>
    </div>
  );
}
