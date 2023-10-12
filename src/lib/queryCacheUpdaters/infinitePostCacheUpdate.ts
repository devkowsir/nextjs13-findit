import { ExtendedPost } from "@/types/db";
import { QueryClient } from "@tanstack/react-query";

export interface InfinitePostCache {
  pages: ExtendedPost[][];
  pageParams: number[];
}

export const setInfinitePostsCache = (
  postId: string,
  partialOrUpdater:
    | Partial<ExtendedPost>
    | ((old: ExtendedPost) => ExtendedPost),
  queryClient: QueryClient,
) => {
  queryClient.setQueriesData(
    { queryKey: ["infinite-post"], exact: false },
    (infinitePostCache: InfinitePostCache | undefined) => {
      if (!infinitePostCache) return undefined;
      const updatedCache = structuredClone(infinitePostCache);

      const pages = updatedCache.pages;
      for (let i = 0; i < pages.length; i++) {
        const j = pages[i].findIndex((post) => post.id === postId);
        if (j >= 0) {
          if (typeof partialOrUpdater === "function")
            pages[i][j] = { ...partialOrUpdater(pages[i][j]) };
          else pages[i][j] = { ...pages[i][j], ...partialOrUpdater };
          break;
        }
      }
      return { pages: [...pages], pageParams: [...updatedCache.pageParams] };
    },
  );
};
