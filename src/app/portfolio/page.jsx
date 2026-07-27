"use client";
import ExportCard from "@/components/portfolio/exportCard";
import { TitleContext } from "@/context/titleContext";
import { UserContext } from "@/context/userContext";
import { WatchContext } from "@/context/watchContext";
import { domToPng } from "modern-screenshot";
import { useContext, useEffect, useState } from "react";

export default function Portfolio() {
  const [exporting, setExporting] = useState(false);
  const { chrono, release } = useContext(TitleContext);
  const { user } = useContext(UserContext);
  const { watchedInfoFetch, isTitleWatched } = useContext(WatchContext);
  const [order, setOrder] = useState([]);

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
    <main>
      <div>
        <p>Nexus collection</p>
      </div>
      <div>
        <button onClick={() => setOrder(chrono)}>Chrono</button>
        <button onClick={() => setOrder(release)}>Release</button>
      </div>
      <button onClick={exportImage} disabled={exporting}>
        {exporting ? "generating" : "export 4:5 image"}
      </button>
      <div
        style={{
          width: 1080,
          height: 1350,
          transformOrigin: "top left",
          marginBottom: -(1350 * 0.65),
          marginRight: -(1080 * 0.65),
        }}
        className="scale-[0.35] md:scale-[0.8]"
      >
        <ExportCard order={order} isTitleWatched={isTitleWatched} />
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
          order={order}
          isTitleWatched={isTitleWatched}
          id="nexus-portfolio-export"
        />
      </div>
    </main>
  );
}
