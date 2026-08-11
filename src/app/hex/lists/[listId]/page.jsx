"use client";
import { useContext, useEffect, useState } from "react";
import { TitleContext } from "@/context/titleContext";
import { FaAngleLeft, FaQuoteLeft } from "react-icons/fa";
import { LoaderContext } from "@/context/loaderContext";
import { useParams, useRouter } from "next/navigation";
import { TitleNavContext } from "@/context/titleNavContext";
import ShowListLoader from "@/components/loaders/showListLoader";
import { WatchContext } from "@/context/watchContext";
import { UserContext } from "@/context/userContext";
import TitleCard from "@/components/layout/titleCard";
import ListLoader from "@/components/loaders/listLoader";
import SecondaryButtons from "@/components/buttons/secBtns";
import ListDelConfirm from "@/components/modals/deleteList";
import EditList from "@/components/modals/editList";
import DeleteList from "@/components/modals/deleteList";
import { ListContext } from "@/context/listContext";
import {
  BiDotsHorizontalRounded,
  BiDownvote,
  BiSolidDownvote,
  BiSolidUpvote,
  BiUpvote,
} from "react-icons/bi";
import ListOpt from "@/components/layout/listOpt";
import { SocketContext } from "@/context/socketContext";
import Swal from "sweetalert2";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export default function List() {
  const { listId } = useParams();
  const { lists } = useContext(ListContext);
  const [showEditListModal, setShowEditListModal] = useState(false);
  const { listVotes } = useContext(SocketContext);
  const [showDeleteListModal, setShowDeleteListModal] = useState(false);
  const { user, allUsers } = useContext(UserContext);
  const { titles } = useContext(TitleContext);
  const { setIsLoading } = useContext(LoaderContext);
  const { handleShowNav } = useContext(TitleNavContext);
  const { isTitleWatched, watchedInfoFetch } = useContext(WatchContext);
  const [showListOpt, setShowListOpt] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const fetchWathced = async () => {
      if (user?.uid) {
        await watchedInfoFetch(user?.uid);
      }
    };

    fetchWathced();
  }, [user]);

  const currentList = lists.find((list) => list.listId === listId);

  const upvotes = listVotes[currentList?.listId]?.upvotes || [];
  const downvotes = listVotes[currentList?.listId]?.downvotes || [];

  const creator = allUsers.find((u) => u.uid === currentList?.userId);

  const listTitles = [...(currentList?.titles || [])]
    ?.sort((a, b) => a.order - b.order)
    .map((listTitle) => {
      const title = titles.find((title) => title.titleId == listTitle.titleId);

      return title
        ? {
            ...title,
            note: listTitle.note,
            listOrder: listTitle.order,
          }
        : null;
    })
    .filter(Boolean);

  const handleVote = async (listId, vote) => {
    try {
      if (!user?.uid) {
        setShowSignIn();
      }

      await fetch(`${BASE_URL}/api/lists/vote/${listId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          vote,
        }),
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Vote failed!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-accent)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title:
            "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
        },
      });
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
        <div className="flex justify-between items-center py-4 w-full">
          <FaAngleLeft
            onClick={() => router.back()}
            className="text-2xl cursor-pointer"
          />
          <h4 className="text-xl">{currentList?.listTitle}</h4>
        </div>
        {listTitles.length === 0 ? (
          <ListLoader />
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 mt-6">
            <div className="md:sticky md:top-4 h-fit">
              <div className="relative rounded-xl bg-second border border-panel p-4">
                <p className="text-xs opacity-60 mb-3">Created by</p>
                <div className="flex items-center gap-3">
                  <img
                    src={creator?.picture || "/fallback.png"}
                    alt={creator?.name}
                    loading="lazy"
                    decoding="async"
                    className="w-10 h-10 object-cover rounded-full"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-base truncate">
                      {creator?.name}
                    </p>
                    <p className="text-xs opacity-60">
                      {currentList?.titles?.length || 0} titles
                    </p>
                  </div>
                </div>
                {currentList?.listDescription && (
                  <p className="mt-2 text-lg font-bold">
                    {currentList?.listDescription}
                  </p>
                )}
                {creator?.uid === user?.uid && (
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => setShowListOpt(true)}
                      className="cursor-pointer"
                    >
                      <BiDotsHorizontalRounded className="text-2xl" />
                    </button>
                  </div>
                )}
                <div className="flex flex-col items-end  mt-4 px-2 gap-2">
                  <div className="flex items-center rounded-full bg-panel py-2 px-4 gap-2">
                    {upvotes.includes(user?.uid) ? (
                      <BiSolidUpvote
                        onClick={() => handleVote(currentList.listId, "up")}
                        className={`text-base text-accent cursor-pointer transition-all duration-200 hover:scale-125 active:scale-125}`}
                      />
                    ) : (
                      <BiUpvote
                        onClick={() => handleVote(currentList.listId, "up")}
                        className={`text-base cursor-pointer transition-all duration-200 hover:scale-125 active:scale-125}`}
                      />
                    )}
                    <span className="text-xs opacity-60">
                      {upvotes.length - downvotes.length}
                    </span>
                    {downvotes.includes(user?.uid) ? (
                      <BiSolidDownvote
                        onClick={() => handleVote(currentList.listId, "down")}
                        className={`text-base text-accent cursor-pointer transition-all duration-200 hover:scale-125 active:scale-125}`}
                      />
                    ) : (
                      <BiDownvote
                        onClick={() => handleVote(currentList.listId, "down")}
                        className={`text-base cursor-pointer transition-all duration-200 hover:scale-125 active:scale-125}`}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 justify-center gap-2">
              {...listTitles.map((unit) => (
                <div className="flex items-center gap-4">
                  <TitleCard
                    key={unit.titleId}
                    unit={unit}
                    isWatched={isTitleWatched(unit.titleId)}
                    onOpen={() => handleShowNav(unit.titleId)}
                    list={true}
                  />
                  <div>
                    <p className="text-lg font-bold text-normal leading-4.5 line-clamp-2">
                      {unit.title}{" "}
                      <span className="text-base opacity-60 font-thin">
                        {new Date(
                          unit.release_date || unit.first_air_date,
                        ).toLocaleDateString([], {
                          year: "numeric",
                        })}
                      </span>
                    </p>
                    {unit.note && (
                      <div className="flex items-start">
                        <div className="flex items-center justify-center w-8 h-8 shrink-0">
                          <FaQuoteLeft className="text-[11px] opacity-60" />
                        </div>
                        <p className="text-sm text-vibe leading-tight line-clamp-2 mt-2">
                          {unit.note}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {showListOpt && (
        <ListOpt
          setShowListOpt={setShowListOpt}
          setShowEditListModal={setShowEditListModal}
          setShowDeleteListModal={setShowDeleteListModal}
        />
      )}
      {showEditListModal && (
        <EditList
          list={currentList}
          setShowEditListModal={setShowEditListModal}
        />
      )}
      {showDeleteListModal && (
        <DeleteList
          listId={listId}
          setShowDeleteListModal={setShowDeleteListModal}
        />
      )}
    </>
  );
}
