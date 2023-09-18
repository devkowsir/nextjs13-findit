import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const postId = url.searchParams.get("postId");
  if (!postId) return new Response("Invalid request", { status: 409 });

  const comments = await prisma.comment.findMany({
    where: { postId, replyToId: null },
    include: {
      author: true,
      votes: true,
      replies: { include: { author: true, votes: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return new Response(JSON.stringify(comments));
}
