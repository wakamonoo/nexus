import { FaImage, FaUser } from "react-icons/fa";

export default function RinaLoaderNews() {
  return (
    <div className="w-full animate-pulse">
      <div className="py-4 bg-linear-to-b from-(--color-panel) to-(--color-secondary)">
        <div className="w-full h-fit px-4">
          <div className="flex gap-2 w-full items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-panel rounded-full shrink-0">
              <FaUser className="text-2xl text-(--color-secondary)" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="w-18 h-5 bg-panel rounded" />
              <div className="w-36 h-3 bg-panel rounded" />
            </div>
          </div>
          <div className="flex flex-col gap-1 py-4">
            <div className="w-full h-5 bg-panel rounded" />
            <div className="w-full h-5 bg-panel rounded" />
            <div className="w-full h-5 bg-panel rounded" />
            <div className="w-full h-5 bg-panel rounded" />
            <div className="w-32 h-5 bg-panel rounded" />
          </div>
        </div>
      </div>
      <div className="mt-2 divide-y divide-(--color-panel)">
        <div className="p-2 bg-second w-full h-28 flex gap-4">
          <div className="flex items-center justify-center w-[24vh] h-full bg-panel shrink-0">
            <FaImage className="text-4xl text-(--color-secondary)" />
          </div>
          <div className="flex flex-col w-full gap-2">
            <div className="w-full h-5 bg-panel rounded" />
            <div className="w-[25%] h-5 bg-panel rounded" />
          </div>
        </div>
        <div className="p-2 bg-second w-full h-28 flex gap-4">
          <div className="flex items-center justify-center w-[24vh] h-full bg-panel shrink-0">
            <FaImage className="text-4xl text-(--color-secondary)" />
          </div>
          <div className="flex flex-col w-full gap-2">
            <div className="w-full h-5 bg-panel rounded" />
            <div className="w-[35%] h-5 bg-panel rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
