import Link from "next/link";

export default function CircledLinks({
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
      className={`w-full py-2 px-4 rounded-full flex justify-center items-center gap-1 ${
        disabled
          ? "cursor-not-allowed bg-(--color-accent)/60"
          : "hover:bg-(--color-accent)/80 cursor-pointer bg-accent "
      } ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
