import { FaImage } from "react-icons/fa";

export default function GoatMaxLoader() {
  return (
    <div className="animate-pulse">
      <div className="flex justify-center flex-wrap gap-2 w-full">
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
    </div>
  );
}
