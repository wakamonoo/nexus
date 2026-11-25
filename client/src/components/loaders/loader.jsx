"use client";
import { LoaderContext } from "@/context/loaderContext";
import { useContext, useEffect, useRef, useState } from "react";

export default function Loader() {
  const { isLoading } = useContext(LoaderContext);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const loadingStarted = useRef(false);

  useEffect(() => {
    let interval;
    let timeout;

    if (isLoading) {
      loadingStarted.current = true;
      setVisible(true);
      setProgress(0);

      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90;
          return prev + (90 - prev) * 0.08;
        });
      }, 150);
    } else if (loadingStarted.current) {
      loadingStarted.current = false;
      setProgress(100);

      timeout = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 z-9999 h-0.75 w-full">
      <div
        className="h-full bg-accent transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
