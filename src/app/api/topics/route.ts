import prisma from "@/lib/database/prisma";

export async function GET(req: Request) {
  try {
    console.time();
    const url = new URL(req.url);
    const query = url.searchParams.get("query");
    if (query === null) {
      console.timeEnd();
      return new Response("Wrong data", { status: 409 });
    }

    const topics = await prisma.topic.findMany({
      where: { name: { contains: query } },
      select: {
        name: true,
        _count: { select: { posts: true, subscribers: true } },
      },
      orderBy: { subscribers: { _count: "desc" } },
      take: 5,
    });
    console.timeEnd();
    return new Response(JSON.stringify(topics));
  } catch (error) {
    console.timeEnd();
    return new Response("Something went wrong", { status: 500 });
  }
}
