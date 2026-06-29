export default function SecondaryCircledButtons({
  onClick,
  children,
  disabled = false,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-2 rounded-full flex justify-center items-center gap-1 ${
        disabled
          ? "bg-second cursor-not-allowed opacity-40"
          : "bg-panel hover:bg-[var(--color-panel)]/80 cursor-pointer"
      }`}
    >
      {children}
    </button>
  );
}