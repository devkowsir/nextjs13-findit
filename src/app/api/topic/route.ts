import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { TopicValidator } from "@/lib/validators/topic";
import { URL } from "url";
import { z } from "zod";

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

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { name } = TopicValidator.parse(body);

    const topicExists = await prisma.topic.findFirst({ where: { name } });
    if (topicExists)
      return new Response("Topic already exists", { status: 409 });

    const topic = await prisma.topic.create({
      data: { name, creatorId: session.user.id },
    });

    await prisma.subscription.create({
      data: {
        topicName: topic.name,
        userId: session.user.id,
      },
    });

    return new Response(topic.name);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError)
      return new Response(error.message, { status: 422 });

    return new Response("Could not create post", { status: 500 });
  }
}
