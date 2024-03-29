import { getPost } from "@/lib/database/utils";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/database/prisma";
import {
  PostCreationValidator,
  PostUpdateValidator,
} from "@/lib/validators/post";
import { nanoid } from "nanoid";
import { z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const postId = url.searchParams.get("postId");
  if (!postId) return new Response("Invalid request", { status: 400 });

  const post = await getPost(postId);
  if (!post) return new Response("Not found", { status: 404 });
  return new Response(JSON.stringify(post));
}

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
        topicName,
      },
    });

    return new Response("Ok", { status: 201 });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError)
      return new Response(error.message, { status: 422 });

    return new Response("Could not create post", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { title, content, postId } = PostUpdateValidator.parse(body);

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) return new Response("Post not found", { status: 404 });
    if (post.authorId !== session.user.id)
      return new Response("Unauthorized", { status: 401 });

    await prisma.post.update({
      where: { id: postId },
      data: { title, content },
    });

    return new Response("Ok");
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError)
      return new Response(error.message, { status: 422 });

    return new Response("Could not create post", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const postId = url.searchParams.get("postId");
    if (!postId) return new Response("Invalid request", { status: 400 });

    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) return new Response("Post not found", { status: 404 });
    if (post.authorId !== session.user.id)
      return new Response("Unauthorized", { status: 401 });

    await prisma.post.delete({ where: { id: postId } });
    return new Response("Ok");
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError)
      return new Response(error.message, { status: 422 });

    return new Response("Could not create post", { status: 500 });
  }
}
