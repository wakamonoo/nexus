import { SigilContext } from "@/context/sigilContext";
import Image from "next/image";
import { useContext } from "react";

export default function ProfileBadges({ profileUser, user }) {
  const { sigils } = useContext(SigilContext);
  return (
    <div className="p-2">
      <h4 className="font-bold text-lg">
        {profileUser.uid === user?.uid
          ? "Your"
          : `${profileUser.name.split(" ")[0]}'s`}{" "}
        sigils
      </h4>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-3 w-full gap-2">
        {sigils
          .filter((sigil) => profileUser?.[sigil.key])
          .map((sigil) => (
            <div
              key={sigil.key}
              tabIndex={0}
              className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel rounded transition-all duration-200 hover:-translate-y-1 focus:-translate-y-1 cursor-pointer"
            >
              <Image
                src={sigil.image}
                alt={sigil.name}
                width={0}
                height={0}
                sizes="100vw"
                className="w-14 h-14 md:w-16 md:h-16 object-fill"
              />
              <p className="text-xs text-vibe truncate w-full text-center">{sigil.name}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
