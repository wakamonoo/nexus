import PrimeProspect from "@/assets/badges/primeProspect.png";
import EmergingLuminary from "@/assets/badges/emergingLuminary.png";
import HeroicScribe from "@/assets/badges/heroicScribe.png";
import FriendlyNeighboor from "@/assets/badges/friendlyNeighboor.png";
import AlleySwinger from "@/assets/badges/alleySwinger.png";
import WebWalker from "@/assets/badges/webWalker.png";
import TaleCollector from "@/assets/badges/taleCollector.png";
import CinematicEye from "@/assets/badges/cinematicEye.png";
import MasterArchivist from "@/assets/badges/masterArchivist.png";
import Vanguard from "@/assets/badges/vanguard.png";
import Paragon from "@/assets/badges/paragon.png";
import InsightScout from "@/assets/badges/insightScout.png";
import LoreGuardian from "@/assets/badges/loreGuardian.png";
import Vigilante from "@/assets/badges/vigilante.png";
import Ascendant from "@/assets/badges/ascendant.png";
import Cosmic from "@/assets/badges/cosmic.png";
import Image from "next/image";

export default function ProfileBadges({ profileUser, user }) {
  return (
    <div className="p-2">
      <h4 className="font-bold text-lg">
        {profileUser.uid === user?.uid
          ? "Your"
          : `${profileUser.name.split(" ")[0]}'s`}{" "}
        badges
      </h4>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-3 w-full gap-2">
        {profileUser?.primeProspect && (
          <div
            tabIndex={0}
            className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel rounded transition-all duration-200 hover:-translate-y-1 focus:-translate-y-1 cursor-pointer"
          >
            <Image
              src={PrimeProspect}
              alt="PrimeProspect"
              width={0}
              height={0}
              sizes="100vw"
              className="w-14 h-14 md:w-16 md:h-16 object-fill rounded-full"
            />
            <p className="text-xs text-vibe truncate w-full text-center">
              Prime Prospect
            </p>
          </div>
        )}
        {profileUser?.emergingLuminary && (
          <div
            tabIndex={0}
            className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel rounded transition-all duration-200 hover:-translate-y-1 focus:-translate-y-1 cursor-pointer"
          >
            <Image
              src={EmergingLuminary}
              alt="EmergingLuminary"
              width={0}
              height={0}
              sizes="100vw"
              className="w-14 h-14 md:w-16 md:h-16 object-fill rounded-full"
            />
            <p className="text-xs text-vibe truncate w-full text-center">
              Emerging Luminary
            </p>
          </div>
        )}
        {profileUser?.heroicScribe && (
          <div
            tabIndex={0}
            className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel rounded transition-all duration-200 hover:-translate-y-1 focus:-translate-y-1 cursor-pointer"
          >
            <Image
              src={HeroicScribe}
              alt="HeroicScribe"
              width={0}
              height={0}
              sizes="100vw"
              className="w-14 h-14 md:w-16 md:h-16 object-fill rounded-full"
            />
            <p className="text-xs text-vibe truncate w-full text-center">
              Heroic Scribe
            </p>
          </div>
        )}
        {profileUser?.friendlyNeighboor && (
          <div
            tabIndex={0}
            className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel rounded transition-all duration-200 hover:-translate-y-1 focus:-translate-y-1 cursor-pointer"
          >
            <Image
              src={FriendlyNeighboor}
              alt="FriendlyNeighboor"
              width={0}
              height={0}
              sizes="100vw"
              className="w-14 h-14 md:w-16 md:h-16 object-fill rounded-full"
            />
            <p className="text-xs text-vibe truncate w-full text-center">
              Friendly Neighboor
            </p>
          </div>
        )}
        {profileUser?.alleySwinger && (
          <div
            tabIndex={0}
            className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel rounded transition-all duration-200 hover:-translate-y-1 focus:-translate-y-1 cursor-pointer"
          >
            <Image
              src={AlleySwinger}
              alt="AlleySwinger"
              width={0}
              height={0}
              sizes="100vw"
              className="w-14 h-14 md:w-16 md:h-16 object-fill rounded-full"
            />
            <p className="text-xs text-vibe truncate w-full text-center">
              Alley Swinger
            </p>
          </div>
        )}
        {profileUser?.webWalker && (
          <div
            tabIndex={0}
            className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel rounded transition-all duration-200 hover:-translate-y-1 focus:-translate-y-1 cursor-pointer"
          >
            <Image
              src={WebWalker}
              alt="WebWalker"
              width={0}
              height={0}
              sizes="100vw"
              className="w-14 h-14 md:w-16 md:h-16 object-fill rounded-full"
            />
            <p className="text-xs text-vibe truncate w-full text-center">
              Web Walker
            </p>
          </div>
        )}
        {profileUser?.taleCollector && (
          <div
            tabIndex={0}
            className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel rounded transition-all duration-200 hover:-translate-y-1 focus:-translate-y-1 cursor-pointer"
          >
            <Image
              src={TaleCollector}
              alt="TaleCollector"
              width={0}
              height={0}
              sizes="100vw"
              className="w-14 h-14 md:w-16 md:h-16 object-fill rounded-full"
            />
            <p className="text-xs text-vibe truncate w-full text-center">
              Tale Collector
            </p>
          </div>
        )}
        {profileUser?.cinematicEye && (
          <div
            tabIndex={0}
            className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel rounded transition-all duration-200 hover:-translate-y-1 focus:-translate-y-1 cursor-pointer"
          >
            <Image
              src={CinematicEye}
              alt="CinematicEye"
              width={0}
              height={0}
              sizes="100vw"
              className="w-14 h-14 md:w-16 md:h-16 object-fill rounded-full"
            />
            <p className="text-xs text-vibe truncate w-full text-center">
              Cinematic Eye
            </p>
          </div>
        )}
        {profileUser?.masterArchivist && (
          <div
            tabIndex={0}
            className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel rounded transition-all duration-200 hover:-translate-y-1 focus:-translate-y-1 cursor-pointer"
          >
            <Image
              src={MasterArchivist}
              alt="MasterArchivist"
              width={0}
              height={0}
              sizes="100vw"
              className="w-14 h-14 md:w-16 md:h-16 object-fill rounded-full"
            />
            <p className="text-xs text-vibe truncate w-full text-center">
              Master Archivist
            </p>
          </div>
        )}
        {profileUser?.vanguard && (
          <div
            tabIndex={0}
            className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel rounded transition-all duration-200 hover:-translate-y-1 focus:-translate-y-1 cursor-pointer"
          >
            <Image
              src={Vanguard}
              alt="Vanguard"
              width={0}
              height={0}
              sizes="100vw"
              className="w-14 h-14 md:w-16 md:h-16 object-fill rounded-full"
            />
            <p className="text-xs text-vibe truncate w-full text-center">
              Vanguard
            </p>
          </div>
        )}
        {profileUser?.paragon && (
          <div
            tabIndex={0}
            className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel rounded transition-all duration-200 hover:-translate-y-1 focus:-translate-y-1 cursor-pointer"
          >
            <Image
              src={Paragon}
              alt="Paragon"
              width={0}
              height={0}
              sizes="100vw"
              className="w-14 h-14 md:w-16 md:h-16 object-fill rounded-full"
            />
            <p className="text-xs text-vibe truncate w-full text-center">
              Paragon
            </p>
          </div>
        )}
        {profileUser?.insightScout && (
          <div
            tabIndex={0}
            className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel rounded transition-all duration-200 hover:-translate-y-1 focus:-translate-y-1 cursor-pointer"
          >
            <Image
              src={InsightScout}
              alt="InsightScout"
              width={0}
              height={0}
              sizes="100vw"
              className="w-14 h-14 md:w-16 md:h-16 object-fill rounded-full"
            />
            <p className="text-xs text-vibe truncate w-full text-center">
              Insight Scout
            </p>
          </div>
        )}
        {profileUser?.loreGuardian && (
          <div
            tabIndex={0}
            className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel rounded transition-all duration-200 hover:-translate-y-1 focus:-translate-y-1 cursor-pointer"
          >
            <Image
              src={LoreGuardian}
              alt="LoreGuardian"
              width={0}
              height={0}
              sizes="100vw"
              className="w-14 h-14 md:w-16 md:h-16 object-fill rounded-full"
            />
            <p className="text-xs text-vibe truncate w-full text-center">
              Lore Guardian
            </p>
          </div>
        )}
        {profileUser?.vigilante && (
          <div
            tabIndex={0}
            className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel rounded transition-all duration-200 hover:-translate-y-1 focus:-translate-y-1 cursor-pointer"
          >
            <Image
              src={Vigilante}
              alt="Vigilante"
              width={0}
              height={0}
              sizes="100vw"
              className="w-14 h-14 md:w-16 md:h-16 object-fill rounded-full"
            />
            <p className="text-xs text-vibe truncate w-full text-center">
              Vigilante
            </p>
          </div>
        )}
        {profileUser?.ascendant && (
          <div
            tabIndex={0}
            className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel rounded transition-all duration-200 hover:-translate-y-1 focus:-translate-y-1 cursor-pointer"
          >
            <Image
              src={Ascendant}
              alt="Ascendant"
              width={0}
              height={0}
              sizes="100vw"
              className="w-14 h-14 md:w-16 md:h-16 object-fill rounded-full"
            />
            <p className="text-xs text-vibe truncate w-full text-center">
              Ascendant
            </p>
          </div>
        )}
        {profileUser?.cosmic && (
          <div
            tabIndex={0}
            className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel rounded transition-all duration-200 hover:-translate-y-1 focus:-translate-y-1 cursor-pointer"
          >
            <Image
              src={Cosmic}
              alt="Cosmic"
              width={0}
              height={0}
              sizes="100vw"
              className="w-14 h-14 md:w-16 md:h-16 object-fill rounded-full"
            />
            <p className="text-xs text-vibe truncate w-full text-center">
              Cosmic
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
