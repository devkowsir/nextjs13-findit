"use client";

import { VoteType } from "@prisma/client";
import VoteUi from "./VoteUi";
import useVoteClient from "./useVoteClient";
import { setInfinitePostsCache } from "@/lib/queryCacheUpdaters/infinitePostCacheUpdate";

interface PostVoteClientProps {
  postId: string;
  initialUserVote: VoteType | null;
  initialVotesAmount: number;
  mutationUrl: string;
  className?: string;
}

const PostVoteClient: React.FC<PostVoteClientProps> = ({
  postId,
  initialUserVote,
  initialVotesAmount,
  mutationUrl,
  className,
}) => {
  const { updateVote, userVote, votesAmount } = useVoteClient({
    postIdOrCommentId: postId,
    initialUserVote,
    initialVotesAmount,
    mutationUrl,
    cacheUpdater: (data, queryClient) => {
      setInfinitePostsCache(postId, data, queryClient);
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

export default PostVoteClient;
