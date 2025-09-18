export default function ImageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <div className="relative w-8 h-8">
          <div
            className="absolute w-full h-full rounded-full border-[3px] border-gray-100/10 border-r-[var(--color-accent)] border-b-[var(--color-accent)] animate-spin"
            style={{ animationDuration: "3s" }}
          />
          <div
            className="absolute w-full h-full rounded-full border-[3px] border-gray-100/10 border-t-[var(--color-accent)] animate-spin"
            style={{ animationDuration: "2s", animationDirection: "reverse" }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0ff]/10 via-transparent to-[#0ff]/5 animate-pulse rounded-full blur-sm" />
      </div>
    </div>
  );
}
