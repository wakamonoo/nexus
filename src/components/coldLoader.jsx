export default function ColdLoader() {
  return (
    <div className="w-full animate-pulse">
      <div className="w-full h-16 p-2 bg-second flex justify-between items-center gap-2">
        <div className="flex gap-1 items-center">
          <div className="w-8 h-8 bg-panel rounded flex-shrink-0" />
          <div className="w-30 h-10 bg-panel rounded flex-shrink-0" />
        </div>
        <div className="flex items-center gap-2 ml-4">
          <div className="w-8 h-8 bg-panel rounded flex-shrink-0" />
          <div className="w-8 h-8 bg-panel rounded flex-shrink-0" />
          <div className="w-8 h-8 bg-panel rounded flex-shrink-0" />
          <div className="w-10 h-10 bg-panel rounded-full flex-shrink-0" />
        </div>
      </div>

      <div className="w-full h-18 bg-panel   flex justify-center items-center p-2 ">
        <div className="flex items-center gap-1">
          <div className="w-24 h-12 bg-second rounded flex-shrink-0" />
          <div className="flex flex-col gap-1 items-center">
            <div className="w-12 h-6 bg-second rounded flex-shrink-0" />
            <div className="w-12 h-6 bg-second rounded flex-shrink-0" />
          </div>
          <div className="w-24 h-12 bg-second rounded flex-shrink-0" />
          <div className="w-24 h-12 bg-second rounded-full flex-shrink-0" />
        </div>
      </div>
      <div className="px-2 pt-8 flex flex-col gap-4 ">
        <div className="p-4 w-full h-fit bg-panel rounded-tl-4xl rounded-tr-4xl">
          <div className="flex gap-2 items-center w-full">
            <div className="w-12 h-12 bg-second rounded-full flex-shrink-0" />
            <div className="w-full flex flex-col gap-1">
              <div className="w-[40%] h-6 bg-second rounded" />
              <div className="w-[50%] h-4 bg-second rounded" />
            </div>
          </div>
          <div className="py-4 flex flex-col gap-1">
            <div className="w-full h-6 bg-second rounded" />
            <div className="w-full h-6 bg-second rounded" />
            <div className="w-full h-6 bg-second rounded" />
            <div className="w-full h-6 bg-second rounded" />
            <div className="w-[40%] h-6 bg-second rounded" />
          </div>
          <div className="flex gap-4">
            <div className="w-full h-10 bg-second rounded-2xl" />
            <div className="w-full h-10 bg-second rounded-2xl" />
            <div className="w-full h-10 bg-second rounded-2xl" />
          </div>
        </div>

        <div className="p-4 w-full h-fit bg-panel rounded-tl-4xl rounded-tr-4xl">
          <div className="flex gap-2 items-center w-full">
            <div className="w-12 h-12 bg-second rounded-full flex-shrink-0  " />
            <div className="w-full flex flex-col gap-1">
              <div className="w-[40%] h-6 bg-second rounded" />
              <div className="w-[50%] h-4 bg-second rounded" />
            </div>
          </div>
          <div className="py-4 flex flex-col gap-1">
            <div className="w-full h-6 bg-second rounded" />
            <div className="w-full h-6 bg-second rounded" />
            <div className="w-full h-6 bg-second rounded" />
            <div className="w-full h-6 bg-second rounded" />
            <div className="w-[40%] h-6 bg-second rounded" />
          </div>
          <div className="py-4">
            <div className="w-full h-50 bg-second rounded" />
          </div>
          <div className="flex gap-4">
            <div className="w-full h-10 bg-second rounded-2xl" />
            <div className="w-full h-10 bg-second rounded-2xl" />
            <div className="w-full h-10 bg-second rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
