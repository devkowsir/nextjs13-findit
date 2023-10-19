import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/database/prisma";
import { VoteValidator } from "@/lib/validators/vote";
import { VoteType } from "@prisma/client";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    let userVote: VoteType | null;
    let comment: { rating: number };
    const session = await getAuthSession();
    const userId = session?.user.id;
    if (!userId) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { type, id: commentId } = VoteValidator.parse(body);

    const voteExists = await prisma.commentVote.findUnique({
      where: { userId_commentId: { userId: userId, commentId } },
    });

    if (!voteExists) {
      [comment] = await prisma.$transaction([
        prisma.comment.update({
          where: { id: commentId },
          data: { rating: type === "UP" ? { increment: 1 } : { decrement: 1 } },
          select: { rating: true },
        }),
        prisma.commentVote.create({
          data: { type, commentId, userId },
          select: { type: true },
        }),
      ]);
      userVote = type;
    } else if (voteExists?.type === type) {
      [comment] = await prisma.$transaction([
        prisma.comment.update({
          where: { id: commentId },
          data: { rating: type === "UP" ? { decrement: 1 } : { increment: 1 } },
          select: { rating: true },
        }),
        prisma.commentVote.delete({
          where: { userId_commentId: { userId, commentId } },
          select: { type: true },
        }),
      ]);
      userVote = null;
    } else {
      [comment] = await prisma.$transaction([
        prisma.comment.update({
          where: { id: commentId },
          data: { rating: type === "UP" ? { increment: 2 } : { decrement: 2 } },
          select: { rating: true },
        }),
        prisma.commentVote.update({
          where: { userId_commentId: { userId, commentId } },
          data: { type },
          select: { type: true },
        }),
      ]);
      userVote = type;
    }
    return new Response(JSON.stringify({ userVote, rating: comment.rating }));
  } catch (err) {
    console.error(err);
    if (err instanceof ZodError)
      return new Response(err.message, { status: 422 });

    return new Response("Could not create post", { status: 500 });
  }
}
