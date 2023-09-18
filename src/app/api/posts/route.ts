import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { VoteType } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    const userId = session?.user.id;
    const subscriptions = userId
      ? await prisma.subscription.findMany({ where: { userId } })
      : [];
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const topicName = searchParams.get("topicName");

    const dbPosts = await prisma.post.findMany({
      // if topic is passed, return the posts from the topic,
      // else if user is logged in then returned posts from his subscribed topics
      // else return the latest posts
      where: topicName
        ? { topicId: topicName }
        : subscriptions.length
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
      skip: INFINITE_SCROLLING_PAGINATION_RESULTS * (page - 1),
    });

    let userVotes: ({ type: VoteType } | null)[] = [];
    if (userId) {
      userVotes = await Promise.all(
        dbPosts.map((post) =>
          prisma.vote.findUnique({
            where: { userId_postId: { postId: post.id, userId } },
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

    return new Response(JSON.stringify(posts));
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }
}
