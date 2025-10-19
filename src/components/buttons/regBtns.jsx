export default function RegularButtons({ onClick, children }) {
  return (
    <div onClick={onClick} className="cursor-pointer bg-accent hover:bg-[var(--color-accent)]/80 w-full p-2 rounded flex justify-center items-center gap-1">
      {children}
    </div>
  );
}
