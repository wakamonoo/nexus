"use client";
import RegularButtons from "@/components/buttons/regBtns";
import SecondaryButtons from "@/components/buttons/secBtns";
import Loader from "@/components/loaders/loader";
import ExportCard from "@/components/portfolio/exportCard";
import { LoaderContext } from "@/context/loaderContext";
import { TitleContext } from "@/context/titleContext";
import { UserContext } from "@/context/userContext";
import { WatchContext } from "@/context/watchContext";
import { domToPng } from "modern-screenshot";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FaAngleLeft } from "react-icons/fa";

export default function Portfolio() {
  const [exporting, setExporting] = useState(false);
  const { chrono, release, titles } = useContext(TitleContext);
  const { user } = useContext(UserContext);
  const { isTitleWatched } = useContext(WatchContext);
  const [order, setOrder] = useState([]);
  const [orderType, setOrderType] = useState("Chronological");
  const { setIsLoading } = useContext(LoaderContext);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (chrono?.length) {
      setOrder(chrono);
    }
  }, [chrono]);

  const exportImage = async () => {
    if (exporting) return;

    try {
      setExporting(true);

      for (let index = 0; index < pages.length; index++) {
        const element = document.getElementById(
          `nexus-portfolio-export-${index}`,
        );

        if (!element) return;

        const dataUrl = await domToPng(element, {
          scale: 2,
          backgroundColor: "#2e2e2e",
          cacheBust: true,
        });

        const link = document.createElement("a");

        link.download =
          pages.length > 1
            ? `${user.name}-nexus-collection-${index + 1}.png`
            : `${user.name}-nexus-collection.png`;

        link.href = dataUrl;

        link.click();
        if (pages.length > 1) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }
    } catch (err) {
      console.error("Failed to export collection.", err);
    } finally {
      setExporting(false);
    }
  };

  const isContinuum = orderType === "Cinematic Continuum";

  const cardWidth = 1080;
  const cardHeight = 1512;

  const titlesPerPage = 102;

  const pages = Array.from(
    { length: Math.ceil(order.length / titlesPerPage) },
    (_, index) =>
      order.slice(index * titlesPerPage, (index + 1) * titlesPerPage),
  );

  return (
    <main className="p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32 w-full">
      <div className="flex justify-between py-4">
        <FaAngleLeft
          onClick={() => router.back()}
          className="text-2xl cursor-pointer"
        />
        <h4 className="text-xl">PORTFOLIO</h4>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="w-full bg-[var(--color-secondary)] h-fit rounded-2xl p-4">
          <div className="mb-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-vibe">
              Your Journey
            </p>
            <p className="text-sm leading-relaxed">
              Showcase your MCU journey with a visual checklist of the titles
              you've watched on ournexus.space. Choose between chronological or
              release order, export your progress, and share your journey with
              friends or on social media.
            </p>
          </div>
          <div className="mb-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-vibe">
              Viewing Order
            </p>
            <div className="grid grid-flow-col auto-cols-fr w-full gap-2">
              <SecondaryButtons
                onClick={() => {
                  setOrder(chrono);
                  setOrderType("Chronological");
                }}
              >
                <p className="font-heading text-normal text-base">Chrono</p>
              </SecondaryButtons>
              <SecondaryButtons
                onClick={() => {
                  setOrder(release);
                  setOrderType("Release");
                }}
              >
                <p className="font-heading text-normal text-base">Release</p>
              </SecondaryButtons>
              <SecondaryButtons
                onClick={() => {
                  setOrder(
                    titles
                      .filter((title) => title.status === "released")
                      .sort((a, b) => {
                        const dateA =
                          a.mediaType === "tv"
                            ? a.first_air_date
                            : a.release_date;

                        const dateB =
                          b.mediaType === "tv"
                            ? b.first_air_date
                            : b.release_date;

                        return new Date(dateA) - new Date(dateB);
                      }),
                  );
                  setOrderType("Cinematic Continuum");
                }}
              >
                <p className="font-heading text-normal text-base">Continuum</p>
              </SecondaryButtons>
            </div>
          </div>
          <div className="flex-1 border-t-2 border-panel" />
          <div className="my-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-vibe">
                Current Order
              </p>
              <p className="text-sm font-bold text-end">{orderType}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-vibe">
                Titles
              </p>
              <p className="text-sm font-bold">{order.length}</p>
            </div>
          </div>
          {exporting ? (
            <Loader />
          ) : (
            <RegularButtons onClick={exportImage} disabled={exporting}>
              <p className="font-heading text-normal text-base">Export Image</p>
            </RegularButtons>
          )}
        </aside>
        <section className="min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-vibe">
                Preview
              </p>
              <h2 className="text-lg font-bold uppercase">
                Your ournexus.space Checklist
              </h2>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-vibe text-end">
                Export Format
              </p>
              <p className="text-sm text-vibe">5:7 Scale</p>
            </div>
          </div>
          <div
            className={`flex flex-col gap-4 min-h-[500px] items-center justify-center overflow-hidden rounded-2xl bg-[var(--color-secondary)] p-4 sm:p-8 ${pages.length === 0 ? "animate-pulse" : "animate-none"}`}
          >
            {pages.map((pageOrder, index) => (
              <div
                key={index}
                className="relative h-[529.2px] w-[378px] md:h-[756px] md:w-[540px] shrink-0"
              >
                <div
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    transformOrigin: "top left",
                  }}
                  className="scale-[0.35] md:scale-[0.5] border"
                >
                  <ExportCard
                    user={user}
                    order={order}
                    pageOrder={pageOrder}
                    orderType={orderType}
                    isTitleWatched={isTitleWatched}
                    isContinuum={isContinuum}
                    cardWidth={cardWidth}
                    cardHeight={cardHeight}
                    pageNumber={index + 1}
                    totalPages={pages.length}
                    startIndex={index * titlesPerPage}
                  />
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              position: "fixed",
              left: "-100000px",
              top: 0,
              width: 1080,
              height: 1512,
              pointerEvents: "none",
            }}
          >
            {pages.map((pageOrder, index) => (
              <ExportCard
                key={index}
                user={user}
                order={order}
                pageOrder={pageOrder}
                orderType={orderType}
                isTitleWatched={isTitleWatched}
                id={`nexus-portfolio-export-${index}`}
                isContinuum={isContinuum}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                pageNumber={index + 1}
                totalPages={pages.length}
                startIndex={index * titlesPerPage}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
