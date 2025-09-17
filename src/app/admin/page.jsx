"use client";
import { useEffect, useRef, useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import CountUp from "react-countup";

export default function Page() {
  const [data, setData] = useState({
    title: "",
    image: null,
    date: "",
    timeline: "",
    phase: "",
    director: "",
    order: "",
    url: "",
    summary: "",
  });
  const fileRef = useRef();
  const router = useRouter();
  const [count, setCount] = useState({ usersCount: 0, titlesCount: 0 });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddNewTitle = async () => {
    try {
      let imageURL;

      const formData = new FormData();
      formData.append("file", data.image);

      const cloudRes = await fetch(
        "http://localhost:4000/api/uploads/imageUpload",
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudData = await cloudRes.json();
      imageURL = cloudData.url;

      await fetch("http://localhost:4000/api/titles/addTitle", {
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
        director: "",
        order: "",
        url: "",
        summary: "",
      });
      fileRef.current.value = "";

      fetchCounts();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCounts = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/counts/countData");
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
    <div className="p-4">
      <FaAngleLeft onClick={() => router.push("/")} className="text-2xl" />

      <div className="flex gap-2 pt-4 items-center justify-center">
        <div className="flex items-center gap-2 justify-center">
          <div className="flex items-center justify-center border-2 border-accent w-24 h-24 rounded-full">
            <CountUp
              end={count.usersCount}
              duration={1.5}
              className="text-7xl font-extrabold text-accent"
            />
          </div>
          <p className="text-base font-extrabold">USERS</p>
        </div>

        <div className="flex items-center gap-2 justify-center">
          <div className="flex items-center justify-center border-2 border-accent w-24 h-24 rounded-full">
            <CountUp
              end={count.titlesCount}
              duration={1.5}
              className="text-7xl font-extrabold text-accent"
            />
          </div>
          <p className="text-base font-extrabold">TITLES</p>
        </div>
      </div>

      <div className="flex flex-col items-start justify-center gap-4 w-full pt-8">
        <h1 className="text-2xl">ADD NEW TITLE</h1>
        <input
          type="text"
          name="title"
          value={data.title}
          onChange={handleChange}
          placeholder="Enter Title"
          className="bg-panel text-base text-normal font-normal p-4 rounded w-full"
        />
        <div className="flex gap-2 items-center w-full">
          <label className="text-normal font-normal text-base w-[20%]">
            Poster
          </label>
          <input
            type="file"
            name="image"
            ref={fileRef}
            onChange={handleChange}
            className="bg-panel p-4 rounded w-[80%]"
          />
        </div>

        <div className="flex items-center w-full">
          <label className="text-normal font-normal text-base w-[20%]">
            Release Date
          </label>
          <input
            type="date"
            name="date"
            value={data.date}
            onChange={handleChange}
            placeholder="Release Date"
            className="bg-panel text-base text-normal font-normal p-4 rounded w-[80%]"
          />
        </div>
        <input
          type="number"
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
          className="bg-panel text-base text-normal font-normal p-4 rounded w-full"
        >
          <option value="null">Select Phase</option>
          <option value="Phase 1">Phase 1</option>
          <option value="Phase 2">Phase 2</option>
          <option value="Phase 3">Phase 3</option>
          <option value="Phase 4">Phase 4</option>
          <option value="Phase 5">Phase 5</option>
          <option value="Phase 6">Phase 6</option>
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
          onChange={handleChange}
          placeholder="Order in Timeline"
          className="bg-panel text-base text-normal font-normal p-4 rounded w-full"
        />
        <input
          type="text"
          name="url"
          value={data.url}
          onChange={handleChange}
          placeholder="Trailer Url"
          className="bg-panel text-base text-normal font-normal p-4 rounded w-full"
        />
        <input
          type="text"
          name="summary"
          value={data.summary}
          onChange={handleChange}
          placeholder="Synopsis"
          className="bg-panel text-base text-normal font-normal p-4 rounded w-full"
        />
        <button
          onClick={handleAddNewTitle}
          className="bg-accent p-4 w-full rounded font-bold cursor-pointer"
        >
          <p className="text-base">Submit</p>
        </button>
      </div>
    </div>
  );
}
