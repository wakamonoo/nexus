export default function PostLoader() {
  return (
    <div className="w-full animate-pulse">
      <div className="w-full h-14 bg-panel" />

      <div className="w-full h-fit p-4 bg-second">
        <div className="flex gap-2 w-full items-start">
          <div className="w-12 h-12 bg-panel rounded-full" />
          <div className="flex flex-col gap-1">
            <div className="w-32 h-6 bg-panel rounded" />
            <div className="w-36 h-4 bg-panel rounded" />
          </div>
        </div>
        <div className="flex flex-col gap-1 py-4">
          <div className="w-full h-6 bg-panel rounded" />
          <div className="w-full h-6 bg-panel rounded" />
          <div className="w-full h-6 bg-panel rounded" />
          <div className="w-full h-6 bg-panel rounded" />
          <div className="w-32 h-6 bg-panel rounded" />
        </div>
        <div className="w-full flex justify-between">
          <div className="w-[30%] h-12 bg-panel rounded-full" />
          <div className="w-[30%] h-12 bg-panel rounded-full" />
          <div className="w-[30%] h-12 bg-panel rounded-full" />
        </div>
      </div>
    </div>
  );
}
