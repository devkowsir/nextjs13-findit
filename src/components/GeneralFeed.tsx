import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import prisma from "@/lib/prisma";
import PostFeed from "./PostFeed";

const GeneralFeed = async () => {
  const dbPosts = await prisma.post.findMany({
    include: {
      author: true,
      topic: true,
      votes: { select: { type: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: "desc" },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
  });

  const posts = dbPosts.map((post) => {
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
      userVote: null,
      votesAmount,
      commentsCount: post._count.comments,
    };
  });

  return <PostFeed initialPosts={posts} />;
};

export default GeneralFeed;
