export default function CircledNotAllowedButtons({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="cursor-not-allowed bg-(--color-accent)/80 hover:bg-(--color-accent)/60 w-full py-2 px-4 rounded-full flex justify-center items-center gap-1"
    >
      {children}
    </button>
  );
}