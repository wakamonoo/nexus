"use client";
import { useContext } from "react";
import { FaBalanceScale, FaDonate, FaInfo, FaLightbulb } from "react-icons/fa";
import { FaFileShield, FaPenToSquare } from "react-icons/fa6";
import { MenuContext } from "@/context/menuContext";
import { useRouter } from "next/navigation";
import { RiContractFill } from "react-icons/ri";
import { GiSwordsEmblem } from "react-icons/gi";
import { LoaderContext } from "@/context/loaderContext";

export default function MenuStructure() {
  const { setShowMenu } = useContext(MenuContext);
  const { setIsLoading } = useContext(LoaderContext);
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 items-start">
      <button
        onClick={() => {
          setIsLoading(true);
          router.push("/about");
          setShowMenu(false);
        }}
        className="flex items-center cursor-pointer gap-4 hover:bg-[var(--color-panel)] focus:bg-[var(--color-panel)] group w-full p-4 rounded transition-all duration-300"
      >
        <FaInfo className="text-2xl" />
        <p className="text-base flex font-bold">About</p>
      </button>
      <button
        onClick={() => {
          setIsLoading(true);
          router.push("/sigils");
          setShowMenu(false);
        }}
        className="flex items-center cursor-pointer gap-4 hover:bg-[var(--color-panel)] focus:bg-[var(--color-panel)] group w-full p-4 rounded transition-all duration-300"
      >
        <GiSwordsEmblem className="text-2xl" />
        <p className="text-base flex font-bold">Sigils</p>
      </button>
      <button
        onClick={() => {
          setIsLoading(true);
          router.push("/trustAndLegality");
          setShowMenu(false);
        }}
        className="flex items-center cursor-pointer gap-4 hover:bg-[var(--color-panel)] focus:bg-[var(--color-panel)] group w-full p-4 rounded transition-all duration-300"
      >
        <FaBalanceScale className="text-2xl" />
        <p className="text-base flex font-bold">Trust & Legality</p>
      </button>
      <button
        onClick={() => {
          setIsLoading(true);
          router.push("/termsAndConditions");
          setShowMenu(false);
        }}
        className="flex items-center cursor-pointer gap-4 hover:bg-[var(--color-panel)] focus:bg-[var(--color-panel)] group w-full p-4 rounded transition-all duration-300"
      >
        <RiContractFill className="text-2xl" />
        <p className="text-base flex font-bold">Terms & Conditions</p>
      </button>
      <button
        onClick={() => {
          setIsLoading(true);
          router.push("/privacyPolicy");
          setShowMenu(false);
        }}
        className="flex items-center cursor-pointer gap-4 hover:bg-[var(--color-panel)] focus:bg-[var(--color-panel)] group w-full p-4 rounded transition-all duration-300"
      >
        <FaFileShield className="text-2xl" />
        <p className="text-base flex font-bold">Privacy Policy</p>
      </button>
      <button
        onClick={() => {
          setIsLoading(true);
          router.push("/communityFeedback");
          setShowMenu(false);
        }}
        className="flex items-center cursor-pointer gap-4 hover:bg-[var(--color-panel)] focus:bg-[var(--color-panel)] group w-full p-4 rounded transition-all duration-300"
      >
        <FaPenToSquare className="text-2xl" />
        <p className="text-base flex font-bold">Community Feedback</p>
      </button>
      <button
        onClick={() => {
          setIsLoading(true);
          router.push("/recommendations");
          setShowMenu(false);
        }}
        className="flex items-center cursor-pointer gap-4 hover:bg-[var(--color-panel)] focus:bg-[var(--color-panel)] group w-full p-4 rounded transition-all duration-300"
      >
        <FaLightbulb className="text-2xl" />
        <p className="text-base flex font-bold">Recommendations</p>
      </button>
      <button
        onClick={() => {
          setIsLoading(true);
          router.push("/heroFund");
          setShowMenu(false);
        }}
        className="flex items-center cursor-pointer gap-4 hover:bg-[var(--color-panel)] focus:bg-[var(--color-panel)] group w-full p-4 rounded transition-all duration-300"
      >
        <FaDonate className="text-2xl " />
        <p className="text-base flex font-bold">Hero Fund</p>
      </button>
    </div>
  );
}
