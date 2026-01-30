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
  const router = useRouter();
  const [count, setCount] = useState({ usersCount: 0, titlesCount: 0 });
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

        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3">
            <div className="flex flex-col gap-2 p-4 items-start justify-center">
              <div className="flex items-center gap-2 justify-center">
                <div className="flex items-center justify-center w-24 h-24">
                  <CountUp
                    end={count.usersCount}
                    duration={1.5}
                    className="text-7xl font-extrabold text-accent"
                  />
                </div>
                <h2 className="text-xl font-extrabold">USERS</h2>
              </div>

              <div className="flex items-center gap-2 justify-center">
                <div className="flex items-center justify-center w-24 h-24">
                  <CountUp
                    end={count.titlesCount}
                    duration={1.5}
                    className="text-7xl font-extrabold text-accent"
                  />
                </div>
                <h2 className="text-xl font-extrabold">TITLES</h2>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <RegularButtons onClick={() => router.push("/admin/addTitle")}>
                <p className="font-bold text-normal text-base uppercase">
                  Add new title
                </p>
              </RegularButtons>
              <RegularButtons onClick={() => router.push("/admin/editTitles")}>
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

          <div className="col-span-1 mt-4 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {allUsers.map((user, i) => {
                return (
                  <div
                    key={i}
                    className="flex flex-col justify-center items-center overflow-y-auto"
                  >
                    <Image
                      src={user?.picture || Fallback}
                      alt="user"
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-full h-full object-cover rounded"
                    />
                    <p className="truncate w-16 text-center text-sm opacity-60">
                      {user?.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}