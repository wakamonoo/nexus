export default function AsideLoader() {
  return (
    <div className="w-full h-full overflow-hidden animate-pulse">
      <div className="py-2 flex flex-col gap-1 ">
        <div className="w-[40%] h-6 bg-second rounded" />

        <div className="p-4 mt-2 w-full h-fit border-1 border-panel rounded-2xl">
          <div className="flex w-[40%] h-8 bg-second rounded-full" />
          <div className="mt-12 flex w-[40%] h-6 bg-second rounded" />
          <div className="flex mt-4 items-start gap-4 justify-between">
            <div className="w-4 h-4 bg-second rounded" />
            <div className="w-full flex flex-col gap-2">
              <div className="w-full h-6 bg-second rounded" />
              <div className="w-full h-6 bg-second rounded" />
            </div>
          </div>
        </div>

        <div className="p-4 mt-2 w-full h-fit border-1 border-panel rounded-2xl hidden lg:block">
          <div className="flex w-[50%] h-8 bg-second rounded-full" />
          <div className="mt-12 flex w-[60%] h-6 bg-second rounded" />
          <div className="flex mt-4 items-start gap-4 justify-between">
            <div className="w-4 h-4 bg-second rounded" />
            <div className="w-full flex flex-col gap-2">
              <div className="w-full h-6 bg-second rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
