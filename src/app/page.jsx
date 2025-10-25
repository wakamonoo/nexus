"use client";
import Banner from "@/components/layout/banner";
import Hero from "../sections/hero";
import NavBar from "@/components/layout/navBar";
import MenuStructure from "@/components/layout/menuStructure";
import LatestReviews from "@/components/layout/latestReviews";

export default function Page() {
  return (
    <>
      <NavBar />
      <div className="flex w-full md:px-8 lg:px-16">
        <aside className="hidden md:block bg-brand md:w-[35%] lg:w-[25%] pt-18 h-screen sticky top-0 md:-ml-4">
          <MenuStructure />
        </aside>
        <div className="w-full md:w-[65%] lg:w-[50%] md:pt-2 md:ml-4 lg:px-8 xl:px-16">
          <Banner />
          <Hero />
        </div>
        <aside className="hidden lg:block lg:w-[25%] pt-18 h-screen sticky top-0">
          <LatestReviews />
        </aside>
      </div>
    </>
  );
}
