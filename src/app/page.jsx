"use client";
import Banner from "@/components/layout/banner";
import Hero from "../sections/hero";
import NavBar from "@/components/layout/navBar";
import MenuStructure from "@/components/layout/menuStructure";
import LatestActivities from "@/components/layout/latestActivities";

export default function Page() {
  return (
    <>
      <NavBar />
      <div className="flex w-full md:px-8 lg:px-16">
        <aside className="hidden md:block bg-brand md:w-[35%] lg:w-[25%] pt-24 h-screen sticky top-0">
          <MenuStructure />
        </aside>
        <div className="w-full md:w-[65%] lg:w-[50%] md:py-2 lg:px-4">
          <Banner />
          <Hero />
        </div>
        <aside className="hidden lg:block lg:w-[25%] pt-20 h-screen sticky top-0">
          <LatestActivities />
        </aside>
      </div>
    </>
  );
}
