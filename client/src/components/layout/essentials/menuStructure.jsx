"use client";
import { useContext } from "react";
import Link from "next/link";
import { FaBalanceScale, FaDonate, FaInfo, FaLightbulb } from "react-icons/fa";
import { FaFileShield, FaPenToSquare } from "react-icons/fa6";
import { MenuContext } from "@/context/menuContext";
import { LoaderContext } from "@/context/loaderContext";
import { usePathname } from "next/navigation";
import { RiContractFill } from "react-icons/ri";
import { GiSwordsEmblem } from "react-icons/gi";

export default function MenuStructure() {
  const { setShowMenu } = useContext(MenuContext);
  const { setIsLoading } = useContext(LoaderContext);
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-2 items-start">
      <Link
        href="/about"
        onClick={() => {
          setShowMenu(false);
          if (pathname !== "/about") setIsLoading(true);
        }}
        className="flex items-center cursor-pointer gap-4 hover:bg-(--color-panel) focus:bg-(--color-panel) group w-full p-4 rounded transition-all duration-300"
      >
        <FaInfo className="text-2xl" />
        <p className="text-base flex font-bold">About</p>
      </Link>
      <Link
        href="/sigils"
        onClick={() => {
          setShowMenu(false);
          if (pathname !== "/sigils") setIsLoading(true);
        }}
        className="flex items-center cursor-pointer gap-4 hover:bg-(--color-panel) focus:bg-(--color-panel) group w-full p-4 rounded transition-all duration-300"
      >
        <GiSwordsEmblem className="text-2xl" />
        <p className="text-base flex font-bold">Sigils</p>
      </Link>
      <Link
        href="/communityFeedback"
        onClick={() => {
          setShowMenu(false);
          if (pathname !== "/communityFeedback") setIsLoading(true);
        }}
        className="flex items-center cursor-pointer gap-4 hover:bg-(--color-panel) focus:bg-(--color-panel) group w-full p-4 rounded transition-all duration-300"
      >
        <FaPenToSquare className="text-2xl" />
        <p className="text-base flex font-bold">Community Feedback</p>
      </Link>
      <Link
        href="/recommendations"
        onClick={() => {
          setShowMenu(false);
          if (pathname !== "/recommendations") setIsLoading(true);
        }}
        className="flex items-center cursor-pointer gap-4 hover:bg-(--color-panel) focus:bg-(--color-panel) group w-full p-4 rounded transition-all duration-300"
      >
        <FaLightbulb className="text-2xl" />
        <p className="text-base flex font-bold">Recommendations</p>
      </Link>
      <Link
        href="/heroFund"
        onClick={() => {
          setShowMenu(false);
          if (pathname !== "/heroFund") setIsLoading(true);
        }}
        className="flex items-center cursor-pointer gap-4 hover:bg-(--color-panel) focus:bg-(--color-panel) group w-full p-4 rounded transition-all duration-300"
      >
        <FaDonate className="text-2xl " />
        <p className="text-base flex font-bold">Hero Fund</p>
      </Link>
      <Link
        href="/trustAndLegality"
        onClick={() => {
          setShowMenu(false);
          if (pathname !== "/trustAndLegality") setIsLoading(true);
        }}
        className="flex items-center cursor-pointer gap-4 hover:bg-(--color-panel) focus:bg-(--color-panel) group w-full p-4 rounded transition-all duration-300"
      >
        <FaBalanceScale className="text-2xl" />
        <p className="text-base flex font-bold">Trust & Legality</p>
      </Link>
      <Link
        href="/termsAndConditions"
        onClick={() => {
          setShowMenu(false);
          if (pathname !== "/termsAndConditions") setIsLoading(true);
        }}
        className="flex items-center cursor-pointer gap-4 hover:bg-(--color-panel) focus:bg-(--color-panel) group w-full p-4 rounded transition-all duration-300"
      >
        <RiContractFill className="text-2xl" />
        <p className="text-base flex font-bold">Terms & Conditions</p>
      </Link>
      <Link
        href="/privacyPolicy"
        onClick={() => {
          setShowMenu(false);
          if (pathname !== "/privacyPolicy") setIsLoading(true);
        }}
        className="flex items-center cursor-pointer gap-4 hover:bg-(--color-panel) focus:bg-(--color-panel) group w-full p-4 rounded transition-all duration-300"
      >
        <FaFileShield className="text-2xl" />
        <p className="text-base flex font-bold">Privacy Policy</p>
      </Link>
    </div>
  );
}
