import { FaImage } from "react-icons/fa";

export default function MomentArchiveLoader() {
  return (
    <div className="animate-pulse relative">
      <div className="rounded-full p-0.5 border-4 border-panel">
        <div className="flex items-center justify-center w-18 h-18 rounded-full bg-panel shrink-0">
          <FaImage className="text-4xl text-(--color-secondary)" />
        </div>
      </div>
      <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 h-8 w-8 rounded-md border-2 border-(--color-bg) bg-second overflow-hidden" />
    </div>
  );
}
