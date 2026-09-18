"use client";
import { UserContext } from "@/context/userContext";
import { useContext, useEffect, useRef, useState } from "react";
import {
  MdCamera,
  MdCameraAlt,
  MdCameraswitch,
  MdClose,
  MdFlashOff,
  MdFlashOn,
  MdSearchOff,
} from "react-icons/md";
import Swal from "sweetalert2";
import RegularButtons from "../buttons/regBtns";
import { LoaderContext } from "@/context/loaderContext";
import { ListContext } from "@/context/listContext";
import Avatar from "@/assets/defaultAvatar.png";
import SecondaryButtons from "../buttons/secBtns";
import { TitleContext } from "@/context/titleContext";
import { IoRadioButtonOff, IoRadioButtonOn } from "react-icons/io5";
import { MomentContext } from "@/context/momentContext";
import Loader from "../loaders/loader";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

const SelectionCard = ({ title, selectedTitle, setSelectedTitle }) => {
  const isSelected = selectedTitle?.titleId === title.titleId;

  return (
    <div
      onClick={() => {
        setSelectedTitle(isSelected ? null : title);
      }}
      className={`flex gap-4 items-start cursor-pointer px-2 py-4 border rounded-lg  ${isSelected ? "border-[var(--color-accent)] bg-accent/10" : "border-[var(--color-panel)] hover:bg-[var(--color-panel)] focus:bg-[var(--color-panel)]"}`}
    >
      {isSelected ? (
        <IoRadioButtonOn className="text-xl text-zeus mt-2 shrink-0" />
      ) : (
        <IoRadioButtonOff className="text-xl text-zeus mt-2 shrink-0" />
      )}
      <div className="relative shrink-0 w-26 h-40">
        <img
          src={
            title.poster
              ? `https://image.tmdb.org/t/p/w500${title.poster}`
              : "/fallback.png"
          }
          alt={title.title}
          loading="lazy"
          decoding="async"
          className="object-fill rounded"
        />
      </div>
      <div className="flex flex-col w-full">
        <p className="text-sm line-clamp-2">{title.title} </p>
        <div className="flex items-center gap-2 my-2 text-xs opacity-60">
          <span>
            {new Date(
              title.release_date ? title.release_date : title.first_air_date,
            ).toLocaleDateString([], {
              year: "numeric",
            })}
          </span>
          <span>•</span>
          <span className="uppercase">{title.category}</span>
        </div>
      </div>
    </div>
  );
};

