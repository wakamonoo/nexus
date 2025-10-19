import { PostContext } from "@/context/postContext";
import { useContext } from "react";
import { MdSensorsOff } from "react-icons/md";
import PostStructure from "../layout/postStructure";

export default function ProfileEchoes({ profileUser }) {
  const { posts } = useContext(PostContext);

  const profileUserEchoes = posts?.filter((p) =>
    p.echoed?.includes(profileUser.uid)
  );

  return (
    <div className="w-full">
      {profileUserEchoes.length === 0 ? (
        <div className="mt-16">
          <div className="flex flex-col items-center justify-center">
            <MdSensorsOff className="text-4xl text-vibe opacity-40" />
            <p className="text-xs text-vibe opacity-40">
              You have no echoed posts yet
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1 py-4 px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
          {profileUserEchoes.map((post, index) => (
            <PostStructure key={index} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
