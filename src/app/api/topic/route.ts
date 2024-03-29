import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/database/prisma";
import { getTopicSummary } from "@/lib/database/utils";
import { TopicCreationRequestValidator } from "@/lib/validators/topic";
import { URL } from "url";
import { z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const topicName = url.searchParams.get("topicName");
  if (topicName === null) return new Response("Wrong data", { status: 409 });
  const topicSummary = await getTopicSummary(topicName);
  return new Response(JSON.stringify(topicSummary));
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { name, description } = TopicCreationRequestValidator.parse(body);

    const topicExists = await prisma.topic.findFirst({ where: { name } });
    if (topicExists)
      return new Response("Topic already exists", { status: 409 });

    const topic = await prisma.topic.create({
      data: {
        name,
        creatorId: session.user.id,
        description,
      },
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
