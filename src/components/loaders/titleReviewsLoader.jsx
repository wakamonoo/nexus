export default function TitleReviewsLoader() {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col gap-4 py-4 md:pt-0 md:overflow-y-auto scrollbar-hide border-t-1 border-panel md:border-none mt-4 md:mt-0">
        <div className="p-4 mt-4 md:mt-0 w-full h-fit bg-second border border-panel rounded-2xl">
          <div className="flex gap-2 items-center w-full pb-2 border-b border-[var(--color-vibranium)]/20">
            <div className="w-12 h-12 bg-panel rounded-full flex-shrink-0  " />
            <div className="flex flex-col w-full gap-1">
              <div className="w-[60%] h-5 bg-panel rounded" />
              <div className="w-[40%] h-3 bg-panel rounded" />
            </div>
          </div>
          <div className="flex mt-2 items-start ">
            <div className="flex w-8 h-8 shrink-0">
              <div className="w-3 h-3 rounded bg-panel" />
            </div>
            <div className="w-full flex flex-col gap-2 -ml-2">
              <div className="w-full h-5 bg-panel rounded" />
              <div className="w-full h-5 bg-panel rounded" />
              <div className="w-[40%] h-5 bg-panel rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
