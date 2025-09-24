"use client";
import { useContext, useEffect } from "react";
import { TitleContext } from "@/context/titleContext";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loader from "@/components/loader";

export default function Title() {
  const { titles, pageLoad } = useContext(TitleContext);
  const { titleId } = useParams();

  if (pageLoad) {
    return <Loader />
  }

  const title = titles.find((t) => t.titleId === titleId);

  if (!title) {
    return <p>not a title</p>;
  }

  return (
    <>
      <div>
        <Image
          src={title.image}
          alt="image"
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-full object-fill rounded"
        />
      </div>
    </>
  );
}
