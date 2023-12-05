import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/database/prisma";
import { getTopicSummary } from "@/lib/database/utils";
import { TopicCreationRequestValidator } from "@/lib/validators/topic";
import { URL } from "url";
import { z } from "zod";

export async function GET(req: Request) {
  console.time();
  try {
    const url = new URL(req.url);
    const topicName = url.searchParams.get("topicName");
    if (topicName === null) return new Response("Wrong data", { status: 409 });
    const topicSummary = await getTopicSummary(topicName);
    console.timeEnd();
    return new Response(JSON.stringify(topicSummary));
  } catch (error) {
    console.timeEnd();
    return new Response("Something went wrong", { status: 500 });
  }
}

export async function POST(req: Request) {
  console.time();
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      console.timeEnd();
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, description } = TopicCreationRequestValidator.parse(body);

    const topicExists = await prisma.topic.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });
    if (topicExists) {
      console.timeEnd();
      return new Response("Topic already exists", { status: 409 });
    }

    const topic = await prisma.topic.create({
      data: {
        name,
        creatorId: session.user.id,
        description: description ? description : null,
      },
    });

    await prisma.subscription.create({
      data: {
        topicName: topic.name,
        userId: session.user.id,
      },
    });
    console.timeEnd();
    return new Response(topic.name);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      console.timeEnd();
      return new Response(error.message, { status: 422 });
    }
    console.timeEnd();
    return new Response("Could not create post", { status: 500 });
  }
}
