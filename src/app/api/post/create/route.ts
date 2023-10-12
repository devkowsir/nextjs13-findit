import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/database/prisma";
import { PostCreationValidator } from "@/lib/validators/post";
import { nanoid } from "nanoid";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { title, topicName, content } = PostCreationValidator.parse(body);

    const userHasSubscription = await prisma.subscription.findUnique({
      where: {
        userId_topicName: { topicName: topicName, userId: session.user.id },
      },
    });
    if (!userHasSubscription)
      return new Response("You neet to subscribe to create posts.", {
        status: 405,
      });

    const id = title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "")
      .concat("-", nanoid(8));

    await prisma.post.create({
      data: {
        id,
        title: title,
        authorId: session.user?.id,
        content,
        topicId: topicName,
      },
    });

    return new Response("Ok");
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError)
      return new Response(error.message, { status: 422 });

    return new Response("Could not create post", { status: 500 });
  }
}
