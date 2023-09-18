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
    const { type, id: postId } = VoteValidator.parse(body);

    const voteExists = await prisma.vote.findUnique({
      where: { userId_postId: { userId: session.user.id, postId } },
    });

    if (voteExists?.type === type) {
      await prisma.vote.delete({
        where: { userId_postId: { postId, userId: session.user.id } },
      });
      userVote = null;
    } else {
      userVote = (
        await prisma.vote.upsert({
          where: { userId_postId: { postId, userId: session.user.id } },
          create: { type, postId, userId: session.user.id },
          update: { type },
          select: { type: true },
        })
      ).type;
    }
    votesAmount = (
      await prisma.vote.findMany({
        where: { postId },
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
