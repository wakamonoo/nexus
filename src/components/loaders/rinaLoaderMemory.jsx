export default function RinaLoaderMemory() {
  return (
    <div className="text-center">
      <div className="flex gap-2 justify-center">
        <span className="size-3 animate-ping rounded-full bg-accent"></span>
        <span className="size-3 animate-ping rounded-full bg-accent [animation-delay:0.2s]"></span>
        <span className="size-3 animate-ping rounded-full bg-accent [animation-delay:0.4s]"></span>
      </div>
      <h2 className="text-sm text-normal mt-4">Kindly wait...</h2>
      <p className="text-xs text-vibe opacity-40">
        While rina is processing your watch history
      </p>
    </div>
  );
}
