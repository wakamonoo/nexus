export default function SecondaryCircledButtons({
  onClick,
  children,
  disabled = false,
  className = "",
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-fit py-2 px-4 rounded-full flex justify-center items-center gap-1 ${
        disabled
          ? "bg-second cursor-not-allowed bg-[var(--color-panel)]/60"
          : "bg-panel hover:bg-[var(--color-panel)]/80 cursor-pointer"
      } ${className}`}
    >
      {children}
    </button>
  );
}
