import CommentForm from "@/components/CommentForm";
import CommentSection from "@/components/CommentSection";
import EditorOutput from "@/components/EditorOutput";
import PostMetadata from "@/components/PostMetadata";
import VoteServer from "@/components/vote/VoteServer";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface pageProps {
  params: { slug: string; postId: string };
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const page: React.FC<pageProps> = async ({ params: { postId, slug } }) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: true,
      topic: true,
      votes: true,
      _count: { select: { comments: true } },
    },
  });
  const session = await getAuthSession();

  if (!post) return notFound();

  return (
    <div className="flex gap-2 md:gap-4">
      <div className="py-4">
        <Suspense fallback={<Loader2 className="h-5 w-5 animate-spin" />}>
          <VoteServer postId={post.id} />
        </Suspense>
      </div>
      <div className="flex w-full flex-col gap-2 rounded-md bg-white p-4">
        <PostMetadata
          createdAt={post.createdAt}
          topicName={slug}
          username={post.author.username || post.author.id}
        />
        <h1 className="text-3xl font-semibold">{post.title}</h1>
        <EditorOutput data={post.content} />
        <div className="my-4 h-[1px] w-full bg-slate-300" />

        <div className="flex flex-col gap-2">
          <p className="text-lg">Your Comment</p>
          <CommentForm postId={postId} />
        </div>
        <Suspense fallback={<Loader2 className="h-5 w-5 animate-spin" />}>
          <CommentSection postId={postId} userId={session?.user.id || null} />
        </Suspense>
      </div>
    </div>
  );
};

export default page;
