export default function LightBox() {
  return (
    <div className="absolute bg-[var(--color-secondary)]/50 w-full p-2 bottom-0 left-0">
      <div className="flex flex-col">
        <p className="text-base mt-2 font-bold leading-3.5">
          {currentPostInfo.userName}
        </p>
        <p className="text-xs text-vibe">{currentPostInfo.date}</p>
      </div>
      <div>
        <p className="text-base text-normal">{currentPostInfo.text}</p>
      </div>
      <div className="flex justify-between items-center pt-4 border-t gap-4 mt-2">
        <div className="flex items-center justify-center gap-2 border-1 p-4 rounded-4xl w-[33%] h-12">
          <FaBolt className="text-xl" />
          <p className="text-xs font-light text-vibe">21</p>
        </div>
        <div className="flex items-center justify-center gap-2 border-1 p-4 rounded-4xl w-[33%] h-12">
          <FaComment className="text-xl" />
          <p className="text-xs font-light text-vibe">21</p>
        </div>
        <div className="flex items-center justify-center gap-2 border-1 p-4 rounded-4xl w-[33%] h-12">
          <FaShare className="text-xl" />
          <p className="text-xs font-light text-vibe">21</p>
        </div>
      </div>
    </div>
  );
}
