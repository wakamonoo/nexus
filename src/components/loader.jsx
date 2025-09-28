export default function Loader() {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center backdrop-blur-lg">
      <div className="flex items-center justify-center bg-second w-32 h-32 p-2 rounded-full animate-pulse">
        <div className="relative w-12 h-16 rounded-tl-4xl rounded-tr-4xl bg-accent animate-pulse">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-second w-4 h-12 rounded-tl-2xl rounded-tr-2xl" />
        </div>
      </div>
    </div>
  );
}
