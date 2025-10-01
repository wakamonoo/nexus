"use client";
import { TitleContext } from "@/context/titleContext";
import { useContext } from "react";
import { FaAngleLeft } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function EditTitle() {
  const { titles } = useContext(TitleContext);
  const router = useRouter();
  
  return (
    <div className="p-2">
      <div className="flex justify-between items-center">
        <FaAngleLeft
          onClick={() => router.back()}
          className="text-2xl cursor-pointer"
        />
        <h1 className="text-2xl">EDIT TITLE</h1>
        <div />
      </div>
      <div className="w-full max-w-5xl py-4">
        <div className="flex flex-wrap justify-center gap-2">
          {...titles
            .sort((a, b) => a.order - b.order)
            .map((unit) => (
              <div
                key={unit.order}
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
  );
}
