export default function SearchLoader() {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div className="flex items-center justify-center bg-second w-16 h-20 rounded-tl-4xl rounded-tr-4xl p-2">
        <div className="relative w-12 h-16 rounded-tl-4xl rounded-tr-4xl bg-accent animate-pulse">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-second w-4 h-12 rounded-tl-2xl rounded-tr-2xl" />
        </div>
      </div>
    </div>
  );
}
