"use client";
import { useContext } from "react";
import { FaBalanceScale, FaDonate, FaInfo, FaLightbulb } from "react-icons/fa";
import { FaFileShield } from "react-icons/fa6";
import { MenuContext } from "@/context/menuContext";
import { useRouter } from "next/navigation";
import { RiContractFill } from "react-icons/ri";

export default function MenuStructure() {
  const { setShowMenu } = useContext(MenuContext);
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 items-start">
      <button
        onClick={() => {
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
          router.push("/terms&Conditions");
          setShowMenu(false);
        }}
        className="flex items-center cursor-pointer gap-4 hover:bg-[var(--color-panel)] focus:bg-[var(--color-panel)] group w-full p-4 rounded transition-all duration-300"
      >
        <RiContractFill className="text-2xl" />
        <p className="text-base flex font-bold">Terms & Conditions</p>
      </button>
      <button
        onClick={() => {
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
