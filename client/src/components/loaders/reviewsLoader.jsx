export default function ReviewsLoader() {
  return (
    <div className="w-full h-full overflow-hidden animate-pulse">
      <div className="flex flex-col gap-4 md:pr-2">
        <div className="p-4 w-full h-fit border border-panel rounded-3xl">
          <div className="flex w-[40%] h-8 bg-second rounded-full" />
          <div className="mt-12 flex w-[40%] h-5 bg-second rounded" />
          <div className="flex mt-8 items-start">
            <div className="flex w-8 h-8 shrink-0">
              <div className="w-3 h-3 rounded bg-second" />
            </div>
            <div className="w-full flex flex-col gap-2 -ml-2">
              <div className="w-full h-5 bg-second rounded" />
              <div className="w-full h-5 bg-second rounded" />
            </div>
          </div>
          <div className="w-full flex justify-end mt-4 mb-2">
            <div className="w-24 h-3 bg-second rounded" />
          </div>
        </div>

        <div className="p-4 w-full h-fit border border-panel rounded-3xl hidden lg:block">
          <div className="flex w-[50%] h-8 bg-second rounded-full" />
          <div className="mt-12 flex w-[60%] h-5 bg-second rounded" />
          <div className="flex mt-8 items-start">
            <div className="flex w-8 h-8 shrink-0">
              <div className="w-3 h-3 rounded bg-second" />
            </div>
            <div className="w-full flex flex-col gap-2 -ml-2">
              <div className="w-full h-5 bg-second rounded" />
            </div>
          </div>
          <div className="w-full flex justify-end mt-4 mb-2">
            <div className="w-22 h-3 bg-second rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
