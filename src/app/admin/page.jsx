"use client";
import { useEffect, useRef, useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import CountUp from "react-countup";

export default function Page() {
  const [data, setData] = useState({
    image: "",
    title: "",
    date: "",
    timeline: "",
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
        image: "",
        title: "",
        date: "",
        timeline: "",
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

      <div className="flex gap-2 items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-accent flex justify-center items-center border-7 border-white">
          <CountUp end={count.usersCount} duration={1.5} />
        </div>

        <div className="w-32 h-32 rounded-full bg-accent flex justify-center items-center border-7 border-white">
          <CountUp end={count.titlesCount} duration={1.5} />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 w-full p-8">
        <input
          type="file"
          name="image"
          ref={fileRef}
          onChange={handleChange}
          className="bg-amber-200 p-4 rounded w-full"
        />
        <input
          type="text"
          name="title"
          value={data.title}
          onChange={handleChange}
          placeholder="Enter Title"
          className="bg-amber-200 p-4 rounded w-full"
        />
        <input
          type="date"
          name="date"
          value={data.date}
          onChange={handleChange}
          placeholder="Release Date"
          className="bg-amber-200 p-4 rounded w-full"
        />
        <input
          type="text"
          name="timeline"
          value={data.timeline}
          onChange={handleChange}
          placeholder="Timeline"
          className="bg-amber-200 p-4 rounded w-full"
        />
        <input
          type="text"
          name="summary"
          value={data.summary}
          onChange={handleChange}
          placeholder="Summary"
          className="bg-amber-200 p-4 rounded w-full"
        />
        <button
          onClick={handleAddNewTitle}
          className="bg-red-500 p-4 w-full rounded"
        >
          submit
        </button>
      </div>
    </div>
  );
}
