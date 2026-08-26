export default function RinaLoaderNews() {
  return (
    <div className="w-full animate-pulse">
      <div className="py-4 bg-gradient-to-b from-[var(--color-panel)] to-[var(--color-secondary)]">
        <div className="w-full h-fit px-4">
          <div className="flex gap-2 w-full items-center">
            <div className="w-12 h-12 bg-panel rounded-full" />
            <div className="flex flex-col gap-1">
              <div className="w-32 h-6 bg-panel rounded" />
              <div className="w-36 h-4 bg-panel rounded" />
            </div>
          </div>
          <div className="flex flex-col gap-1 py-4">
            <div className="w-[40%] h-6 bg-panel rounded-full" />
            <div className="w-full h-6 bg-panel rounded" />
            <div className="w-full h-6 bg-panel rounded" />
            <div className="w-full h-6 bg-panel rounded" />
            <div className="w-full h-6 bg-panel rounded" />
            <div className="w-32 h-6 bg-panel rounded" />
          </div>
        </div>
      </div>
      <div className="mt-2 divide-y divide-[var(--color-panel)]">
        <div className="p-2 bg-second w-full h-28 flex gap-4">
          <div className="w-[24vh] h-full bg-panel shrink-0"></div>
          <div className="flex flex-col w-full gap-2">
            <div className="w-full h-6 bg-panel rounded" />
            <div className="w-[25%] h-6 bg-panel rounded" />
          </div>
        </div>
        <div className="p-2 bg-second w-full h-28 flex gap-4">
          <div className="w-[24vh] h-full bg-panel shrink-0"></div>
          <div className="flex flex-col w-full gap-2">
            <div className="w-full h-6 bg-panel rounded" />
            <div className="w-[35%] h-6 bg-panel rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
