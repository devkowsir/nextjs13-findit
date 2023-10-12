import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import prisma from "@/lib/database/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get("query");
  if (query === null) return new Response("Wrong data", { status: 409 });
  const topicQuery = query.startsWith("t/") ? query.slice(2) : null;
  const userQuery = query.startsWith("u/") ? query.slice(2) : null;
  const generalQuery =
    query.startsWith("u/") || query.startsWith("t/") ? null : query;

  const topicsRes =
    topicQuery || generalQuery
      ? (
          await prisma.topic.findMany({
            where: { name: { contains: topicQuery || generalQuery! } },
            select: {
              name: true,
              _count: { select: { posts: true, subscribers: true } },
            },
            orderBy: { subscribers: { _count: "desc" } },
            take: INFINITE_SCROLLING_PAGINATION_RESULTS,
          })
        ).map((topic) => ({
          nameOrUsername: `t/${topic.name}`,
          postsCount: topic._count.posts,
          subscriberOrFollowerCount: topic._count.subscribers,
        }))
      : [];

  const usersRes =
    userQuery || generalQuery
      ? (
          await prisma.user.findMany({
            where: { username: { contains: userQuery || generalQuery! } },
            select: {
              username: true,
              _count: { select: { posts: true, followedBy: true } },
            },
            orderBy: { followedBy: { _count: "desc" } },
            take: INFINITE_SCROLLING_PAGINATION_RESULTS,
          })
        ).map((user) => ({
          nameOrUsername: `u/${user.username}`,
          postsCount: user._count.posts,
          subscriberOrFollowerCount: user._count.followedBy,
        }))
      : [];

  return new Response(JSON.stringify([...topicsRes, ...usersRes]));
}
