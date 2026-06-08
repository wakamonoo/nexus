"use client";
import { PostContext } from "@/context/postContext";
import { UserContext } from "@/context/userContext";
import { useContext, useEffect, useState } from "react";
import { FaAngleLeft, FaPen } from "react-icons/fa";
import Image from "next/image";
import { LoaderContext } from "@/context/loaderContext";
import { useParams, useRouter } from "next/navigation";
import { TitleContext } from "@/context/titleContext";
import { GiTrophy } from "react-icons/gi";
import { WatchContext } from "@/context/watchContext";
import { TitleNavContext } from "@/context/titleNavContext";
import ProfilePosts from "@/components/profile/profilePosts";
import ProfileReviews from "@/components/profile/profileReviews";
import EditProfile from "@/components/modals/editProfile";
import Fallback from "@/assets/fallback.png";
import ProfileEchoes from "@/components/profile/profileEchoes";
import ProfileSigils from "@/components/profile/profileSigils";
import ProfileLoader from "@/components/loaders/profileLoader";
import ReactMarkdown from "react-markdown";
import { SigilContext } from "@/context/sigilContext";
import RinaLoaderMemory from "@/components/loaders/rinaLoaderMemory";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

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
  const [memory, setMemory] = useState(null);
  const [loadingMemory, setLoadingMemory] = useState(false);
  const [memoryCache, setMemoryCache] = useState({});
  const { sigils } = useContext(SigilContext);
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
    watchInfo?.filter(
      (w) => w.userId === profileUser?.uid && w.watched === true,
    ) || [];
  const latestWatch = [...profileUserWatch]
    .sort((a, b) => {
      const aDate = new Date(a.updatedAt || a.createdAt);
      const bDate = new Date(b.updatedAt || b.createdAt);
      return bDate - aDate;
    })
    .slice(0, 3);

  const progress =
    showNum > 0 ? ((profileUser?.totalWatched || 0) / showNum) * 100 : 0;

  const memoryInput = latestWatch.map((m) => m.title).filter(Boolean);

  const memoryKey = JSON.stringify(memoryInput);

  useEffect(() => {
    const runMemory = async () => {
      if (!memoryInput?.length) return;

      const cacheKey = `${profileUser.uid}-${memoryKey}`;

      if (memoryCache[cacheKey]) {
        setMemory(memoryCache[cacheKey]);
        return;
      }

      setLoadingMemory(true);
      try {
        const res = await fetch(`${BASE_URL}/api/memory/memoryFeed`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            recentTitles: memoryInput,
            user,
            profileUser,
          }),
        });

        const data = await res.json();

        if (data?.result) {
          setMemory(data.result);

          setMemoryCache((prev) => ({ ...prev, [cacheKey]: data.result }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMemory(false);
      }
    };
    runMemory();
  }, [memoryKey]);

  const userSigils = sigils?.filter((s) => profileUser?.[s.key] === true) || [];

  return (
    <>
      {editProfile && (
        <EditProfile setEditProfile={setEditProfile} user={user} />
      )}
      <div className="p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
        <div className="flex justify-between items-center py-4 w-full">
          <FaAngleLeft
            onClick={() => router.back()}
            className="text-2xl cursor-pointer"
          />
          <h4 className="text-xl">Profile</h4>
        </div>
        {!profileUser ? (
          <div className="w-full py-4">
            <ProfileLoader />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] lg:gap-4 items-start">
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

                  <div className="h-2 w-full overflow-hidden bg-panel rounded-full">
                    <div
                      className="h-full bg-accent transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="p-2">
                <p className="text-sm text-vibe italic">{profileUser.bio}</p>
              </div>
              {userSigils.length > 0 ? (
                <ProfileSigils profileUser={profileUser} user={user} />
              ) : (
                <div className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel transition-all duration-200 hover:-translate-y-1 focus:-translate-y-1 cursor-pointer rounded my-1">
                  <p className="text-xs text-vibe opacity-40 text-center">
                    you have no available sigils to show.
                  </p>
                </div>
              )}

              {profileUser.rankings ? (
                <div className="w-full h-full p-2">
                  <h4 className="font-bold text-lg">
                    {profileUser.uid === user?.uid
                      ? "Your"
                      : `${profileUser.name.split(" ")[0]}'s`}{" "}
                    holy trinity
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
                <div className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel transition-all duration-200 hover:-translate-y-1 focus:-translate-y-1 cursor-pointer rounded my-1">
                  <p className="text-xs text-vibe opacity-40 text-center">
                    {`${profileUser?.uid === user?.uid ? "you" : profileUser.name} haven't ranked any titles yet.`}
                  </p>
                </div>
              )}
              {latestWatch.length > 0 ? (
                <div className="w-full h-full p-2">
                  <h4 className="font-bold text-lg">
                    {profileUser.uid === user?.uid
                      ? "Your"
                      : `${profileUser.name.split(" ")[0]}'s`}{" "}
                    latest watch
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
                <div className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel transition-all duration-200 hover:-translate-y-1 focus:-translate-y-1 cursor-pointer rounded my-1">
                  <p className="text-xs text-vibe opacity-40 text-center">
                    {`${profileUser?.uid === user?.uid ? "you" : profileUser.name} haven't watched anything yet.`}
                  </p>
                </div>
              )}

              {profileUser?.totalWatched > 0 ? (
                <div className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel transition-all duration-200 hover:-translate-y-1 focus:-translate-y-1 cursor-pointer rounded my-4">
                  {loadingMemory && (
                    <div className="p-4">
                      <RinaLoaderMemory />
                    </div>
                  )}
                  {!loadingMemory && memory && (
                    <div className="p-4">
                      <h4 className="text-center w-full bg-accent rounded-2xl my-2 font-bold text-lg">
                        Archive Log
                      </h4>
                      <div className="text-sm font-normal text-vibe text-justify leading-5 whitespace-pre-wrap">
                        <ReactMarkdown>{memory}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                  {!loadingMemory && !memory && (
                    <div className="p-4">
                      <p className="text-sm font-normal text-vibe text-justify leading-5 whitespace-pre-wrap">
                        Memory not available.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel transition-all duration-200 hover:-translate-y-1 focus:-translate-y-1 cursor-pointer rounded my-1">
                  <p className="text-xs text-vibe opacity-40 text-center">
                    watch titles to see archive log.
                  </p>
                </div>
              )}
            </aside>

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
        )}
      </div>
    </>
  );
}
