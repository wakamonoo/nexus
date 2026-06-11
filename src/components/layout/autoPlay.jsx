import { useEffect, useRef } from "react";

export default function AutoPlay({ src, onLoadedMetadata }) {
  const vidRef = useRef(null);

  useEffect(() => {
    const video = vidRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      {
        threshold: 0.5,
      },
    );

    if (video) observer.observe(video);

    return () => observer.disconnect();
  }, []);
  return (
    <video
      ref={vidRef}
      src={src}
      muted
      playsInline
      loop
      preload="metadata"
      onLoadedMetadata={onLoadedMetadata}
      className="w-full h-full object-cover"
    />
  );
}
