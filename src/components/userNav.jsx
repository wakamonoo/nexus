import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { PiRankingDuotone } from 'react-icons/pi';

export default function UserNav({ setShowUserNav }) {
  const router = useRouter()

  return (
    <div
      onClick={() => setShowUserNav(false)}
      className="inset-0 z-50 backdrop-blur-xs flex items-center justify-center fixed"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 p-4 absolute top-18 right-2 bg-accent w-[65%] h-fit rounded overflow-hidden"
      >
        <button className="flex items-center gap-2 cursor-pointer">
          <FaUser className="text-2xl" />
          <p className="text-base font-bold text-normal">Activities</p>
        </button>
        <button onClick={() => router.push("/rank")} className="flex items-center gap-2 cursor-pointer">
          <PiRankingDuotone className="text-2xl" />
          <p className="text-base font-bold text-normal">Rank'em</p>
        </button>
      </div>
    </div>
  );
}
