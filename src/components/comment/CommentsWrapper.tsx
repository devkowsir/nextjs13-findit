"use client";

import { ExtendedComment } from "@/types/db";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import Comment from "./Comment";
import { Loader2 } from "lucide-react";

interface CommentsWrapperProps {
  postId: string;
}

const CommentsWrapper: React.FC<CommentsWrapperProps> = ({ postId }) => {
  const [replyingTo, setReplyingTo] = useState("");

  const { data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/comments?postId=${postId}`);
      return data as ExtendedComment[];
    },
    staleTime: Infinity,
    initialDataUpdatedAt: Infinity,
    structuralSharing: (
      oldData: ExtendedComment[] | undefined,
      newData: ExtendedComment[],
    ) => (oldData ? [...oldData, ...newData] : [...newData]),
  });

  if (!data)
    return (
      <div className="py-8">
        <Loader2 size={24} className="mx-auto animate-spin" />
      </div>
    );

  return (
    <div className="mt-8">
      <h3 className="mb-4 text-xl font-semibold">Comments</h3>
      <ul className="space-y-6">
        {data
          .filter((comment) => comment.replyToId === null)
          .map((comment) => {
            return (
              <li key={comment.id}>
                <Comment
                  postId={postId}
                  comments={data}
                  comment={comment}
                  replyDepth={0}
                  replyingTo={replyingTo}
                  setReplyingTo={setReplyingTo}
                />
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default CommentsWrapper;
