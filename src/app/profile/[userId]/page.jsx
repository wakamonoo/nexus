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
import EditProfile from "@/components/modals/editProfile";
import Fallback from "@/assets/fallback.png";
import ProfileEchoes from "@/components/profile/profileEchoes";

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
  const [showProfileEchoes, setShowProfileEchoes] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
    if (allUsers && posts) {
      setIsLoading(false);
    }
  }, [allUsers, posts]);

  const profileUser = allUsers?.find((u) => u.uid === userId);

  const topRanks = profileUser?.rankings
    ? [...profileUser.rankings].sort((a, b) => a.rank - b.rank).slice(0, 3)
    : [];
  const showNum = titles?.length;

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
      {editProfile && <EditProfile setEditProfile={setEditProfile} />}
      <div className="p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
        <div className="flex justify-between items-center py-4 w-full">
          <FaAngleLeft
            onClick={() => router.back()}
            className="text-2xl cursor-pointer"
          />
          <h4 className="text-xl">Profile</h4>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 items-start">
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
            <aside className="flex flex-col lg:sticky lg:top-0">
              <div className="flex items-center w-full gap-2 py-4">
                <div className="w-16 h-16">
                  <Image
                    src={profileUser.picture || Fallback}
                    alt="user"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="flex flex-col justify-center items-start">
                  <div className="flex justify-between gap-1">
                    <p className="font-bold text-xl leading-5 text-normal">
                      {profileUser.name}
                    </p>
                    <FaPen
                      onClick={() => setEditProfile(true)}
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
              <div className="p-2">
                <p className="text-sm text-vibe italic">{profileUser.bio}</p>
              </div>

              {profileUser.rankings ? (
                <div className="w-full h-full p-2">
                  <h4 className="font-bold text-lg">
                    {profileUser.name.split(" ")[0]}'s holy trinity
                  </h4>
                  <div className="flex gap-2 justify-start">
                    {topRanks.map((rank, index) => (
                      <div
                        key={index}
                        onClick={() => handleShowNav(rank.titleId)}
                        className="w-26 h-40 md:w-32 md:h-46 cursor-pointer relative"
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
                  <h4 className="font-bold text-lg">
                    {profileUser.name.split(" ")[0]}'s latest watch
                  </h4>
                  <div className="flex gap-2 justify-start">
                    {latestWatch.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => handleShowNav(item.titleId)}
                        className="w-26 h-40 md:w-32 md:h-46 cursor-pointer relative"
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
            </aside>
          )}

          <main className="flex flex-col justify-center items-center">
            <div
              className={`flex justify-center gap-8 p-8 w-full ${
                profileUser ? "block" : "hidden"
              }`}
            >
              <button
                onClick={() => {
                  setShowProfilePosts(true);
                  setShowProfileReviews(false);
                  setShowProfileEchoes(false);
                }}
                className="cursor-pointer flex flex-1"
              >
                <p
                  className={`text-lg w-full text-center hover:font-bold hover:text-[var(--color-accent)] ${
                    showProfilePosts
                      ? "font-bold text-accent border-b-2 border-accent"
                      : "text-normal"
                  }`}
                >
                  Posts
                </p>
              </button>
              <button
                onClick={() => {
                  setShowProfileReviews(true);
                  setShowProfilePosts(false);
                  setShowProfileEchoes(false);
                }}
                className="cursor-pointer flex flex-1"
              >
                <p
                  className={`text-lg w-full text-center hover:font-bold hover:text-[var(--color-accent)] ${
                    showProfileReviews
                      ? "font-bold text-accent border-b-2 border-accent"
                      : "text-normal"
                  }`}
                >
                  Reviews
                </p>
              </button>
              <button
                onClick={() => {
                  setShowProfileEchoes(true);
                  setShowProfileReviews(false);
                  setShowProfilePosts(false);
                }}
                className="cursor-pointer flex flex-1"
              >
                <p
                  className={`text-lg w-full text-center hover:font-bold hover:text-[var(--color-accent)] ${
                    showProfileEchoes
                      ? "font-bold text-accent border-b-2 border-accent"
                      : "text-normal"
                  }`}
                >
                  Echoes
                </p>
              </button>
            </div>
            <div className="flex justify-center w-full">
              {showProfilePosts && profileUser && (
                <ProfilePosts profileUser={profileUser} />
              )}
              {showProfileReviews && profileUser && (
                <ProfileReviews profileUser={profileUser} />
              )}
              {showProfileEchoes && profileUser && (
                <ProfileEchoes profileUser={profileUser} />
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
