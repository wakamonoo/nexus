export default function SecondaryButtons({ onClick, htmlFor, children }) {
  if (htmlFor) {
    return (
      <label
        htmlFor={htmlFor}
        className="cursor-pointer mt-2 bg-panel hover:bg-[var(--color-panel)]/80 w-full p-2 rounded flex justify-center items-center gap-1"
      >
        {children}
      </label>
    );
  }
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="cursor-pointer mt-2 bg-panel hover:bg-[var(--color-panel)]/80 w-full p-2 rounded flex justify-center items-center gap-1"
      >
        {children}
      </button>
    );
  }
}