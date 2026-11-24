import Link from "next/link";

export default function CircledNotAllowedLinks({
  href,
  onClick,
  children,
  className = "",
  ...props
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`cursor-not-allowed bg-(--color-accent)/80 hover:bg-(--color-accent)/60 w-full py-2 px-4 rounded-full flex justify-center items-center gap-1 ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
