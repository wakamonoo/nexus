export default function ChatLoader() {
  return (
    <div className="p-4 animate-pulse">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-start gap-2">
          <div className="bg-second w-8 h-8 rounded-full" />
          <div className="bg-second w-[40%] h-24 rounded-2xl" />
        </div>
        <div className="flex justify-start gap-2">
          <div className="bg-second w-8 h-8 rounded-full" />
          <div className="bg-second w-[55%] h-24 rounded-2xl" />
        </div>
        <div className="flex justify-end gap-2">
          <div className="bg-second w-[60%] h-24 rounded-2xl" />
          <div className="bg-second w-8 h-8 rounded-full" />
        </div>
        <div className="flex justify-start gap-2">
          <div className="bg-second w-8 h-8 rounded-full" />
          <div className="bg-second w-[70%] h-32 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
