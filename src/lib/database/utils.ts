import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { ExtendedComment, ExtendedPost } from "@/types/db";
import { VoteType } from "@prisma/client";
import prisma from "./prisma";

interface GetPostRequirements {
  subscriptions: string[];
  page?: number;
  sortMode?: string;
  userId?: string;
  authorId?: string;
}

export async function getTopicSummary(topicName: string) {
  const topicSummary = await prisma.topic.findUnique({
    where: { name: topicName },
    select: {
      _count: { select: { posts: true, subscribers: true } },
      createdAt: true,
      description: true,
      name: true,
      creatorId: true,
    },
  });

  if (!topicSummary) return null;

  return {
    name: topicName,
    description: topicSummary.description,
    creatorId: topicSummary.creatorId,
    createdAt: topicSummary.createdAt,
    postCount: topicSummary._count.posts,
    subscriberCount: topicSummary._count.subscribers,
  };
}

export async function isUserSubscribed(topicName: string, userId: string) {
  return (await prisma.subscription.findUnique({
    where: { userId_topicName: { topicName, userId } },
  }))
    ? true
    : false;
}

export async function getSubscriptions(userId: string) {
  return (
    await prisma.subscription.findMany({
      where: { userId },
      select: { topicName: true },
    })
  ).map((subscription) => subscription.topicName);
}

export async function getSubscribers(topicName: string) {
  return (
    await prisma.subscription.findMany({
      where: { topicName },
      select: { userId: true },
    })
  ).map((subscription) => subscription.userId);
}

export async function getRatingFromVotesArray(votes: { type: VoteType }[]) {
  return votes.reduce(
    (acc, { type }) => (type === "UP" ? acc + 1 : acc - 1),
    0,
  );
}

export async function getUserVoteFromVotesArray(
  votes: { userId: string; type: VoteType }[],
  userId: string,
) {
  return votes.find(({ userId: _userId }) => userId === _userId)?.type || null;
}

export async function getPost(
  postId: string,
  userId?: string,
): Promise<ExtendedPost | null> {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: { select: { id: true, username: true, image: true } },
      _count: { select: { comments: true } },
    },
  });

  if (!post) return null;
  const userVote = userId ? await getUserPostVote(postId, userId) : null;

  return post
    ? {
        id: post.id,
        author: post.author,
        topicName: post.topicName,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        userVote,
        rating: post.rating,
        commentsCount: post._count.comments,
      }
    : null;
}

export async function getUserPostVote(postId: string, userId: string) {
  return (
    (
      await prisma.postVote.findUnique({
        where: { userId_postId: { postId, userId } },
      })
    )?.type ?? null
  );
}

export async function getUserPostVotes(postIds: string[], userId: string) {
  return (
    await Promise.all(
      postIds.map((postId) =>
        prisma.postVote.findUnique({
          where: { userId_postId: { userId, postId: postId } },
          select: { type: true },
        }),
      ),
    )
  ).map((vote) => vote?.type || null);
}

export async function getFeedPosts({
  subscriptions,
  page = 1,
  sortMode = "new",
  userId,
  authorId,
}: GetPostRequirements): Promise<ExtendedPost[]> {
  const ONE_DAY = 24 * 60 * 60 * 1000;
  let filter: any = {};
  if (subscriptions.length) filter.topicName = { in: subscriptions };
  if (authorId) filter.authorId = authorId;
  if (sortMode === "hot") {
    filter.createdAt = { gte: new Date(Date.now() - ONE_DAY) };
    filter.rating = { gte: 1 };
  } else if (sortMode === "top") {
    filter.rating = { gte: 0 };
  }
  const dbPosts = await prisma.post.findMany({
    // if topic is passed, return the posts from the topic,
    // else if user is logged in then returned posts from his subscribed topics
    // else return the latest posts
    where: filter,
    select: {
      id: true,
      createdAt: true,
      topicName: true,
      title: true,
      content: true,
      rating: true,
      author: { select: { id: true, username: true, image: true } },
      _count: { select: { comments: { where: { replyToId: null } } } },
    },
    orderBy: sortMode === "new" ? { createdAt: "desc" } : { rating: "desc" },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
    skip: INFINITE_SCROLLING_PAGINATION_RESULTS * (page - 1),
  });

  let userVotes: ({ type: VoteType } | null)[] = [];
  if (userId) {
    userVotes = await Promise.all(
      dbPosts.map((post) =>
        prisma.postVote.findUnique({
          where: { userId_postId: { postId: post.id, userId } },
          select: { type: true },
        }),
      ),
    );
  }

  return dbPosts.map(
    (post, index): ExtendedPost => ({
      id: post.id,
      author: post.author,
      topicName: post.topicName,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      userVote: userVotes?.[index]?.type || null,
      rating: post.rating,
      commentsCount: post._count.comments,
    }),
  );
}

