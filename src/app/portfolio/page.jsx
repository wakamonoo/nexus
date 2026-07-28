"use client";
import RegularButtons from "@/components/buttons/regBtns";
import SecondaryButtons from "@/components/buttons/secBtns";
import ExportCard from "@/components/portfolio/exportCard";
import { TitleContext } from "@/context/titleContext";
import { UserContext } from "@/context/userContext";
import { WatchContext } from "@/context/watchContext";
import { domToPng } from "modern-screenshot";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FaAngleLeft } from "react-icons/fa";

export default function Portfolio() {
  const [exporting, setExporting] = useState(false);
  const { chrono, release } = useContext(TitleContext);
  const { user } = useContext(UserContext);
  const { watchedInfoFetch, isTitleWatched } = useContext(WatchContext);
  const [order, setOrder] = useState([]);
  const [orderType, setOrderType] = useState("Chronological");
  const router = useRouter();

  useEffect(() => {
    const fetchWathced = async () => {
      if (user?.uid) {
        await watchedInfoFetch(user.uid);
      }
    };

    fetchWathced();
  }, [user]);

  useEffect(() => {
    if (chrono?.length) {
      setOrder(chrono);
    }
  }, [chrono]);

  const exportImage = async () => {
    if (exporting) return;

    const element = document.getElementById("nexus-portfolio-export");

    if (!element) return;

    try {
      setExporting(true);

      const dataUrl = await domToPng(element, {
        scale: 2,
        backgroundColor: "#2e2e2e",
        cacheBust: true,
      });

      const link = document.createElement("a");

      link.download = `${user.name}-nexus-collection.png`;

      link.href = dataUrl;

      link.click();
    } catch (err) {
      console.error("Failed to export collection.", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32 w-full">
      <div className="flex justify-between py-4">
        <FaAngleLeft
          onClick={() => router.back()}
          className="text-2xl cursor-pointer"
        />
        <h4 className="text-xl">PORTFOLIO</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)] md:gap-8">
        <aside className="w-full">
          <div className="flex gap-2">
            <SecondaryButtons
              onClick={() => {
                setOrder(chrono);
                setOrderType("Chronological");
              }}
            >
              Chrono
            </SecondaryButtons>
            <SecondaryButtons
              onClick={() => {
                setOrder(release);
                setOrderType("Release");
              }}
            >
              Release
            </SecondaryButtons>
          </div>
          <RegularButtons onClick={exportImage} disabled={exporting}>
            {exporting ? "generating" : "export 4:5 image"}
          </RegularButtons>
        </aside>
        <div>
          <div className="flex justify-center mt-4">
            <div className="relative h-[472.5px] w-[378px] md:h-[675px] md:w-[540px]">
              <div
                style={{
                  width: 1080,
                  height: 1350,
                  transformOrigin: "top left",
                  marginBottom: -(1350 * 0.65),
                  marginRight: -(1080 * 0.65),
                }}
                className="scale-[0.35] md:scale-[0.5]"
              >
                <ExportCard
                  user={user}
                  order={order}
                  orderType={orderType}
                  isTitleWatched={isTitleWatched}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              position: "fixed",
              left: "-100000px",
              top: 0,
              width: 1080,
              height: 1350,
              pointerEvents: "none",
            }}
          >
            <ExportCard
              user={user}
              order={order}
              orderType={orderType}
              isTitleWatched={isTitleWatched}
              id="nexus-portfolio-export"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
