"use client";
import { useContext, useEffect } from "react";
import { TitleContext } from "@/context/titleContext";
import { FaAngleLeft, FaBoxOpen } from "react-icons/fa";
import Image from "next/image";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";
import { TitleNavContext } from "@/context/titlesNavContex";
import { LoaderContext } from "@/context/loaderContext";
import ShowListLoader from "@/components/showListLoader";

export default function Chrono() {
  const { titles } = useContext(TitleContext);
  const { setIsLoading } = useContext(LoaderContext);
  const { handleShowNav } = useContext(TitleNavContext);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (!titles || titles.length === 0) {
    return <ShowListLoader />;
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center p-2">
        <div className="flex justify-between items-center py-4 w-full">
          <FaAngleLeft
            onClick={() => router.back()}
            className="text-2xl cursor-pointer"
          />
          <h4 className="text-2xl">GOAT STATUS</h4>
        </div>
        <div className="w-full max-w-5xl">
          <div className="flex flex-wrap justify-center gap-2">
            {...titles
              .sort((a, b) => a.order - b.order)
              .map((unit) => (
                <div
                  key={unit.order}
                  onClick={() => handleShowNav(unit.titleId)}
                  className="w-26 h-40 flex-shrink-0 cursor-pointer"
                >
                  <Image
                    src={unit.image}
                    alt="image"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-full object-fill rounded"
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
