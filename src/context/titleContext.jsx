"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { LoaderContext } from "./loaderContext";
import Swal from "sweetalert2";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export const TitleContext = createContext();

export const TitleProvider = ({ children }) => {
  const [titles, setTitles] = useState([]);
  const [pageLoad, setPageLoad] = useState(true);
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
  const { setIsLoading } = useContext(LoaderContext);

  useEffect(() => {
    const handleGetTitles = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/titles/titleGet`, {
          method: "GET",
        });

        const data = await res.json();
        setTitles(data.result);
      } catch (err) {
        console.error("failed to fetch titles", err);
        setTitles([]);
      } finally {
        setPageLoad(false);
      }
    };

    handleGetTitles();
  }, []);

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
        title: "Error",
        text: "Failed updating title!",
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
        text: "Title have been updated!",
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

  const handleTitleDelete = async (titleId) => {
    try {
      setIsLoading(true);
      await fetch(`${BASE_URL}/api/titles/deleteTitle/${titleId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Failed updating title!",
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
        text: "Title have been deleted!",
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
    <TitleContext.Provider
      value={{
        titles,
        pageLoad,
        data,
        setData,
        handleChange,
        handleAddNewTitle,
        handleUpdateTitle,
        handleTitleDelete,
      }}
    >
      {children}
    </TitleContext.Provider>
  );
};
