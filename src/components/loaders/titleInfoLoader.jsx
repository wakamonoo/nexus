export default function TitleInfoLoader() {
  return (
    <div className="animate-pulse">
      <div className="md:sticky md:top-0 min-w-0">
        <div className="mt-42 md:mt-48 lg:mt-76">
          <div className="py-4 flex flex-col gap-1">
            <div className="w-[40%] h-5 rounded bg-panel mb-4" />
            <div className="w-full h-5 rounded bg-panel" />
            <div className="w-full h-5 rounded bg-panel" />
            <div className="w-full h-5 rounded bg-panel" />
          </div>
        </div>
        <div className="flex flex-col gap-2 pb-4">
          <div className="bg-panel w-24 h-4 rounded" />
          <div className="flex gap-2 w-full">
            <div className="bg-panel w-24 h-30 rounded" />
            <div className="bg-panel w-24 h-30  rounded" />
          </div>
        </div>
        <div className="flex flex-col gap-2 pb-4">
          <div className="bg-panel w-18 h-4 rounded" />
          <div className="flex gap-2 w-full">
            <div className="bg-panel w-24 h-35 rounded" />
            <div className="bg-panel w-24 h-35 rounded" />
            <div className="bg-panel w-24 h-35 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
