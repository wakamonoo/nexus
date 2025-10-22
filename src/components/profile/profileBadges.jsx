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

export default function ProfileBadges({ profileUser }) {
  return (
    <div className="p-2">
      <h4 className="font-bold text-lg">
        {profileUser.name.split(" ")[0]}'s badges
      </h4>
      <div className="flex flex-wrap gap-2">
        {profileUser?.primeProspect && (
            <Image
              src={PrimeProspect}
              alt="PrimeProspect"
              width={0}
              height={0}
              sizes="100vw"
              className="w-10 h-10 md:w-12 md:h-12 object-fill rounded-full"
            />
        )}
        {profileUser?.emergingLuminary && (
          <Image
            src={EmergingLuminary}
            alt="EmergingLuminary"
            width={0}
            height={0}
            sizes="100vw"
            className="w-10 h-10 md:w-12 md:h-12 object-fill rounded-full"
          />
        )}
        {profileUser?.heroicScribe && (
          <Image
            src={HeroicScribe}
            alt="HeroicScribe"
            width={0}
            height={0}
            sizes="100vw"
            className="w-10 h-10 md:w-12 md:h-12 object-fill rounded-full"
          />
        )}
        {profileUser?.friendlyNeighboor && (
          <Image
            src={FriendlyNeighboor}
            alt="FriendlyNeighboor"
            width={0}
            height={0}
            sizes="100vw"
            className="w-10 h-10 md:w-12 md:h-12 object-fill rounded-full"
          />
        )}
        {profileUser?.alleySwinger && (
          <Image
            src={AlleySwinger}
            alt="AlleySwinger"
            width={0}
            height={0}
            sizes="100vw"
            className="w-10 h-10 md:w-12 md:h-12 object-fill rounded-full"
          />
        )}
        {profileUser?.webWalker && (
          <Image
            src={WebWalker}
            alt="WebWalker"
            width={0}
            height={0}
            sizes="100vw"
            className="w-10 h-10 md:w-12 md:h-12 object-fill rounded-full"
          />
        )}
        {profileUser?.taleCollector && (
          <Image
            src={TaleCollector}
            alt="TaleCollector"
            width={0}
            height={0}
            sizes="100vw"
            className="w-10 h-10 md:w-12 md:h-12 object-fill rounded-full"
          />
        )}
        {profileUser?.cinematicEye && (
          <Image
            src={CinematicEye}
            alt="CinematicEye"
            width={0}
            height={0}
            sizes="100vw"
            className="w-10 h-10 md:w-12 md:h-12 object-fill rounded-full"
          />
        )}
        {profileUser?.masterArchivist && (
          <Image
            src={MasterArchivist}
            alt="MasterArchivist"
            width={0}
            height={0}
            sizes="100vw"
            className="w-10 h-10 md:w-12 md:h-12 object-fill rounded-full"
          />
        )}
        {profileUser?.vanguard && (
          <Image
            src={Vanguard}
            alt="Vanguard"
            width={0}
            height={0}
            sizes="100vw"
            className="w-10 h-10 md:w-12 md:h-12 object-fill rounded-full"
          />
        )}
        {profileUser?.paragon && (
          <Image
            src={Paragon}
            alt="Paragon"
            width={0}
            height={0}
            sizes="100vw"
            className="w-10 h-10 md:w-12 md:h-12 object-fill rounded-full"
          />
        )}
        {profileUser?.insightScout && (
          <Image
            src={InsightScout}
            alt="InsightScout"
            width={0}
            height={0}
            sizes="100vw"
            className="w-10 h-10 md:w-12 md:h-12 object-fill rounded-full"
          />
        )}
        {profileUser?.loreGuardian && (
          <Image
            src={LoreGuardian}
            alt="LoreGuardian"
            width={0}
            height={0}
            sizes="100vw"
            className="w-10 h-10 md:w-12 md:h-12 object-fill rounded-full"
          />
        )}
        {profileUser?.vigilante && (
          <Image
            src={Vigilante}
            alt="Vigilante"
            width={0}
            height={0}
            sizes="100vw"
            className="w-10 h-10 md:w-12 md:h-12 object-fill rounded-full"
          />
        )}
        {profileUser?.ascendant && (
          <Image
            src={Ascendant}
            alt="Ascendant"
            width={0}
            height={0}
            sizes="100vw"
            className="w-10 h-10 md:w-12 md:h-12 object-fill rounded-full"
          />
        )}
        {profileUser?.cosmic && (
          <Image
            src={Cosmic}
            alt="Cosmic"
            width={0}
            height={0}
            sizes="100vw"
            className="w-10 h-10 md:w-12 md:h-12 object-fill rounded-full"
          />
        )}
      </div>
    </div>
  );
}
