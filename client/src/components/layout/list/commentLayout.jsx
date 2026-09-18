"use client";
import ConfirmListCommentDelete from "@/components/modals/confirmListCommentDelete";
import { LoaderContext } from "@/context/loaderContext";
import { UserContext } from "@/context/userContext";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { Bs1CircleFill } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";

export default function CommentLayout({ comment, firstComment, listId }) {
  const { allUsers, user } = useContext(UserContext);
  const { setIsLoading } = useContext(LoaderContext);
  const [showConfirmListCommentDelete, setShowConfirmListCommentDelete] = useState(false);
  const router = useRouter();

  const commentor = allUsers.find((u) => u.uid === comment.userId);

  return (
    <>
      <div className="flex gap-2 relative">
        <img
          onClick={() => {
            router.push(`/profile/${commentor.uid}`);
            setIsLoading(true);
          }}
          src={commentor?.picture}
          alt={commentor.name}
          loading="lazy"
          decoding="async"
          className="w-12 h-12 object-cover rounded-full cursor-pointer"
        />
        {comment.date === firstComment.date ? (
          <div className="flex absolute top-0 left-8">
            <Bs1CircleFill className="text-xl text-zeus" />
          </div>
        ) : null}
        <div className="flex flex-col w-full">
          <div className="bg-second w-full py-2 px-4 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl">
            <div className="flex justify-between items-start gap-4">
              <div className="flex flex-col">
                <p
                  onClick={() => {
                    router.push(`/profile/${comment.userId}`);
                    setIsLoading(true);
                  }}
                  className="text-base text-normal font-bold cursor-pointer"
                >
                  {commentor.name}
                </p>
                <p className="text-xs text-vibe">
                  {dayjs(comment.date).fromNow()}
                </p>
              </div>
              {user?.uid === commentor.uid && (
                <div
                  onClick={() => setShowConfirmListCommentDelete(true)}
                  className="top-2 right-2"
                >
                  <FaTrash className="text-xs cursor-pointer" />
                </div>
              )}
            </div>
            {comment.textComment && (
              <p
                className="text-base text-normal py-2 max-w-full whitespace-pre-wrap"
                style={{ overflowWrap: "anywhere" }}
              >
                {comment.textComment}
              </p>
            )}
          </div>
        </div>
      </div>
      {showConfirmListCommentDelete && (
        <ConfirmListCommentDelete
          setShowConfirmListCommentDelete={setShowConfirmListCommentDelete}
          comment={comment}
          listId={listId}
        />
      )}
    </>
  );
}
