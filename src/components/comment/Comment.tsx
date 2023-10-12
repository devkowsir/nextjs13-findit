"use client";

import { Icons } from "@/components/Icons";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import CommentVoteClient from "@/components/vote/CommentVoteClient";
import { toast } from "@/hooks/useToast";
import { formatTimeToNow } from "@/lib/utils";
import { ExtendedComment } from "@/types/db";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import CommentForm from "./CommentForm";

interface CommentProps {
  postId: string;
  comments: ExtendedComment[];
  comment: ExtendedComment;
  replyDepth: number;
  replyingTo: string;
  setReplyingTo: Dispatch<SetStateAction<string>>;
}

const Comment: React.FC<CommentProps> = ({
  postId,
  comments,
  comment,
  replyDepth: depth,
  replyingTo,
  setReplyingTo,
}) => {
  const queryClient = useQueryClient();
  const replies = comments.filter(
    (_comment) => _comment.replyToId === comment.id,
  );

  return (
    <>
      <div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative aspect-square w-6 md:w-8">
              <UserAvatar user={comment.author} />
            </div>
            <span className="text-sm text-slate-900">
              u/{comment.author.username}
            </span>
            <span className="text-sm text-slate-500">
              {formatTimeToNow(new Date(comment.createdAt))}
            </span>
          </div>
          <p className="text-slate-800">{comment.text}</p>
          <div className="flex items-center gap-4">
            <CommentVoteClient
              postId={postId}
              commentId={comment.id}
              initialUserVote={comment.userVote}
              initialVotesAmount={comment.rating}
              mutationUrl="/api/comment-vote"
            />
            {depth < 3 && (
              <Button
                variant="secondary"
                size={"xs"}
                className="flex items-center gap-2 bg-slate-50 text-slate-900"
                onClick={() => setReplyingTo(comment.id)}
              >
                <Icons.commentReply size={18} />
                <span>Reply</span>
              </Button>
            )}
          </div>
        </div>
        {depth < 3 && replyingTo === comment.id && (
          <CommentForm
            setReplyingTo={setReplyingTo}
            replyToName={comment.author.username!}
            replyToId={comment.id}
            postId={postId}
          />
        )}
      </div>
      {replies.length > 0 && depth < 4 && (
        <ul className="border-l-2 px-4">
          {replies.map((reply) => (
            <li key={reply.id}>
              <Comment
                postId={postId}
                comments={comments}
                comment={reply}
                replyDepth={depth + 1}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
              />
            </li>
          ))}
        </ul>
      )}
      {comment.repliesCount - replies.length > 0 && (
        <div
          onClick={async () => {
            try {
              const { data } = (await axios.get(
                `/api/comments?postId=${postId}&replyToId=${comment.id}${
                  replies.length > 0 ? `&skip=${replies.length}` : ""
                }`,
              )) as { data: ExtendedComment[] };
              queryClient.setQueryData(["comments", postId], data);
            } catch (err) {
              return toast({
                title: "Something went wrong",
                variant: "destructive",
              });
            }
          }}
          className="cursor-pointer"
        >
          {replies.length > 0 ? "View more replies." : "View replies."}
        </div>
      )}
    </>
  );
};

export default Comment;
