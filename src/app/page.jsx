"use client";
import { useEffect, useState } from "react";
import Hero from "../sections/hero";
import NavBar from "@/components/navBar";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";
import Loader from "@/components/loader";

export default function Page() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { loading } = useContext(UserContext);

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
      {loading ? (
        <Loader />
      ) : (
        <>
          <NavBar isScrolled={isScrolled} />

          <Hero />
        </>
      )}
    </>
  );
}
