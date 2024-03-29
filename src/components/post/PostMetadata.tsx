"use client";

import { numberFormatter } from "@/config";
import { formatTimeToNow } from "@/lib/utils";
import Link from "next/link";
import { useRef, useState } from "react";
import useHoverLogic from "../../hooks/useHoverLogic";
import { buttonVariants } from "../ui/button";

interface PostMetadataProps {
  topicName?: string;
  username: string;
  userId: string;
  createdAt: Date;
}

interface TopicInfo {
  name: string;
  description: string;
  createdAt: Date;
  postCount: number;
  subscriberCount: number;
}

interface UserSummary {
  id: string;
  name: string;
  username: string;
  bio?: string;
  postsCreated: number;
  topicsCreated: number;
  followedBy: number;
}

const PostMetadata: React.FC<PostMetadataProps> = ({
  topicName,
  username,
  userId,
  createdAt,
}) => {
  const [topicInfo, setTopicInfo] = useState<TopicInfo>();
  const topicRef = useRef<HTMLDivElement>(null);
  const { isVisible: isTopicInfoVisible } = useHoverLogic({
    ref: topicRef,
    searchUrl: `/api/topic?topicName=${topicName}`,
    data: topicInfo,
    setData: setTopicInfo,
  });

  const [userSummary, setUserSummary] = useState<UserSummary>();
  const userRef = useRef<HTMLDivElement>(null);
  const { isVisible: isUserRefVisible } = useHoverLogic({
    ref: userRef,
    searchUrl: `/api/user?userId=${userId}`,
    data: userSummary,
    setData: setUserSummary,
  });

  const topicMeta = topicName ? (
    <>
      <div className="rounded bg-slate-50 px-2 py-1" ref={topicRef}>
        <Link
          className="py-1 font-semibold underline-offset-2 hover:underline"
          href={`/t/${topicName}`}
        >
          t/{topicName}
        </Link>

        {isTopicInfoVisible &&
          (topicInfo ? (
            <div className="absolute top-full z-10 w-80 space-y-2 rounded-md bg-slate-50 px-3 py-2 shadow">
              <h3 className="text-lg font-semibold text-slate-700">
                {topicName}
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-sm bg-slate-100 px-1 py-0.5">
                  {numberFormatter.format(topicInfo.subscriberCount)} members
                </span>
                <Seperator />
                <span className="rounded-sm bg-slate-100 px-1 py-0.5">
                  {numberFormatter.format(topicInfo.postCount)} posts
                </span>
                <Seperator />
                <span className="rounded-sm bg-slate-100 px-1 py-0.5">
                  created {formatTimeToNow(new Date(topicInfo.createdAt))}
                </span>
              </div>
              {topicInfo.description ? (
                <p className="py-1 text-xs">
                  {topicInfo.description.length > 128
                    ? topicInfo.description.slice(0, 125).concat("...")
                    : topicInfo.description}
                </p>
              ) : null}
              <Link
                className={buttonVariants({
                  size: "sm",
                  variant: "outline",
                })}
                href={`/t/${topicName}`}
              >
                View Topic
              </Link>
            </div>
          ) : (
            <></>
          ))}
      </div>
      <Seperator />
    </>
  ) : null;

  const authorMeta = (
    <div ref={userRef} className="rounded bg-slate-50 px-2 py-1">
      <span className="hidden min-[400px]:inline">Posted </span>by{" "}
      <Link
        href={`/u/${username}`}
        className="cursor-pointer underline-offset-2 hover:underline"
      >{`u/${username}`}</Link>
      {isUserRefVisible &&
        (userSummary ? (
          <div className="absolute top-full z-10 w-80 space-y-2 rounded-md bg-slate-50 px-3 py-2 shadow">
            <div>
              <h3 className="text-lg font-semibold text-slate-700">
                {userSummary.name}
              </h3>
              <span>u/{userSummary.username}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-sm bg-slate-100 px-1 py-0.5">
                {numberFormatter.format(userSummary.postsCreated)} posts
              </span>
              <Seperator />
              <span className="rounded-sm bg-slate-100 px-1 py-0.5">
                {numberFormatter.format(userSummary.followedBy)} followers
              </span>
            </div>
            {userSummary.bio && (
              <p>
                {userSummary.bio.length > 128
                  ? userSummary.bio.slice(0, 125).concat("...")
                  : userSummary.bio}
              </p>
            )}
            <Link
              className={buttonVariants({
                size: "sm",
                variant: "outline",
              })}
              href={`/u/${username}`}
            >
              View Profile
            </Link>
          </div>
        ) : null)}
    </div>
  );

  return (
    <div className="relative flex items-center gap-2 text-xs text-slate-700">
      {topicMeta}
      {authorMeta}
      <Seperator />
      <span className="rounded-sm bg-slate-50 px-2 py-1">
        {formatTimeToNow(new Date(createdAt))}
      </span>
    </div>
  );
};

export default PostMetadata;

const Seperator = () => (
  <span className="inline-block h-1 w-1 rounded-full bg-slate-950" />
);
