"use client";
import { useEffect, useState } from "react";
import { FaBars, FaHome, FaSearch, FaUser } from "react-icons/fa";
import SignIn from "@/components/signIn";
import Image from "next/image";
import HeroBg from "@/assets/bg-hero.png";
import { MdChat } from "react-icons/md";

export default function Hero({ isLogged, adminBtn, user }) {
  const [showSignIn, setShowSignIn] = useState(false);
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
      <div className="relative h-screen bg-gradient-to-b from-transparent to-[var(--color-bg)] w-full">
        <Image
          src={HeroBg}
          alt="herobg"
          className="fixed -z-10 h-screen w-full object-cover"
        />

        <div
          className={`fixed flex gap-4 justify-between px-4 py-2 w-full h-12 transition-colors duration-150 z-[70] ${
            isScrolled ? "bg-[var(--color-accent)]" : "bg-transparent"
          }`}
        >
          <div className="flex items-center"> 
            <h1>logo</h1>
          </div>
          <div className="flex items-center gap-4">
            <FaHome className="text-2xl" />
            <MdChat className="text-2xl" />
            {isLogged && user?.picture ? (
              <Image src={user.picture} alt="user" width={0} height={0} sizes="100vw" className="w-8 rounded-full h-auto" />
            ) : (
              <FaUser className="text-2xl" />
            )}
          </div>
        </div>

        <div className="absolute w-full p-4 flex flex-col left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex items-center justify-center">
            <h1 className="font-tall text-6xl text-accent">THERE</h1>

            <div className="flex flex-col mt-2.5 items-center justify-center">
              <h1 className="font-tall text-3xl text-accent leading-4.5">
                WAS
              </h1>
              <h1 className="font-tall text-3xl text-accent">AN</h1>
            </div>

            <h1 className="font-tall text-6xl text-accent">IDEA...</h1>
          </div>

          <div className="flex my-4 w-auto items-center justify-center px-4 py-2 bg-text rounded-full">
            <input
              type="text"
              placeholder="Search movies, series or one shot..."
              className="p-2 w-full outline-none text-base text-brand font-normal placeholder:text-brand"
            />
            <FaSearch className="text-2xl text-brand" />
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 rounded bg-accent w-full text-normal text-base font-normal">
              Joint Global Chat
            </button>
            <button
              onClick={() => setShowSignIn(true)}
              className="px-4 py-2 rounded bg-accent w-full text-base font-normal"
            >
              Sign Up Now
            </button>
          </div>
        </div>
      </div>
      {showSignIn && <SignIn setShowSignIn={setShowSignIn} isLogged={isLogged} adminBtn={adminBtn} />}
    </>
  );
}
