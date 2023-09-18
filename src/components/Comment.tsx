"use client";

import { formatTimeToNow } from "@/lib/utils";
import { User, VoteType } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import { Icons } from "./Icons";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/button";
import VoteClient from "./vote/VoteClient";
import CommentForm from "./CommentForm";

interface CommentProps {
  author: User;
  postId: string;
  createdAt: Date;
  text: string;
  commentId: string;
  mainCommentId: string;
  userVote: VoteType | null;
  votesAmount: number;
  replyingTo: string;
  setReplyingTo: Dispatch<SetStateAction<string>>;
}

const Comment: React.FC<CommentProps> = ({
  author,
  postId,
  createdAt,
  text,
  commentId,
  mainCommentId,
  userVote,
  votesAmount,
  replyingTo,
  setReplyingTo,
}) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <div className="relative aspect-square w-6 md:w-8">
          <UserAvatar user={author} />
        </div>
        <span className="text-sm text-slate-900">u/{author.username}</span>
        <span className="text-sm text-slate-500">
          {formatTimeToNow(new Date(createdAt))}
        </span>
      </div>

      <p className="py-2 text-slate-800">{text}</p>
      <div className="flex items-center gap-2">
        <VoteClient
          id={commentId}
          initialUserVote={userVote}
          initialVoteAmount={votesAmount}
          mutationUrl="/api/comment-vote"
        />
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-slate-900"
          onClick={() => setReplyingTo(commentId)}
        >
          <Icons.commentReply size={18} />
          <span>Reply</span>
        </Button>
      </div>
      {replyingTo === commentId && (
        <CommentForm
          setReplyingTo={setReplyingTo}
          replyToName={author.username}
          replyToId={mainCommentId}
          postId={postId}
        />
      )}
    </>
  );
};

export default Comment;
