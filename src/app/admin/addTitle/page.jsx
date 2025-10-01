"use client";
import { useContext, useRef, useState } from "react";
import Swal from "sweetalert2";
import { LoaderContext } from "@/context/loaderContext";
import { FaAngleLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function addTitle() {
  const [data, setData] = useState({
    title: "",
    image: null,
    date: "",
    timeline: "",
    phase: "",
    type: "",
    director: "",
    order: "",
    episode: "",
    duration: "",
    summary: "",
  });
  const fileRef = useRef();
  const { setIsLoading } = useContext(LoaderContext);
  const router = useRouter();

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

  const handleAddNewTitle = async () => {
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
        title: "",
        image: null,
        date: "",
        timeline: "",
        phase: "",
        type: "",
        director: "",
        order: "",
        episode: "",
        duration: "",
        summary: "",
      });

      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Failed adding title!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-text)",
        color: "var(--color-bg)",
        iconColor: "var(--color-accent)",
        customClass: {
          popup: "rounded-2xl shadow-lg",
          title: "text-lg font-bold !text-[var(--color-accent)]",
          htmlContainer: "text-sm",
        },
      });
    } finally {
      setIsLoading(false);
      Swal.fire({
        title: "Success",
        text: "Title have been added!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-text)",
        color: "var(--color-bg)",
        iconColor: "var(--color-hulk)",
        customClass: {
          popup: "rounded-2xl shadow-lg",
          title: "text-lg font-bold !text-[var(--color-hulk)]",
          htmlContainer: "text-sm",
        },
      });
    }
  };

  return (
    <div className="p-2">
      <div className="flex justify-between items-center">
        <FaAngleLeft
          onClick={() => router.back()}
          className="text-2xl cursor-pointer"
        />
        <h1 className="text-2xl">ADD NEW TITLE</h1>
        <div />
      </div>
      <form
        className="flex flex-col items-start justify-center gap-4 w-full pt-8"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddNewTitle();
        }}
      >
        <input
          type="text"
          name="title"
          value={data.title}
          required
          onChange={handleChange}
          placeholder="Enter Title"
          className="bg-panel text-base text-normal font-normal p-4 rounded w-full"
        />
        <div className="flex gap-2 items-center w-full">
          <label className="text-normal font-normal text-base w-[28%]">
            Poster
          </label>
          <input
            type="file"
            name="image"
            required
            ref={fileRef}
            onChange={handleChange}
            className="bg-panel p-4 rounded w-[72%] cursor-pointer"
          />
        </div>

        <div className="flex items-center w-full">
          <label className="text-normal font-normal text-base w-[30%]">
            Release Date
          </label>
          <input
            type="date"
            name="date"
            required
            value={data.date}
            onChange={handleChange}
            placeholder="Release Date"
            className="bg-panel text-base text-normal font-normal p-4 rounded w-[70%]"
          />
        </div>
        <input
          type="text"
          name="timeline"
          required
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
          type="text"
          required
          name="director"
          value={data.director}
          onChange={handleChange}
          placeholder="Director/s"
          className="bg-panel text-base text-normal font-normal p-4 rounded w-full"
        />
        <input
          type="number"
          required
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
        <textarea
          type="text"
          required
          name="summary"
          value={data.summary}
          onChange={handleChange}
          placeholder="Synopsis"
          className="bg-panel text-base text-normal font-normal p-4 rounded w-full"
        />
        <button
          type="submit"
          className="bg-accent p-4 w-full rounded font-bold cursor-pointer"
        >
          <p className="text-base">Submit</p>
        </button>
      </form>
    </div>
  );
}
