"use client";
import { useState } from "react";
import { FaBars } from "react-icons/fa";
import Nav from "@/components/nav";
import SignIn from "@/components/signIn";

export default function Hero() {
  const [showNav, setShowNav] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <>
      <div className="bg-panel h-screen">
        <div className="bg-brand flex justify-between p-4">
          <h1>logo</h1>
          <FaBars onClick={() => setShowNav(true)} />
        </div>
      </div>
      {showNav && <Nav setShowNav={setShowNav} setShowSignIn={setShowSignIn} />}
      {showSignIn && <SignIn setShowSignIn={setShowSignIn} />}
    </>
  );
}
