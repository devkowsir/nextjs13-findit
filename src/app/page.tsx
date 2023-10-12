import { ContainerLayout, LeftLayout, RightLayout } from "@/components/Layouts";
import CustomFeed from "@/components/feed/CustomFeed";
import GeneralFeed from "@/components/feed/GeneralFeed";
import { buttonVariants } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Home() {
  const session = await getAuthSession();

  return (
    <ContainerLayout>
      {/* About This Page */}
      <RightLayout additionalClasses="divide-y [&>*]:py-2">
        <p className="text-xl font-semibold text-slate-700">About Reddit</p>
        <p className="text-sm text-slate-700">
          Your personal FindIt front page. Come here to check in with your
          favorite communities.
        </p>
        <div className="space-y-2">
          <Link href="/create" className={cn(buttonVariants(), "w-full")}>
            Create Post
          </Link>
          <Link
            href="/t/create"
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          >
            Create Topic
          </Link>
        </div>
      </RightLayout>
      {/* Feed */}
      <LeftLayout>
        {session?.user ? (
          <CustomFeed userId={session.user.id} />
        ) : (
          <GeneralFeed />
        )}
      </LeftLayout>
    </ContainerLayout>
  );
}
