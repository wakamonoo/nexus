import alt from "@/assets/alt_logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="w-full mt-14 p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-62 bg-panel">
      <div className="flex items-center justify-center w-full">
        <div className="border-t border-2 border-[var(--color-secondary)] flex-1" />
        <Image
          src={alt}
          alt="Nexus"
          width={0}
          height={0}
          sizes="100vw"
          className="w-10 h-10 bg-second rounded-full p-1"
        />
        <div className="border-t border-2 border-[var(--color-secondary)] flex-1" />
      </div>
      <div className="px-4 py-2 items-center justify-center">
        <p className="mx-auto max-w-5xl text-xs text-vibe text-center">
          Nexus is a fan-made, unofficial project and is not affiliated with,
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

        <div className="flex flex-col items-center justify-center gap-2 mt-4">
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="The Movie Database"
          >
            <Image
              src="/tmdb_logo.svg"
              alt="The Movie Database"
              width={0}
              height={0}
              sizes="100vw"
              className="w-12 h-auto"
            />
          </a>
          <p className="mx-auto max-w-5xl text-xs text-vibe text-center">
            This website uses the <strong>TMDB API</strong> but is not endorsed
            or certified by <strong>TMDB</strong>
          </p>
        </div>
        <p
          onClick={() => router.push("/heroFund")}
          className="mx-auto max-w-5xl text-xs text-vibe opacity-60 text-center mt-2 cursor-pointer hover:opacity-100 active:opacity-100"
        >
          support Nexus and help keep the community alive, growing, and free for
          everyone
        </p>
        <p className="mx-auto max-w-5xl text-xs text-vibe opacity-60 text-center mt-2">
          © 2025 - {new Date().getFullYear()} Nexus. Built by a marvel fan, for
          the community.
        </p>
      </div>
    </footer>
  );
}
