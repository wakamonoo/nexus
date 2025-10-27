export default function RegularButtons({ onClick, type = "button", children }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="cursor-pointer mt-2 bg-accent hover:bg-[var(--color-accent)]/80 w-full p-2 rounded flex justify-center items-center gap-1"
    >
      {children}
    </button>
  );
}