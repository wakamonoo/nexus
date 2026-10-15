export default function MomentArchiveLoader() {
  return (
    <div className="animate-pulse relative">
      <div className="rounded-full p-0.5 border-4 border-panel">
        <div className="w-18 h-18 rounded-full bg-panel shrink-0" />
      </div>
      <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 h-8 w-8 rounded-md border-2 border-(--color-bg) bg-second overflow-hidden" />
    </div>
  );
}
