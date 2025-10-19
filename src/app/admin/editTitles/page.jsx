"use client";
import { TitleContext } from "@/context/titleContext";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import Image from "next/image";
import Fallback from "@/assets/fallback.png";
import TitleDelConfirm from "@/components/modals/titleDelConfirm";
import AdminGuard from "@/components/guard/adminGuard";
import CircledButtons from "@/components/buttons/circledBtns";

export default function EditTitleMain() {
  const { titles } = useContext(TitleContext);
  const [delConfim, setDelModal] = useState(false);
  const [selectedTitleId, setSelectedTitleId] = useState(null);
  const router = useRouter();

  const openDelModal = (titleId) => {
    setSelectedTitleId(titleId);
    setDelModal(true);
  };

  return (
    <>
      <AdminGuard>
        {delConfim && (
          <TitleDelConfirm
            titleId={selectedTitleId}
            setDelModal={setDelModal}
          />
        )}
        <div className="p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
          <div className="flex justify-between items-center">
            <FaAngleLeft
              onClick={() => router.back()}
              className="text-2xl cursor-pointer"
              title="Back"
            />
            <h1 className="text-xl">Edit Titles</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 p-2">
            {titles.map((title, index) => (
              <div key={index} className="flex gap-4 items-center">
                <Image
                  src={title?.image || Fallback}
                  alt="image"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-26 h-40 md:w-32 md:h-46 object-fill rounded"
                />
                <div className="w-full flex flex-col gap-2">
                  <h4 className="leading-3.5">{title.title}</h4>
                  <div className="flex flex-col gap-2 w-full">
                    <CircledButtons
                      onClick={() =>
                        router.push(`/admin/editTitles/${title.titleId}`)
                      }
                    >
                      <p className="font-bold text-normal text-base">
                        Edit title
                      </p>
                    </CircledButtons>
                    <CircledButtons
                      onClick={() => openDelModal(title.titleId)}
                      className="px-4 bg-accent rounded-2xl"
                    >
                      <p className="font-bold text-normal text-base">
                        Delete title
                      </p>
                    </CircledButtons>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminGuard>
    </>
  );
}
