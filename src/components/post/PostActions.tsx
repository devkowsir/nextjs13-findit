"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { cn } from "@/lib/utils";
import { MoreVertical, PenSquare } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import DeleteDialog from "./DeleteDialog";

interface PostActionsProps {
  postId: string;
}

const PostActions: React.FC<PostActionsProps> = ({ postId }) => {
  const [areActionsVisible, setAreActionsVisible] = useState(false);
  const moreButtonRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(() => setAreActionsVisible(false), moreButtonRef);

  return (
    <div className="relative cursor-pointer text-slate-700">
      <Button
        variant={"secondary"}
        size={"xs"}
        className="bg-slate-50 text-slate-700"
      >
        <MoreVertical
          onClick={() => setAreActionsVisible((prev) => !prev)}
          size={24}
        />
      </Button>
      {areActionsVisible && (
        <div
          ref={moreButtonRef}
          className="absolute right-0 top-full w-28 cursor-pointer divide-y rounded-md border border-slate-300 bg-white shadow [&>*]:flex [&>*]:w-full [&>*]:items-center [&>*]:justify-start [&>*]:gap-2 [&>*]:rounded-none [&>*]:bg-transparent [&>*]:px-3 [&>*]:py-2 [&>*]:text-slate-700"
        >
          <Link
            className={cn(buttonVariants({ variant: "secondary", size: "xs" }))}
            href={`/edit/${postId}`}
          >
            <PenSquare size={24} />
            <span>Edit</span>
          </Link>
          <DeleteDialog postId={postId} />
        </div>
      )}
    </div>
  );
};

export default PostActions;
