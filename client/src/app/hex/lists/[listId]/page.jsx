"use client";
import { useContext, useEffect, useState } from "react";
import { TitleContext } from "@/context/titleContext";
import {
  FaAngleLeft,
  FaComment,
  FaQuoteLeft,
  FaRegComment,
} from "react-icons/fa";
import { LoaderContext } from "@/context/loaderContext";
import { useParams, useRouter } from "next/navigation";
import { TitleNavContext } from "@/context/titleNavContext";
import ShowListLoader from "@/components/loaders/showListLoader";
import { WatchContext } from "@/context/watchContext";
import { UserContext } from "@/context/userContext";
import TitleCard from "@/components/layout/title/titleCard";
import ListLoader from "@/components/loaders/listLoader";
import SecondaryButtons from "@/components/buttons/secBtns";
import ListDelConfirm from "@/components/modals/confirmListDeleteModal";
import EditListModal from "@/components/modals/editListModal";
import ConfirmListDeleteModal from "@/components/modals/confirmListDeleteModal";
import { ListContext } from "@/context/listContext";
import {
  BiDotsHorizontalRounded,
  BiDownvote,
  BiSolidDownvote,
  BiSolidUpvote,
  BiUpvote,
} from "react-icons/bi";
import { SocketContext } from "@/context/socketContext";
import Swal from "sweetalert2";
import AddCommentModal from "@/components/modals/addCommentModal";
import ListOptions from "@/components/options/listOptions";
import CommentLayout from "@/components/layout/list/commentLayout";

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
  const [showConfirmListDeleteModal, setShowConfirmListDeleteModal] =
    useState(false);
  const { user, allUsers, setShowSignInModal } = useContext(UserContext);
  const { titles } = useContext(TitleContext);
  const { setIsLoading } = useContext(LoaderContext);
  const { handleShowNav } = useContext(TitleNavContext);
  const { isTitleWatched } = useContext(WatchContext);
  const [showListOption, setShowListOption] = useState(false);
  const [showAddCommentModal, setShowAddCommentModal] = useState(false);
  const [showTitles, setShowTitles] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const currentList = lists.find((list) => list.listId === listId);

  const realtimeVote = listVotes[currentList?.listId];

  const upvotes = realtimeVote?.upvotes ?? currentList?.upvotes ?? [];
  const downvotes = realtimeVote?.downvotes ?? currentList?.downvotes ?? [];

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
    if (!user?.uid) {
      setShowSignInModal();
    }

    try {
      await fetch(`${BASE_URL}/api/reacts/listVote/${listId}`, {
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
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border !border-(--color-panel) !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title: "!text-base !font-semibold !text-(--color-text) !leading-4.5",
        },
      });
    }
  };

  const firstComment = currentList?.comments?.sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  )[0];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowTitles(true);
        setShowComments(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      <div
        onClick={() => setShowListOption(false)}
        className="flex flex-col justify-center items-center p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32"
      >
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
          <div className="relative w-full grid grid-cols-1 md:grid-cols-[300px_1fr] items-start gap-6 mt-6">
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowListOption((prev) => !prev);
                      }}
                      className="cursor-pointer"
                    >
                      <BiDotsHorizontalRounded className="text-2xl" />
                    </button>
                    {showListOption && (
                      <ListOptions
                        setShowListOption={setShowListOption}
                        setShowEditListModal={setShowEditListModal}
                        setShowConfirmListDeleteModal={
                          setShowConfirmListDeleteModal
                        }
                      />
                    )}
                  </div>
                )}
                <div className="flex justify-end mt-4 px-2 gap-2">
                  <div className="flex items-center rounded-full bg-panel cursor-pointer hover:bg-(--color-panel)/60 transition-all duration-100 py-2 px-4 gap-2">
                    {upvotes.includes(user?.uid) ? (
                      <BiSolidUpvote
                        onClick={() => handleVote(currentList.listId, "up")}
                        className="text-base text-accent cursor-pointer transition-all duration-200 hover:scale-125 active:scale-125"
                      />
                    ) : (
                      <BiUpvote
                        onClick={() => handleVote(currentList.listId, "up")}
                        className="text-base cursor-pointer transition-all duration-200 hover:scale-125 active:scale-125"
                      />
                    )}
                    <span className="text-xs opacity-60">
                      {upvotes.length - downvotes.length}
                    </span>
                    {downvotes.includes(user?.uid) ? (
                      <BiSolidDownvote
                        onClick={() => handleVote(currentList.listId, "down")}
                        className="text-base text-accent cursor-pointer transition-all duration-200 hover:scale-125 active:scale-125"
                      />
                    ) : (
                      <BiDownvote
                        onClick={() => handleVote(currentList.listId, "down")}
                        className="text-base cursor-pointer transition-all duration-200 hover:scale-125 active:scale-125"
                      />
                    )}
                  </div>
                  <div
                    onClick={() => {
                      user
                        ? setShowAddCommentModal(true)
                        : setShowSignInModal(true);
                    }}
                    className="flex items-center cursor-pointer rounded-full bg-panel hover:bg-(--color-panel)/60 transition-all duration-100 py-2 px-4 gap-2"
                  >
                    <FaComment className="text-base" />
                    <span className="text-xs opacity-60">
                      {currentList?.comments?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full mt-2 hidden md:block">
                {!currentList.comments || currentList.comments?.length === 0 ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="flex items-center gap-2">
                      <FaRegComment className="text-2xl" />
                      <p className="text-base text-normal">
                        Be the first to comment
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 w-full">
                    {currentList?.comments?.map((comment) => (
                      <CommentLayout
                        key={comment.commentId}
                        comment={comment}
                        firstComment={firstComment}
                        listId={listId}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center gap-8 px-8 py-2 w-full md:hidden">
              <button
                onClick={() => {
                  setShowTitles(true);
                  setShowComments(false);
                }}
                className="cursor-pointer flex flex-1"
              >
                <p
                  className={`text-lg w-full text-center hover:font-bold hover:text-(--color-accent) ${
                    showTitles
                      ? "font-bold text-accent border-b-2 border-accent"
                      : "text-normal"
                  }`}
                >
                  Titles
                </p>
              </button>
              <button
                onClick={() => {
                  setShowTitles(false);
                  setShowComments(true);
                }}
                className="cursor-pointer flex flex-1"
              >
                <p
                  className={`text-lg w-full text-center hover:font-bold hover:text-(--color-accent) ${
                    showComments
                      ? "font-bold text-accent border-b-2 border-accent"
                      : "text-normal"
                  }`}
                >
                  Comments
                </p>
              </button>
            </div>
            {showTitles && (
              <div className="grid grid-cols-1 lg:grid-cols-2 justify-center gap-2">
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
                          <p className="text-sm text-vibe leading-tight mt-2">
                            {unit.note}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {showComments && (
              <div className="w-full">
                {currentList.comments?.length === 0 ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="flex items-center gap-2">
                      <FaRegComment className="text-2xl" />
                      <p className="text-base text-normal">
                        Be the first to comment
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 w-full">
                    {currentList?.comments?.map((comment) => (
                      <CommentLayout
                        key={comment.commentId}
                        comment={comment}
                        firstComment={firstComment}
                        listId={listId}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {showEditListModal && (
        <EditListModal
          list={currentList}
          setShowEditListModal={setShowEditListModal}
        />
      )}
      {showConfirmListDeleteModal && (
        <ConfirmListDeleteModal
          listToDelete={listId}
          setShowConfirmListDeleteModal={setShowConfirmListDeleteModal}
        />
      )}
      {showAddCommentModal && (
        <AddCommentModal
          listId={listId}
          user={user}
          setShowAddCommentModal={setShowAddCommentModal}
        />
      )}
    </>
  );
}
