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
      <RightLayout>
        <p className="text-2xl font-semibold text-slate-700">About FindIt</p>
        <p className="text-slate-700">
          Your personal FindIt front page. Come here to check in with your
          favorite communities.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Link href="/create" className={cn(buttonVariants(), "")}>
            Create Post
          </Link>
          <Link
            href="/t/create"
            className={cn(buttonVariants({ variant: "outline" }), "")}
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
