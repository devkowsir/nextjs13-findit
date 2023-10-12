import EditTopic from "@/components/EditTopic";
import { ContainerLayout, LeftLayout, RightLayout } from "@/components/Layouts";
import SubscriptionToggle from "@/components/SubscriptionToggle";
import { buttonVariants } from "@/components/ui/button";
import { numberFormatter } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { getTopicSummary, isUserSubscribed } from "@/lib/database/utils";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
  params: { topicName: string };
}

const Layout = async ({ children, params: { topicName } }: LayoutProps) => {
  const topicSummary = await getTopicSummary(topicName);
  if (!topicSummary) return notFound();

  const session = await getAuthSession();
  const userId = session?.user.id;
  const subscribed = userId ? await isUserSubscribed(topicName, userId) : false;

  return (
    <ContainerLayout>
      {/* About topic */}
      <RightLayout additionalClasses="divide-y [&>*]:py-2">
        <p className="text-xl font-semibold text-slate-700">
          About t/{topicName}
        </p>
        {topicSummary.description ? (
          <p className="text-sm text-slate-700">{topicSummary.description}</p>
        ) : null}
        <div className="text-sm text-slate-600 [&>*]:py-0.5">
          <div className="flex items-center justify-between">
            <span>Created</span>
            <span>{topicSummary.createdAt.toDateString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Members</span>
            <span>{numberFormatter.format(topicSummary.subscriberCount)}</span>
          </div>
        </div>
        <div className="space-y-2 py-4">
          {subscribed ? (
            <Link
              className={cn(buttonVariants(), "w-full")}
              href={`/t/${topicName}/create`}
            >
              Create Post
            </Link>
          ) : null}
          {topicSummary.creatorId === userId ? (
            <EditTopic description={topicSummary.description} />
          ) : (
            <SubscriptionToggle
              isSubscribed={subscribed}
              topicName={topicName}
            />
          )}
        </div>
      </RightLayout>
      {/* Posts from topic */}
      <LeftLayout>{children}</LeftLayout>
    </ContainerLayout>
  );
};

export default Layout;
