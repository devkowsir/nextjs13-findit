"use client";

import { Icons } from "@/components/Icons";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import CommentVoteClient from "@/components/vote/CommentVoteClient";
import { toast } from "@/hooks/useToast";
import { formatTimeToNow } from "@/lib/utils";
import { ExtendedComment } from "@/types/db";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction } from "react";
import CommentActions from "./CommentActions";
import CommentForm from "./CommentForm";
import { useComment } from "./CommentStore";

interface CommentProps {
  postId: string;
  comment: ExtendedComment;
  replyDepth: number;
  replyingTo: string;
  setReplyingTo: Dispatch<SetStateAction<string>>;
}

const Comment: React.FC<CommentProps> = ({
  postId,
  comment,
  replyDepth: depth,
  replyingTo,
  setReplyingTo,
}) => {
  const { data: session } = useSession();
  const { comments, addFetchedComments } = useComment();
  const replies = comments.filter(
    (_comment) => _comment.replyToId === comment.id,
  );

  const fetchReplies = async (replyToId: string, skip: number) => {
    try {
      const { data } = (await axios.get(
        `/api/comments?postId=${postId}&replyToId=${replyToId}&skip=${skip}`,
      )) as { data: ExtendedComment[] };
      addFetchedComments(data);
    } catch (err) {
      return toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const mainComment = (
    <div>
      <div className="mb-2 space-y-2">
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
            initialRating={comment.rating}
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
          {comment.author.id === session?.user.id && (
            <CommentActions commentId={comment.id} text={comment.text} />
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
  );

  const replyComments = (
    <ul className="border-l-2 pl-4">
      {replies.map((reply) => (
        <li key={reply.id}>
          <Comment
            postId={postId}
            comment={reply}
            replyDepth={depth + 1}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
          />
        </li>
      ))}
    </ul>
  );

  const replyFetchButton = (
    <div
      onClick={() => fetchReplies(comment.id, replies.length)}
      className="cursor-pointer text-sm underline underline-offset-4"
    >
      {replies.length > 0 ? "View more replies" : "View replies"}
    </div>
  );

  return (
    <>
      {mainComment}
      {replies.length > 0 && depth < 4 && replyComments}
      {comment.repliesCount - replies.length > 0 && replyFetchButton}
    </>
  );
};

export default Comment;
