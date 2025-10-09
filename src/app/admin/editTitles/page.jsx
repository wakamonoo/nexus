"use client";
import { TitleContext } from "@/context/titleContext";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { FaAngleLeft } from "react-icons/fa";
import Image from "next/image";

export default function EditTitleMain() {
  const { titles } = useContext(TitleContext);
  const router = useRouter();

  return (
    <div className="p-2">
      <div className="flex justify-between items-center">
        <FaAngleLeft
          onClick={() => router.back()}
          className="text-2xl cursor-pointer"
          title="Back"
        />
        <h1 className="text-2xl">Edit Titles</h1>
      </div>

      <div className="flex flex-col gap-2 p-2">
        {titles.map((title, index) => (
          <div key={index} className="flex gap-4 items-center">
            <Image
              src={title?.image}
              alt="image"
              width={0}
              height={0}
              sizes="100vw"
              className="w-26 h-40 object-fill rounded"
            />
            <div className="w-full">
              <h4 className="leading-3.5">{title.title}</h4>
              <div className="flex flex-col gap-2 w-full">
                <button
                  onClick={() => router.push(`/admin/editTitles/${title.titleId}`)}
                  className="cursor-pointer px-4 bg-hulk rounded-2xl"
                >
                  <p className="font-bold text-normal">Edit title</p>
                </button>
                <button className="px-4 bg-accent rounded-2xl">
                  <p className="cursor-pointer font-bold text-normal">Delete title</p>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
