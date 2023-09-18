import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { TopicSubscriptionValidator } from "@/lib/validators/topic";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { topicName } = TopicSubscriptionValidator.parse(body);

    const topic = await prisma.topic.findUnique({ where: { name: topicName } });
    if (!topic) return new Response("Topic does not exist", { status: 422 });

    const subscription = await prisma.subscription.findUnique({
      where: {
        userId_topicName: { topicName: topic.name, userId: session?.user.id },
      },
    });

    if (subscription) {
      await prisma.subscription.delete({
        where: { userId_topicName: { ...subscription } },
      });
      return new Response(`Unsubscribed from topic ${topic.name}`);
    }

    await prisma.subscription.create({
      data: { topicName: topic.name, userId: session.user.id },
    });

    return new Response(`Subscribed to topic ${topic.name}`);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError)
      return new Response(error.message, { status: 422 });
    return new Response("Something went wrong", { status: 500 });
  }
}
