import PostFeed from "@/components/feed/PostFeed";
import { getAuthSession } from "@/lib/auth";
import { getFeedPosts } from "@/lib/database/utils";

interface pageProps {
  params: { topicName: string };
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const page: React.FC<pageProps> = async ({ params: { topicName } }) => {
  const session = await getAuthSession();
  const userId = session?.user.id;
  const subscriptions = [topicName];
  const posts = await getFeedPosts({ subscriptions, userId });

  return (
    <PostFeed
      initialPosts={posts}
      topicName={topicName}
      additionalQueryKeys={[`t/${topicName}`]}
    />
  );
};

export default page;
