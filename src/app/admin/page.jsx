"use client";
import { useContext, useEffect, useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import CountUp from "react-countup";
import { UserContext } from "@/context/userContext";
import AdminGuard from "@/components/guard/adminGuard";
import { LoaderContext } from "@/context/loaderContext";
import RegularButtons from "@/components/buttons/regBtns";
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export default function Page() {
  const router = useRouter();
  const [count, setCount] = useState({ usersCount: 0, titlesCount: 0 });
  const { setShowSignIn } = useContext(UserContext);
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
            <p className="font-bold text-normal text-base uppercase">Add new title</p>
          </RegularButtons>
          <RegularButtons onClick={() => router.push("/admin/editTitles")}>
            <p className="font-bold text-normal text-base uppercase">Edit Titles</p>
          </RegularButtons>
          <RegularButtons
            onClick={() => router.push("/admin/updateTitlesOrder")}
          >
            <p className="font-bold text-normal text-base uppercase">Update Order</p>
          </RegularButtons>
        </div>
      </div>
    </AdminGuard>
  );
}
