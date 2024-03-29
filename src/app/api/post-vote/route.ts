import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/database/prisma";
import { VoteValidator } from "@/lib/validators/vote";
import { VoteType } from "@prisma/client";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    console.log(Date.now());
    let userVote: VoteType | null;
    let post: { rating: number };
    const session = await getAuthSession();
    const userId = session?.user.id;
    if (!userId) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { type, id: postId } = VoteValidator.parse(body);

    const voteExists = await prisma.postVote.findUnique({
      where: { userId_postId: { userId: userId, postId } },
      select: { type: true },
    });

    if (!voteExists) {
      [post] = await prisma.$transaction([
        prisma.post.update({
          where: { id: postId },
          data: { rating: type === "UP" ? { increment: 1 } : { decrement: 1 } },
          select: { rating: true },
        }),
        prisma.postVote.create({
          data: { type, postId, userId: userId },
          select: { type: true },
        }),
      ]);
      userVote = type;
    } else if (voteExists?.type === type) {
      [post] = await prisma.$transaction([
        prisma.post.update({
          where: { id: postId },
          data: { rating: type === "UP" ? { decrement: 1 } : { increment: 1 } },
          select: { rating: true },
        }),
        prisma.postVote.delete({
          where: { userId_postId: { userId: userId, postId } },
          select: { type: true },
        }),
      ]);
      userVote = null;
    } else {
      [post] = await prisma.$transaction([
        prisma.post.update({
          where: { id: postId },
          data: { rating: type === "UP" ? { increment: 2 } : { decrement: 2 } },
          select: { rating: true },
        }),
        prisma.postVote.update({
          where: { userId_postId: { userId, postId } },
          data: { type },
          select: { type: true },
        }),
      ]);
      userVote = type;
    }
    console.log(Date.now());
    return new Response(JSON.stringify({ userVote, votesAmount: post.rating }));
  } catch (err) {
    console.error(err);
    if (err instanceof ZodError)
      return new Response(err.message, { status: 422 });

    return new Response("Could not create post", { status: 500 });
  }
}
