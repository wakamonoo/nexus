import alt from "@/assets/alt_logo.png";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full mt-14 p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-62 bg-panel">
      <div className="flex items-center justify-center w-full">
        <div className="border-t border-2 border-[var(--color-secondary)] flex-1" />
        <Image
          src={alt}
          alt="nexus"
          width={0}
          height={0}
          sizes="100vw"
          className="w-10 h-10 bg-second rounded-full p-1"
        />
        <div className="border-t border-2 border-[var(--color-secondary)] flex-1" />
      </div>
      <div className="px-4 py-2 items-center justify-center">
        <p className="mx-auto max-w-5xl text-xs text-vibe text-center">
          nexus is a fan-made, unofficial project and is not affiliated with,
          endorsed by, or sponsored by{" "}
          <a
            href="https://www.marvel.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold hover:underline"
          >
            Marvel Studios
          </a>
          ,{" "}
          <a
            href="https://thewaltdisneycompany.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold hover:underline"
          >
            The Walt Disney Company
          </a>
          , or any other rights holders. All characters, titles, trademarks, and
          related intellectual property belong to their respective owners.
        </p>
        <p className="mx-auto max-w-5xl text-xs text-vibe text-center mt-2">
          © 2025 - {new Date().getFullYear()} nexus. Built by a marvel fan, for
          the community.
        </p>
      </div>
    </footer>
  );
}
