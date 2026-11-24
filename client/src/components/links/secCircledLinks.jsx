import Link from "next/link";

export default function SecondaryCircledLinks({
  href,
  onClick,
  children,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <Link
      href={href}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      }}
      aria-disabled={disabled}
      className={`w-fit py-2 px-4 rounded-full flex justify-center items-center gap-1 ${
        disabled
          ? "bg-second cursor-not-allowed bg-(--color-panel)/60"
          : "bg-panel hover:bg-(--color-panel)/80 cursor-pointer"
      } ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
