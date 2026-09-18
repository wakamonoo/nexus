export default function NexusReviewLoader() {
  return (
    <div className="animate-pulse py-7">
      <div className="flex gap-2 w-full">
        <div className="w-10 h-10 shrink-0 rounded-full bg-panel" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <div className="w-32 h-4 bg-panel rounded" />
            <div className="flex gap-0.5">
              <div className="w-4 h-4 bg-panel rounded" />
              <div className="w-4 h-4 bg-panel rounded" />
              <div className="w-4 h-4 bg-panel rounded" />
              <div className="w-4 h-4 bg-panel rounded" />
              <div className="w-4 h-4 bg-panel rounded" />
            </div>
          </div>
          <div className="w-36 h-3 bg-panel rounded mt-1" />
          <div className="flex mt-2 items-start">
            <div className="flex w-8 h-8 shrink-0">
              <div className="w-3 h-3 rounded bg-panel" />
            </div>
            <div className="w-full flex flex-col gap-2 -ml-2">
              <div className="w-full h-5 bg-panel rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
