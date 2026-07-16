export default function CountdownLoader() {
  return (
    <div className="w-full h-full overflow-hidden animate-pulse">
      <div className="flex flex-col gap-1 ">
        <div className="w-full h-fit bg-gradient-to-b from-[var(--color-panel)] to-[var(--color-secondary)]">
          <div className="p-4">
            <div className="flex flex-col gap-2 items-center justify-center">
              <div className="w-[60%] h-6 bg-panel rounded" />
              <div className="flex items-center justify-center gap-3">
                <div className="w-18 h-18 bg-panel rounded flex-shrink-0" />
                <div className="w-18 h-18 bg-panel rounded flex-shrink-0" />
                <div className="w-18 h-18 bg-panel rounded flex-shrink-0" />
                <div className="w-18 h-18 bg-panel rounded flex-shrink-0" />
              </div>
              <div className="w-[30%] h-4 bg-panel rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
