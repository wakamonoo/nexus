import { FaImage } from "react-icons/fa";

export default function MomentLoader() {
  return (
    <div className="animate-pulse flex justify-center items-center w-28 h-40 md:w-35 md:h-49 rounded bg-panel shrink-0">
      <FaImage className="text-4xl text-(--color-secondary)" />
    </div>
  );
}
