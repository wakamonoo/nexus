import { LoaderContext } from "@/context/loaderContext";
import { SocketContext } from "@/context/socketContext";
import { useContext } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export default function PingOpt({ pingId, setSelectedPing }) {
  const { setIsLoading } = useContext(LoaderContext);
  const { setPings } = useContext(SocketContext);

  const handleDeletePing = async (pingId) => {
    try {
      setIsLoading(true);
      await fetch(`${BASE_URL}/api/pings/deletePing/${pingId}`, {
        method: "DELETE",
      });

      setPings((prev) => prev.filter((p) => p.pingId !== pingId));
    } catch (err) {
      console.error(err);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Failed deleting ping!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-accent)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title: "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
        },
      });
    } finally {
      setIsLoading(false);
      setSelectedPing(null);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Ping have been deleted!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-hulk)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title: "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
        },
      });
    }
  };

  const handleReadPing = async (ping) => {
    try {
      setIsLoading(true);
      await fetch(`${BASE_URL}/api/pings/isReadPatch/${pingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRead: true }),
      });

      setPings((prev) =>
        prev.map((p) => (p.pingId === pingId ? { ...p, isRead: true } : p))
      );
    } catch (err) {
      console.error(err);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Failed marking ping as read!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-accent)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title: "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
        },
      });
    } finally {
      setIsLoading(false);
      setSelectedPing(null);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Ping have been marked as read!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-hulk)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title: "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
        },
      });
    }
  };
  return (
    <div className="flex flex-col absolute top-10 right-0 w-60 border-1 border-panel bg-second shadow-2xl rounded p-2 z-50">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDeletePing(pingId);
        }}
        className="flex w-full items-center gap-2 hover:bg-[var(--color-panel)] focus:bg-[var(--color-panel)] p-4 rounded cursor-pointer"
      >
        <FaTrash className="text-xl shrink-0" />
        <p className="text-base font-bold">Delete ping</p>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleReadPing(pingId);
        }}
        className="flex w-full items-center gap-2 hover:bg-[var(--color-panel)] focus:bg-[var(--color-panel)] p-4 rounded cursor-pointer"
      >
        <FaEye className="text-xl shrink-0" />
        <p className="text-base font-bold">Mark as read</p>
      </button>
    </div>
  );
}
