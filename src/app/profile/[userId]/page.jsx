"use client";
import { PostContext } from "@/context/postContext";
import { UserContext } from "@/context/userContext";
import { useContext, useEffect, useState } from "react";
import { FaAngleLeft, FaPen, FaUserSlash } from "react-icons/fa";
import Image from "next/image";
import { LoaderContext } from "@/context/loaderContext";
import { useParams, useRouter } from "next/navigation";
import { LuImageUp } from "react-icons/lu";
import { TitleContext } from "@/context/titleContext";
import { GiTrophy } from "react-icons/gi";
import { WatchContext } from "@/context/watchContext";
import { TitleNavContext } from "@/context/titlesNavContext";
import ProfilePosts from "@/components/profile/profilePosts";
import ProfileReviews from "@/components/profile/profileReviews";

export default function UserProfile() {
  const { userId } = useParams();
  const { allUsers, user } = useContext(UserContext);
  const { posts } = useContext(PostContext);
  const { titles } = useContext(TitleContext);
  const { setIsLoading } = useContext(LoaderContext);
  const { watchedInfoFetch, watchInfo } = useContext(WatchContext);
  const { handleShowNav } = useContext(TitleNavContext);
  const [showProfilePosts, setShowProfilePosts] = useState(true);
  const [showProfileReviews, setShowProfileReviews] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
    if (allUsers && posts) {
      setIsLoading(false);
    }
  }, [allUsers, posts]);

  const profileUser = allUsers.find((u) => u.uid === userId);

  const topRanks = profileUser?.rankings
    ? [...profileUser.rankings].sort((a, b) => a.rank - b.rank).slice(0, 3)
    : [];
  const showNum = titles.length;

  useEffect(() => {
    const fetchWathced = async () => {
      if (profileUser?.uid) {
        await watchedInfoFetch(profileUser.uid);
      }
    };

    fetchWathced();
  }, [profileUser]);

  const profileUserWatch =
    watchInfo?.filter((w) => w.userId === profileUser?.uid) || [];
  const latestWatch = [...profileUserWatch]
    .sort((a, b) => {
      const aDate = new Date(a.updatedAt || a.createdAt);
      const bDate = new Date(b.updatedAt || b.createdAt);
      return bDate - aDate;
    })
    .slice(0, 3);

  return (
    <>
      <div className="p-2">
        <div className="flex justify-between items-center py-4 w-full">
          <FaAngleLeft
            onClick={() => router.back()}
            className="text-2xl cursor-pointer"
          />
          <h4 className="text-2xl">Profile</h4>
        </div>
        {!profileUser ? (
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-col items-center justify-center">
              <FaUserSlash className="text-4xl text-vibe opacity-40" />
              <p className="text-xs text-vibe opacity-40">
                Sorry, this user cant be found
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center w-full gap-2 py-4">
              <div className="w-16 h-16 relative">
                <Image
                  src={profileUser.picture}
                  alt="user"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-full object-cover rounded-full"
                />
                <LuImageUp
                  className={`absolute cursor-pointer bottom-1 right-1 text-2xl ${
                    user?.uid === profileUser.uid ? "flex" : "hidden"
                  }`}
                />
              </div>
              <div className="flex flex-col justify-center items-start">
                <div className="flex justify-between gap-1">
                  <p className="font-bold text-base text-normal">
                    {profileUser.name}
                  </p>
                  <FaPen
                    className={`text-xs cursor-pointer text-vibe opacity-70 ${
                      user?.uid === profileUser.uid ? "flex" : "hidden"
                    }`}
                  />
                </div>
                <p className="text-xs text-vibe">
                  {profileUser.totalWatched ? profileUser.totalWatched : 0}/
                  <span>{showNum}</span> watched
                </p>
              </div>
            </div>

            {profileUser.rankings ? (
              <div className="w-full h-full p-2">
                <h4 className="font-bold text-base">
                  {profileUser.name.split(" ")[0]}'s holy trinity
                </h4>
                <div className="flex gap-2 justify-center">
                  {topRanks.map((rank, index) => (
                    <div
                      key={index}
                      onClick={() => handleShowNav(rank.titleId)}
                      className="w-26 h-40 cursor-pointer relative"
                    >
                      <Image
                        src={rank?.poster}
                        alt="profileUser"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-full object-fill rounded"
                      />
                      <div
                        className={`absolute opacity-80 top-0 right-1 p-2 h-8 w-6 flex items-center justify-center rounded-bl-2xl rounded-br-2xl ${
                          rank?.rank === 1 ? "bg-hulk" : "bg-accent"
                        }`}
                      >
                        <p
                          className={`font-bold text-sm ${
                            rank?.rank === 1 ? "text-zeus" : "text-normal"
                          }`}
                        >
                          {rank?.rank === 1 ? <GiTrophy /> : rank?.rank}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center">
                <p className="text-xs text-vibe opacity-40">
                  {profileUser.name} haven't ranked any title yet.
                </p>
              </div>
            )}
            {latestWatch.length > 0 ? (
              <div className="w-full h-full p-2">
                <h4 className="font-bold text-base">
                  {profileUser.name.split(" ")[0]}'s latest watch
                </h4>
                <div className="flex gap-2 justify-center">
                  {latestWatch.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleShowNav(item.titleId)}
                      className="w-26 h-40 cursor-pointer relative"
                    >
                      <Image
                        src={item?.poster}
                        alt="profileUser"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-full object-fill rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center">
                <p className="text-xs text-vibe opacity-40">
                  {profileUser.name} haven't watched anything yet.
                </p>
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex justify-center gap-8 p-8 w-full">
        <div
          onClick={() => {
            setShowProfilePosts(true);
            setShowProfileReviews(false);
          }}
          className="cursor-pointer w-[50%]"
        >
          <p
            className={`text-base w-full text-center ${
              showProfilePosts
                ? "font-bold text-accent border-b-2 border-accent"
                : "text-normal"
            }`}
          >
            Posts
          </p>
        </div>
        <div
          onClick={() => {
            setShowProfileReviews(true);
            setShowProfilePosts(false);
          }}
          className="cursor-pointer w-[50%]"
        >
          <p
            className={`text-base w-full text-center ${
              showProfileReviews
                ? "font-bold text-accent border-b-2 border-accent"
                : "text-normal"
            }`}
          >
            Reviews
          </p>
        </div>
      </div>
      {showProfilePosts && <ProfilePosts profileUser={profileUser} />}
      {showProfileReviews && <ProfileReviews profileUser={profileUser} />}
    </>
  );
}
