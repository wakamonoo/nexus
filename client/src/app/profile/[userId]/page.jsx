"use client";
import { PostContext } from "@/context/postContext";
import { UserContext } from "@/context/userContext";
import { use, useContext, useEffect, useRef, useState } from "react";
import { FaAngleLeft, FaPen, FaPlus } from "react-icons/fa";
import Image from "next/image";
import { LoaderContext } from "@/context/loaderContext";
import { useParams, useRouter } from "next/navigation";
import { TitleContext } from "@/context/titleContext";
import { GiTrophy } from "react-icons/gi";
import { WatchContext } from "@/context/watchContext";
import { TitleNavContext } from "@/context/titleNavContext";
import ProfilePosts from "@/components/layout/profile/profilePosts";
import ProfileReviews from "@/components/layout/profile/profileReviews";
import EditProfileModal from "@/components/modals/editProfileModal";
import Avatar from "@/assets/defaultAvatar.png";
import ProfileEchoes from "@/components/layout/profile/profileEchoes";
import ProfileSigils from "@/components/layout/profile/profileSigils";
import ReactMarkdown from "react-markdown";
import { SigilContext } from "@/context/sigilContext";
import RinaLoaderMemory from "@/components/loaders/rinaLoaderMemory";
import Rina from "../../../assets/rina.png";
import ProfileLibrary from "@/components/layout/profile/profileLibrary";
import TitleCard from "@/components/layout/title/titleCard";
import TitleProfileLoader from "@/components/loaders/titleProfileLoader";
import SigilsProfileLoader from "@/components/loaders/sigilsProfileLoader";
import InfoProfileLoader from "@/components/loaders/infoProfileLoader";
import { MomentContext } from "@/context/momentContext";
import MomentLoader from "@/components/loaders/momentLoader";
import AddMomenttModal from "@/components/modals/addMomentModal";
import MomentLightbox from "@/components/lightBoxes/momentLightbox";
import { RiArrowLeftWideFill, RiArrowRightWideFill } from "react-icons/ri";
import Fallback from "@/assets/fallback.png";
import MomentArchiveLoader from "@/components/loaders/momentArchiveLoader";
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
  const { allUsers, user, allUsersLoading } = useContext(UserContext);
  const { posts, getUserPosts, userPosts } = useContext(PostContext);
  const {
    titles,
    titlesLoad,
    releasedMCUTitles,
    releasedLegacyTitles,
    releasedAdjacentTitles,
  } = useContext(TitleContext);
  const { setIsLoading } = useContext(LoaderContext);
  const { getUserWatchedInfoFetch, isTitleWatched } = useContext(WatchContext);
  const { handleShowNav } = useContext(TitleNavContext);
  const [showProfilePosts, setShowProfilePosts] = useState(true);
  const [showProfileReviews, setShowProfileReviews] = useState(false);
  const [showProfileEchoes, setShowProfileEchoes] = useState(false);
  const [showProfileLibrary, setShowProfileLibrary] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [memory, setMemory] = useState(null);
  const [loadingMemory, setLoadingMemory] = useState(false);
  const [memoryCache, setMemoryCache] = useState({});
  const { sigils } = useContext(SigilContext);
  const [profileUserWatch, setProfileUserWatch] = useState(null);
  const { getUserMoments, userMoments, momentLoading } =
    useContext(MomentContext);
  const [isScrolled1, setIsScrolled1] = useState(false);
  const [showArrows1, setShowArrows1] = useState(false);
  const scrollRef1 = useRef(null);
  const [isScrolled2, setIsScrolled2] = useState(false);
  const [showArrows2, setShowArrows2] = useState(false);
  const scrollRef2 = useRef(null);
  const [isScrolled3, setIsScrolled3] = useState(false);
  const [showArrows3, setShowArrows3] = useState(false);
  const scrollRef3 = useRef(null);
  const [canScroll1, setCanScroll1] = useState(false);
  const [canScroll2, setCanScroll2] = useState(false);
  const [canScroll3, setCanScroll3] = useState(false);
  const [selectedMoment, setSelectedMoment] = useState(null);
  const [showAddMomentModal, setShowAddMomentModal] = useState(false);
  const [showMomentLightbox, setShowMomentLightbox] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
    if (allUsers && posts) {
      setIsLoading(false);
    }
  }, [allUsers, posts]);

  const profileUser = allUsers?.find((u) => u.uid === userId);

  useEffect(() => {
    if (!profileUser?.uid) return;

    const fetchProfileWatch = async () => {
      try {
        const data = await getUserWatchedInfoFetch(profileUser?.uid);

        setProfileUserWatch(data.filter((w) => w.watched === true));
      } catch (err) {
        console.error(err);
        setProfileUserWatch([]);
      }
    };

    fetchProfileWatch();
  }, [profileUser?.uid]);

  const topRanks = profileUser?.rankings
    ? [...profileUser?.rankings].sort((a, b) => a.rank - b.rank).slice(0, 3)
    : [];

  const showNumAll =
    releasedMCUTitles?.length +
    releasedLegacyTitles?.length +
    releasedAdjacentTitles?.length;
  const showNumMCU = releasedMCUTitles?.length;
  const showNumLegacy = releasedLegacyTitles?.length;
  const showNumAdjacent = releasedAdjacentTitles?.length;

  const latestWatch = profileUserWatch
    ? [...profileUserWatch]
        .sort((a, b) => {
          const aDate = new Date(a.updatedAt || a.createdAt);
          const bDate = new Date(b.updatedAt || b.createdAt);
          return bDate - aDate;
        })
        .slice(0, 3)
    : [];

  const progressAll =
    showNumAll > 0 ? ((profileUser?.totalWatched || 0) / showNumAll) * 100 : 0;

  const progressMCU =
    showNumMCU > 0
      ? ((profileUser?.totalMCUWatched || 0) / showNumMCU) * 100
      : 0;

  const progressLegacy =
    showNumLegacy > 0
      ? ((profileUser?.totalLegacyWatched || 0) / showNumLegacy) * 100
      : 0;

  const progressAdjacent =
    showNumAdjacent > 0
      ? ((profileUser?.totalAdjacentWatched || 0) / showNumAdjacent) * 100
      : 0;

  const memoryInput = latestWatch
    .map((watch) => {
      const title = titles.find((t) => t.titleId === watch.titleId);
      return title?.title;
    })
    .filter(Boolean);

  const memoryKey = JSON.stringify(memoryInput);

  useEffect(() => {
    const runMemory = async () => {
      if (!profileUser?.uid || !memoryInput?.length) return;

      const cacheKey = `${profileUser?.uid}-${memoryKey}`;

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
  }, [!profileUser?.uid, memoryKey]);

  useEffect(() => {
    if (userId) {
      getUserMoments(userId);
    }
  }, [userId]);

  useEffect(() => {
    const current = scrollRef1.current;
    if (!current) return;

    const handleScroll1 = () => {
      setIsScrolled1(current.scrollLeft > 0);
    };

    current.addEventListener("scroll", handleScroll1);
    return () => {
      current.removeEventListener("scroll", handleScroll1);
    };
  }, [userMoments]);

  const handleScrollLeft1 = () => {
    if (scrollRef1.current) {
      scrollRef1.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const handleScrollRight1 = () => {
    if (scrollRef1.current) {
      scrollRef1.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const current = scrollRef2.current;
    if (!current) return;

    const handleScroll2 = () => {
      setIsScrolled2(current.scrollLeft > 0);
    };

    current.addEventListener("scroll", handleScroll2);
    return () => {
      current.removeEventListener("scroll", handleScroll2);
    };
  }, [topRanks]);

  const handleScrollLeft2 = () => {
    if (scrollRef2.current) {
      scrollRef2.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const handleScrollRight2 = () => {
    if (scrollRef2.current) {
      scrollRef2.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const current = scrollRef3.current;
    if (!current) return;

    const handleScroll3 = () => {
      setIsScrolled3(current.scrollLeft > 0);
    };

    current.addEventListener("scroll", handleScroll3);
    return () => {
      current.removeEventListener("scroll", handleScroll3);
    };
  }, [latestWatch]);

  const handleScrollLeft3 = () => {
    if (scrollRef3.current) {
      scrollRef3.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const handleScrollRight3 = () => {
    if (scrollRef3.current) {
      scrollRef3.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const refs = [
      [scrollRef1, setCanScroll1],
      [scrollRef2, setCanScroll2],
      [scrollRef3, setCanScroll3],
    ];

    const observers = refs.map(([ref, setCanScroll]) => {
      const el = ref.current;
      if (!el) return null;

      const checkOverflow = () => {
        setCanScroll(el.scrollWidth > el.clientWidth);
      };

      checkOverflow();

      const observer = new ResizeObserver(checkOverflow);
      observer.observe(el);

      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [userMoments, topRanks, latestWatch]);

  const userSigils = sigils?.filter((s) => profileUser?.[s.key] === true) || [];

  useEffect(() => {
    const hash = window.location.hash;

    if (hash === "#reviews") {
      setShowProfileReviews(true);
      setShowProfilePosts(false);
      setShowProfileEchoes(false);
      setShowProfileLibrary(false);
    } else if (hash === "#library") {
      setShowProfileLibrary(true);
      setShowProfileReviews(false);
      setShowProfilePosts(false);
      setShowProfileEchoes(false);
    }
  }, []);

  return (
    <>
      {showEditProfileModal && (
        <EditProfileModal
          setShowEditProfileModal={setShowEditProfileModal}
          user={user}
        />
      )}
      <div className="p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
        <div className="flex justify-between items-center py-4 w-full">
          <FaAngleLeft
            onClick={() => router.back()}
            className="text-2xl cursor-pointer"
          />
          <h4 className="text-xl">Profile</h4>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_2.5fr] lg:gap-4 items-start">
          <aside className="flex flex-col min-w-0 lg:sticky lg:top-0">
            {allUsersLoading ? (
              <InfoProfileLoader />
            ) : (
              <>
                <div className="flex items-center w-full gap-2 py-4">
                  <div className="w-32 h-32 shrink-0">
                    <img
                      src={profileUser.picture || Avatar.src}
                      alt={profileUser.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="flex flex-col justify-center items-start">
                    <div className="flex justify-between gap-1">
                      <p className="font-bold text-xl leading-5 text-normal">
                        {profileUser.name}
                      </p>
                      <FaPen
                        onClick={() => setShowEditProfileModal(true)}
                        className={`text-xs cursor-pointer text-vibe opacity-70 ${
                          user?.uid === profileUser.uid ? "flex" : "hidden"
                        }`}
                      />
                    </div>

                    <div className="w-[200] flex flex-col gap-1 mt-1">
                      <div className="h-4 w-full overflow-hidden bg-panel rounded-full relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-xs text-vibe opacity-60">
                            {profileUser.totalMCUWatched
                              ? profileUser.totalMCUWatched
                              : 0}
                            /<span>{showNumMCU}</span> mcu titles watched
                          </p>
                        </div>
                        <div
                          className="h-full bg-accent transition-all duration-500"
                          style={{ width: `${progressMCU}%` }}
                        />
                      </div>

                      <div className="h-4 w-full overflow-hidden bg-panel rounded-full relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-xs text-vibe opacity-60">
                            {profileUser.totalLegacyWatched
                              ? profileUser.totalLegacyWatched
                              : 0}
                            /<span>{showNumLegacy}</span> multiversal cannon
                            watched
                          </p>
                        </div>
                        <div
                          className="h-full bg-hulk transition-all duration-500"
                          style={{ width: `${progressLegacy}%` }}
                        />
                      </div>

                      <div className="h-4 w-full overflow-hidden bg-panel rounded-full relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-xs text-vibe opacity-60">
                            {profileUser.totalAdjacentWatched
                              ? profileUser.totalAdjacentWatched
                              : 0}
                            /<span>{showNumAdjacent}</span> marvel adjacent
                            watched
                          </p>
                        </div>
                        <div
                          className="h-full bg-(--color-infinity) transition-all duration-500"
                          style={{ width: `${progressAdjacent}%` }}
                        />
                      </div>

                      <div className="h-4 w-full overflow-hidden bg-panel rounded-full relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-xs text-vibe opacity-60">
                            {profileUser.totalWatched
                              ? profileUser.totalWatched
                              : 0}
                            /<span>{showNumAll}</span> overall watched
                          </p>
                        </div>
                        <div
                          className="h-full bg-zeus transition-all duration-500"
                          style={{ width: `${progressAll}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-sm text-vibe italic">{profileUser.bio}</p>
                </div>
              </>
            )}

            <div className="w-full h-full p-2">
              <h4 className="font-bold text-lg">
                {profileUser?.uid === user?.uid
                  ? "Your"
                  : `${profileUser?.name.split(" ")[0]}'s`}{" "}
                moment archive
              </h4>
              <div
                className="relative"
                onMouseEnter={() => setShowArrows1(true)}
                onMouseLeave={() => setShowArrows1(false)}
              >
                <div
                  className={`pointer-events-none absolute z-40 top-0 left-0 w-16 h-full bg-linear-to-r from-(--color-bg)/80  ${
                    showArrows1 && isScrolled1 && canScroll1
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                />
                <div
                  className={`pointer-events-none absolute z-40 top-0 right-0 w-16 h-full bg-linear-to-l from-(--color-bg)/80 ${
                    showArrows1 && canScroll1 ? "opacity-100" : "opacity-0"
                  }`}
                />

                {showArrows1 && isScrolled1 && canScroll1 && (
                  <button
                    onClick={handleScrollLeft1}
                    className="cursor-pointer absolute z-50 top-1/2 -translate-y-1/2 left-1"
                  >
                    <RiArrowLeftWideFill className="text-2xl" />
                  </button>
                )}
                {showArrows1 && userMoments && canScroll1 && (
                  <button
                    onClick={handleScrollRight1}
                    className="cursor-pointer absolute z-50 top-1/2 -translate-y-1/2 right-1"
                  >
                    <RiArrowRightWideFill className="text-2xl" />
                  </button>
                )}

                <div
                  ref={scrollRef1}
                  className="flex gap-2 overflow-x-auto scrollbar-hide pb-2.5"
                >
                  <div className="flex gap-2 w-full">
                    {momentLoading || allUsersLoading ? (
                      <>
                        <MomentArchiveLoader />
                        <MomentArchiveLoader />
                        <MomentArchiveLoader />
                        <MomentArchiveLoader />
                      </>
                    ) : userMoments?.length === 0 ? (
                      <div className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel rounded">
                        <p className="text-xs text-vibe opacity-60 text-center">
                          {`${profileUser?.uid === user?.uid ? "You" : profileUser?.name} haven't shared any moments yet.`}
                        </p>
                      </div>
                    ) : (
                      userMoments?.map((moment) => {
                        const owner = allUsers.find(
                          (u) => u.uid === moment?.userId,
                        );
                        const title = titles.find(
                          (t) => t.titleId === moment?.titleId,
                        );

                        return (
                          <div
                            key={moment?.momentId}
                            className="group relative select-none overflow-visible"
                          >
                            <div
                              onClick={() => {
                                setSelectedMoment({
                                  moment,
                                  owner,
                                  title,
                                });
                                setShowMomentLightbox(true);
                              }}
                              className="cursor-pointer p-0.5 rounded-full border-4 border-panel"
                            >
                              <div className="w-18 h-18 rounded-full border-2 border-panel overflow-hidden shrink-0">
                                <img
                                  src={
                                    title?.backdrop
                                      ? `https://image.tmdb.org/t/p/w500${title?.backdrop}`
                                      : Fallback.src
                                  }
                                  alt={title?.title}
                                  loading="lazy"
                                  decoding="async"
                                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105 group-active:scale-105"
                                />
                              </div>
                            </div>
                              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex h-8 w-8 flex-col items-center justify-center rounded-md border-2 border-(--color-bg) bg-second overflow-hidden">
                                <div className="absolute top-0 flex w-full items-center justify-center bg-accent/60">
                                  <span className="text-[8px] font-semibold uppercase">
                                    {new Date(
                                      moment?.createdAt,
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                    })}
                                  </span>
                                </div>
                                <span className="mt-3 text-[10px] font-bold leading-none">
                                  {new Date(moment?.createdAt).getDate()}
                                </span>
                              </div>
                         
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2">
              <h4 className="font-bold text-lg">
                {profileUser?.uid === user?.uid
                  ? "Your"
                  : `${profileUser?.name.split(" ")[0]}'s`}{" "}
                sigils
              </h4>
              {allUsersLoading || !sigils ? (
                <SigilsProfileLoader />
              ) : userSigils.length > 0 ? (
                <ProfileSigils profileUser={profileUser} user={user} />
              ) : (
                <div className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel rounded">
                  <p className="text-xs text-vibe opacity-60 text-center">
                    {`${profileUser.uid === user?.uid ? "You" : profileUser.name} have no sigils to show.`}
                  </p>
                </div>
              )}
            </div>

            <div className="w-full h-full p-2">
              <h4 className="font-bold text-lg">
                {profileUser?.uid === user?.uid
                  ? "Your"
                  : `${profileUser?.name.split(" ")[0]}'s`}{" "}
                holy trinity
              </h4>
              <div
                className="relative"
                onMouseEnter={() => setShowArrows2(true)}
                onMouseLeave={() => setShowArrows2(false)}
              >
                <div
                  className={`pointer-events-none absolute z-40 top-0 left-0 w-16 h-full bg-linear-to-r from-(--color-bg)/80  ${
                    showArrows2 && isScrolled2 && canScroll2
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                />
                <div
                  className={`pointer-events-none absolute z-40 top-0 right-0 w-16 h-full bg-linear-to-l from-(--color-bg)/80 ${
                    showArrows2 && canScroll2 ? "opacity-100" : "opacity-0"
                  }`}
                />

                {showArrows2 && isScrolled2 && canScroll2 && (
                  <button
                    onClick={handleScrollLeft2}
                    className="cursor-pointer absolute z-50 top-1/2 -translate-y-1/2 left-1"
                  >
                    <RiArrowLeftWideFill className="text-2xl" />
                  </button>
                )}
                {showArrows2 && canScroll2 && (
                  <button
                    onClick={handleScrollRight2}
                    className="cursor-pointer absolute z-50 top-1/2 -translate-y-1/2 right-1"
                  >
                    <RiArrowRightWideFill className="text-2xl" />
                  </button>
                )}

                <div
                  ref={scrollRef2}
                  className="flex gap-2 overflow-x-auto scrollbar-hide"
                >
                  {allUsersLoading || titlesLoad ? (
                    <TitleProfileLoader />
                  ) : profileUser?.rankings?.length > 0 ? (
                    <div className="flex gap-2 justify-start">
                      {topRanks.map((rank) => {
                        const title = titles.find(
                          (t) => t.titleId === rank.titleId,
                        );

                        if (!title) return null;
                        return (
                          <TitleCard
                            key={rank.titleId}
                            unit={{ ...title, rank: rank.rank }}
                            isWatched={isTitleWatched(title.titleId)}
                            onOpen={() => handleShowNav(title.titleId)}
                            goat={true}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel rounded">
                      <p className="text-xs text-vibe opacity-60 text-center">
                        {`${profileUser?.uid === user?.uid ? "You" : profileUser?.name} haven't ranked any titles yet.`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full h-full p-2">
              <h4 className="font-bold text-lg">
                {profileUser?.uid === user?.uid
                  ? "Your"
                  : `${profileUser?.name.split(" ")[0]}'s`}{" "}
                latest watch
              </h4>
              <div
                className="relative"
                onMouseEnter={() => setShowArrows3(true)}
                onMouseLeave={() => setShowArrows3(false)}
              >
                <div
                  className={`pointer-events-none absolute z-40 top-0 left-0 w-16 h-full bg-linear-to-r from-(--color-bg)/80  ${
                    showArrows3 && isScrolled3 && canScroll3
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                />
                <div
                  className={`pointer-events-none absolute z-40 top-0 right-0 w-16 h-full bg-linear-to-l from-(--color-bg)/80 ${
                    showArrows3 && canScroll3 ? "opacity-100" : "opacity-0"
                  }`}
                />

                {showArrows3 && isScrolled3 && canScroll3 && (
                  <button
                    onClick={handleScrollLeft3}
                    className="cursor-pointer absolute z-50 top-1/2 -translate-y-1/2 left-1"
                  >
                    <RiArrowLeftWideFill className="text-2xl" />
                  </button>
                )}
                {showArrows3 && canScroll3 && (
                  <button
                    onClick={handleScrollRight3}
                    className="cursor-pointer absolute z-50 top-1/2 -translate-y-1/2 right-1"
                  >
                    <RiArrowRightWideFill className="text-2xl" />
                  </button>
                )}

                <div
                  ref={scrollRef3}
                  className="flex gap-2 overflow-x-auto scrollbar-hide"
                >
                  {allUsersLoading ||
                  titlesLoad ||
                  profileUserWatch === null ? (
                    <TitleProfileLoader />
                  ) : latestWatch.length > 0 ? (
                    <div className="flex gap-2 justify-start">
                      {latestWatch.map((item) => {
                        const title = titles.find(
                          (t) => t.titleId === item.titleId,
                        );

                        if (!title) return null;

                        return (
                          <TitleCard
                            key={item.titleId}
                            unit={title}
                            isWatched={isTitleWatched(title.titleId)}
                            onOpen={() => handleShowNav(title.titleId)}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel rounded">
                      <p className="text-xs text-vibe opacity-60 text-center">
                        {`${profileUser?.uid === user?.uid ? "You" : profileUser?.name} haven't watched anything yet.`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {allUsersLoading ||
            titlesLoad ||
            profileUserWatch === null ||
            loadingMemory ? (
              <RinaLoaderMemory />
            ) : profileUser?.totalWatched > 0 ? (
              <div className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel transition-all duration-200 hover:-translate-y-1 focus:-translate-y-1 cursor-pointer rounded my-4">
                {!loadingMemory && memory && (
                  <div className="p-4">
                    <div className="flex items-center gap-3 pb-4">
                      <Image
                        src={Rina}
                        alt="file"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-base mt-2 font-bold leading-3.5 truncate">
                          Rina
                        </p>
                        <p className="text-xs text-vibe">
                          gemini-3.1-flash-lite
                        </p>
                      </div>
                    </div>
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
              <div className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel rounded">
                <p className="text-xs text-vibe opacity-60 text-center">
                  {`${profileUser?.uid === user?.uid ? "You" : profileUser?.name} have no archive available.`}
                </p>
              </div>
            )}
          </aside>

          <main className="flex flex-col min-w-0 justify-center items-center">
            <div className="flex justify-center gap-8 p-8 w-full">
              <button
                id="posts"
                onClick={() => {
                  setShowProfilePosts(true);
                  setShowProfileReviews(false);
                  setShowProfileEchoes(false);
                  setShowProfileLibrary(false);
                }}
                className="cursor-pointer flex flex-1"
              >
                <p
                  className={`text-lg w-full text-center hover:font-bold hover:text-(--color-accent) ${
                    showProfilePosts
                      ? "font-bold text-accent border-b-2 border-accent"
                      : "text-normal"
                  }`}
                >
                  Posts
                </p>
              </button>
              <button
                id="reviews"
                onClick={() => {
                  setShowProfileReviews(true);
                  setShowProfilePosts(false);
                  setShowProfileEchoes(false);
                  setShowProfileLibrary(false);
                }}
                className="cursor-pointer flex flex-1"
              >
                <p
                  className={`text-lg w-full text-center hover:font-bold hover:text-(--color-accent) ${
                    showProfileReviews
                      ? "font-bold text-accent border-b-2 border-accent"
                      : "text-normal"
                  }`}
                >
                  Reviews
                </p>
              </button>
              <button
                id="echoes"
                onClick={() => {
                  setShowProfileEchoes(true);
                  setShowProfileReviews(false);
                  setShowProfilePosts(false);
                  setShowProfileLibrary(false);
                }}
                className="cursor-pointer flex flex-1"
              >
                <p
                  className={`text-lg w-full text-center hover:font-bold hover:text-(--color-accent) ${
                    showProfileEchoes
                      ? "font-bold text-accent border-b-2 border-accent"
                      : "text-normal"
                  }`}
                >
                  Echoes
                </p>
              </button>
              <button
                id="library"
                onClick={() => {
                  setShowProfileLibrary(true);
                  setShowProfileReviews(false);
                  setShowProfilePosts(false);
                  setShowProfileEchoes(false);
                }}
                className="cursor-pointer flex flex-1"
              >
                <p
                  className={`text-lg w-full text-center hover:font-bold hover:text-(--color-accent) ${
                    showProfileLibrary
                      ? "font-bold text-accent border-b-2 border-accent"
                      : "text-normal"
                  }`}
                >
                  Library
                </p>
              </button>
            </div>
            <div className="flex justify-center w-full">
              {showProfilePosts && <ProfilePosts profileUser={profileUser} />}
              {showProfileReviews && (
                <ProfileReviews profileUser={profileUser} />
              )}
              {showProfileEchoes && <ProfileEchoes profileUser={profileUser} />}
              {showProfileLibrary && (
                <ProfileLibrary
                  profileUserWatch={profileUserWatch}
                  profileUser={profileUser}
                />
              )}
            </div>
          </main>
        </div>
      </div>
      {showAddMomentModal && (
        <AddMomenttModal setShowAddMomentModal={setShowAddMomentModal} />
      )}
      {showMomentLightbox && (
        <MomentLightbox
          setShowMomentLightbox={setShowMomentLightbox}
          moment={selectedMoment.moment}
          owner={selectedMoment.owner}
          title={selectedMoment.title}
        />
      )}
    </>
  );
}
