"use client";
import Hero from "../sections/hero";
import NavBar from "@/components/navBar";
import { useContext } from "react";
import { PostContext } from "@/context/postContext";
import ColdLoader from "@/components/coldLoader";

export default function Page() {
  const { coldLoad } = useContext(PostContext);
  return (
    <>
      {coldLoad ? (
        <ColdLoader />
      ) : (
        <>
          <NavBar />
          <Hero />
        </>
      )}
    </>
  );
}
