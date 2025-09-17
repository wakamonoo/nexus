"use client";
import { useEffect, useState } from "react";
import Hero from "../sections/hero";
import NavBar from "@/components/navBar";

export default function Page() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  return (
    <>
      <NavBar isScrolled={isScrolled} />

      <Hero />

    </>
  );
}
