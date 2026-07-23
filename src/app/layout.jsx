import { Bebas_Neue, Roboto, Anton, Orbitron } from "next/font/google";
import { UserProvider } from "@/context/userContext";
import { ScrollProvider } from "@/context/scrollContext";
import { MenuProvider } from "@/context/menuContext";
import { TitleProvider } from "@/context/titleContext";
import { PostProvider } from "@/context/postContext";
import { LoaderProvider } from "@/context/loaderContext";
import { TitleNavProvider } from "@/context/titleNavContext";
import { WatchProvider } from "@/context/watchContext";
import { SigilProvider } from "@/context/sigilContext";
import { SocketProvider } from "@/context/socketContext";
import "./globals.css";

// Fonts
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
});

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

const orbitron = Orbitron({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-orbitron",
});

// Metadata
export const metadata = {
  title: {
    default: "nexus",
    template: "%s | nexus",
  },
  description:
    "Nexus is the ultimate Marvel fan platform where you can discover MCU watch orders, track your Marvel journey, rank movies and series, discuss the Marvel Cinematic Universe, and connect with other Marvel fans.",

  keywords: [
    "Nexus",
    "Marvel",
    "Marvel Cinematic Universe",
    "MCU",
    "MCU Watch Guide",
    "Marvel Watch Order",
    "MCU Release Order",
    "MCU Chronological Order",
    "MCU Timeline",
    "Marvel Timeline",
    "Marvel Movies List",
    "MCU Series Guide",
    "MCU Watch Tracker",
    "MCU Rankings",
    "Marvel Rankings",
    "Marvel Universe Guide",
    "MCU Community",
    "Marvel Fan Hub",
    "Marvel Fanbase",
    "Marvel Discussion",
    "Marvel Fansite",
    "Marvel Phase Guide",
    "MCU Phase Timeline",
    "Marvel Universe Timeline",
    "Marvel Phases Explained",
    "MCU Database",
    "Marvel Multiverse",
    "Marvel Fan Portal",
    "MCU Companion",
    "MCU Platform",
    "Marvel Streaming Order",
    "Marvel Shows and Movies",
    "Marvel Watch Platform",
  ],

  authors: [
    { name: "wakamono of the night" },
    { name: "Joven Bataller", url: "https://wakamonoo.site" },
  ],
  creator: "Joven Bataller",
  publisher: "nexus",

  applicationName: "nexus",

  category: "Entertainment",

  robots: {
    index: true,
    follow: true,
  },

  verification: {
    google: "iYKOhXEC4XjkkIKgKZzvAmLnQtaQsCHa8-HREmlTjU8",
  },

  manifest: "/manifest.json",

  icons: {
    icon: [
      { url: "/icons/alt_logo.png" },
      { url: "/icons/alt_logo.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/alt_logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/icons/alt_logo.png",
    shortcut: "/icons/alt_logo.png",
  },

  openGraph: {
    title: "nexus",
    description:
      "An unofficial, fan-made Marvel companion built for your journey through the MCU and beyond. Explore watch orders, track everything you've watched, rank your favorite movies and series, discover connected stories, and connect with fellow Marvel fans. Nexus is not affiliated with or endorsed by Marvel or Disney.",
    url: "https://ournexus.space",
    siteName: "nexus",
    locale: "en-US",
    type: "website",
    images: [
      {
        url: "https://i.imgur.com/WCCf5AW.png",
        width: 1249,
        height: 339,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "nexus",
    description:
      "An unofficial, fan-made Marvel companion built for your journey through the MCU and beyond. Explore watch orders, track everything you've watched, rank your favorite movies and series, discover connected stories, and connect with fellow Marvel fans. Nexus is not affiliated with or endorsed by Marvel or Disney.",
    images: "https://i.imgur.com/WCCf5AW.png",
  },

  metadataBase: new URL("https://ournexus.space"),
};

export const viewport = {
  themeColor: "#1c1c1c",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${bebasNeue.variable} ${roboto.variable} ${anton.variable} ${orbitron.variable} scroll-smooth`}
      >
        <LoaderProvider>
          <UserProvider>
            <SocketProvider>
              <ScrollProvider>
                <MenuProvider>
                  <TitleProvider>
                    <PostProvider>
                      <TitleNavProvider>
                        <WatchProvider>
                          <SigilProvider>{children}</SigilProvider>
                        </WatchProvider>
                      </TitleNavProvider>
                    </PostProvider>
                  </TitleProvider>
                </MenuProvider>
              </ScrollProvider>
            </SocketProvider>
          </UserProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}
