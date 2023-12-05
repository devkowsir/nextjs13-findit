import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/database/prisma";
import { getPost } from "@/lib/database/utils";
import {
  PostCreationValidator,
  PostUpdateValidator,
} from "@/lib/validators/post";
import { z } from "zod";

export async function GET(req: Request) {
  console.time();
  try {
    const url = new URL(req.url);
    const postId = url.searchParams.get("postId");
    if (!postId) {
      console.timeEnd();
      return new Response("Invalid request", { status: 400 });
    }

    const post = await getPost(postId);
    if (!post) {
      console.timeEnd();
      return new Response("Not found", { status: 404 });
    }
    console.timeEnd();
    return new Response(JSON.stringify(post));
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
    const { title, topicName, content } = PostCreationValidator.parse(body);

    const userHasSubscription = await prisma.subscription.findUnique({
      where: {
        userId_topicName: { topicName: topicName, userId: session.user.id },
      },
    });
    if (!userHasSubscription) {
      console.timeEnd();
      return new Response("You neet to subscribe to create posts.", {
        status: 405,
      });
    }

    await prisma.post.create({
      data: {
        title,
        authorId: session.user?.id,
        content,
        topicName,
      },
    });
    console.timeEnd();
    return new Response("Ok", { status: 201 });
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

export async function PATCH(req: Request) {
  try {
    console.time();
    const session = await getAuthSession();
    if (!session?.user) {
      console.timeEnd();
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, content, postId } = PostUpdateValidator.parse(body);

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      console.timeEnd();
      return new Response("Post not found", { status: 404 });
    }
    if (post.authorId !== session.user.id) {
      console.timeEnd();
      return new Response("Unauthorized", { status: 401 });
    }

    await prisma.post.update({
      where: { id: postId },
      data: { title, content },
    });
    console.timeEnd();
    return new Response("Ok");
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

export async function DELETE(req: Request) {
  console.time();
  try {
    const url = new URL(req.url);
    const postId = url.searchParams.get("postId");
    if (!postId) {
      console.timeEnd();
      return new Response("Invalid request", { status: 400 });
    }

    const session = await getAuthSession();
    if (!session?.user) {
      console.timeEnd();
      return new Response("Unauthorized", { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      console.timeEnd();
      return new Response("Post not found", { status: 404 });
    }
    if (post.authorId !== session.user.id) {
      console.timeEnd();
      return new Response("Unauthorized", { status: 401 });
    }
    await prisma.post.delete({ where: { id: postId } });
    console.timeEnd();
    return new Response("Ok");
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
