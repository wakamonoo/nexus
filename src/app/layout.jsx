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
import { ListProvider } from "@/context/listContext";

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
    title: "nexus — Marvel Watch Tracker, Watch Order & More",
    template: "%s | nexus",
  },
  description:
    "An unofficial, fan-made Marvel companion for your journey through the MCU and beyond. Track everything you've watched, explore Marvel watch orders and timelines, build lists, rate and review movies and series, rank your favorites, and connect with fellow Marvel fans.",

  keywords: [
    "Marvel Watch Tracker",
    "MCU Watch Tracker",
    "Marvel Watch Order",
    "MCU Watch Order",
    "MCU Chronological Order",
    "MCU Release Order",
    "Marvel Timeline",
    "MCU Timeline",
    "Marvel Movies List",
    "MCU Series Guide",
    "Marvel Universe Guide",
    "Marvel Universe Timeline",
    "Marvel Phase Guide",
    "MCU Phase Timeline",
    "Marvel Multiverse",
    "MCU Database",
    "Marvel Shows and Movies",
    "Marvel Rankings",
    "MCU Rankings",
    "Marvel Community",
    "Marvel Fansite",
    "Marvel Fan Hub",
    "Marvel Fan Portal",
    "MCU Companion",
    "Nexus",
    "Marvel",
    "Marvel Cinematic Universe",
    "MCU",
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
    title: "nexus — Marvel Watch Tracker, Watch Order & More",
    description:
      "An unofficial, fan-made Marvel companion for your journey through the MCU and beyond. Track everything you've watched, explore Marvel watch orders and timelines, build lists, rate and review movies and series, rank your favorites, and connect with fellow Marvel fans.",
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
    title: "nexus — Marvel Watch Tracker, Watch Order & More",
    description:
      "An unofficial, fan-made Marvel companion for your journey through the MCU and beyond. Track everything you've watched, explore Marvel watch orders and timelines, build lists, rate and review movies and series, rank your favorites, and connect with fellow Marvel fans.",
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
                          <ListProvider>
                            <SigilProvider>{children}</SigilProvider>
                          </ListProvider>
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
