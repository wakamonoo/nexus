export default function RegularButtons({ onClick, type, children }) {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="cursor-pointer bg-accent hover:bg-[var(--color-accent)]/80 w-full p-2 rounded flex justify-center items-center gap-1"
      >
        {children}
      </button>
    );
  }
  if (type) {
    return (
      <button
        type={type}
        className="cursor-pointer bg-accent hover:bg-[var(--color-accent)]/80 w-full p-2 rounded flex justify-center items-center gap-1"
      >
        {children}
      </button>
    );
  }
}
