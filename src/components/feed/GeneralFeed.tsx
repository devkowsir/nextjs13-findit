import { getFeedPosts } from "@/lib/database/utils";
import PostFeed from "./PostFeed";

const GeneralMainFeed = async () => {
  const posts = await getFeedPosts({ subscriptions: [] });

  return <PostFeed initialPosts={posts} />;
};

export default GeneralMainFeed;
