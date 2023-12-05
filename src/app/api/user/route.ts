import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/database/prisma";
import { getUserSummary } from "@/lib/database/utils";
import { ProfileChangeRequestValidator } from "@/lib/validators/user";
import { ZodError } from "zod";

export async function GET(req: Request) {
  try {
    console.time();
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId) {
      console.timeEnd();
      return new Response("Invalid request", { status: 409 });
    }

    const userSummary = await getUserSummary(userId);
    if (!userSummary) {
      console.timeEnd();
      return new Response("Not Found", { status: 404 });
    }
    console.timeEnd();
    return new Response(JSON.stringify(userSummary));
  } catch (error) {
    console.timeEnd();
    return new Response("Something Went Wrong", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    console.time();
    const session = await getAuthSession();
    if (!session?.user.id) {
      console.timeEnd();
      return new Response("Unauthorized", { status: 401 });
    }
    const body = await req.json();

    const { bio, username } = ProfileChangeRequestValidator.parse(body);
    const data = await prisma.user.findMany({
      where: { OR: [{ id: session.user.id }, { username }] },
      select: {
        id: true,
        username: true,
        bio: true,
        usernameHasBeenChanged: true,
      },
    });
    const existingUser = data.find(
      (user) => user.username === username && user.id !== session.user.id,
    );
    if (existingUser) {
      console.timeEnd();
      return new Response("User with this given username already exists", {
        status: 409,
      });
    }

    const oldUserData = data.find((user) => user.id === session.user.id);

    if (!oldUserData)
      throw new Error("Signed in user found, but database has no record!");

    if (
      (bio === oldUserData.bio && username === oldUserData.username) ||
      (!bio && !username)
    ) {
      console.timeEnd();
      return new Response("Invalid request.", { status: 400 });
    } else if (
      username !== oldUserData.username &&
      oldUserData.usernameHasBeenChanged
    ) {
      console.timeEnd();
      return new Response(
        "You have already changed your username once. Please contact with the developers for additional help",
        { status: 403 },
      );
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        username,
        bio,
        usernameHasBeenChanged: oldUserData.usernameHasBeenChanged
          ? true
          : username !== oldUserData.username
          ? true
          : false,
      },
    });
    console.timeEnd();
    return new Response("Ok");
  } catch (error) {
    if (error instanceof ZodError) {
      console.timeEnd();
      return new Response(error.message);
    } else {
      console.timeEnd();
      return new Response("Something went wrong", { status: 500 });
    }
  }
}
