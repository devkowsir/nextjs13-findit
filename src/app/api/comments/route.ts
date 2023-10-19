import { SortMode } from "@/components/feed/PostFeed";
import { getAuthSession } from "@/lib/auth";
import { getComments } from "@/lib/database/utils";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const postId = url.searchParams.get("postId");
  const replyToId = url.searchParams.get("replyToId");
  const skip = Number(url.searchParams.get("skip"));
  const sortMode = url.searchParams.get("sort-mode");
  if (!postId) return new Response("Invalid request", { status: 409 });

  const userId = (await getAuthSession())?.user.id || null;
  const comments = await getComments(
    postId,
    userId,
    replyToId,
    sortMode || "top",
    Number.isNaN(skip) || skip < 0 ? 0 : skip,
  );

  return new Response(JSON.stringify(comments));
}
