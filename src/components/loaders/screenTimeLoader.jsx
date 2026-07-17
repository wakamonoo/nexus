export default function ScreenTimeLoader() {
  return (
    <div className="w-full h-full overflow-hidden animate-pulse">
      <div className="flex flex-col gap-1 ">
        <div className="w-full h-fit bg-gradient-to-b from-[var(--color-panel)] to-[var(--color-secondary)]">
          <div className="p-4">
            <div className="flex gap-2 items-center justify-between w-full">
              <div className="w-full flex flex-col gap-1">
                <div className="w-[40%] h-6 bg-panel rounded" />
                <div className="w-[60%] h-4 bg-panel rounded" />
              </div>
              <div className="w-full flex flex-col items-end gap-1">
                <div className="w-8 h-8 bg-panel rounded flex-shrink-0" />
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <div className="flex justify-between bg-panel border border-[var(--color-secondary)] rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[var(--color-secondary)] rounded flex-shrink-0" />
                  <div className="w-12 h-12 bg-[var(--color-secondary)] rounded-full flex-shrink-0" />
                  <div className="flex flex-col gap-2">
                    <div className="w-24 h-6 bg-[var(--color-secondary)] rounded" />
                    <div className="w-12 h-4 bg-[var(--color-secondary)] rounded" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <div className="w-8 h-6 bg-[var(--color-secondary)] rounded" />
                  <div className="w-24 h-4 bg-[var(--color-secondary)] rounded" />
                </div>
              </div>

              <div className="flex justify-between bg-panel border border-[var(--color-secondary)] rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[var(--color-secondary)] rounded flex-shrink-0" />
                  <div className="w-12 h-12 bg-[var(--color-secondary)] rounded-full flex-shrink-0" />
                  <div className="flex flex-col gap-2">
                    <div className="w-20 h-6 bg-[var(--color-secondary)] rounded" />
                    <div className="w-12 h-4 bg-[var(--color-secondary)] rounded" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <div className="w-10 h-6 bg-[var(--color-secondary)] rounded" />
                  <div className="w-24 h-4 bg-[var(--color-secondary)] rounded" />
                </div>
              </div>

              <div className="flex justify-between bg-panel border border-[var(--color-secondary)] rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[var(--color-secondary)] rounded flex-shrink-0" />
                  <div className="w-12 h-12 bg-[var(--color-secondary)] rounded-full flex-shrink-0" />
                  <div className="flex flex-col gap-2">
                    <div className="w-28 h-6 bg-[var(--color-secondary)] rounded" />
                    <div className="w-12 h-4 bg-[var(--color-secondary)] rounded" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <div className="w-8 h-6 bg-[var(--color-secondary)] rounded" />
                  <div className="w-24 h-4 bg-[var(--color-secondary)] rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
