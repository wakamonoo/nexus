import { FaImage } from "react-icons/fa";

export default function ListLoader() {
  return (
    <div className="flex flex-col items-start justify-center w-full h-full gap-4 overflow-hidden animate-pulse">
      <div className="w-full grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 mt-6 items-start">
        <div className="flex w-full items-center gap-2">
          <div className="bg-panel w-full h-[35vh] rounded-xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center bg-panel w-26 h-40 md:w-32 md:h-46 rounded shrink-0">
              <FaImage className="text-4xl text-(--color-secondary)" />
            </div>
            <div className="bg-panel w-full h-5 rounded" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center bg-panel w-26 h-40 md:w-32 md:h-46 rounded shrink-0">
              <FaImage className="text-4xl text-(--color-secondary)" />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <div className="bg-panel w-32 h-5 rounded" />
              <div className="flex mt-2 items-start gap-4 justify-between">
                <div className="w-3 h-3 bg-panel rounded shrink-0" />
                <div className="w-full flex flex-col gap-2">
                  <div className="w-full h-5 bg-panel rounded" />
                  <div className="w-40 h-5 bg-panel rounded" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center bg-panel w-26 h-40 md:w-32 md:h-46 rounded shrink-0">
              <FaImage className="text-4xl text-(--color-secondary)" />
            </div>
            <div className="bg-panel w-40 h-5 rounded" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center bg-panel w-26 h-40 md:w-32 md:h-46 rounded shrink-0">
              <FaImage className="text-4xl text-(--color-secondary)" />
            </div>
            <div className="bg-panel w-36 h-5 rounded" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center bg-panel w-26 h-40 md:w-32 md:h-46 rounded shrink-0">
              <FaImage className="text-4xl text-(--color-secondary)" />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <div className="bg-panel w-32 h-5 rounded" />
              <div className="flex mt-2 items-start gap-4 justify-between">
                <div className="w-3 h-3 bg-panel rounded shrink-0" />
                <div className="w-full flex flex-col gap-2">
                  <div className="w-full h-5 bg-panel rounded" />
                  <div className="w-32 h-5 bg-panel rounded" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center bg-panel w-26 h-40 md:w-32 md:h-46 rounded shrink-0">
              <FaImage className="text-4xl text-(--color-secondary)" />
            </div>
            <div className="bg-panel w-24 h-5 rounded" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center bg-panel w-26 h-40 md:w-32 md:h-46 rounded shrink-0">
              <FaImage className="text-4xl text-(--color-secondary)" />
            </div>
            <div className="bg-panel w-full h-5 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
