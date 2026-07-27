import { MdRadioButtonChecked, MdRadioButtonUnchecked } from "react-icons/md";

export default function ExportCard({ order, isTitleWatched, id }) {
  return (
    <div
      id={id}
      style={{ width: 1080, height: 1350 }}
      className="grid grid-cols-3 content-start gap-x-4 gap-y-1 p-10 bg-panel"
    >
      {order.map((unit, index) => (
        <div key={unit.titleId} className="flex min-w-0 items-start gap-2 py-1">
          {isTitleWatched(unit.titleId) ? (
            <MdRadioButtonChecked className="shrink-0 text-2xl text-accent" />
          ) : (
            <MdRadioButtonUnchecked className="shrink-0 text-2xl text-accent" />
          )}
          <p className="text-base"><span className="font-bold">{index + 1}. </span>{unit.title}</p>
        </div>
      ))}
    </div>
  );
}
