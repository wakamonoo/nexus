export default function PostLoader() {
  return (
    <div className="w-full animate-pulse">
      <div className="py-4 bg-second md:rounded-2xl">
        <div className="w-full h-fit px-4">
          <div className="flex gap-2 w-full items-center">
            <div className="w-12 h-12 bg-panel rounded-full shrink-0" />
            <div className="flex flex-col gap-1">
              <div className="w-32 h-5 bg-panel rounded" />
              <div className="w-36 h-3 bg-panel rounded" />
            </div>
          </div>
          <div className="py-2 flex flex-col gap-1">
            <div className="w-full h-5 bg-panel rounded" />
            <div className="w-full h-5 bg-panel rounded" />
            <div className="w-full h-5 bg-panel rounded" />
            <div className="w-full h-5 bg-panel rounded" />
            <div className="w-32 h-5 bg-panel rounded" />
          </div>
        </div>
        <div className="w-full flex gap-1 py-4 border-t border-panel">
          <div className="w-full h-12 bg-panel" />
          <div className="w-full h-12 bg-panel" />
          <div className="w-full h-12 bg-panel" />
        </div>
      </div>
    </div>
  );
}
