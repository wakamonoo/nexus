"use client";
import { useState } from "react";

export default function Page() {
  const [data, setData] = useState({
    image: "",
    title: "",
    date: "",
    timeline: "",
    summary: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewTitle = async () => {
    try {
      await fetch("http://localhost:4000/api/titles/addTitle", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setData({
        image: "",
        title: "",
        date: "",
        timeline: "",
        summary: "",
      });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-4 w-full p-8">
        <input type="file" name="image" onChange={handleChange}
          value={data.image} className="bg-amber-200 p-4 rounded w-full" />
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
