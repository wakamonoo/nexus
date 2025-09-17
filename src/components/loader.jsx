export default function Loader() {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center backdrop-blur-xs">
      <div className="flex flex-col items-center animate-[bounce_1s_ease-in-out_infinite_0.1s]">
        <div className="w-1 h-6 bg-hulk" />
        <div className="w-3 h-12 bg-hulk rounded-sm" />
        <div className="w-1 h-6 bg-hulk" />
      </div>
      <div className="flex flex-col items-center animate-[bounce_1s_ease-in-out_infinite_0.2s]">
        <div className="w-1 h-6 bg-accent" />
        <div className="w-3 h-12 bg-accent rounded-sm" />
        <div className="w-1 h-6 bg-accent" />
      </div>
      <div className="flex flex-col items-center animate-[bounce_1s_ease-in-out_infinite_0.1s]">
        <div className="w-1 h-6 bg-hulk" />
        <div className="w-3 h-12 bg-hulk rounded-sm" />
        <div className="w-1 h-6 bg-hulk" />
      </div>
    </div>
  );
}
