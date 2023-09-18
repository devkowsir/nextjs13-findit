import { Comment, CommentVote, Post, Topic, VoteType } from "@prisma/client";

type _Post = Pick<Post, "id" | "title" | "content" | "createdAt" | "updatedAt">;

export type ExtendedPost = _Post & {
  topic: Topic;
  author: User;
  userVote: VoteType | null;
  votesAmount: number;
  commentsCount: number;
};

export type ExtendedComment = Comment & {
  author: User;
  votes: CommentVote[];
  replies: (Comment & { author: User; votes: CommentVote[] })[];
};

export type VoteResponse = { voterId: string; voteType: VoteType | null };
