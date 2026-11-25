"use client";
import { useContext, useRef } from "react";
import { MdClose } from "react-icons/md";
import { LoaderContext } from "@/context/loaderContext";
import Swal from "sweetalert2";
import RegularButton from "../buttons/regularButton";
import SecondaryButton from "../buttons/secondaryButton";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export default function ConfirmPingsDeleteModal({
  setShowConfirmpPingsDeleteModal,
  setPings,
  setSelectedPing,
  userId,
}) {
  const { startActionLoading, finishActionLoading } =
    useContext(LoaderContext);
  const requestInFlight = useRef(false);

  const handleDeleteAll = async () => {
    const actionId = `delete-pings:${userId}`;
    if (requestInFlight.current) return;
    if (!startActionLoading(actionId, "Deleting notifications...")) return;
    requestInFlight.current = true;
    setShowConfirmpPingsDeleteModal(false);

    try {
      await fetch(`${BASE_URL}/api/pings/deleteAll/${userId}`, {
        method: "DELETE",
      });

      setPings((prev) => prev.filter((p) => p.userId !== userId));

      setSelectedPing(null);

      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "All pings have been deleted!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-hulk)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border !border-(--color-panel) !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title: "!text-base !font-semibold !text-(--color-text) !leading-4.5",
        },
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Failed deleting pings!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-accent)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border !border-(--color-panel) !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title: "!text-base !font-semibold !text-(--color-text) !leading-4.5",
        },
      });
    } finally {
      requestInFlight.current = false;
      finishActionLoading(actionId);
    }
  };

  return (
    <div
      onClick={() => setShowConfirmpPingsDeleteModal(false)}
      className="fixed inset-0 z-150 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-panel bg-second shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-panel p-4">
          <h1 className="text-base font-bold text-normal">Delete pings</h1>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirmpPingsDeleteModal(false);
            }}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-vibe transition hover:bg-(--color-panel) hover:text-(--color-accent) shrink-0"
          >
            <MdClose className="text-xl" />
          </button>
        </div>
        <div className="p-4">
          <p className="text-center text-normal font-bold leading-5">
            Are you sure you want to delete all pings?
          </p>
        </div>
        <div className="flex gap-2 border-t border-panel p-4">
          <SecondaryButton onClick={handleDeleteAll}>
            <p className="font-bold text-normal text-base">Confirm</p>
          </SecondaryButton>
          <RegularButton
            onClick={() => setShowConfirmpPingsDeleteModal(false)}
          >
            <p className="font-bold text-normal text-base">Cancel</p>
          </RegularButton>
        </div>
      </div>
    </div>
  );
}
