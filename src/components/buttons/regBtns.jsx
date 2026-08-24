export default function RegularButtons({ onClick, type = "button", children, form }) {
  return (
    <button
      type={type}
      onClick={onClick}
      form={form}
      className="cursor-pointer mt-2 bg-accent hover:bg-[var(--color-accent)]/80 w-full py-2 px-4 rounded flex justify-center items-center gap-1"
    >
      {children}
    </button>
  );
}