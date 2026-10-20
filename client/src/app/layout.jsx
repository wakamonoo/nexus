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
import { MomentProvider } from "@/context/momentContext";
import { FeedbackProvider } from "@/context/feedbackContext";
import FeedbackPopUp from "@/components/layout/essentials/feedbackPopUp";

// Fonts
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--heading-family",
});

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--body-family",
});

const orbitron = Orbitron({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--alt-family",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--tall-family",
});

// Metadata
export const metadata = {
  title: {
    default: "Nexus • Marvel Watch Tracker & MCU Watch Order",
    template: "%s • Nexus",
  },
  description:
    "Track your Marvel journey with Nexus, an unofficial Marvel and MCU watch tracker. Explore MCU watch orders, timelines, movies and series, create lists, rank titles, write reviews, and connect with Marvel fans.",

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
  publisher: "Nexus",

  applicationName: "Nexus",

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
    title: "Nexus • Marvel Watch Tracker & MCU Watch Order",
    description:
      "Track your Marvel journey with Nexus, an unofficial Marvel and MCU watch tracker. Explore MCU watch orders, timelines, movies and series, create lists, rank titles, write reviews, and connect with Marvel fans.",
    url: "https://ournexus.space",
    siteName: "Nexus",
    locale: "en-US",
    type: "website",
    images: [
      {
        url: "/main_logo.png",
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Nexus • Marvel Watch Tracker & MCU Watch Order",
    description:
      "Track your Marvel journey with Nexus, an unofficial Marvel and MCU watch tracker. Explore MCU watch orders, timelines, movies and series, create lists, rank titles, write reviews, and connect with Marvel fans.",
    images: "/main_logo.png",
  },

  metadataBase: new URL("https://ournexus.space"),
};

export const viewport = {
  themeColor: "#1c1c1c",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${roboto.variable}  ${orbitron.variable} ${anton.variable} scroll-smooth`}
    >
      <body>
        <LoaderProvider>
          <UserProvider>
            <TitleProvider>
              <SocketProvider>
                <ScrollProvider>
                  <MenuProvider>
                    <PostProvider>
                      <TitleNavProvider>
                        <WatchProvider>
                          <ListProvider>
                            <MomentProvider>
                              <FeedbackProvider>
                                <SigilProvider>
                                  {children}
                                  <FeedbackPopUp />
                                </SigilProvider>
                              </FeedbackProvider>
                            </MomentProvider>
                          </ListProvider>
                        </WatchProvider>
                      </TitleNavProvider>
                    </PostProvider>
                  </MenuProvider>
                </ScrollProvider>
              </SocketProvider>
            </TitleProvider>
          </UserProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}
