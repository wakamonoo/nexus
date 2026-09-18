"use client";
import { createContext } from "react";

const PrimeProspect = "/sigils/primeProspect.png";
const EmergingLuminary = "/sigils/emergingLuminary.png";
const HeroicScribe = "/sigils/heroicScribe.png";
const FriendlyNeighbor = "/sigils/friendlyNeighbor.png";
const AlleySwinger = "/sigils/alleySwinger.png";
const WebWalker = "/sigils/webWalker.png";
const TaleCollector = "/sigils/taleCollector.png";
const CinematicEye = "/sigils/cinematicEye.png";
const MasterArchivist = "/sigils/masterArchivist.png";
const Vanguard = "/sigils/vanguard.png";
const Paragon = "/sigils/paragon.png";
const InsightScout = "/sigils/insightScout.png";
const LoreGuardian = "/sigils/loreGuardian.png";
const Vigilante = "/sigils/vigilante.png";
const Ascendant = "/sigils/ascendant.png";
const Cosmic = "/sigils/cosmic.png";

export const SigilContext = createContext();

export const SigilProvider = ({ children }) => {
  const sigils = [
    {
      key: "primeProspect",
      name: "Prime Prospect",
      image: PrimeProspect,
      desc: "Every legend begins with a single voice. Earned by making your very first post, marking the dawn of your heroic journey.",
    },
    {
      key: "emergingLuminary",
      name: "Emerging Luminary",
      image: EmergingLuminary,
      desc: "The light grows brighter. Granted after posting 10 times, proof that your voice now shines among rising creators.",
    },
    {
      key: "heroicScribe",
      name: "Heroic Scribe",
      image: HeroicScribe,
      desc: "Your words have weight and your stories endure. Awarded after making 20 posts, showing that you now stand as a seasoned storyteller of the realm.",
    },
    {
      key: "friendlyNeighbor",
      name: "Friendly Neighbor",
      image: FriendlyNeighbor,
      desc: "No hero stands alone. Granted upon making your first comment, your first step in weaving bonds across the community.",
    },
    {
      key: "alleySwinger",
      name: "Alley Swinger",
      image: AlleySwinger,
      desc: "You have joined the conversation. Earned after posting 20 comments, showing you are part of the ever-connected web of voices.",
    },
    {
      key: "webWalker",
      name: "Web Walker",
      image: WebWalker,
      desc: "40 comments deep, you now move with purpose through the threads of discourse, shaping stories and sparking dialogue.",
    },

    {
      key: "vanguard",
      name: "Vanguard",
      image: Vanguard,
      desc: "The front line of inspiration. Awarded after energizing 20 posts, your support fuels the creative charge of others.",
    },
    {
      key: "paragon",
      name: "Paragon",
      image: Paragon,
      desc: "A true beacon of empowerment. Earned after energizing 40 posts, your encouragement has become legendary among peers.",
    },
    {
      key: "insightScout",
      name: "Insight Scout",
      image: InsightScout,
      desc: "Seeker of brilliance. Granted after echoing 15 posts, showing your keen eye for insight and potential across the realm.",
    },
    {
      key: "loreGuardian",
      name: "Lore Guardian",
      image: LoreGuardian,
      desc: "Protector of stories. Earned after echoing 30 posts, you now safeguard and amplify the voices that shape the multiverse.",
    },
    {
      key: "taleCollector",
      name: "Tale Collector",
      image: TaleCollector,
      desc: "Every story holds a lesson. Awarded after writing 15 reviews, your insights illuminate the depths of every tale you witness.",
    },
    {
      key: "cinematicEye",
      name: "Cinematic Eye",
      image: CinematicEye,
      desc: "You see beyond the screen. Earned after writing 30 reviews, your vision deciphers art, emotion, and narrative like few can.",
    },
    {
      key: "masterArchivist",
      name: "Master Archivist",
      image: MasterArchivist,
      desc: "The keeper of chronicles. Awarded after writing 60 reviews, your wisdom preserves the essence of countless stories.",
    },
    {
      key: "vigilante",
      name: "Vigilante",
      image: Vigilante,
      desc: "Watcher of worlds. Earned after watching 20 titles, your curiosity and devotion make you a silent guardian of tales.",
    },
    {
      key: "ascendant",
      name: "Ascendant",
      image: Ascendant,
      desc: "Rising beyond the ordinary. Granted after watching 40 titles, your passion for storytelling transcends boundaries.",
    },
    {
      key: "cosmic",
      name: "Cosmic",
      image: Cosmic,
      desc: "You have seen it all, every story and every saga. Awarded for watching all titles, you now exist beyond the horizon of imagination itself.",
    },
  ];
  return (
    <SigilContext.Provider value={{ sigils }}>{children}</SigilContext.Provider>
  );
};
