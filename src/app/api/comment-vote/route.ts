import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { VoteValidator } from "@/lib/validators/vote";
import { ZodError } from "zod";

export async function POST(req: Request) {
  let votesAmount;
  let userVote;
  try {
    const session = await getAuthSession();
    if (!session?.user.id) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { type, id: commentId } = VoteValidator.parse(body);

    const voteExists = await prisma.commentVote.findUnique({
      where: { userId_commentId: { userId: session.user.id, commentId } },
    });

    if (voteExists?.type === type) {
      await prisma.commentVote.delete({
        where: { userId_commentId: { userId: session.user.id, commentId } },
      });
      userVote = null;
    } else {
      userVote = (
        await prisma.commentVote.upsert({
          where: { userId_commentId: { userId: session.user.id, commentId } },
          create: { type, commentId, userId: session.user.id },
          update: { type },
          select: { type: true },
        })
      ).type;
    }
    votesAmount = (
      await prisma.commentVote.findMany({
        where: { commentId },
        select: { type: true },
      })
    ).reduce((acc, curr) => (curr.type === "UP" ? acc + 1 : acc - 1), 0);
    return new Response(JSON.stringify({ userVote, votesAmount }));
  } catch (err) {
    console.error(err);
    if (err instanceof ZodError)
      return new Response(err.message, { status: 422 });

    return new Response("Could not create post", { status: 500 });
  }
}
