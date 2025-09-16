"use client";
import { useState } from "react";
import { FaBars, FaSearch } from "react-icons/fa";
import Nav from "@/components/nav";
import SignIn from "@/components/signIn";
import Image from "next/image";
import HeroBg from "@/assets/bg-hero.png";

export default function Hero() {
  const [showNav, setShowNav] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <>
      <div className="relative h-screen w-full">
        <Image src={HeroBg} alt="herobg" className="fixed -z-10 h-screen w-full object-cover" />

        <div className="flex justify-between p-4">
          <h1>logo</h1>
          <FaBars onClick={() => setShowNav(true)} />
        </div>

        <div className="absolute w-full p-4 flex flex-col left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <h1 className="font-tall text-6xl text-accent" style={{ textShadow: "1px 1px 1px #ffffff"}}>THERE WAS AN IDEA...</h1>

          <div className="flex my-4 w-auto items-center justify-center px-4 py-2 bg-text rounded-full">
            <input type="text" placeholder="Search movies, series or one shot" className="p-2 w-full outline-none text-base text-brand font-normal placeholder:text-brand" />
            <FaSearch className="text-2xl text-brand" />
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 rounded bg-accent w-full text-normal text-base font-normal">Joint Global Chat</button>
            <button className="px-4 py-2 rounded bg-accent w-full text-base font-normal">Start Browsing</button>
          </div>
        </div>
      </div>
      {showNav && <Nav setShowNav={setShowNav} setShowSignIn={setShowSignIn} />}
      {showSignIn && <SignIn setShowSignIn={setShowSignIn} />}
    </>
  );
}
