import { Bebas_Neue, Roboto, Anton, Orbitron } from "next/font/google";
import { UserProvider } from "@/context/userContext";
import { ScrollProvider } from "@/context/scrollContext";
import { MenuProvider } from "@/context/menuContext";
import { TitleProvider } from "@/context/titleContext";
import { PostProvider } from "@/context/postContext";
import { LoaderProvider } from "@/context/loaderContext";
import { TitleNavProvider } from "@/context/titlesNavContext";
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
    "Nexus is a fan-driven MCU platform offering multiple watch orders, rankings, and community spaces where fans can explore, discuss, and connect across the Marvel Cinematic Universe.",

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
    { name: "Joven Bataller", url: "https://wakamonoo.vercel.app" },
  ],
  creator: "Joven Bataller",
  publisher: "nexus",

  applicationName: "nexus",

  category: "Entertainment",

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: [
      { url: "/alt_logo.png" },
      { url: "/alt_logo.png", sizes: "32x32", type: "image/png" },
      { url: "/alt_logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/alt_logo.png",
    shortcut: "/alt_logo.png",
  },

  openGraph: {
    title: "nexus",
    description:
      "Nexus is a fan-driven MCU platform offering multiple watch orders, rankings, and community spaces where fans can explore, discuss, and connect across the Marvel Cinematic Universe.",
    url: "https://nexus-wakamonoo.vercel.app",
    siteName: "nexus",
    locale: "en-US",
    type: "website",
    images: [
      {
        url: "https://i.imgur.com/e2unHxa.png",
        width: 1249,
        height: 339,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "nexus",
    description:
      "Nexus is a fan-driven MCU platform offering multiple watch orders, rankings, and community spaces where fans can explore, discuss, and connect across the Marvel Cinematic Universe.",
    images: "https://i.imgur.com/e2unHxa.png",
  },

  metadataBase: new URL("https://nexus-wakamonoo.vercel.app"),
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
