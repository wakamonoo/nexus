import Link from "next/link";

export default function SecondaryLinks({
  href,
  children,
  className = "",
  ...props
}) {
  return (
    <Link
      href={href}
      className={`cursor-pointer mt-2 bg-panel hover:bg-(--color-panel)/80 w-full py-2 px-4 rounded flex justify-center items-center gap-1 ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
