"use client";
import { LoaderContext } from "@/context/loaderContext";
import { TitleContext } from "@/context/titleContext";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import AdminGuard from "@/components/guard/adminGuard";
import Fallback from "@/assets/fallback.png";
import Image from "next/image";
import Swal from "sweetalert2";
import { FaAngleLeft } from "react-icons/fa";
import RegularButtons from "@/components/buttons/regBtns";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export default function EditTitle() {
  const [data, setData] = useState({
    title: "",
    image: null,
    posterCredit: "",
    posterCreditUrl: "",
    date: "",
    timeline: "",
    phase: "",
    type: "",
    director: "",
    order: "",
    episode: "",
    duration: "",
    trailer: "",
    summary: "",
  });
  const { titleId } = useParams();
  const { setIsLoading } = useContext(LoaderContext);
  const { titles } = useContext(TitleContext);
  const fileRef = useRef();
  const router = useRouter();

  const title = titles.find((t) => t.titleId === titleId);

  useEffect(() => {
    if (title) {
      setData({
        title: title.title || "",
        image: title.image || null,
        posterCredit: title.posterCredit || "",
        posterCreditUrl: title.posterCreditUrl || "",
        date: title.date || "",
        timeline: title.timeline || "",
        phase: title.phase || "",
        type: title.type || "",
        director: title.director || "",
        order: title.order || "",
        episode: title.episode || "",
        duration: title.duration || "",
        trailer: title.trailer || "",
        summary: title.summary || "",
      });
    }
  }, [title]);

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

  const handleUpdateTitle = async (titleId) => {
    try {
      setIsLoading(true);

      let imageURL = data.image;

      if (data.image instanceof File) {
        const formData = new FormData();
        formData.append("file", data.image);

        const cloudRes = await fetch(`${BASE_URL}/api/uploads/imageUpload`, {
          method: "POST",
          body: formData,
        });

        const cloudData = await cloudRes.json();
        imageURL = cloudData.url;
      }

      await fetch(`${BASE_URL}/api/titles/updateTitle/${titleId}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          image: imageURL,
        }),
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Failed updating title!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-accent)",
        customClass: {
          popup:
            "max-w-xs w-full border-1 border-[var(--color-panel)] text-normal rounded-lg shadow-lg p-4",
          title: "text-lg font-bold !text-[var(--color-accent)]",
        },
      });
    } finally {
      setIsLoading(false);
      Swal.fire({
  toast: true,
  position: "bottom-start",
  title: "Title have been updated",
  icon: "success",
  timer: 2000,
  showConfirmButton: false,
  background: "var(--color-secondary)",
  iconColor: "var(--color-hulk)",
  customClass: {
    popup:
      "max-w-xs w-full border border-[var(--color-panel)] text-normal rounded-lg shadow-lg p-4",
    title:
      "!text-[var(--color-hulk)] text-base",
  },
});

    }
  };

  return (
    <AdminGuard>
      <div className="p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
        <div className="flex justify-between items-center">
          <FaAngleLeft
            onClick={() => router.back()}
            className="text-2xl cursor-pointer"
          />
          <h1 className="text-xl">Edit Title</h1>
        </div>
        <form
          className="flex flex-col items-start justify-center gap-4 w-full pt-8"
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateTitle(titleId);
          }}
        >
          <div className="flex justify-center items-center w-full">
            <label htmlFor="addPoster">
              <Image
                src={
                  data.image instanceof File
                    ? URL.createObjectURL(data.image)
                    : data.image || Fallback
                }
                alt="user"
                width={0}
                height={0}
                sizes="100vw"
                name="userImage"
                className="object-cover w-26 h-40 md:w-32 md:h-46 cursor-pointer rounded"
              />
            </label>
            <input
              id="addPoster"
              type="file"
              name="image"
              ref={fileRef}
              onChange={handleChange}
              className="bg-panel p-4 rounded w-[72%] cursor-pointer hidden"
            />
          </div>
          <input
            type="text"
            name="title"
            value={data.title}
            onChange={handleChange}
            placeholder="Enter Title"
            className="bg-panel text-base text-normal font-normal p-4 rounded w-full"
          />
          <input
            type="text"
            name="posterCredit"
            value={data.posterCredit}
            onChange={handleChange}
            placeholder="Poster Credit"
            className="bg-panel text-base text-normal font-normal p-4 rounded w-full"
          />
          <input
            type="text"
            name="posterCreditUrl"
            value={data.posterCreditUrl}
            onChange={handleChange}
            placeholder="Poster Credit Url"
            className="bg-panel text-base text-normal font-normal p-4 rounded w-full"
          />
          <div className="flex items-center w-full">
            <label className="text-normal font-normal text-base w-[30%]">
              Release Date
            </label>
            <input
              type="date"
              name="date"
              value={data.date}
              onChange={handleChange}
              placeholder="Release Date"
              className="bg-panel text-base text-normal font-normal p-4 rounded w-[70%]"
            />
          </div>
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
            type="text"
            name="director"
            value={data.director}
            onChange={handleChange}
            placeholder="Director/s"
            className="bg-panel text-base text-normal font-normal p-4 rounded w-full"
          />
          <input
            type="number"
            name="order"
            value={data.order}
            onWheel={(e) => e.target.blur()}
            onChange={handleChange}
            placeholder="Order in Timeline"
            className="bg-panel text-base text-normal font-normal p-4 rounded w-full"
          />
          <input
            type="number"
            name="episode"
            value={data.episode}
            onWheel={(e) => e.target.blur()}
            onChange={handleChange}
            placeholder="Number of Episodes (TV Series)"
            className="bg-panel text-base text-normal font-normal p-4 rounded w-full"
          />
          <input
            type="number"
            name="duration"
            value={data.duration}
            onWheel={(e) => e.target.blur()}
            onChange={handleChange}
            placeholder="Runtime (Movies & One Shots)"
            className="bg-panel text-base text-normal font-normal p-4 rounded w-full"
          />
          <input
            type="text"
            name="trailer"
            value={data.trailer}
            onChange={handleChange}
            placeholder="Trailer Url"
            className="bg-panel text-base text-normal font-normal p-4 rounded w-full"
          />
          <textarea
            type="text"
            name="summary"
            value={data.summary}
            onChange={handleChange}
            placeholder="Synopsis"
            className="bg-panel text-base text-normal font-normal p-4 rounded w-full"
          />
          <RegularButtons type="submit">
            <p className="font-bold text-normal text-base">Update Title</p>
          </RegularButtons>
        </form>
      </div>
    </AdminGuard>
  );
}