export async function getComments(
  postId: string,
  userId: string | null,
  replyToId: string | null,
  skip?: number,
): Promise<ExtendedComment[]> {
  const comments = await prisma.comment.findMany({
    where: { postId, replyToId },
    select: {
      id: true,
      createdAt: true,
      text: true,
      replyToId: true,
      rating: true,
      author: { select: { id: true, username: true, image: true } },
      _count: { select: { replies: true } },
    },
    orderBy: [{ commentVotes: { _count: "desc" } }, { createdAt: "asc" }],
    take: 5,
    skip: skip || 0,
  });

  let userVotes: (VoteType | null)[];
  if (userId) {
    userVotes = (
      await Promise.all(
        comments.map((comment) =>
          prisma.commentVote.findUnique({
            where: { userId_commentId: { commentId: comment.id, userId } },
            select: { type: true },
          }),
        ),
      )
    ).map((vote) => vote?.type || null);
  }

  return comments.map((comment, index) => {
    return {
      id: comment.id,
      createdAt: comment.createdAt,
      author: comment.author,
      postId,
      text: comment.text,
      replyToId: comment.replyToId,
      userVote: userVotes[index],
      rating: comment.rating,
      repliesCount: comment._count.replies,
    };
  });
}

export async function getUserSummary(userId: string) {
  const data = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      usernameHasBeenChanged: true,
      _count: {
        select: { posts: true, followedBy: true },
      },
    },
  });

  if (!data) return null;
  return {
    id: data.id,
    name: data.name!,
    username: data.username!,
    usernameHasBeenChanged: data.usernameHasBeenChanged,
    bio: data.bio,
    postsCreated: data._count.posts,
    followedBy: data._count.followedBy,
  };
}

export async function getUserProfile(authorName: string, userId?: string) {
  const isFollowing = userId
    ? (await prisma.follow.findUnique({
        where: {
          followedById_follwingToId: {
            followedById: userId,
            follwingToId: authorName,
          },
        },
      }))
      ? true
      : false
    : false;

  const data = await prisma.user.findUnique({
    where: { username: authorName },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      email: true,
      image: true,
      _count: {
        select: { followedBy: true, posts: true },
      },
      posts: {
        orderBy: { createdAt: "desc" },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
        select: {
          id: true,
          createdAt: true,
          title: true,
          content: true,
          rating: true,
          topicName: true,
          _count: { select: { comments: { where: { replyToId: null } } } },
        },
      },
    },
  });

  if (!data) return null;
  const author = { id: data.id, image: data.image, username: data.username };
  const userVotes = userId
    ? await getUserPostVotes(
        data.posts.map((post) => post.id),
        userId,
      )
    : new Array(data.posts.length).fill(null);

  return {
    id: data.id,
    name: data.name,
    username: data.username,
    bio: data.bio,
    email: data.email,
    image: data.image,
    counts: data._count,
    isFollowing,
    posts: data.posts.map(
      (post, index): ExtendedPost => ({
        id: post.id,
        topicName: post.topicName,
        createdAt: post.createdAt,
        author,
        title: post.title,
        content: post.content,
        rating: post.rating,
        commentsCount: post._count.comments,
        userVote: userVotes[index],
      }),
    ),
  };
}
