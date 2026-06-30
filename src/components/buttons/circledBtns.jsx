export default function CircledButtons({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer bg-accent hover:bg-[var(--color-accent)]/80 w-full py-2 px-4 rounded-full flex justify-center items-center gap-1"
    >
      {children}
    </button>
  );
}