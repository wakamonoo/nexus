export default function RegularButtons({
  onClick,
  type = "button",
  children,
  form,
  disabled,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      form={form}
      disabled={disabled}
      className={`mt-2 w-full py-2 px-4 rounded flex justify-center items-center gap-1 ${
        disabled
          ? "cursor-not-allowed bg-[var(--color-accent)]/60"
          : "hover:bg-[var(--color-accent)]/80 cursor-pointer bg-accent"
      }`}
    >
      {children}
    </button>
  );
}
