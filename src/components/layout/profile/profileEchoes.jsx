import { PostContext } from "@/context/postContext";
import { useContext, useEffect } from "react";
import { MdSensorsOff } from "react-icons/md";
import PostStructure from "../post/postStructure";
import { UserContext } from "@/context/userContext";
import PostLoader from "@/components/loaders/postLoader";

export default function ProfileEchoes({ profileUser }) {
  const { posts, getUserEchoes, userEchoes, postLoading } =
    useContext(PostContext);
  const { user, allUsersLoading } = useContext(UserContext);

  const isLoading = postLoading || allUsersLoading || !userEchoes;

  useEffect(() => {
    if (profileUser?.uid) {
      getUserEchoes(profileUser?.uid);
    }
  }, [profileUser?.uid]);

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex flex-col gap-1 py-4 px-2 sm:px-4 md:px-8 lg:px-16">
          <PostLoader />
        </div>
      ) : userEchoes.length === 0 ? (
        <div className="flex h-full w-full justify-center items-center my-16">
          <div className="flex flex-col gap-2 items-center justify-center">
            <div className="w-14 h-14 rounded-full border border-panel flex items-center justify-center">
              <MdSensorsOff className="text-5xl text-vibe opacity-60 p-2" />
            </div>
            <div className="w-40 text-center">
              <p className="text-xs text-vibe opacity-60 leading-tight">
                {`${profileUser?.uid === user?.uid ? "You" : profileUser.name} have no echoed posts yet`}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1 py-4 px-2 sm:px-4 md:px-8 lg:px-16">
          {userEchoes.map((post, index) => (
            <PostStructure key={index} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
