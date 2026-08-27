export default function InfoProfileLoader() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="flex items-center w-full gap-2 py-4">
        <div className="w-32 h-32 bg-panel rounded-full flex-shrink-0  " />
        <div className="flex flex-col justify-center items-start">
          <div className="w-[60%] h-6 bg-panel rounded" />
          <div className="w-[200] flex flex-col gap-1 mt-1">
            <div className="w-full h-4 bg-panel rounded-full" />
            <div className="w-full h-4 bg-panel rounded-full" />
            <div className="w-full h-4 bg-panel rounded-full" />
            <div className="w-full h-4 bg-panel rounded-full" />
          </div>
        </div>
      </div>
      <div className="py-2 flex flex-col gap-1 w-full">
        <div className="w-full h-5 bg-panel rounded" />
        <div className="w-[40%] h-5 bg-panel rounded" />
      </div>
    </div>
  );
}
