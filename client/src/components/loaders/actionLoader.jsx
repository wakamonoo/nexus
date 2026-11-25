"use client";
import { useContext } from "react";
import { LoaderContext } from "@/context/loaderContext";
import SpinLoader from "./spinLoader";

export default function ActionLoader() {
  const { isActionLoading } = useContext(LoaderContext);

  return (
    <div
      className={`fixed bottom-4 left-4 bg-second px-4 py-2 w-full max-w-xs items-center justify-center gap-2 border border-(--color-panel) text-normal rounded-lg shadow-lg ${isActionLoading ? "flex" : "hidden"}`}
    >
      <SpinLoader />
      <p className="text-base font-semibold text-(--color-text) leading-4.5">
        Processing Request...
      </p>
    </div>
  );
}
