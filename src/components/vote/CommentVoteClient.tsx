"use client";

import { VoteType } from "@prisma/client";
import VoteUi from "./VoteUi";
import useVoteClient from "./useVoteClient";
import { setCommentsCache } from "@/lib/queryCacheUpdaters/commentCacheUpdater";
import { usePathname } from "next/navigation";

interface CommentVoteClientProps {
  commentId: string;
  postId: string;
  initialUserVote: VoteType | null;
  initialVotesAmount: number;
  mutationUrl: string;
  className?: string;
}

const CommentVoteClient: React.FC<CommentVoteClientProps> = ({
  commentId,
  postId,
  initialUserVote,
  initialVotesAmount,
  mutationUrl,
  className,
}) => {
  const { updateVote, userVote, votesAmount } = useVoteClient({
    postIdOrCommentId: commentId,
    initialUserVote,
    initialVotesAmount,
    mutationUrl,
    cacheUpdater(data, queryClient) {
      setCommentsCache(postId, commentId, data, queryClient);
    },
  });

  return (
    <VoteUi
      updateVote={updateVote}
      userVote={userVote}
      votesAmount={votesAmount}
      className={className}
    />
  );
};

export default CommentVoteClient;
