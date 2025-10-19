export default function SecondaryButtons({ onClick, children }) {
  return (
    <div onClick={onClick} className="cursor-pointer mt-2 bg-panel hover:bg-[var(--color-panel)]/80 w-full p-2 rounded flex justify-center items-center gap-1">
      {children}
    </div>
  );
}
