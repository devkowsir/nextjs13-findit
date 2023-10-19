"use client";

import { setInfinitePostsCache } from "@/lib/queryCacheUpdaters/infinitePostCacheUpdate";
import { ExtendedPost } from "@/types/db";
import { VoteType } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import VoteUi from "./VoteUi";
import useVoteClient from "./useVoteClient";

interface PostVoteClientProps {
  postId: string;
  initialUserVote: VoteType | null;
  initialRating: number;
  mutationUrl: string;
  setPost?: Dispatch<SetStateAction<ExtendedPost>>;
  className?: string;
}

const PostVoteClient: React.FC<PostVoteClientProps> = ({
  postId,
  initialUserVote,
  initialRating,
  mutationUrl,
  setPost,
  className,
}) => {
  const { updateVote, userVote, rating, isLoading } = useVoteClient({
    postIdOrCommentId: postId,
    initialUserVote,
    initialRating,
    mutationUrl,
    cacheUpdater(data, queryClient) {
      setInfinitePostsCache(postId, data, queryClient);
      setPost && setPost((old) => ({ ...old, ...data }));
    },
  });

  return (
    <VoteUi
      updateVote={updateVote}
      userVote={userVote}
      rating={rating}
      className={className}
      isLoading={isLoading}
    />
  );
};

export default PostVoteClient;
