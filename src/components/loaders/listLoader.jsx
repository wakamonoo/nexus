export default function ListLoader() {
  return (
    <div className="flex flex-col items-start justify-center w-full h-full gap-4 overflow-hidden animate-pulse">
      <div className="w-full grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 mt-6 items-start">
        <div className="flex w-full items-center gap-2">
          <div className="bg-panel w-full h-[35vh] rounded-xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
          <div className="flex items-center gap-4">
            <div className="bg-panel w-26 h-40 md:w-32 md:h-46 rounded shrink-0" />
            <div className="bg-panel w-full h-6 rounded" />
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-panel w-26 h-40 md:w-32 md:h-46 rounded shrink-0" />
            <div className="flex flex-col gap-1 w-full">
              <div className="bg-panel w-32 h-6 rounded" />
              <div className="bg-panel w-full h-4 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-panel w-26 h-40 md:w-32 md:h-46 rounded shrink-0" />
            <div className="bg-panel w-40 h-6 rounded" />
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-panel w-26 h-40 md:w-32 md:h-46 rounded shrink-0" />
            <div className="bg-panel w-36 h-6 rounded" />
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-panel w-26 h-40 md:w-32 md:h-46 rounded shrink-0" />
            <div className="flex flex-col gap-1 w-full">
              <div className="bg-panel w-32 h-6 rounded" />
              <div className="bg-panel w-full h-4 rounded" />
              <div className="bg-panel w-full h-4 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-panel w-26 h-40 md:w-32 md:h-46 rounded shrink-0" />
            <div className="bg-panel w-24 h-6 rounded" />
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-panel w-26 h-40 md:w-32 md:h-46 rounded shrink-0" />
            <div className="bg-panel w-full h-6 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
