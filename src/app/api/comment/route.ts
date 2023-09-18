import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CommentValidator } from "@/lib/validators/comment";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const commentData = CommentValidator.parse(body);

    const res = await prisma.comment.create({
      data: { ...commentData, authorId: session.user.id },
    });

    return new Response(JSON.stringify(res));
  } catch (err) {
    console.error(err);
    return new Response("Something went wrong", { status: 500 });
  }
}
