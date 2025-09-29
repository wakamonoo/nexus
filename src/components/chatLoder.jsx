export default function ChatLoader() {
  return (
    <div
      className="flex flex-col h-full w-full animate-pulse"
      style={{ height: "100dvh" }}
    >
      <div className="flex flex-col overflow-y-auto justify-end  flex-1 gap-4 w-full p-4 ">
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
          <div className="bg-second w-[70%] h-34 rounded-2xl" />
        </div>
        <div className="flex justify-end gap-2">
          <div className="bg-second w-[70%] h-24 rounded-2xl" />
          <div className="bg-second w-8 h-8 rounded-full" />
        </div>
        <div className="flex justify-start gap-2">
          <div className="bg-second w-8 h-8 rounded-full" />
          <div className="bg-second w-[40%] h-24 rounded-2xl" />
        </div>
      </div>
      <div className="w-full h-18 bg-second shrink-0" />
    </div>
  );
}
