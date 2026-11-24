import Link from "next/link";
import { useContext } from "react";
import { LoaderContext } from "@/context/loaderContext";
import { usePathname } from "next/navigation";

export default function CustomLink({
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
      className={`relative border hover:border-red-600 duration-500 group cursor-pointer text-accent  overflow-hidden px-4 py-2 rounded-md bg-red-800 p-2 flex justify-center items-center font-extrabold ${className}`}
      {...props}
    >
      <div className="absolute z-10 w-48 h-48 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-red-900 delay-150 group-hover:delay-75"></div>
      <div className="absolute z-10 w-40 h-40 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-red-800 delay-150 group-hover:delay-100"></div>
      <div className="absolute z-10 w-32 h-32 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-red-700 delay-150 group-hover:delay-150"></div>
      <div className="absolute z-10 w-24 h-24 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-red-600 delay-150 group-hover:delay-200"></div>
      <div className="absolute z-10 w-16 h-16 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-red-500 delay-150 group-hover:delay-300"></div>
      <span className="z-10">{children}</span>
    </Link>
  );
}