export default function AddMomenttModal({ setShowAddMomentModal }) {
  const { user } = useContext(UserContext);
  const { titles } = useContext(TitleContext);
  const { setMoments } = useContext(MomentContext);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [flashOn, setFlashOn] = useState(false);
  const [cameraFacing, setCameraFacing] = useState("environment");
  const { setIsLoading } = useContext(LoaderContext);
  const [caption, setCaption] = useState("");
  const inputRef = useRef(null);

  const handleTitleSearch = async () => {
    if (!searchInput) return setSearchResults([]);
    try {
      setLoading(true);
      const res = await fetch(
        `${BASE_URL}/api/titles/titleGet?query=${encodeURIComponent(
          searchInput,
        )}`,
      );
      const data = await res.json();
      setSearchResults(data.result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchInput) {
      setSearchResults([]);
      return;
    }

    const debounce = setTimeout(() => {
      handleTitleSearch();
    }, 300);

    return () => {
      clearTimeout(debounce);
    };
  }, [searchInput]);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraFacing,
        },
        audio: false,
      });

      setCameraStream(stream);
      setShowCamera(true);
    } catch (err) {
      console.error("camera error:", err);
    }
  };

  useEffect(() => {
    if (!showCamera || !videoRef.current || !cameraStream) return;

    videoRef.current.srcObject = cameraStream;

    return () => {
      cameraStream.getTracks().forEach((track) => track.stop());
    };
  }, [showCamera, cameraStream]);

  const rotateCamera = async () => {
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }

      const newFacing = cameraFacing === "environment" ? "user" : "environment";

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: newFacing,
        },
        audio: false,
      });

      setCameraFacing(newFacing);
      setCameraStream(stream);
    } catch (err) {
      console.error("camera rotation error", err);
    }
  };

  const toggleFlash = async () => {
    try {
      const track = cameraStream?.getVideoTracks()[0];

      if (!track) return;

      const capabilities = track.getCapabilities();

      if (!capabilities.torch) {
        Swal.fire({
          toast: true,
          position: "bottom-start",
          title: "flash/torch not supported!",
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

        return;
      }

      await track.applyConstraints({
        advanced: [{ torch: !flashOn }],
      });

      setFlashOn((prev) => !prev);
    } catch (err) {
      console.error("flash error", err);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const targetWidth = 1080;
    const targetHeight = 1512;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext("2d");

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    const targetRatio = targetWidth / targetHeight;
    const videoRatio = videoWidth / videoHeight;

    let cropWidth = videoWidth;
    let cropHeight = videoHeight;
    let cropX = 0;
    let cropY = 0;

    if (videoRatio > targetRatio) {
      cropWidth = videoHeight * targetRatio;
      cropX = (videoWidth - cropWidth) / 2;
    } else {
      cropHeight = videoWidth / targetRatio;
      cropY = (videoHeight - cropHeight) / 2;
    }

    if (cameraFacing === "user") {
      context.save();
      context.translate(targetWidth, 0);
      context.scale(-1, 1);

      context.drawImage(
        video,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        targetWidth,
        targetHeight,
      );
    } else {
      context.drawImage(
        video,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        targetWidth,
        targetHeight,
      );
    }

    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], "moment.jpg", {
        type: "image/jpeg",
      });

      setCapturedPhoto(file);
      setShowCamera(false);
      setCameraStream(null);
    }, "image/jpeg");
  };

  useEffect(() => {
    const textarea = inputRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [caption]);

  const submitMoment = async () => {
    try {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("files", capturedPhoto);

      const uploadRes = await fetch(`${BASE_URL}/api/uploads/momentUpload`, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();

        if (uploadRes.status === 413) {
          Swal.fire({
            toast: true,
            position: "bottom-start",
            title: "file too large, 50 MB maximum per file!",
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
          return;
        }
        throw new Error(errorData.error || "Upload failed");
      }

      const { urls } = await uploadRes.json();

      const res = await fetch(`${BASE_URL}/api/moments/addMoment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          image: urls[0],
          titleId: selectedTitle.titleId,
          caption,
        }),
      });

      if (!res.ok) {
        throw new Error("failed to create moment");
      }

      const { moment: newMoment } = await res.json();

      setMoments((prev) => [newMoment, ...prev]);

      setCapturedPhoto(null);
      setSelectedTitle(null);
      setCaption("");
      setShowAddMomentModal(false);

      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Your moment is live!",
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
    } catch (err) {
      console.error(err);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Something went wrong, please try again later!",
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
    }
  };

  return (
    <div
      onClick={() => setShowAddMomentModal(false)}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col w-full max-w-md max-h-[90vh] overflow-hidden rounded-2xl border border-panel bg-second shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-panel p-4">
          <h1 className="text-base font-bold text-normal">Add momment</h1>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAddMomentModal(false);
            }}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-vibe transition hover:bg-[var(--color-panel)] hover:text-[var(--color-accent)] shrink-0"
          >
            <MdClose className="text-xl" />
          </button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto custom-scroll">
          {capturedPhoto && (
            <div className="mt-4">
              <p className="text-sm text-vibe opacity-60 mb-2">
                Photo Captured
              </p>
              <img
                src={URL.createObjectURL(capturedPhoto)}
                alt="Captured Moment"
                className="w-full rounded-lg"
              />
            </div>
          )}
          <div className="py-2">
            <button
              type="button"
              onClick={openCamera}
              className="cursor-pointer flex w-full items-center justify-center gap-1 rounded-lg border border-panel px-4 py-2"
            >
              <MdCameraAlt className="text-xl" />
              <span className="text-xs text-vibe opacity-60">Open Camera</span>
            </button>
          </div>
          {showCamera && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-second">
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full">
                <div className="flex items-center justify-between px-4 lg:px-8 xl:px-16 w-full">
                  <div className="w-8" />
                  <p className="text-base text-vibe font-bold">
                    Capture the moment
                  </p>
                  <button
                    onClick={() => setShowCamera(false)}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-vibe transition hover:bg-[var(--color-panel)] hover:text-[var(--color-accent)] shrink-0"
                  >
                    <MdClose className="text-xl" />
                  </button>
                </div>
              </div>
              <div className="relative aspect-[5/7] w-[min(90vw,57.14vh)] border border-accent rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className={`h-full w-full object-cover ${cameraFacing === "user" ? "scale-x-[-1]" : ""}`}
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-8">
                <button
                  onClick={toggleFlash}
                  className={`cursor-pointer h-12 w-12 flex items-center justify-center rounded-full p-2 transition-all duration-200 ${flashOn ? "bg-accent text-zeus" : "text-vibe hover:bg-[var(--color-panel)] hover:text-accent"}`}
                >
                  {flashOn ? (
                    <MdFlashOn className="text-2xl" />
                  ) : (
                    <MdFlashOff className="text-2xl" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="cursor-pointer h-12 w-12 rounded-full border-4 border-accent transition-all duration-200 p-2 hover:p-1"
                >
                  <div className="bg-accent w-full h-full rounded-full" />
                </button>
                <button
                  onClick={rotateCamera}
                  className="cursor-pointer h-12 w-12 flex items-center justify-center rounded-full p-2 text-vibe transition-all duration-200 hover:bg-[var(--color-panel)] hover:text-accent"
                >
                  <MdCameraswitch className="text-2xl" />
                </button>
              </div>
            </div>
          )}

          <div className="py-2 w-full">
            <h4>Caption</h4>
            <textarea
              ref={inputRef}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Give it a caption..."
              rows={1}
              style={{ maxHeight: "120px" }}
              className="w-full resize-none overflow-y-auto rounded-lg text-normal outline-none text-base font-normal bg-panel p-2"
            />
          </div>
          <div className="py-2 w-full">
            <h4>Find what you're watching</h4>
            <div className="flex w-full justify-between items-center gap-2 bg-panel px-4 py-2 rounded-full">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="What are you watching right now?"
                className="w-full outline-none text-base text-normal"
              />
            </div>{" "}
          </div>

          {loading ? (
            <Loader />
          ) : searchResults.length > 0 ? (
            <div>
              <div className="px-4 py-8">
                <p className="text-sm text-vibe w-full line-clamp-1">
                  Search results for{" "}
                  <span className="font-bold">"{searchInput}"</span>
                </p>
              </div>
              <div>
                <div className="mt-4 flex flex-col gap-2 ">
                  {searchResults
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
                    })
                    .map((title) => {
                      return (
                        <SelectionCard
                          key={title.titleId}
                          title={title}
                          selectedTitle={selectedTitle}
                          setSelectedTitle={setSelectedTitle}
                        />
                      );
                    })}
                </div>
              </div>
            </div>
          ) : searchInput ? (
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="flex flex-col items-center justify-center">
                <MdSearchOff className="text-4xl text-vibe opacity-40" />
                <p className="text-xs text-vibe opacity-40">
                  No results for{" "}
                  <span className="font-bold">{searchInput}</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-2 ">
              {titles
                .sort((a, b) => {
                  const dateA =
                    a.mediaType === "tv" ? a.first_air_date : a.release_date;

                  const dateB =
                    b.mediaType === "tv" ? b.first_air_date : b.release_date;

                  return new Date(dateA) - new Date(dateB);
                })
                .map((title) => {
                  return (
                    <SelectionCard
                      key={title.titleId}
                      title={title}
                      selectedTitle={selectedTitle}
                      setSelectedTitle={setSelectedTitle}
                    />
                  );
                })}
            </div>
          )}
        </div>
        <div className="flex border-t border-panel p-4">
          <RegularButtons
            disabled={!selectedTitle || !capturedPhoto}
            onClick={() => submitMoment()}
          >
            <p className="font-bold text-normal text-base">Add</p>
          </RegularButtons>
        </div>
      </div>
    </div>
  );
}
