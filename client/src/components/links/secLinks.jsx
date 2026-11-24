import Link from "next/link";
import { useContext } from "react";
import { LoaderContext } from "@/context/loaderContext";
import { usePathname } from "next/navigation";

export default function SecondaryLinks({
  href,
  onClick,
  children,
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
        onClick?.(e);
        if (
          !e.defaultPrevented &&
          isInternalLink &&
          targetPath !== currentPath
        ) {
          setIsLoading(true);
        }
      }}
      className={`cursor-pointer mt-2 bg-panel hover:bg-(--color-panel)/80 w-full py-2 px-4 rounded flex justify-center items-center gap-1 ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
