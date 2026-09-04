export default function CircledButtons({
  onClick,
  children,
  disabled = false,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-2 px-4 rounded-full flex justify-center items-center gap-1 ${
        disabled
          ? "cursor-not-allowed bg-[var(--color-accent)]/60"
          : "hover:bg-[var(--color-accent)]/80 cursor-pointer bg-accent "
      }`}
    >
      {children}
    </button>
  );
}
