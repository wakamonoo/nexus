export default function PostsLoader() {
  return (
    <div className="w-full h-full overflow-hidden animate-pulse">
      <div className="flex flex-col gap-1 ">
        <div className="w-full h-fit bg-gradient-to-b from-[var(--color-panel)] to-[var(--color-secondary)] rounded-tl-2xl rounded-br-2xl">
          <div className="p-4">
            <div className="flex gap-2 items-center w-full">
              <div className="w-12 h-12 bg-panel rounded-full flex-shrink-0" />
              <div className="w-full flex flex-col gap-1">
                <div className="w-[40%] h-6 bg-panel rounded" />
                <div className="w-[50%] h-4 bg-panel rounded" />
              </div>
            </div>
            <div className="py-4 flex flex-col gap-1">
              <div className="w-[40%] h-6 bg-panel rounded-full" />
              <div className="w-full h-6 bg-panel rounded" />
              <div className="w-full h-6 bg-panel rounded" />
              <div className="w-full h-6 bg-panel rounded" />
              <div className="w-full h-6 bg-panel rounded" />
              <div className="w-[40%] h-6 bg-panel rounded" />
            </div>
          </div>
          <div className="w-full flex gap-1 pb-4">
            <div className="w-full h-12 bg-panel" />
            <div className="w-full h-12 bg-panel" />
            <div className="w-full h-12 bg-panel" />
          </div>
        </div>

        <div className="w-full h-fit bg-gradient-to-b from-[var(--color-panel)] to-[var(--color-secondary)] rounded-tl-2xl rounded-br-2xl">
          <div className="p-4">
            <div className="flex gap-2 items-center w-full">
              <div className="w-12 h-12 bg-panel rounded-full flex-shrink-0  " />
              <div className="w-full flex flex-col gap-1">
                <div className="w-[40%] h-6 bg-panel rounded" />
                <div className="w-[50%] h-4 bg-panel rounded" />
              </div>
            </div>
            <div className="py-4 flex flex-col gap-1">
              <div className="w-[30%] h-6 bg-panel rounded-full" />
              <div className="w-full h-6 bg-panel rounded" />
              <div className="w-full h-6 bg-panel rounded" />
              <div className="w-full h-6 bg-panel rounded" />
              <div className="w-full h-6 bg-panel rounded" />
              <div className="w-[40%] h-6 bg-panel rounded" />
            </div>
            <div className="py-4">
              <div className="w-full h-50 bg-panel rounded" />
            </div>
          </div>
          <div className="w-full flex gap-1 pb-4">
            <div className="w-full h-12 bg-panel" />
            <div className="w-full h-12 bg-panel" />
            <div className="w-full h-12 bg-panel" />
          </div>
        </div>
      </div>
    </div>
  );
}
