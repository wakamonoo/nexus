export default function ShowLoader() {
  return (
    <div className="w-full animate-pulse overflow-hidden">
      <div className="grid md:grid-cols-[3fr_1fr] md:gap-8 md:h-[calc(100vh-6rem)]">
        <div className="min-w-0">
          <div className="mt-42 md:mt-48 lg:mt-76">
            <div className="py-4 flex flex-col gap-1">
              <div className="w-[40%] h-5 rounded bg-panel mb-4" />
              <div className="w-full h-5 rounded bg-panel" />
              <div className="w-full h-5 rounded bg-panel" />
              <div className="w-full h-5 rounded bg-panel" />
            </div>
          </div>
          <div className="flex flex-col gap-2 pb-4">
            <div className="bg-panel w-24 h-6 rounded" />
            <div className="flex gap-2 w-full">
              <div className="bg-panel w-24 h-30 rounded" />
              <div className="bg-panel w-24 h-30  rounded" />
            </div>
          </div>
          <div className="flex flex-col gap-2 pb-4">
            <div className="bg-panel w-18 h-6 rounded" />
            <div className="flex gap-2 w-full">
              <div className="bg-panel w-24 h-35 rounded" />
              <div className="bg-panel w-24 h-35 rounded" />
              <div className="bg-panel w-24 h-35 rounded" />
            </div>
          </div>
        </div>

        <div className="min-w-0 flex flex-col md:h-full">
          <div className="flex flex-col gap-4 py-4 md:pt-0 mt-4 md:mt-0">
            <div className="p-4 mt-4 md:mt-0 w-full h-fit bg-second border-1 border-panel rounded-2xl">
              <div className="flex gap-2 items-center w-full">
                <div className="w-12 h-12 bg-panel rounded-full flex-shrink-0  " />
                <div className="flex flex-col w-full gap-1">
                  <div className="w-[60%] h-6 bg-panel rounded" />
                  <div className="w-[40%] h-4 bg-panel rounded" />
                </div>
              </div>
              <div className="mt-4 flex gap-1 w-full">
                <div className="w-4 h-4 bg-panel rounded" />
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <div className="w-full h-6 bg-panel rounded" />
                  <div className="w-full h-6 bg-panel rounded" />
                  <div className="w-[40%] h-6 bg-panel rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
