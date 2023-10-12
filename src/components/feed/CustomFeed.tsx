import { getFeedPosts, getSubscriptions } from "@/lib/database/utils";
import PostFeed from "./PostFeed";

const CustomFeed = async ({ userId }: { userId: string }) => {
  const subscriptions = await getSubscriptions(userId);
  const posts = await getFeedPosts({ subscriptions, userId });

  return <PostFeed initialPosts={posts} />;
};

export default CustomFeed;
