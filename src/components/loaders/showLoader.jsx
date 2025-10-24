export default function ShowLoader() {
  return (
    <div className="w-full animate-pulse">
      <div className="grid md:grid-cols-[3fr_1fr] md:gap-8 md:h-[calc(100vh-6rem)]">
        <div>
          <div className="flex justify-between">
            <div className="flex flex-col gap-1 ">
              <div className="flex gap-2 items-end">
                <div className="w-32 h-8 rounded bg-panel" />
                <div className="w-12 h-6 rounded bg-panel" />
              </div>
              <div className="flex gap-2 items-end">
                <div className="w-24 h-5 rounded bg-panel" />
                <div className="w-16 h-5 rounded bg-panel" />
              </div>
              <div className="mt-4 flex flex-col gap-1">
                <div className="w-24 h-5 rounded bg-panel" />
                <div className="w-32 h-6 rounded bg-panel" />
                <div className="flex gap-1 mt-2">
                  <div className="w-24 h-5 rounded bg-panel" />
                  <div className="w-12 h-5 rounded bg-panel" />
                </div>
                <div className="flex gap-1">
                  <div className="w-32 h-5 rounded bg-panel" />
                  <div className="w-6 h-5 rounded bg-panel" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full flex justify-between items-center gap-1">
              <div className="w-40 h-10 rounded-full bg-panel" />
              <div className="w-24 h-8 rounded bg-panel" />
            </div>
            <div className="py-4 flex flex-col gap-1">
              <div className="w-full h-5 rounded bg-panel" />
              <div className="w-full h-5 rounded bg-panel" />
              <div className="w-full h-5 rounded bg-panel" />
              <div className="w-full h-5 rounded bg-panel" />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-full h-10 rounded-full bg-panel" />
            <div className="w-full h-10 rounded-full bg-panel" />
          </div>
        </div>
        <div className="p-4 mt-4 md:mt-0 w-full h-fit bg-second border-1 border-panel rounded-2xl">
          <div className="flex gap-2 items-center w-full">
            <div className="w-8 h-8 bg-panel rounded-full flex-shrink-0  " />
            <div className="w-[40%] h-6 bg-panel rounded" />
          </div>
          <div className="py-2 flex flex-col gap-1">
            <div className="w-full h-6 bg-panel rounded" />
            <div className="w-full h-6 bg-panel rounded" />
            <div className="w-[40%] h-6 bg-panel rounded" />
          </div>
          <div className="flex mt-2 items-center gap-4 justify-between">
            <div className="w-full h-6 bg-panel rounded" />
            <div className="w-full h-6 bg-panel rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
