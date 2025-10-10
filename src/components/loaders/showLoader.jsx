export default function ShowLoader() {
  return (
    <div className="w-full p-8 animate-pulse">
      <div className="mt-4">
        <div className="flex justify-between">
          <div className="flex flex-col gap-1 ">
            <div className="w-32 h-8 rounded bg-second" />
            <div className="w-24 h-5 rounded bg-second" />
            <div className="mt-4 flex flex-col gap-1">
              <div className="w-24 h-5 rounded bg-second" />
              <div className="w-32 h-6 rounded bg-second" />
              <div className="flex gap-1">
                <div className="w-16 h-5 rounded bg-second" />
                <div className="w-12 h-5 rounded bg-second" />
              </div>
              <div className="flex gap-1">
                <div className="w-10 h-5 rounded bg-second" />
                <div className="w-24 h-5 rounded bg-second" />
              </div>
            </div>
          </div>
          <div className="w-[40%]">
            <div className="w-full h-48 rounded bg-second" />
          </div>
        </div>
        <div className="mt-8">
          <div className="w-full flex justify-between items-center gap-1">
            <div className="w-40 h-10 rounded-full bg-second" />
            <div className="w-24 h-8 rounded bg-second" />
          </div>
          <div className="py-4 flex flex-col gap-1">
            <div className="w-full h-5 rounded bg-second" />
            <div className="w-full h-5 rounded bg-second" />
            <div className="w-full h-5 rounded bg-second" />
            <div className="w-full h-5 rounded bg-second" />
          </div>
        </div>
      </div>
    </div>
  );
}
