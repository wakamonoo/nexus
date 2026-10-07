import { FaImage } from "react-icons/fa";

export default function LibraryLoader() {
  return (
    <div className="flex flex-col gap-1 py-4 px-2 sm:px-4 md:px-8 animate-pulse w-full">
      <div className="flex justify-end px-4 pb-4">
        <div className="bg-panel w-42 h-10 rounded shrink-0" />
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,104px)] md:grid-cols-[repeat(auto-fill,128px)] justify-center gap-2">
        <div className="flex items-center justify-center bg-panel w-26 h-40 md:w-32 md:h-46 rounded shrink-0">
          <FaImage className="text-4xl text-(--color-secondary)" />
        </div>
        <div className="flex items-center justify-center bg-panel w-26 h-40 md:w-32 md:h-46 rounded shrink-0">
          <FaImage className="text-4xl text-(--color-secondary)" />
        </div>
        <div className="flex items-center justify-center bg-panel w-26 h-40 md:w-32 md:h-46 rounded shrink-0">
          <FaImage className="text-4xl text-(--color-secondary)" />
        </div>
        <div className="flex items-center justify-center bg-panel w-26 h-40 md:w-32 md:h-46 rounded shrink-0">
          <FaImage className="text-4xl text-(--color-secondary)" />
        </div>
        <div className="flex items-center justify-center bg-panel w-26 h-40 md:w-32 md:h-46 rounded shrink-0">
          <FaImage className="text-4xl text-(--color-secondary)" />
        </div>
        <div className="flex items-center justify-center bg-panel w-26 h-40 md:w-32 md:h-46 rounded shrink-0">
          <FaImage className="text-4xl text-(--color-secondary)" />
        </div>
        <div className="flex items-center justify-center bg-panel w-26 h-40 md:w-32 md:h-46 rounded shrink-0">
          <FaImage className="text-4xl text-(--color-secondary)" />
        </div>
        <div className="flex items-center justify-center bg-panel w-26 h-40 md:w-32 md:h-46 rounded shrink-0">
          <FaImage className="text-4xl text-(--color-secondary)" />
        </div>
        <div className="flex items-center justify-center bg-panel w-26 h-40 md:w-32 md:h-46 rounded shrink-0">
          <FaImage className="text-4xl text-(--color-secondary)" />
        </div>
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
