import { Bebas_Neue, Roboto, Anton, Orbitron } from "next/font/google";
import { UserProvider } from "@/context/userContext";
import AuthWrapper from "@/components/authWrapper";
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
          <AuthWrapper>{children}</AuthWrapper>
        </UserProvider>
      </body>
    </html>
  );
}
