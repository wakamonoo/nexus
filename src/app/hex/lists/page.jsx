"use client";
import SecondaryButtons from "@/components/buttons/secBtns";
import ListsLoader from "@/components/loaders/listsLoader";
import AddListModal from "@/components/modals/addListModal";
import { ListContext } from "@/context/listContext";
import { LoaderContext } from "@/context/loaderContext";
import { SocketContext } from "@/context/socketContext";
import { TitleContext } from "@/context/titleContext";
import { TitleNavContext } from "@/context/titleNavContext";
import { UserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { BiSolidUpvote } from "react-icons/bi";
import { FaAngleLeft, FaBoxOpen, FaComment, FaList } from "react-icons/fa";

export default function Lists() {
  const [showAddListModal, setShowAddListModal] = useState(false);
  const { listVotes } = useContext(SocketContext);
  const { setIsLoading } = useContext(LoaderContext);
  const { user, allUsers, setShowSignInModal } = useContext(UserContext);
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
        <div className="w-full flex flex-col items-center justify-center">
          <h1 className="text-xl font-bold tracking-tight">
            Give titles a place
          </h1>
          <p className="max-w-xl text-sm text-vibe text-center">
            Some titles share a story, theme, character, or idea. Put them in a
            list and share what connects them.
          </p>

          <div className="w-fit mt-2">
            <SecondaryButtons
              onClick={() => {
                user ? setShowAddListModal(true) : setShowSignInModal(true);
              }}
            >
              <p className="font-bold text-normal text-base">
                Curate Your List
              </p>
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
                  className="group relative rounded-xl bg-gradient-to-b from-[var(--color-panel)] to-[var(--color-secondary)] border border-panel hover:border-[var(--color-secondary)] focus:border-[var(--color-secondary)] transition-all duration-200 cursor-pointer"
                >
                  <div className="p-4">
                    <div className="relative h-42 md:h-50">
                      <div className="relative flex h-full items-start justify-center">
                        {visibleTitles.map((title, index) => (
                          <div
                            key={title.titleId}
                            className="absolute w-26 h-40 md:w-32 md:h-46 flex-shrink-0 transition-transform duration-200 group-hover:-translate-y-1"
                            style={{
                              transform: `translateX(${(index - (visibleTitles.length - 1) / 2) * 40}px) rotate(${(index - (visibleTitles.length - 1) / 2) * 2}deg)`,
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
                          <div className="absolute bottom-20 right-4 z-20 px-3 py-1 rounded-full text-xs bg-panel border border-[var(--color-secondary)] transition-all duration-200 group-hover:-translate-y-1">
                            +{remaining} more
                          </div>
                        )}
                      </div>{" "}
                    </div>
                    <div className="mt-2 w-full border-t border-panel">
                      <div className="flex flex-col mt-2">
                        <p className="text-base font-bold">{list.listTitle}</p>
                        <div className="flex gap-4 mt-1">
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
                            <p className="text-xs font-semibold opacity-100 text-vibe">
                              {creator?.name}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <BiSolidUpvote className="text-xs opacity-60" />
                            <p className="text-xs opacity-60 leading-none">
                              {upvotes.length - downvotes.length}{" "}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaComment className="text-xs opacity-60" />
                            <p className="text-xs opacity-60 leading-none">
                              {list.comments?.length || 0}{" "}
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
        <AddListModal user={user} setShowAddListModal={setShowAddListModal} />
      )}
    </>
  );
}
