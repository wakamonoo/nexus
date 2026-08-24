import { MdClose } from "react-icons/md";
import CircledButtons from "@/components/buttons/circledBtns";
import RegularButtons from "@/components/buttons/regBtns";

export default function ListOpt({
  setShowListOpt,
  setShowEditListModal,
  setShowDeleteListModal,
}) {
  return (
    <div
      onClick={() => setShowListOpt(false)}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-panel bg-second shadow-2xl"
      >
        <div className="flex items-center justify-end p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowListOpt(false);
            }}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-vibe transition hover:bg-[var(--color-panel)] hover:text-[var(--color-accent)] shrink-0"
          >
            <MdClose className="text-xl" />
          </button>
        </div>
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:gap-2">
            <RegularButtons
              onClick={() => {
                setShowEditListModal(true);
                setShowListOpt(false);
              }}
            >
              <p className="font-bold text-normal text-base">Edit List</p>
            </RegularButtons>
            <RegularButtons
              onClick={() => {
                setShowDeleteListModal(true);
                setShowListOpt(false);
              }}
            >
              <p className="font-bold text-normal text-base">Delete List</p>
            </RegularButtons>
          </div>
        </div>
      </div>
    </div>
  );
}
