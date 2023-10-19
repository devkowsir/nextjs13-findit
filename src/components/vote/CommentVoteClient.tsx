"use client";

import { setCommentsCache } from "@/lib/queryCacheUpdaters/commentCacheUpdater";
import { VoteType } from "@prisma/client";
import VoteUi from "./VoteUi";
import useVoteClient from "./useVoteClient";
import { useComment } from "../comment/CommentStore";

interface CommentVoteClientProps {
  commentId: string;
  postId: string;
  initialUserVote: VoteType | null;
  initialRating: number;
  mutationUrl: string;
  className?: string;
}

const CommentVoteClient: React.FC<CommentVoteClientProps> = ({
  commentId,
  postId,
  initialUserVote,
  initialRating,
  mutationUrl,
  className,
}) => {
  const { updateComment } = useComment();
  const { updateVote, userVote, rating, isLoading } = useVoteClient({
    postIdOrCommentId: commentId,
    initialUserVote,
    initialRating,
    mutationUrl,
    cacheUpdater(data, queryClient) {
      setCommentsCache(postId, commentId, data, queryClient);
      updateComment(commentId, data);
    },
  });

  return (
    <VoteUi
      updateVote={updateVote}
      userVote={userVote}
      rating={rating}
      isLoading={isLoading}
      className={className}
    />
  );
};

export default CommentVoteClient;
