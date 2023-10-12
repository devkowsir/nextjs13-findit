import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/database/prisma";
import { FollowToggleRequestValidator } from "@/lib/validators/user";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { username } = FollowToggleRequestValidator.parse(body);

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      select: { id: true },
    });
    if (user === null)
      return new Response("User does not exist", { status: 422 });

    const filter = {
      followedById: session.user.id,
      follwingToId: user.id,
    };

    const follow = await prisma.follow.findUnique({
      where: {
        followedById_follwingToId: filter,
      },
      select: { follwingToId: true },
    });

    if (follow) {
      await prisma.follow.delete({
        where: {
          followedById_follwingToId: filter,
        },
        select: { follwingToId: true },
      });
      return new Response(`Successfully removed following ${username}`);
    }

    await prisma.follow.create({
      data: filter,
      select: { followedById: true },
    });

    return new Response(`Successfully started following to ${username}`);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError)
      return new Response(error.message, { status: 422 });
    return new Response("Something went wrong", { status: 500 });
  }
}
