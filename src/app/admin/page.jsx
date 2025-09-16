"use client";
import { useRef, useState } from "react";

export default function Page() {
  const [data, setData] = useState({
    image: "",
    title: "",
    date: "",
    timeline: "",
    summary: "",
  });
  const fileRef = useRef()

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
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
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
