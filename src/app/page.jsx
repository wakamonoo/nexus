"use client";
import Banner from "@/components/layout/essentials/banner";
import Hero from "../components/layout/essentials/hero";
import NavBar from "@/components/layout/essentials/navBar";
import MenuStructure from "@/components/layout/essentials/menuStructure";
import LatestReviews from "@/components/layout/essentials/latestReviews";
import RinaNews from "@/components/layout/essentials/rinaNews";
import TitleCountdown from "@/components/layout/essentials/countdown";
import ScreenTime from "@/components/layout/essentials/screenTime";
import Footer from "@/components/layout/essentials/footer";
import Activities from "@/components/layout/essentials/activities";

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
          <TitleCountdown />
          <ScreenTime />
          <Activities />
          <div className="lg:hidden">
            <LatestReviews />
          </div>
          <RinaNews />

          <Hero />
        </div>
        <aside className="hidden lg:block lg:w-[25%] pt-18 h-screen sticky top-0">
          <LatestReviews />
        </aside>
      </div>
      <Footer />
    </>
  );
}
