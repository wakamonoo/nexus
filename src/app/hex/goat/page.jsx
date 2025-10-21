"use client";
import { useContext, useEffect } from "react";
import { TitleContext } from "@/context/titleContext";
import { FaAngleLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { LoaderContext } from "@/context/loaderContext";
import ShowListLoader from "@/components/loaders/showListLoader";
import GoatTitlesStructureMax from "@/components/layout/goatTitlesStructureMax";

export default function Goat() {
  const { titles } = useContext(TitleContext);
  const { setIsLoading } = useContext(LoaderContext);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (!titles || titles.length === 0) {
    return <ShowListLoader />;
  }

  return (
    <div className="flex flex-col justify-center items-center p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
      <div className="flex justify-between items-center py-4 w-full">
        <FaAngleLeft
          onClick={() => router.back()}
          className="text-2xl cursor-pointer"
        />
        <h4 className="text-xl">GOAT STATUS</h4>
      </div>
      <div className="w-full">
        <GoatTitlesStructureMax />
      </div>
      <div className="w-full flex justify-center p-8 opacity-70">
        <p className="text-xs text-vibe">
          Your fav not here?{" "}
          <span
            onClick={() => router.push("/powerboard")}
            className="cursor-pointer underline"
          >
            Rank it
          </span>
        </p>
      </div>
    </div>
  );
}
