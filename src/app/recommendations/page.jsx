export default function Reco() {
  return (
    <div className="pt-16 p-2">
      <h1 className="text-4xl pt-4 text-accent">— Feedback & Suggestions</h1>
      <p className="text-normal font-normal text-base">
        Found a bug? Have a feature idea or a question?
      </p>
      <form className="flex flex-col gap-2 py-4 p-2">
        <input
          type="text"
          placeholder="Name"
          className="bg-second w-full p-2 rounded text-normal text-base"
        />
        <input
          type="text"
          placeholder="Email"
          className="bg-second w-full p-2 rounded text-normal text-base"
        />
        <input
          type="text"
          placeholder="Subject"
          className="bg-second w-full p-2 rounded text-normal text-base"
        />
        <textarea placeholder="Message..." className="bg-second w-full h-32 p-2 text-normal text-base" />
        
      </form>
    </div>
  );
}
