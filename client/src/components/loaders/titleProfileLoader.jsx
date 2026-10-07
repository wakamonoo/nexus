import { FaImage } from "react-icons/fa";

export default function TitleProfileLoader() {
  return (
    <div className="flex gap-2 animate-pulse">
      <div className="flex items-center justify-center bg-panel w-26 h-40 md:w-32 md:h-46 rounded shrink-0">
        <FaImage className="text-4xl text-(--color-secondary)" />
      </div>
      <div className="flex items-center justify-center bg-panel w-26 h-40 md:w-32 md:h-46 rounded shrink-0">
        <FaImage className="text-4xl text-(--color-secondary)" />
      </div>
      <div className="flex items-center justify-center bg-panel w-26 h-40 md:w-32 md:h-46 rounded shrink-0">
        <FaImage className="text-4xl text-(--color-secondary)" />
      </div>
    </div>
  );
}
