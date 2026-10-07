import { FaUser } from "react-icons/fa";

export default function FeedbackFormLoader() {
  return (
    <div className="animate-pulse mb-6 flex items-center gap-2">
      <div className="flex items-center justify-center bg-panel w-10 h-10 rounded-full shrink-0">
        <FaUser className="text-xl text-(--color-secondary)" />
      </div>
      <div className="w-32 h-4 bg-panel rounded" />
    </div>
  );
}
