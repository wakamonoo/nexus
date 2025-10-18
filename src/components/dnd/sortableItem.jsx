import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";

export default function SortableItem({ id, image }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="w-26 h-40 md:w-32 md:h-46 flex-shrink-0 cursor-pointer touch-none"
    >
      <Image
        src={image}
        alt="image"
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-full object-fill rounded"
      />
    </div>
  );
}
