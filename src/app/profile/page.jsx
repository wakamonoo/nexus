"use client";
import Loader from "@/components/loader";
import { PostContext } from "@/context/postContext";
import { UserContext } from "@/context/userContext";
import { useContext, useEffect, useState } from "react";
import { FaAngleLeft, FaPen } from "react-icons/fa";
import Image from "next/image";
import { LoaderContext } from "@/context/loaderContext";
import { useRouter } from "next/navigation";
import { LuImageUp } from "react-icons/lu";
import { TitleContext } from "@/context/titleContext";
import { GiTrophy } from "react-icons/gi";
import { WatchContext } from "@/context/watchContext";
import { TitleNavContext } from "@/context/titlesNavContext";
import ProfilePosts from "@/components/profilePosts";
import ProfileReviews from "@/components/profileReviews";

export default function Profile() {
  const { user } = useContext(UserContext);
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
    if (user?.uid) {
      watchedInfoFetch(user.uid);
    }
  }, [user]);

  const isLoading = !user || !posts;

  if (isLoading) {
    return <Loader />;
  }

  const topRanks = user.rankings
    ? [...user.rankings].sort((a, b) => a.rank - b.rank).slice(0, 3)
    : [];
  const showNum = titles.length;

  const userWatch = watchInfo?.filter((w) => w.userId === user?.uid) || [];
  const latestWatch = [...userWatch]
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
        <div className="flex items-center w-full gap-2 py-4">
          <div className="w-16 h-16 relative">
            <Image
              src={user.picture}
              alt="user"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-full object-cover rounded-full"
            />
            <LuImageUp className="cursor-pointer absolute bottom-1 right-1 text-2xl" />
          </div>
          <div className="flex flex-col justify-center items-start">
            <div className="flex justify-between gap-1">
              <p className="font-bold text-base text-normal">{user.name}</p>
              <FaPen className="cursor-pointer text-xs text-vibe opacity-70" />
            </div>
            <p className="text-xs text-vibe">
              {user.totalWatched ? user.totalWatched : 0}/<span>{showNum}</span>{" "}
              watched
            </p>
          </div>
        </div>

        {user.rankings ? (
          <div className="w-full h-full p-2">
            <h4 className="font-bold text-base">Your holy trinity</h4>
            <div className="flex gap-2 justify-center">
              {topRanks.map((rank, index) => (
                <div
                  key={index}
                  onClick={() => handleShowNav(rank.titleId)}
                  className="w-26 h-40 cursor-pointer relative"
                >
                  <Image
                    src={rank?.poster}
                    alt="user"
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
              You haven't ranked any title yet.
            </p>
          </div>
        )}
        {latestWatch.length > 0 ? (
          <div className="w-full h-full p-2">
            <h4 className="font-bold text-base">Your latest watch</h4>
            <div className="flex gap-2 justify-center">
              {latestWatch.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleShowNav(item.titleId)}
                  className="w-26 h-40 cursor-pointer relative"
                >
                  <Image
                    src={item?.poster}
                    alt="user"
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
              You haven't watched anything yet.
            </p>
          </div>
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
      {showProfilePosts && <ProfilePosts />}
      {showProfileReviews && <ProfileReviews />}
    </>
  );
}
