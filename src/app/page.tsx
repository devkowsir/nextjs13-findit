import CustomFeed from "@/components/CustomFeed";
import GeneralFeed from "@/components/GeneralFeed";
import { buttonVariants } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Home() {
  const session = await getAuthSession();

  return (
    <main className="container">
      <h1 className="mb-4 text-3xl font-bold text-slate-700 md:text-4xl">
        Your Feed
      </h1>
      <div className="grid grid-cols-1 gap-y-6 md:grid-cols-3 md:gap-x-4">
        {/* About This Page */}
        <div className="h-fit overflow-hidden rounded-lg border border-slate-400 md:order-last">
          <div className="flex items-center gap-2 bg-emerald-200/75 px-4 py-6">
            <HomeIcon />
            Home
          </div>
          <div className="space-y-4 px-4 py-4">
            <p className="text-sm text-slate-600">
              Your personal FindIt front page. Come here to check in with your
              favorite communities.
            </p>
            <Link href="/t/create" className={cn(buttonVariants(), "w-full")}>
              Create Topic
            </Link>
          </div>
        </div>
        {/* Feed */}
        <div className="col-span-2">
          {session?.user ? <CustomFeed /> : <GeneralFeed />}
        </div>
      </div>
    </main>
  );
}
