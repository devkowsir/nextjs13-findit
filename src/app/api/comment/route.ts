import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/database/prisma";
import {
  CommentCreationValidator,
  CommentUpdateValidator,
} from "@/lib/validators/comment";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const commentData = CommentCreationValidator.parse(body);

    const res = await prisma.comment.create({
      data: { ...commentData, authorId: session.user.id },
      include: {
        author: { select: { id: true, username: true, image: true } },
      },
    });

    return new Response(JSON.stringify(res));
  } catch (err) {
    console.error(err);
    return new Response("Something went wrong", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { commentId, text } = CommentUpdateValidator.parse(body);

    const res = await prisma.comment.update({
      where: { id: commentId },
      data: { text },
      select: { text: true },
    });

    return new Response(res.text);
  } catch (err) {
    console.error(err);
    return new Response("Something went wrong", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) return new Response("Unauthorized", { status: 401 });

    const url = new URL(req.url);
    const commentId = url.searchParams.get("commentId");
    if (!commentId) return new Response("Bad Request", { status: 400 });

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) return new Response("Resource Not Found.", { status: 404 });
    if (comment.authorId !== session.user.id)
      return new Response("Unauthorized", { status: 401 });

    await prisma.comment.delete({ where: { id: commentId } });
    return new Response("OK");
  } catch (err) {
    console.error(err);
    return new Response("Something went wrong", { status: 500 });
  }
}
