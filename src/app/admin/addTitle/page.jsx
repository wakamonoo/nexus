"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { LoaderContext } from "@/context/loaderContext";
import Fallback from "@/assets/fallback.png";
import AdminGuard from "@/components/guard/adminGuard";
import Image from "next/image";
import Swal from "sweetalert2";
import RegularButtons from "@/components/buttons/regBtns";
import TMDBSearch from "@/components/modals/tmdbSearch";
import SecondaryButtons from "@/components/buttons/secBtns";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export default function AddTitle() {
  const [data, setData] = useState({
    tmdbId: "",
    mediaType: "",
    timeline: "",
    phase: "",
    type: "",
    order: "",
    category: "",
    universe: "",
    status: "",
    connections: "",
    summary: "",
  });
  const { setIsLoading } = useContext(LoaderContext);
  const router = useRouter();
  const fileRef = useRef();

  const [showTMDBSearch, setShowTMDBSearch] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setData((prev) => ({
        ...prev,
        [name]:
          name === "order" || name === "episode" || name === "duration"
            ? Number(value)
            : value,
      }));
    }
  };

  const handleAddNewTitle = async (fileRef) => {
    try {
      setIsLoading(true);

      let imageURL;

      const formData = new FormData();
      formData.append("file", data.image);

      const cloudRes = await fetch(`${BASE_URL}/api/uploads/imageUpload`, {
        method: "POST",
        body: formData,
      });

      const cloudData = await cloudRes.json();
      imageURL = cloudData.url;

      await fetch(`${BASE_URL}/api/titles/addTitle`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ ...data, image: imageURL }),
      });

      setData({
        tmdbId: "",
        mediaType: "",
        timeline: "",
        phase: "",
        type: "",
        order: "",
        category: "",
        universe: "",
        status: "",
        connections: "",
        summary: "",
      });

      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      console.error(err);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Failed adding title!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-accent)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title:
            "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
        },
      });
    } finally {
      setIsLoading(false);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Title have been added!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-hulk)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title:
            "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
        },
      });
    }
  };

  return (
    <AdminGuard>
      <>
        <div className="p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
          <div className="flex justify-between items-center">
            <FaAngleLeft
              onClick={() => router.back()}
              className="text-2xl cursor-pointer"
            />
            <h1 className="text-xl">ADD NEW TITLE</h1>
          </div>
          <form
            className="flex flex-col items-start justify-center gap-4 w-full pt-8"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddNewTitle(fileRef);
            }}
          >
            <SecondaryButtons onClick={() => setShowTMDBSearch(true)}>
              <p className="font-bold text-normal text-base">Locate in TMDB</p>
            </SecondaryButtons>
            <input
              type="text"
              name="timeline"
              value={data.timeline}
              onChange={handleChange}
              placeholder="Timeline Date"
              className="bg-panel text-base text-normal font-normal p-4 rounded w-full"
            />
            <select
              name="phase"
              required
              value={data.phase}
              onChange={handleChange}
              className="bg-panel text-base text-normal font-normal p-4 cursor-pointer rounded w-full"
            >
              <option value="null">Select Phase</option>
              <option value="Phase 1">Phase 1</option>
              <option value="Phase 2">Phase 2</option>
              <option value="Phase 3">Phase 3</option>
              <option value="Phase 4">Phase 4</option>
              <option value="Phase 5">Phase 5</option>
              <option value="Phase 6">Phase 6</option>
              <option value="Not Part">Not Part</option>
            </select>
            <select
              name="type"
              required
              value={data.type}
              onChange={handleChange}
              className="bg-panel text-base text-normal font-normal p-4 rounded w-full cursor-pointer"
            >
              <option value="null">Select Type</option>
              <option value="Film">Film</option>
              <option value="One Shot">One Shot</option>
              <option value="TV Series">TV Series</option>
              <option value="Mini-Series">Mini-Series</option>
              <option value="Animated Series">Animated Series</option>
              <option value="Special Presentaion">Special Presentaion</option>
            </select>
            <input
              type="number"
              name="order"
              value={data.order}
              onWheel={(e) => e.target.blur()}
              onChange={handleChange}
              placeholder="Order in Timeline"
              className="bg-panel text-base text-normal font-normal p-4 rounded w-full"
            />
            <select
              name="category"
              required
              value={data.category}
              onChange={handleChange}
              className="bg-panel text-base text-normal font-normal p-4 rounded w-full cursor-pointer"
            >
              <option value="null">Select Category</option>
              <option value="mcu">MCU</option>
              <option value="legacy">Legacy</option>
            </select>
            <input
              type="text"
              required
              name="universe"
              value={data.universe}
              onChange={handleChange}
              placeholder="Universe: (ex. Earth-616)"
              className="bg-panel text-base text-normal font-normal p-4 rounded w-full"
            />
            <select
              name="status"
              value={data.status}
              onChange={handleChange}
              className="bg-panel text-base text-normal font-normal p-4 rounded w-full cursor-pointer"
            >
              <option value="null">Select Status</option>
              <option value="released">Released</option>
              <option value="upcoming">Upcoming</option>
            </select>
            <input
              type="text"
              name="connections"
              value={data.connections}
              onChange={handleChange}
              placeholder="Connections"
              className="bg-panel text-base text-normal font-normal p-4 rounded w-full"
            />
            <RegularButtons type="submit">
              <p className="font-bold text-normal text-base">Submit</p>
            </RegularButtons>
          </form>
        </div>
        {showTMDBSearch && (
          <TMDBSearch
            BASE_URL={BASE_URL}
            setShowTMDBSearch={setShowTMDBSearch}
            setData={setData}
          />
        )}
      </>
    </AdminGuard>
  );
}
