"use client";

import Post from "@/components/feed/Post";
import { ExtendedPost } from "@/types/db";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Sort from "../Sort";
import BackButton from "./BackButton";
import PostFallBack from "./PostFallback";
import { ErrorBoundary } from "react-error-boundary";

interface PostFeedProps {
  initialPosts: ExtendedPost[];
  topicName?: string;
  authorId?: string;
  additionalQueryKeys?: string[];
}

export type SortMode = "new" | "hot" | "top";

const PostFeed: React.FC<PostFeedProps> = ({
  initialPosts,
  topicName,
  authorId,
  additionalQueryKeys,
}) => {
  const [sortMode, setSortMode] = useState<SortMode>("new");

  const initialData = () =>
    sortMode === "new" ? { pages: [initialPosts], pageParams: [1] } : undefined;

  const { data, isFetchingNextPage, fetchNextPage } = useInfiniteQuery(
    ["infinite-post", ...(additionalQueryKeys || []), sortMode],
    async function ({ pageParam = 1 }) {
      const queryUrl = [
        "/api/posts",
        `?page=${pageParam}`,
        `&sort-mode=${sortMode}`,
        topicName ? `&topicName=${topicName}` : "",
        authorId ? `&authorId=${authorId}` : "",
      ].join("");

      const { data } = await axios.get(queryUrl);
      return data as ExtendedPost[];
    },
    {
      getNextPageParam(_, pages) {
        return pages.length + 1;
      },
      initialData,
      staleTime: 10 * 60 * 1000,
      keepPreviousData: false,
    },
  );

  const lastPostRef = useRef<HTMLLIElement>(null);
  const { entry, ref } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) fetchNextPage();
  }, [entry, fetchNextPage]);

  const posts = data?.pages?.flatMap((page) => page) ?? initialPosts;

  return (
    <ErrorBoundary fallback={<div>Something Went Wrong</div>}>
      <div className="pb-8">
        <div className="flex items-center">
          <BackButton />
          <Sort sortMode={sortMode} setSortMode={setSortMode} />
        </div>
        {posts.length > 0 ? (
          <ul className="col-span-2 flex flex-col space-y-6">
            {posts.map((post, index) => (
              <Post
                ref={index === posts.length - 1 ? ref : null}
                key={post.id}
                post={post}
              />
            ))}
            {isFetchingNextPage && <PostFallBack />}
          </ul>
        ) : (
          <div className="text-center text-lg font-semibold capitalize text-slate-700">
            {sortMode} Posts Not Found.
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default PostFeed;
