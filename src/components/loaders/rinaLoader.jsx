export default function RinaLoader() {
  return (
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[var(--color-accent)]/50 mx-auto"></div>
      <h2 className="text-base text-normal mt-4">Kindly wait...</h2>
      <p className="text-xs text-vibe opacity-40">
        While rina is processing your watch history
      </p>
    </div>
  );
}
