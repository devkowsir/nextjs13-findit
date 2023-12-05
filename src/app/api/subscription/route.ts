import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/database/prisma";
import { getSubscriptions } from "@/lib/database/utils";
import { TopicSubscriptionRequestValidator } from "@/lib/validators/topic";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    console.time();
    const session = await getAuthSession();
    if (!session?.user) {
      console.timeEnd();
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { topicName } = TopicSubscriptionRequestValidator.parse(body);

    const topic = await prisma.topic.findUnique({ where: { name: topicName } });
    if (!topic) {
      console.timeEnd();
      return new Response("Topic does not exist", { status: 422 });
    }

    const subscription = await prisma.subscription.findUnique({
      where: {
        userId_topicName: { topicName: topic.name, userId: session?.user.id },
      },
    });

    if (subscription) {
      await prisma.subscription.delete({
        where: { userId_topicName: { ...subscription } },
      });
      console.timeEnd();
      return new Response(`Unsubscribed from topic ${topic.name}`);
    }

    await prisma.subscription.create({
      data: { topicName: topic.name, userId: session.user.id },
    });
    console.timeEnd();
    return new Response(`Subscribed to topic ${topic.name}`);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      console.timeEnd();
      return new Response(error.message, { status: 422 });
    }
    console.timeEnd();
    return new Response("Something went wrong", { status: 500 });
  }
}

export async function GET() {
  console.time();
  const session = await getAuthSession();
  const userId = session?.user.id;
  if (!userId) {
    console.timeEnd();
    return new Response("Unauthorized", { status: 401 });
  }
  console.timeEnd();
  return new Response(JSON.stringify(await getSubscriptions(userId)));
}
