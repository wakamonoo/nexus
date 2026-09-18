export default function PostsLoader() {
  return (
    <div className="w-full h-full overflow-hidden animate-pulse">
      <div className="flex flex-col gap-1">
        <div className="w-full h-fit bg-linear-to-b from-(--color-panel) to-(--color-secondary) rounded-tl-2xl rounded-br-2xl">
          <div className="p-4">
            <div className="flex gap-2 items-center w-full">
              <div className="w-12 h-12 bg-panel rounded-full shrink-0" />
              <div className="w-full flex flex-col gap-1">
                <div className="w-[40%] h-5 bg-panel rounded" />
                <div className="w-[50%] h-3 bg-panel rounded" />
              </div>
            </div>
            <div className="py-2 flex flex-col gap-1">
              <div className="w-full h-5 bg-panel rounded" />
              <div className="w-full h-5 bg-panel rounded" />
              <div className="w-full h-5 bg-panel rounded" />
              <div className="w-full h-5 bg-panel rounded" />
              <div className="w-[40%] h-5 bg-panel rounded" />
            </div>
          </div>
          <div className="w-full flex gap-1 py-4 border-t border-panel">
            <div className="w-full h-12 bg-panel" />
            <div className="w-full h-12 bg-panel" />
            <div className="w-full h-12 bg-panel" />
          </div>
        </div>

        <div className="w-full h-fit bg-linear-to-b from-(--color-panel) to-(--color-secondary) rounded-tl-2xl rounded-br-2xl">
          <div className="p-4">
            <div className="flex gap-2 items-center w-full">
              <div className="w-12 h-12 bg-panel rounded-full shrink-0 " />
              <div className="w-full flex flex-col gap-1">
                <div className="w-[40%] h-5 bg-panel rounded" />
                <div className="w-[50%] h-3 bg-panel rounded" />
              </div>
            </div>
            <div className="py-2 flex flex-col gap-1">
              <div className="w-full h-5 bg-panel rounded" />
              <div className="w-full h-5 bg-panel rounded" />
              <div className="w-full h-5 bg-panel rounded" />
              <div className="w-full h-5 bg-panel rounded" />
              <div className="w-[40%] h-5 bg-panel rounded" />
            </div>
          </div>
          <div className="w-full h-50 bg-panel mb-2" />
          <div className="w-full flex gap-1 py-4 border-t border-panel">
            <div className="w-full h-12 bg-panel" />
            <div className="w-full h-12 bg-panel" />
            <div className="w-full h-12 bg-panel" />
          </div>
        </div>
      </div>
    </div>
  );
}
