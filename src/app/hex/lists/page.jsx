"use client";
import SecondaryButtons from "@/components/buttons/secBtns";
import ListsLoader from "@/components/loaders/listsLoader";
import AddList from "@/components/modals/addList";
import { ListContext } from "@/context/listContext";
import { LoaderContext } from "@/context/loaderContext";
import { SocketContext } from "@/context/socketContext";
import { TitleContext } from "@/context/titleContext";
import { TitleNavContext } from "@/context/titleNavContext";
import { UserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { BiSolidUpvote } from "react-icons/bi";
import { FaAngleLeft, FaBoxOpen, FaList } from "react-icons/fa";

export default function Lists() {
  const [showAddListModal, setShowAddListModal] = useState(false);
  const { listVotes } = useContext(SocketContext);
  const { setIsLoading } = useContext(LoaderContext);
  const { user, allUsers } = useContext(UserContext);
  const { lists, listLoad } = useContext(ListContext);
  const { titles } = useContext(TitleContext);
  const { handleShowListNav } = useContext(TitleNavContext);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  });

  return (
    <>
      <div className="p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
        <div className="flex justify-between py-4">
          <FaAngleLeft
            onClick={() => router.back()}
            className="text-2xl cursor-pointer"
          />
          <h4 className="text-xl">Lists</h4>
        </div>
        <div className="w-full flex justify-end">
          <div className="w-fit">
            <SecondaryButtons onClick={() => setShowAddListModal(true)}>
              <p className="font-bold text-normal text-base">Create List</p>
            </SecondaryButtons>
          </div>
        </div>

        {listLoad ? (
          <ListsLoader />
        ) : lists.length === 0 ? (
          <div className="flex flex-col w-full min-h-[50vh] justify-center items-center">
            <FaList className="text-6xl text-panel" />
            <p className="text-sm text-panel font-normal">
              Create the first list to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
            {lists.map((list) => {
              const listTitles = [...(list.titles || [])]
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((item) =>
                  titles.find(
                    (title) => String(title.titleId) === String(item.titleId),
                  ),
                )
                .filter(Boolean);

              const visibleTitles = listTitles.slice(0, 5);
              const remaining = listTitles.length - visibleTitles.length;

              const creator = allUsers.find((u) => u.uid === list.userId);

              const realtimeVote = listVotes[list.listId];

              const upvotes = realtimeVote?.upvotes ?? list?.upvotes ?? [];
              const downvotes =
                realtimeVote?.downvotes ?? list?.downvotes ?? [];

              return (
                <div
                  key={list.listId || list._id}
                  onClick={() => handleShowListNav(`lists/${list.listId}`)}
                  className="group relative rounded-xl bg-second border border-panel hover:border-[var(--color-secondary)] hover:bg-[var(--color-panel)] tracking-all duration-200 cursor-pointer"
                >
                  <div className="relative h-60 md:h-70 p-4">
                    <div className="relative flex h-full items-start justify-center">
                      {visibleTitles.map((title, index) => (
                        <div
                          key={title.titleId}
                          className="absolute w-26 h-40 md:w-32 md:h-46 flex-shrink-0 transition-transform duration-200 group-hover:-translate-y-1"
                          style={{
                            transform: `translateX(${(index - (visibleTitles.length - 1) / 2) * 40}px) rotate(${(index - (visibleTitles.length - 1) / 2) * 4}deg)`,
                            zIndex: index,
                          }}
                        >
                          <img
                            src={
                              title.poster
                                ? `https://image.tmdb.org/t/p/w500${title.poster}`
                                : "/fallback.png"
                            }
                            alt={title.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover rounded-lg shadow-lg"
                          />
                        </div>
                      ))}
                      {remaining > 0 && (
                        <div className="absolute bottom-20 right-4 z-20 px-3 py-1 rounded-full text-xs bg-panel border border-[var(--color-secondary)]">
                          +{remaining} more
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-2 left-2 z-20">
                      <div className="flex flex-col">
                        <p className="text-sm font-bold">{list.listTitle}</p>
                        <div className="flex gap-4">
                          <div className="flex items-center gap-1">
                            <img
                              src={
                                creator
                                  ? `${creator?.picture}`
                                  : "/fallback.png"
                              }
                              alt={creator?.name}
                              loading="lazy"
                              decoding="async"
                              className="w-4 h-4 object-cover rounded-lg shadow-lg"
                            />
                            <p className="text-xs">
                              <span className="opacity-60">Created by </span>
                              <span className="font-semibold opacity-100 text-vibe">
                                {creator?.name}
                              </span>
                            </p>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <BiSolidUpvote className="text-xs opacity-60" />
                            <p className="text-xs opacity-60 leading-none">
                              {upvotes.length - downvotes.length}{" "}
                              <span>
                                {upvotes.length - downvotes.length === 1
                                  ? "upvote"
                                  : "upvotes"}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAddListModal && (
        <AddList user={user} setShowAddListModal={setShowAddListModal} />
      )}
    </>
  );
}
