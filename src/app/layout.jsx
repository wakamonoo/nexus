import { Bebas_Neue, Roboto, Anton, Orbitron } from "next/font/google";
import { UserProvider } from "@/context/userContext";
import { ScrollProvider } from "@/context/scrollContext";
import { MenuProvider } from "@/context/menuContext";
import { TitleProvider } from "@/context/titleContext";
import { PostProvider } from "@/context/postContext";
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
  title: "nexus",
  description: "Explore the MCU in chronological order",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${bebasNeue.variable} ${roboto.variable} ${anton.variable} ${orbitron.variable} scroll-smooth`}
      >
        <UserProvider>
          <ScrollProvider>
            <MenuProvider>
              <TitleProvider>
                <PostProvider>{children}</PostProvider>
              </TitleProvider>
            </MenuProvider>
          </ScrollProvider>
        </UserProvider>
      </body>
    </html>
  );
}
