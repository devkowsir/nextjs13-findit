import { getAuthSession } from "@/lib/auth";
import { getFeedPosts, getSubscriptions } from "@/lib/database/utils";

export async function GET(req: Request) {
  console.time();
  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page"));
    const topicName = url.searchParams.get("topicName");
    const authorId = url.searchParams.get("authorId");
    const sortMode = url.searchParams.get("sort-mode");

    const session = await getAuthSession();
    const userId = session?.user.id;

    const subscriptions = authorId
      ? []
      : topicName
      ? [topicName]
      : userId
      ? await getSubscriptions(userId)
      : [];

    const posts = await getFeedPosts({
      page,
      subscriptions,
      sortMode: sortMode ? sortMode : "new",
      userId,
      authorId: authorId ? authorId : undefined,
    });
    console.timeEnd();
    return new Response(JSON.stringify(posts));
  } catch (error) {
    console.error(error);
    console.timeEnd();
    return new Response("Something went wrong", { status: 500 });
  }
}
