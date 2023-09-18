import SubscriptionToggle from "@/components/SubscriptionToggle";
import { Button } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface LayoutProps {
  children: React.ReactNode;
  params: { slug: string };
}

const Layout = async ({ children, params: { slug } }: LayoutProps) => {
  const session = await getAuthSession();

  const subscription = !session?.user
    ? null
    : await prisma.subscription.findUnique({
        where: {
          userId_topicName: { topicName: slug, userId: session.user.id },
        },
      });

  const topic = await prisma.topic.findUnique({
    where: { name: slug },
  });

  const subscriberCount = await prisma.subscription.count({
    where: { topicName: slug },
  });

  if (!topic) return null;

  return (
    <div className="grid grid-cols-1 gap-y-8 md:grid-cols-3 md:gap-x-4 lg:gap-x-8">
      {/* About topic */}
      <div className="h-fit space-y-2 overflow-hidden rounded-lg border bg-white pb-2 md:order-last [&>*]:px-6">
        <p className="bg-slate-100 py-4 text-xl font-bold">About t/{slug}</p>
        <div className="divide-y text-sm text-slate-600 [&>*:not(:first-child)]:pt-2 [&>*:not(:last-child)]:pb-2">
          <div className="flex items-center justify-between">
            <span>Created</span>
            <span>{topic.createdAt.toDateString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Members</span>
            <span>{subscriberCount}</span>
          </div>
        </div>
        <div className="space-y-4 py-4">
          {topic.creatorId === session?.user.id ? (
            <p className="border-t pt-2 text-center text-sm font-semibold text-slate-800">
              You created this topic.
            </p>
          ) : (
            <>
              <SubscriptionToggle
                subscribed={!!subscription}
                topicName={slug}
              />
            </>
          )}
        </div>
      </div>
      {/* Posts from topic */}
      <main className="md:col-span-2">{children}</main>
    </div>
  );
};

export default Layout;
