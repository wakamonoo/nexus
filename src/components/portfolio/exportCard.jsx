import { MdRadioButtonChecked, MdRadioButtonUnchecked } from "react-icons/md";
import logo from "@/assets/main_logo.png";
import Fallback from "@/assets/fallback.png";
import Image from "next/image";

export default function ExportCard({
  user,
  order,
  orderType,
  isTitleWatched,
  id,
}) {
  return (
    <div
      id={id}
      style={{ width: 1080, height: 1350 }}
      className="p-10 bg-gradient-to-b from-[var(--color-panel)] to-[var(--color-secondary)]"
    >
      <div className="flex items-center justify-center gap-2 p-2">
        <Image
          src={user?.picture || Fallback}
          alt={user?.name}
          width={0}
          height={0}
          sizes="100vw"
          className="w-12 h-12 rounded-full object-cover"
        />
        <p className="text-4xl font-tall uppercase">
          {user?.name} MCU {orderType} Checklist
        </p>
      </div>
      <div className="grid grid-cols-3 content-start gap-x-4 gap-y-1 mt-4 bg-second p-4 rounded-2xl">
        {order.map((unit, index) => (
          <div
            key={unit.titleId}
            className="flex min-w-0 items-start gap-2 py-1"
          >
            {isTitleWatched(unit.titleId) ? (
              <MdRadioButtonChecked className="shrink-0 text-2xl text-accent" />
            ) : (
              <MdRadioButtonUnchecked className="shrink-0 text-2xl text-accent" />
            )}
            <p className="text-base">
              <span className="font-bold">{index + 1}. </span>
              {unit.title}
            </p>
          </div>
        ))}
      </div>
      <div className="flex justify-between w-full mt-4">
        <div></div>
        <div>
          <Image
            src={logo}
            alt="nexus_logo"
            width={0}
            height={0}
            sizes="100vw"
            className="w-46 h-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
}
