export default function AsideLoader() {
  return (
    <div className="w-full h-full overflow-hidden animate-pulse">
      <div className="py-2 flex flex-col gap-1 ">
        <div className="w-[40%] h-6 bg-second rounded" />
        <div className="p-4 mt-2 w-full h-fit border-1 border-panel rounded-2xl">
          <div className="flex gap-2 items-center w-full">
            <div className="w-6 h-6 bg-second rounded-full flex-shrink-0  " />
            <div className="w-[40%] h-6 bg-second rounded" />
          </div>
          <div className="py-2 flex flex-col gap-1">
            <div className="w-full h-6 bg-second rounded" />
            <div className="w-full h-6 bg-second rounded" />
            <div className="w-[40%] h-6 bg-second rounded" />
          </div>
          <div className="flex mt-2 items-center gap-4 justify-between">
            <div className="w-full h-6 bg-second rounded" />
            <div className="w-full h-6 bg-second rounded" />
          </div>
        </div>
      </div>

      <div className="p-4 mt-2 w-full h-fit border-1 border-panel rounded-2xl">
        <div className="flex gap-2 items-center w-full">
          <div className="w-8 h-8 bg-second rounded-full flex-shrink-0  " />
          <div className="w-[40%] h-6 bg-second rounded" />
        </div>
        <div className="py-2 flex flex-col gap-1">
          <div className="w-full h-6 bg-second rounded" />
          <div className="w-full h-6 bg-second rounded" />
          <div className="w-[40%] h-6 bg-second rounded" />
        </div>
        <div className="flex mt-2 items-center gap-4 justify-between">
          <div className="w-full h-6 bg-second rounded" />
          <div className="w-full h-6 bg-second rounded" />
        </div>
      </div>
    </div>
  );
}
