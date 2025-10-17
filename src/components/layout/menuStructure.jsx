"use client";
import { useContext } from "react";
import { FaBalanceScale, FaDonate, FaInfo, FaLightbulb } from "react-icons/fa";
import { FaFileShield } from "react-icons/fa6";
import { MenuContext } from "@/context/menuContext";
import { useRouter } from "next/navigation";
import { RiContractFill } from "react-icons/ri";

export default function MenuStructure() {
  const { setShowMenu} = useContext(MenuContext);
  const router = useRouter();


  return (
      <div className="flex flex-col gap-2 items-start">
        <button
          onClick={() => {
            router.push("/about");
            setShowMenu(false);
          }}
          className="flex items-center cursor-pointer gap-4 hover:bg-[var(--color-text)] focus:bg-[var(--color-text)] group w-full p-4 rounded-full transition-all duration-300"
        >
          <FaInfo className="text-2xl group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]" />
          <p className="text-base flex font-bold group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]">
            About
          </p>
        </button>
        <button
          onClick={() => {
            router.push("/trustAndLegality");
            setShowMenu(false);
          }}
          className="flex items-center cursor-pointer gap-4 hover:bg-[var(--color-text)] focus:bg-[var(--color-text)] group w-full p-4 rounded-full transition-all duration-300"
        >
          <FaBalanceScale className="text-2xl group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]" />
          <p className="text-base flex font-bold group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]">
            Trust & Legality
          </p>
        </button>
        <button
          onClick={() => {
            router.push("/terms&Conditions");
            setShowMenu(false);
          }}
          className="flex items-center cursor-pointer gap-4 hover:bg-[var(--color-text)] focus:bg-[var(--color-text)] group w-full p-4 rounded-full transition-all duration-300"
        >
          <RiContractFill className="text-2xl group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]" />
          <p className="text-base flex font-bold group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]">
            Terms & Conditions
          </p>
        </button>
        <button
          onClick={() => {
            router.push("/privacyPolicy");
            setShowMenu(false);
          }}
          className="flex items-center cursor-pointer gap-4 hover:bg-[var(--color-text)] focus:bg-[var(--color-text)] group w-full p-4 rounded-full transition-all duration-300"
        >
          <FaFileShield className="text-2xl group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]" />
          <p className="text-base flex font-bold group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]">
            Privacy Policy
          </p>
        </button>
        <button
          onClick={() => {
            router.push("/recommendations");
            setShowMenu(false);
          }}
          className="flex items-center cursor-pointer gap-4 hover:bg-[var(--color-text)] focus:bg-[var(--color-text)] group w-full p-4 rounded-full transition-all duration-300"
        >
          <FaLightbulb className="text-2xl group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]" />
          <p className="text-base flex font-bold group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]">
            Recommendations
          </p>
        </button>
        <button
          onClick={() => {
            router.push("/heroFund");
            setShowMenu(false);
          }}
          className="flex items-center cursor-pointer gap-4 hover:bg-[var(--color-text)] focus:bg-[var(--color-text)] group w-full p-4 rounded-full transition-all duration-300"
        >
          <FaDonate className="text-2xl group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]" />
          <p className="text-base flex font-bold group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]">
            Hero Fund
          </p>
        </button>
      </div>
  );
}
