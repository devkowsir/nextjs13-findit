import { ExtendedComment } from "@/types/db";
import { QueryClient } from "@tanstack/react-query";

/* 
  This code is intentionally changing the state mutably. 
  Reason - structuralSharing (in `useQuery` hook) allows us to merge 
  old data to newly fetched on user click. When immutably updating the cache
  state, state update gets triggered and due to structuralSharing data 
  redundancy occurs. To prevent state change, update is performed mutably. 
*/

export const setCommentsCache = (
  postId: string,
  commentId: string,
  partialCommentOrUpdaterFunction:
    | Partial<ExtendedComment>
    | ((old: ExtendedComment) => void),
  queryClient: QueryClient,
) => {
  const oldData: ExtendedComment[] | undefined = queryClient.getQueryData([
    "comments",
    postId,
  ]);
  if (!oldData) return;
  const indexOfTheCommentInCache = oldData.findIndex(
    (comment) => comment.id === commentId,
  );
  if (indexOfTheCommentInCache >= 0) {
    if (typeof partialCommentOrUpdaterFunction === "function") {
      const updaterFunction = partialCommentOrUpdaterFunction;
      updaterFunction(oldData[indexOfTheCommentInCache]);
    } else {
      const partialComment = partialCommentOrUpdaterFunction;
      Object.keys(partialComment).forEach((key) => {
        // @ts-ignore
        oldData[indexOfTheCommentInCache][key] = partialComment[key];
      });
    }
  }
};

export const addToCommentsCache = (
  postId: string,
  comment: ExtendedComment,
  queryClient: QueryClient,
) => {
  // due to structuralSharing function, `[comment]` will be merged with the old datas.
  queryClient.setQueryData(
    ["comments", postId],
    // @ts-ignore
    [comment],
  );
  if (comment.replyToId) {
    setCommentsCache(
      postId,
      comment.replyToId,
      (old) => (old.repliesCount = old.repliesCount++),
      queryClient,
    );
  }
};

export function deleteFromCommentsCache(
  postId: string,
  commentId: string,
  queryClient: QueryClient,
) {
  const oldData: ExtendedComment[] | undefined = queryClient.getQueryData([
    "comments",
    postId,
  ]);
  if (!oldData) return;

  const commentIndex = oldData.findIndex((comment) => comment.id === commentId);
  if (commentIndex < 0) return;

  const comment = oldData[commentIndex];
  if (comment.replyToId) {
    setCommentsCache(
      postId,
      comment.replyToId,
      (old) => old.repliesCount--,
      queryClient,
    );
  }
  oldData.splice(commentIndex, 1);
}
