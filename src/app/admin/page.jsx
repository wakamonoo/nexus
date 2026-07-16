"use client";
import { useContext, useEffect, useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import CountUp from "react-countup";
import { UserContext } from "@/context/userContext";
import AdminGuard from "@/components/guard/adminGuard";
import { LoaderContext } from "@/context/loaderContext";
import RegularButtons from "@/components/buttons/regBtns";
import Image from "next/image";
import Fallback from "@/assets/fallback.png";
import ScrollContainer from "react-indiana-drag-scroll";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export default function Page() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [count, setCount] = useState({
    usersCount: 0,
    titlesCount: 0,
    mcuTitlesCount: 0,
    legacyTitlesCount: 0,
    releasedTitlesCount: 0,
    upcomingTitlesCount: 0,
  });
  const { setShowSignIn, allUsers } = useContext(UserContext);
  const { setIsLoading } = useContext(LoaderContext);

  useEffect(() => {
    setShowSignIn(false);
    setIsLoading(false);
  }, []);

  const fetchCounts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/counts/countData`);
      const data = await res.json();
      setCount(data);
    } catch (err) {
      console.error("failed to fetch count:", err);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <AdminGuard>
      <div className="p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
        <FaAngleLeft
          onClick={() => router.back()}
          title="Back"
          className="text-2xl cursor-pointer"
        />
        <div className="p-4 w-full text-center">
          <h4 className="text-xl">Hello {user?.name}</h4>
          <p className="text-sm">Welcome to the Dashboard</p>
        </div>
        <div className="flex flex-col md:grid md:grid-cols-4 gap-4 mt-4">
          <div className="md:col-span-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 items-start justify-center">
              <div className="flex items-center gap-2 p-4 w-full justify-center border border-panel bg-second rounded-2xl">
                <div className="flex flex-col items-center justify-center">
                  <CountUp
                    end={count.usersCount}
                    duration={1.5}
                    className="text-6xl font-extrabold text-accent"
                  />
                  <h2 className="text-xs">Registered Users</h2>
                </div>
              </div>

              <div className="flex items-center gap-2 p-4 w-full justify-center border border-panel bg-second rounded-2xl">
                <div className="flex flex-col items-center justify-center">
                  <CountUp
                    end={count.titlesCount}
                    duration={1.5}
                    className="text-6xl font-extrabold text-accent"
                  />
                  <h2 className="text-xs">Overall Titles</h2>
                </div>
              </div>

              <div className="flex items-center gap-2 p-4 w-full justify-center border border-panel bg-second rounded-2xl">
                <div className="flex flex-col items-center justify-center">
                  <CountUp
                    end={count.mcuTitlesCount}
                    duration={1.5}
                    className="text-6xl font-extrabold text-accent"
                  />
                  <h2 className="text-xs">MCU Titles</h2>
                </div>
              </div>

              <div className="flex items-center gap-2 p-4 w-full justify-center border border-panel bg-second rounded-2xl">
                <div className="flex flex-col items-center justify-center">
                  <CountUp
                    end={count.legacyTitlesCount}
                    duration={1.5}
                    className="text-6xl font-extrabold text-accent"
                  />
                  <h2 className="text-xs">Legacy Titles</h2>
                </div>
              </div>

              <div className="flex items-center gap-2 p-4 w-full justify-center border border-panel bg-second rounded-2xl">
                <div className="flex flex-col items-center justify-center">
                  <CountUp
                    end={count.releasedTitlesCount}
                    duration={1.5}
                    className="text-6xl font-extrabold text-accent"
                  />
                  <h2 className="text-xs">Released Titles</h2>
                </div>
              </div>

              <div className="flex items-center gap-2 p-4 w-full justify-center border border-panel bg-second rounded-2xl">
                <div className="flex flex-col items-center justify-center">
                  <CountUp
                    end={count.upcomingTitlesCount}
                    duration={1.5}
                    className="text-6xl font-extrabold text-accent"
                  />
                  <h2 className="text-xs">Upcoming Titles</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-second p-4 rounded-2xl border border-panel">
              <p className="font-bold text-lg">Quick Actions</p>
              <div className="flex flex-col gap-2">
                <RegularButtons onClick={() => router.push("/admin/addTitle")}>
                  <p className="font-bold text-normal text-base uppercase">
                    Add new title
                  </p>
                </RegularButtons>
                <RegularButtons
                  onClick={() => router.push("/admin/editTitles")}
                >
                  <p className="font-bold text-normal text-base uppercase">
                    Edit Titles
                  </p>
                </RegularButtons>
                <RegularButtons
                  onClick={() => router.push("/admin/updateTitlesOrder")}
                >
                  <p className="font-bold text-normal text-base uppercase">
                    Update Order
                  </p>
                </RegularButtons>
              </div>
            </div>
          </div>
        </div>
        <div className="my-8">
          <p className="font-bold text-lg mb-2">Registered Users</p>
          <ScrollContainer
            className="flex overflow-auto cursor-grab active:cursor-grabbing select-none scrollbar-hide md:scrollbar"
            vertical
            horizontal
          >
            <div className="flex gap-2">
              {allUsers.map((user, i) => {
                return (
                  <div
                    key={i}
                    className="flex flex-col justify-center p-2 bg-second rounded-2xl border border-panel items-center w-50 h-auto"
                  >
                    <Image
                      src={user?.picture || Fallback}
                      alt="user"
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                    <p className="truncate h-10 w-full text-center text-sm font-bold border-b border-panel mb-2">
                      {user?.name}
                    </p>
                    <p className="text-xs text-center opacity-60">
                      <span className="font-bold">Joined </span>
                      {new Date(user?.createdAt).toLocaleDateString([], {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-center opacity-60">
                      {user?.totalWatched ? user?.totalWatched : "0"}{" "}
                      <span className="font-bold">Titles watched</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </ScrollContainer>
        </div>
      </div>
    </AdminGuard>
  );
}
