import { FaImage } from "react-icons/fa";

export default function SigilsProfileLoader() {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-3 w-full gap-2 animate-pulse">
      <div className="w-full h-full min-h-23 md:min-h-26 p-2 border border-panel rounded">
        <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 mx-auto bg-panel rounded shrink-0">
          <FaImage className="text-4xl text-(--color-secondary)" />
        </div>
        <div className="h-3 w-3/4 mx-auto mt-1 bg-panel rounded" />
      </div>
      <div className="w-full h-full min-h-23 md:min-h-26 p-2 border border-panel rounded">
        <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 mx-auto bg-panel rounded shrink-0">
          <FaImage className="text-4xl text-(--color-secondary)" />
        </div>
        <div className="h-3 w-full mx-auto mt-1 bg-panel rounded" />
      </div>
      <div className="w-full h-full min-h-23 md:min-h-26 p-2 border border-panel rounded">
        <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 mx-auto bg-panel rounded shrink-0">
          <FaImage className="text-4xl text-(--color-secondary)" />
        </div>
        <div className="h-3 w-11/12 mx-auto mt-1 bg-panel rounded" />
      </div>
      <div className="w-full h-full min-h-23 md:min-h-26 p-2 border border-panel rounded">
        <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 mx-auto bg-panel rounded shrink-0">
          <FaImage className="text-4xl text-(--color-secondary)" />
        </div>
        <div className="h-3 w-3/4 mx-auto mt-1 bg-panel rounded" />
      </div>
      <div className="w-full h-full min-h-23 md:min-h-26 p-2 border border-panel rounded">
        <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 mx-auto bg-panel rounded shrink-0">
          <FaImage className="text-4xl text-(--color-secondary)" />
        </div>
        <div className="h-3 w-5/6 mx-auto mt-1 bg-panel rounded" />
      </div>
      <div className="w-full h-full min-h-23 md:min-h-26 p-2 border border-panel rounded">
        <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 mx-auto bg-panel rounded shrink-0">
          <FaImage className="text-4xl text-(--color-secondary)" />
        </div>
        <div className="h-3 w-4/5 mx-auto mt-1 bg-panel rounded" />
      </div>
    </div>
  );
}
