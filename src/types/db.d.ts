import { Comment, CommentVote, Post, User, VoteType } from "@prisma/client";

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

// prettier-ignore
type _Post = Pick<Post, "id" | "title" | "content" | "createdAt" | "rating">;
// prettier-ignore
type _Comment = Pick<Comment, "id" | "text" | "createdAt" | "replyToId"  | "rating">;
type _CommentVote = Pick<CommentVote, "type" | "userId">;
type _User = Pick<User, "id" | "username" | "image">;

export type ExtendedPost = Prettify<
  _Post & {
    topicName: string;
    author: _User;
    userVote: VoteType | null;
    commentsCount: number;
  }
>;

export type ExtendedComment = Prettify<
  _Comment & {
    author: _User;
    userVote: VoteType | null;
    repliesCount: number;
  }
>;

export type VoteResponse = { voterId: string; voteType: VoteType | null };
