"use client";

import { numberFormatter } from "@/config";
import { toast } from "@/hooks/useToast";
import axios from "axios";
import { Loader2, ScrollText, Search, Users2, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface TopicsOrUsersResponse {
  nameOrUsername: string;
  postsCount: number;
  subscriberOrFollowerCount: number;
}

const SearchTopicOrUser = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const [topicsOrUser, setTopicsOrUser] = useState<TopicsOrUsersResponse[]>([]);

  const fetchTopics = useCallback(async (text: string) => {
    try {
      setIsLoading(true);
      const { data } = (await axios.get(`/api/search?query=${text}`)) as {
        data: TopicsOrUsersResponse[];
      };
      setTopicsOrUser(data);
    } catch (error) {
      return toast({
        title: "Something went wrong!",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const conditionMetForTopicSearch =
      searchText.startsWith("t/") && searchText.length >= 5;
    const conditionMetForUserSearch =
      searchText.startsWith("u/") && searchText.length >= 5;
    const conditionMetForBothSearch =
      !searchText.startsWith("u/") &&
      !searchText.startsWith("t/") &&
      searchText.length >= 3;

    if (
      !conditionMetForTopicSearch &&
      !conditionMetForUserSearch &&
      !conditionMetForBothSearch
    ) {
      setTopicsOrUser([]);
      return;
    }
    if (!isFocused) return;
    const timer = setTimeout(async () => {
      await fetchTopics(searchText);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText, isFocused, fetchTopics]);

  return (
    <div className="relative max-w-xs shrink rounded-md border border-slate-200 text-slate-700 shadow-sm">
      <span className="absolute left-2 top-1/2 -translate-y-1/2 sm:left-4">
        {isloading ? (
          <Loader2 className="animate-spin text-slate-500" size={18} />
        ) : (
          <Search className="text-slate-500" size={18} />
        )}
      </span>
      <input
        className={`w-full rounded-t-md py-2 pl-7 pr-2 placeholder:text-sm sm:pl-10 sm:pr-4 focus-within:outline-none${
          topicsOrUser.length > 0
            ? " border-b border-slate-200"
            : " rounded-b-md"
        }`}
        type="text"
        placeholder={"Search for Topics Or User"}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {searchText.length > 0 && (
        <X
          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-500"
          size={18}
          onClick={() => {
            setSearchText("");
            setTopicsOrUser([]);
          }}
        />
      )}
      {topicsOrUser.length > 0 && (
        <ul className="absolute top-full z-20 w-full overflow-hidden rounded-b-md bg-white shadow">
          {topicsOrUser.map((topicsOrUser) => (
            <li key={topicsOrUser.nameOrUsername}>
              <Link
                className="flex w-full gap-4 bg-white px-4 py-2 text-sm hover:bg-slate-900/5"
                href={`/${topicsOrUser.nameOrUsername}`}
                onClick={() => {
                  setTopicsOrUser([]);
                  setSearchText("");
                }}
              >
                <span>{topicsOrUser.nameOrUsername}</span>
                <span className="ml-auto flex shrink-0 items-center gap-1">
                  <Users2 className="text-pink-300" size={18} />
                  {numberFormatter.format(
                    topicsOrUser.subscriberOrFollowerCount,
                  )}
                </span>
                <span className="flex shrink-0 items-center gap-1">
                  <ScrollText className="text-emerald-300" size={18} />
                  {numberFormatter.format(topicsOrUser.postsCount)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchTopicOrUser;
