"use client";

import { ExtendedComment } from "@/types/db";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import Comment from "./Comment";

interface CommentsWrapperProps {
  initialComments: ExtendedComment[];
  userId: string | null;
  postId: string;
}

const CommentsWrapper: React.FC<CommentsWrapperProps> = ({
  initialComments,
  userId,
  postId,
}) => {
  const [replyingTo, setReplyingTo] = useState("");
  const { data: comments } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async ({ queryKey: [_, postId] }) => {
      const { data: comments } = await axios.get(
        `/api/comments?postId=${postId}`,
      );
      return comments as ExtendedComment[];
    },
    initialData: initialComments,
  });

  return (
    <ul className="mt-8 space-y-6">
      {comments.map((comment) => {
        const userVote =
          comment.votes.find((vote) => vote.userId === userId)?.type || null;
        const votesAmount = comment.votes.reduce(
          (acc, { type }) => (type === "UP" ? acc + 1 : acc - 1),
          0,
        );
        return (
          <li key={comment.id}>
            <Comment
              author={comment.author}
              commentId={comment.id}
              mainCommentId={comment.id}
              createdAt={comment.createdAt}
              setReplyingTo={setReplyingTo}
              text={comment.text}
              userVote={userVote}
              votesAmount={votesAmount}
              replyingTo={replyingTo}
              postId={comment.postId}
            />
            {comment.replies.length > 0 && (
              <ul className="space-y-4 border-l-2 pl-4 pt-4">
                {comment.replies.map((reply) => {
                  const _userVote =
                    reply.votes.find((vote) => vote.userId === userId)?.type ||
                    null;
                  const _votesAmount = reply.votes.reduce(
                    (acc, { type }) => (type === "UP" ? acc + 1 : acc - 1),
                    0,
                  );
                  return (
                    <li key={reply.id}>
                      <Comment
                        author={reply.author}
                        commentId={reply.id}
                        mainCommentId={comment.id}
                        createdAt={reply.createdAt}
                        setReplyingTo={setReplyingTo}
                        text={reply.text}
                        userVote={_userVote}
                        votesAmount={_votesAmount}
                        replyingTo={replyingTo}
                        postId={reply.postId}
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default CommentsWrapper;
