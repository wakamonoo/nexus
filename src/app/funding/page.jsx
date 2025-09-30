export default function Funding() {
  return (
    <div className="w-full h-full overflow-hidden animate-pulse">
      <div className="p-2 flex flex-col gap-1 ">
        <div className="p-4 w-full h-fit bg-gradient-to-b from-[var(--color-panel)] to-[var(--color-secondary)] rounded-tl-2xl rounded-br-2xl">
          <div className="flex gap-2 items-center w-full">
            <div className="w-12 h-12 bg-second rounded-full flex-shrink-0" />
            <div className="w-full flex flex-col gap-1">
              <div className="w-[40%] h-6 bg-second rounded" />
              <div className="w-[50%] h-4 bg-second rounded" />
            </div>
          </div>
          <div className="py-4 flex flex-col gap-1">
            <div className="w-full h-6 bg-second rounded" />
            <div className="w-full h-6 bg-second rounded" />
            <div className="w-full h-6 bg-second rounded" />
            <div className="w-full h-6 bg-second rounded" />
            <div className="w-[40%] h-6 bg-second rounded" />
          </div>
          <div className="flex gap-4">
            <div className="w-full h-10 bg-second rounded-2xl" />
            <div className="w-full h-10 bg-second rounded-2xl" />
            <div className="w-full h-10 bg-second rounded-2xl" />
          </div>
        </div>

        <div className="p-4 w-full h-fit bg-gradient-to-b from-[var(--color-panel)] to-[var(--color-secondary)] rounded-tl-2xl rounded-br-2xl">
          <div className="flex gap-2 items-center w-full">
            <div className="w-12 h-12 bg-second rounded-full flex-shrink-0  " />
            <div className="w-full flex flex-col gap-1">
              <div className="w-[40%] h-6 bg-second rounded" />
              <div className="w-[50%] h-4 bg-second rounded" />
            </div>
          </div>
          <div className="py-4 flex flex-col gap-1">
            <div className="w-full h-6 bg-second rounded" />
            <div className="w-full h-6 bg-second rounded" />
            <div className="w-full h-6 bg-second rounded" />
            <div className="w-full h-6 bg-second rounded" />
            <div className="w-[40%] h-6 bg-second rounded" />
          </div>
          <div className="py-4">
            <div className="w-full h-50 bg-second rounded" />
          </div>
          <div className="flex gap-4">
            <div className="w-full h-10 bg-second rounded-2xl" />
            <div className="w-full h-10 bg-second rounded-2xl" />
            <div className="w-full h-10 bg-second rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
