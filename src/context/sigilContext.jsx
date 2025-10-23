"use client";
import { createContext } from "react";

import PrimeProspect from "@/assets/sigils/primeProspect.png";
import EmergingLuminary from "@/assets/sigils/emergingLuminary.png";
import HeroicScribe from "@/assets/sigils/heroicScribe.png";
import FriendlyNeighbor from "@/assets/sigils/friendlyNeighbor.png";
import AlleySwinger from "@/assets/sigils/alleySwinger.png";
import WebWalker from "@/assets/sigils/webWalker.png";
import TaleCollector from "@/assets/sigils/taleCollector.png";
import CinematicEye from "@/assets/sigils/cinematicEye.png";
import MasterArchivist from "@/assets/sigils/masterArchivist.png";
import Vanguard from "@/assets/sigils/vanguard.png";
import Paragon from "@/assets/sigils/paragon.png";
import InsightScout from "@/assets/sigils/insightScout.png";
import LoreGuardian from "@/assets/sigils/loreGuardian.png";
import Vigilante from "@/assets/sigils/vigilante.png";
import Ascendant from "@/assets/sigils/ascendant.png";
import Cosmic from "@/assets/sigils/cosmic.png";

export const SigilContext = createContext();

export const SigilProvider = ({ children }) => {
  const sigils = [
    {
      key: "primeProspect",
      name: "Prime Prospect",
      image: PrimeProspect,
      desc: "Given for users who posted for the first time.",
    },
    {
      key: "emergingLuminary",
      name: "Emerging Luminary",
      image: EmergingLuminary,
      desc: "Given for users who posted for 10 times.",
    },
    {
      key: "heroicScribe",
      name: "Heroic Scribe",
      image: HeroicScribe,
      desc: "Given for users who posted for 20 times.",
    },
    {
      key: "friendlyNeighbor",
      name: "Friendly Neighbor",
      image: FriendlyNeighbor,
      desc: "Given for users who commented for the first time.",
    },
    {
      key: "alleySwinger",
      name: "Alley Swinger",
      image: AlleySwinger,
      desc: "Given for users who commented for 10 times.",
    },
    {
      key: "webWalker",
      name: "Web Walker",
      image: WebWalker,
      desc: "Given for users who commented for 20 times.",
    },
    {
      key: "taleCollector",
      name: "Tale Collector",
      image: TaleCollector,
      desc: "Given for users who reviewed for 10 times.",
    },
    {
      key: "cinematicEye",
      name: "Cinematic Eye",
      image: CinematicEye,
      desc: "Given for users who reviewed for 20 times.",
    },
    {
      key: "masterArchivist",
      name: "Master Archivist",
      image: MasterArchivist,
      desc: "Given for users who reviewed for 40 times.",
    },
    {
      key: "vanguard",
      name: "Vanguard",
      image: Vanguard,
      desc: "Given for users who energized posts for 10 times.",
    },
    {
      key: "paragon",
      name: "Paragon",
      image: Paragon,
      desc: "Given for users who energized posts for the 20 times.",
    },
    {
      key: "insightScout",
      name: "Insight Scout",
      image: InsightScout,
      desc: "Given for users who echoes posts for 10 times.",
    },
    {
      key: "loreGuardian",
      name: "Lore Guardian",
      image: LoreGuardian,
      desc: "Given for users who echoed posts for 20 times.",
    },
    {
      key: "vigilante",
      name: "Vigilante",
      image: Vigilante,
      desc: "Given for users who watched 20 titles at one time.",
    },
    {
      key: "ascendant",
      name: "Ascendant",
      image: Ascendant,
      desc: "Given for users who watched 40 titles at one time.",
    },
    {
      key: "cosmic",
      name: "Cosmic",
      image: Cosmic,
      desc: "Given for users who watched all titles at one time.",
    },
  ];
  return (
    <SigilContext.Provider value={{ sigils }}>{children}</SigilContext.Provider>
  );
};
