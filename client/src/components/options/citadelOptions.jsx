import { FaPen, FaTrash } from "react-icons/fa";

export default function CitadelOptions({
  selectedMessage,
  setSelectedMessage,
  messageSize,
  setEditingMessage,
  setEditInput,
  setMessageToDelete,
  setShowConfirmMessageDeleteModal,
}) {
  return (
    <div
      className={`flex flex-col absolute -top-32 ${messageSize.width >= 180 ? "left-4" : "right-4"} sm:right-4 sm:left-auto w-50 border-1 border-panel bg-second rounded shadow-2xl p-2 z-50`}
    >
      <button
        onClick={() => {
          setEditingMessage(selectedMessage.msgId);
          setEditInput(selectedMessage.text);
          setSelectedMessage(null);
        }}
        className="flex w-full items-center gap-2 hover:bg-[var(--color-panel)] focus:bg-[var(--color-panel)] p-4 rounded cursor-pointer"
      >
        <FaPen className="text-xl shrink-0" />
        <p className="text-base font-bold">Edit message</p>
      </button>
      <button
        onClick={() => {
          setMessageToDelete(selectedMessage.msgId);
          setShowConfirmMessageDeleteModal(true);
          setSelectedMessage(null);
        }}
        className="flex w-full items-center gap-2 hover:bg-[var(--color-panel)] focus:bg-[var(--color-panel)] p-4 rounded cursor-pointer"
      >
        <FaTrash className="text-xl shrink-0" />
        <p className="text-base font-bold">Delete message</p>
      </button>
    </div>
  );
}
