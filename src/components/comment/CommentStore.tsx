"use client";

import { ExtendedComment } from "@/types/db";
import { useParams } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { SortMode } from "../feed/PostFeed";
import CommentForm from "./CommentForm";
import CommentsSection from "./CommentsSection";

interface CommentStore {
  comments: ExtendedComment[];
  sortMode: SortMode;
  addComment: (comment: ExtendedComment) => void;
  addFetchedComments: (fetchedComments: ExtendedComment[]) => void;
  updateComment: (commentId: string, comment: Partial<ExtendedComment>) => void;
  deleteComment: (commentId: string) => void;
  setComments: Dispatch<SetStateAction<ExtendedComment[]>>;
  setSortMode: Dispatch<SetStateAction<SortMode>>;
}

export const CommentContext = createContext<CommentStore | null>(null);

const CommentsProvider = ({
  comments: initialComments,
}: {
  comments: ExtendedComment[];
}) => {
  const { postId } = useParams() as { postId: string };
  const [comments, setComments] = useState<ExtendedComment[]>(initialComments);
  const [sortMode, setSortMode] = useState<SortMode>("top");

  const addComment = (comment: ExtendedComment) => {
    setComments((prevComments) => {
      if (!comment.replyToId) return [...prevComments, comment];

      const parentCommentIndex = prevComments.findIndex(
        (prevComment) => prevComment.id === comment.replyToId,
      );

      return [
        ...prevComments.map((comment, index) => {
          if (index !== parentCommentIndex) return comment;
          comment.repliesCount++;
          return comment;
        }),
        comment,
      ];
    });
  };

  const addFetchedComments = (fetchedComments: ExtendedComment[]) => {
    setComments((prevComments) => [...prevComments, ...fetchedComments]);
  };

  const updateComment = (
    commentId: string,
    comment: Partial<ExtendedComment>,
  ) => {
    setComments((prevComments) => {
      const commentIndex = prevComments.findIndex(
        (prevComment) => prevComment.id === commentId,
      );
      return prevComments.map((prevComment, index) => {
        if (index === commentIndex) return { ...prevComment, ...comment };
        return prevComment;
      });
    });
  };

  const deleteComment = (commentId: string) => {
    setComments((prevComments) => {
      const commentIndex = prevComments.findIndex(
        (prevComment) => prevComment.id === commentId,
      );
      if (prevComments[commentIndex].replyToId) {
        const parentComment = prevComments.find(
          (prevComment) =>
            prevComment.id === prevComments[commentIndex].replyToId,
        );
        if (parentComment)
          parentComment.repliesCount = parentComment.repliesCount--;
      }

      return prevComments.filter((_, index) =>
        index === commentIndex ? false : true,
      );
    });
  };

  return (
    <CommentContext.Provider
      value={{
        comments,
        sortMode,
        addComment,
        addFetchedComments,
        updateComment,
        deleteComment,
        setComments,
        setSortMode,
      }}
    >
      <div id="comments" className="mt-4 flex flex-col gap-2">
        <p className="text-lg">Your Comment</p>
        <CommentForm postId={postId} />
      </div>
      <CommentsSection />
    </CommentContext.Provider>
  );
};

export const useComment = () => {
  const Comment = useContext(CommentContext);
  if (!Comment)
    throw "Comment context value is null. Please make sure that context is provided to this component.";
  return Comment;
};

export default CommentsProvider;
