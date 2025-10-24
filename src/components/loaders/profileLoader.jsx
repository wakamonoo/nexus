import PostsLoader from "./postsLoader";

export default function ProfileLoader() {
  return (
    <div className="w-full h-full overflow-hidden animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] lg:gap-4 items-start">
        <div>
          <div className="py-2 flex flex-col gap-1 ">
            <div className="flex gap-2 items-center w-full">
              <div className="w-16 h-16 bg-panel rounded-full flex-shrink-0  " />
              <div className="w-full flex flex-col gap-1 justify-center">
                <div className="w-[60%] h-8 bg-panel rounded" />
                <div className="w-[40%] h-4 bg-panel rounded" />
              </div>
            </div>
            <div className="py-2 flex flex-col gap-1">
              <div className="w-full h-5 bg-panel rounded" />
              <div className="w-[40%] h-5 bg-panel rounded" />
            </div>

            <div>
              <div className="w-[30%] h-6 bg-panel rounded" />
              <div className="py-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-2">
                <div className="w-full h-18 bg-panel rounded" />
                <div className="w-full h-18 bg-panel rounded" />
                <div className="w-full h-18 bg-panel rounded" />
                <div className="w-full h-18 bg-panel rounded" />
                <div className="w-full h-18 bg-panel rounded" />
              </div>
            </div>
          </div>

          <div>
            <div className="w-[30%] h-6 bg-panel rounded" />
            <div className="py-2 flex gap-2">
              <div className="w-26 h-40 md:w-32 md:h-46 bg-panel rounded" />
              <div className="w-26 h-40 md:w-32 md:h-46 bg-panel rounded" />
              <div className="w-26 h-40 md:w-32 md:h-46 bg-panel rounded" />
            </div>
          </div>
          <div>
            <div className="w-[30%] h-6 bg-panel rounded" />
            <div className="py-2 flex gap-2">
              <div className="w-26 h-40 md:w-32 md:h-46 bg-panel rounded" />
              <div className="w-26 h-40 md:w-32 md:h-46 bg-panel rounded" />
              <div className="w-26 h-40 md:w-32 md:h-46 bg-panel rounded" />
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-4 mt-4">
            <div className="w-full h-8 bg-panel rounded" />
            <div className="w-full h-8 bg-panel rounded" />
            <div className="w-full h-8 bg-panel rounded" />
          </div>
          <div className="flex flex-col gap-1 py-4 px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
            <PostsLoader />
          </div>
        </div>
      </div>
    </div>
  );
}
