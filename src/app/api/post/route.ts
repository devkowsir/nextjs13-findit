import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const postId = url.searchParams.get("postId");
  if (!postId) return new Response("Invalid request", { status: 409 });

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: true,
      votes: true,
      topic: true,
      _count: { select: { comments: true } },
    },
  });
  if (!post) return new Response("Not found", { status: 404 });
  return new Response(JSON.stringify(post));
}
