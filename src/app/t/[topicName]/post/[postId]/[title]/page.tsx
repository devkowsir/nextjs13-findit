import BackButton from "@/components/feed/BackButton";
import PostAndComments from "@/components/post/PostAndComments";
import PostProvider from "@/components/post/PostStore";
import { getAuthSession } from "@/lib/auth";
import { getPostWithTopComments } from "@/lib/database/utils";
import { notFound } from "next/navigation";

interface pageProps {
  params: { postId: string };
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const page: React.FC<pageProps> = async ({ params: { postId } }) => {
  const session = await getAuthSession();
  const data = await getPostWithTopComments(postId, session?.user.id);

  if (!data) return notFound();

  return (
    <main>
      <BackButton />
      <PostProvider initialPost={data.post}>
        <PostAndComments
          userId={session?.user.id || null}
          comments={data.comments}
        />
      </PostProvider>
    </main>
  );
};

export default page;
