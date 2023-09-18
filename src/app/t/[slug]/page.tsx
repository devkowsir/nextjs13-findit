import MiniCreatePost from "@/components/MiniCreatePost";
import PostFeed from "@/components/PostFeed";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

interface pageProps {
  params: { slug: string };
}

const page: React.FC<pageProps> = async ({ params: { slug } }) => {
  const session = await getAuthSession();
  const topic = await prisma.topic.findUnique({
    where: { name: slug },
    include: {
      posts: {
        include: {
          topic: true,
          author: true,
          votes: true,
          _count: { select: { comments: true } },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
      },
    },
  });

  const subscription = !session?.user
    ? null
    : await prisma.subscription.findUnique({
        where: {
          userId_topicName: { topicName: slug, userId: session.user.id },
        },
      });

  if (!topic) return notFound();

  return (
    <>
      <h1 className="mb-4 text-3xl font-bold text-slate-700 md:text-4xl">
        t/{topic.name}
      </h1>
      {session && session.user && subscription ? (
        <MiniCreatePost user={session?.user} />
      ) : null}
      <PostFeed
        initialPosts={topic.posts}
        topicName={topic.name}
        additionalQueryKey={[slug]}
      />
    </>
  );
};

export default page;
