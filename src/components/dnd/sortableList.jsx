import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableList({ item, index, title }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.titleId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!title) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-2 cursor-pointer bg-panel rounded p-2"
    >
      <div className="opacity-80 p-2 h-8 w-8 flex items-center justify-center rounded-full bg-accent">
        <p className="font-bold text-lg">{index + 1}</p>
      </div>
      <img
        src={
          title.poster
            ? `https://image.tmdb.org/t/p/w500${title.poster}`
            : "/fallback.png"
        }
        alt={title.title}
        loading="lazy"
        decoding="async"
        className="w-26 h-40 object-fill rounded"
      />
      <div className="flex flex-col">
        <p className="text-base font-bold truncate">{title.title}</p>
        <span className="text-xs text-vibe opacity-60 line-clamp-2">
          {item.note}
        </span>
      </div>
    </div>
  );
}
