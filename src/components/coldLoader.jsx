export default function ColdLoader() {
  return (
    <div className="w-full">
      <div className="w-full h-16 p-2 bg-second animate-pulse flex items-center gap-2">
        <div className="w-8 h-8 bg-panel rounded flex-shrink-0 animate-pulse" />
        <div className="w-30 h-10 bg-panel rounded flex-shrink-0 animate-pulse" />
        <div className="flex items-center gap-2 ml-4">
          <div className="w-8 h-8 bg-panel rounded flex-shrink-0 animate-pulse" />
          <div className="w-8 h-8 bg-panel rounded flex-shrink-0 animate-pulse" />
          <div className="w-8 h-8 bg-panel rounded flex-shrink-0 animate-pulse" />
          <div className="w-10 h-10 bg-panel rounded-full flex-shrink-0 animate-pulse" />
        </div>
      </div>
      <div className="w-full h-18 bg-panel animate-pulse flex items-center p-2">
        <div className="flex items-center gap-1">
          <div className="w-24 h-12 bg-second rounded flex-shrink-0 animate-pulse" />
          <div className="flex flex-col gap-1 items-center">
            <div className="w-12 h-6 bg-second rounded flex-shrink-0 animate-pulse" />
            <div className="w-12 h-6 bg-second rounded flex-shrink-0 animate-pulse" />
          </div>
          <div className="w-24 h-12 bg-second rounded flex-shrink-0 animate-pulse" />
          <div className="w-24 h-12 bg-second rounded-full flex-shrink-0 animate-pulse" />
        </div>
      </div>
      <div className="px-2 pt-8 flex flex-col gap-4">
        <div className="p-4 w-full h-fit bg-panel rounded-tl-4xl rounded-tr-4xl animate-pulse">
          <div className="flex gap-2 items-center w-full">
            <div className="w-12 h-12 bg-second rounded-full flex-shrink-0 animate-pulse" />
            <div className="w-full flex flex-col gap-1">
              <div className="w-[40%] h-4 bg-second rounded animate-pulse" />
              <div className="w-[50%] h-2 bg-second rounded animate-pulse" />
            </div>
          </div>
          <div className="py-4 flex flex-col gap-1">
            <div className="w-full h-4 bg-second rounded animate-pulse" />
            <div className="w-full h-4 bg-second rounded animate-pulse" />
            <div className="w-full h-4 bg-second rounded animate-pulse" />
            <div className="w-full h-4 bg-second rounded animate-pulse" />
            <div className="w-[40%] h-4 bg-second rounded animate-pulse" />
          </div>
          <div className="flex gap-4">
            <div className="w-full h-10 bg-second rounded-2xl animate-pulse" />
            <div className="w-full h-10 bg-second rounded-2xl animate-pulse" />
            <div className="w-full h-10 bg-second rounded-2xl animate-pulse" />
          </div>
        </div>

        <div className="p-4 w-full h-fit bg-panel rounded-tl-4xl rounded-tr-4xl animate-pulse">
          <div className="flex gap-2 items-center w-full">
            <div className="w-12 h-12 bg-second rounded-full flex-shrink-0 animate-pulse" />
            <div className="w-full flex flex-col gap-1">
              <div className="w-[40%] h-4 bg-second rounded animate-pulse" />
              <div className="w-[50%] h-2 bg-second rounded animate-pulse" />
            </div>
          </div>
          <div className="py-4 flex flex-col gap-1">
            <div className="w-full h-4 bg-second rounded animate-pulse" />
            <div className="w-full h-4 bg-second rounded animate-pulse" />
            <div className="w-full h-4 bg-second rounded animate-pulse" />
            <div className="w-full h-4 bg-second rounded animate-pulse" />
            <div className="w-[40%] h-4 bg-second rounded animate-pulse" />
          </div>
          <div className="py-4">
            <div className="w-full h-50 bg-second rounded animate-pulse" />
          </div>
          <div className="flex gap-4">
            <div className="w-full h-10 bg-second rounded-2xl animate-pulse" />
            <div className="w-full h-10 bg-second rounded-2xl animate-pulse" />
            <div className="w-full h-10 bg-second rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
