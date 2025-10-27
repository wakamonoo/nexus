export default function CircledNotAllowedButtons({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="cursor-not-allowed bg-[var(--color-accent)]/80 hover:bg-[var(--color-accent)]/60 w-full p-2 rounded-full flex justify-center items-center gap-1"
    >
      {children}
    </button>
  );
}