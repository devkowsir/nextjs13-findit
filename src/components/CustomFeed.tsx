import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { VoteType } from "@prisma/client";
import PostFeed from "./PostFeed";

const CustomFeed = async () => {
  const session = await getAuthSession();
  const userId = session?.user.id;
  const subscriptions = await prisma.subscription.findMany({
    where: { userId: userId },
  });
  const dbPosts = await prisma.post.findMany({
    // if topic is passed, return the posts from the topic,
    // else if user is logged in then returned posts from his subscribed topics
    // else return the latest posts
    where: subscriptions.length
      ? { topicId: { in: subscriptions.map(({ topicName }) => topicName) } }
      : {},
    include: {
      author: true,
      topic: true,
      votes: { select: { type: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: "desc" },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
  });

  let userVotes: ({ type: VoteType } | null)[] = [];
  if (userId) {
    userVotes = await Promise.all(
      dbPosts.map((post) =>
        prisma.vote.findUnique({
          where: {
            userId_postId: { postId: post.id, userId: userId },
          },
          select: { type: true },
        }),
      ),
    );
  }

  const posts = dbPosts.map((post, index) => {
    const votes = post.votes;
    const votesAmount = votes.reduce(
      (acc, { type }) => (type === "UP" ? acc + 1 : acc - 1),
      0,
    );

    return {
      id: post.id,
      author: post.author,
      topic: post.topic,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      userVote: userVotes?.[index]?.type || null,
      votesAmount,
      commentsCount: post._count.comments,
    };
  });

  return <PostFeed initialPosts={posts} />;
};

export default CustomFeed;
