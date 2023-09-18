"use client";

import { ExtendedPost } from "@/types/db";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef } from "react";
import Post from "./Post";
import { Loader2 } from "lucide-react";

interface PostFeedProps {
  initialPosts: ExtendedPost[];
  topicName?: string;
  additionalQueryKey?: string[];
}

const PostFeed: React.FC<PostFeedProps> = ({
  initialPosts,
  topicName,
  additionalQueryKey,
}) => {
  const lastPostRef = useRef<HTMLElement>(null);
  const { entry, ref } = useIntersection({ root: lastPostRef.current });

  const { data, isFetchingNextPage, fetchNextPage } = useInfiniteQuery(
    ["infinite-post-query", ...(additionalQueryKey || [])],
    async function ({ pageParam = 1 }) {
      const queryUrl = [
        "/api/posts",
        `?page=${pageParam}`,
        topicName ? `&topicName=${topicName}` : "",
      ].join("");

      const { data } = await axios.get(queryUrl);
      return data as ExtendedPost[];
    },
    {
      getNextPageParam(_, pages) {
        return pages.length + 1;
      },
      initialData: { pages: [initialPosts], pageParams: [1] },
      // initialDataUpdatedAt: 0,
      keepPreviousData: false,
    },
  );

  useEffect(() => {
    if (entry?.isIntersecting) fetchNextPage();
  }, [entry]);

  const posts = data?.pages?.flatMap((page) => page) ?? initialPosts;

  return (
    <>
      <ul className="col-span-2 mt-8 flex flex-col space-y-6">
        {posts.map((post, index) => (
          <li
            {...(index === posts.length - 1 ? { ref } : {})}
            className="rounded-md bg-white shadow"
            key={post.id}
          >
            <Post post={post} />
          </li>
        ))}
      </ul>
      {isFetchingNextPage ? (
        <div className="my-12">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-center" />
        </div>
      ) : null}
    </>
  );
};

export default PostFeed;
