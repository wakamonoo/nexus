import Link from "next/link";
import { useContext } from "react";
import { LoaderContext } from "@/context/loaderContext";
import { usePathname } from "next/navigation";

export default function RegularLinks({
  href,
  onClick,
  children,
  disabled = false,
  className = "",
  ...props
}) {
  const { setIsLoading } = useContext(LoaderContext);
  const pathname = usePathname();
  const isInternalLink =
    typeof href === "string" && href.startsWith("/") && !href.startsWith("//");
  const targetPath = isInternalLink
    ? href.split(/[?#]/)[0].replace(/\/$/, "")
    : null;
  const currentPath = pathname.replace(/\/$/, "");

  return (
    <Link
      href={href}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
        if (
          !e.defaultPrevented &&
          isInternalLink &&
          targetPath !== currentPath
        ) {
          setIsLoading(true);
        }
      }}
      aria-disabled={disabled}
      className={`mt-2 w-full py-2 px-4 rounded flex justify-center items-center gap-1 ${
        disabled
          ? "cursor-not-allowed bg-(--color-accent)/60"
          : "hover:bg-(--color-accent)/80 cursor-pointer bg-accent"
      } ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
