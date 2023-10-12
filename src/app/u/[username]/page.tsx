import FollowToggle from "@/components/FollowToggle";
import { ContainerLayout, LeftLayout, RightLayout } from "@/components/Layouts";
import PostFeed from "@/components/feed/PostFeed";
import { numberFormatter } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { getUserProfile } from "@/lib/database/utils";
import { notFound } from "next/navigation";

interface LayoutProps {
  params: { username: string };
}

const Layout = async ({ params: { username } }: LayoutProps) => {
  const session = await getAuthSession();
  const userProfile = await getUserProfile(username, session?.user.id);
  if (!userProfile) return notFound();
  const selfProfile = userProfile.id === session?.user.id;

  return (
    <ContainerLayout>
      {/* About topic */}
      <RightLayout additionalClasses="divide-y [&>*]:py-2">
        <p className="text-xl font-semibold text-slate-700">
          {selfProfile ? "Your Profile" : `About u/${username}`}
        </p>
        {userProfile.bio ? (
          <p className="text-sm text-slate-700">{userProfile.bio}</p>
        ) : null}
        <div className="text-sm text-slate-600 [&>*]:py-0.5">
          <div className="flex items-center justify-between">
            <span>Followed By</span>
            <span>{numberFormatter.format(userProfile.counts.followedBy)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Posts Created</span>
            <span>{numberFormatter.format(userProfile.counts.posts)}</span>
          </div>
        </div>
        {selfProfile ? null : (
          /* Toggle follow button */
          <FollowToggle
            username={userProfile.username!}
            isFollowing={userProfile.isFollowing}
          />
        )}
      </RightLayout>
      {/* Posts from topic */}
      <LeftLayout>
        <PostFeed
          initialPosts={userProfile.posts}
          authorId={userProfile.id}
          additionalQueryKeys={[`u/${userProfile.id!}`]}
        />
      </LeftLayout>
    </ContainerLayout>
  );
};

export default Layout;
