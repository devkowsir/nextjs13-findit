import prisma from "@/lib/database/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get("query");
  if (query === null) return new Response("Wrong data", { status: 409 });

  const topics = await prisma.topic.findMany({
    where: { name: { contains: query } },
    select: {
      name: true,
      _count: { select: { posts: true, subscribers: true } },
    },
    orderBy: { subscribers: { _count: "desc" } },
    take: 5,
  });

  return new Response(JSON.stringify(topics));
}
