import { FaPen, FaTrash } from "react-icons/fa";

export default function ListOptions({
  setShowListOption,
  setShowEditListModal,
  setShowConfirmListDeleteModal,
}) {
  return (
    <div className="flex flex-col absolute top-full right-0 w-60 border border-panel bg-second rounded shadow-2xl p-2 z-50">
      <button
        onClick={() => {
          setShowEditListModal(true);
          setShowListOption(false);
        }}
        className="flex w-full items-center gap-2 hover:bg-(--color-panel) focus:bg-(--color-panel) p-4 rounded cursor-pointer"
      >
        <FaPen className="text-xl shrink-0" />
        <p className="text-base font-bold">Edit list</p>
      </button>
      <button
        onClick={() => {
          setShowConfirmListDeleteModal(true);
          setShowListOption(false);
        }}
        className="flex w-full items-center gap-2 hover:bg-(--color-panel) focus:bg-(--color-panel) p-4 rounded cursor-pointer"
      >
        <FaTrash className="text-xl shrink-0" />
        <p className="text-base font-bold">Delete list</p>
      </button>
    </div>
  );
}
