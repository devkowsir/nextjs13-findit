"use client";

import { Button } from "@/components/ui/button";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { MoreVertical } from "lucide-react";
import { useRef, useState } from "react";
import Delete from "./Delete";
import Edit from "./Edit";

interface CommentActionsProps {
  commentId: string;
  text: string;
}

const CommentActions: React.FC<CommentActionsProps> = ({ commentId, text }) => {
  const [areActionsVisible, setAreActionsVisible] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(() => setAreActionsVisible(false), actionsRef);

  return (
    <div className="relative ml-auto cursor-pointer text-slate-700">
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
          ref={actionsRef}
          className="absolute right-0 top-full w-28 cursor-pointer divide-y rounded-md border border-slate-300 bg-white shadow [&>*]:flex [&>*]:w-full [&>*]:items-center [&>*]:justify-start [&>*]:gap-2 [&>*]:rounded-none [&>*]:bg-transparent [&>*]:px-3 [&>*]:py-2 [&>*]:text-slate-700"
        >
          <Edit commentId={commentId} text={text} />
          <Delete commentId={commentId} />
        </div>
      )}
    </div>
  );
};

export default CommentActions;
