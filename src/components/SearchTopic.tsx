"use client";

import { toast } from "@/hooks/useToast";
import axios from "axios";
import { Loader2, ScrollText, Search, Users2, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface TopicsResponse {
  name: string;
  _count: {
    posts: number;
    subscribers: number;
  };
}

const SearchTopic = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const [topics, setTopics] = useState<TopicsResponse[]>([]);

  const fetchTopics = useCallback(async (text: string) => {
    try {
      setIsLoading(true);
      const { data } = (await axios.get(`/api/topic?query=${text}`)) as {
        data: TopicsResponse[];
      };
      setTopics(data);
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
    if (searchText.length < 3) {
      setTopics([]);
      return;
    }
    if (!isFocused) return;
    const timer = setTimeout(async () => {
      await fetchTopics(searchText);
      console.log("effect running");
    }, 300);

    return () => {
      console.log("cleanup running");
      clearTimeout(timer);
    };
  }, [searchText, isFocused]);

  const placeholderText = isFocused
    ? "Type at least 3 letters"
    : "Search for Topics";

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
          topics.length > 0 ? " border-b border-slate-200" : " rounded-b-md"
        }`}
        type="text"
        placeholder={placeholderText}
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
            setTopics([]);
          }}
        />
      )}
      {topics.length > 0 && (
        <ul className="absolute top-full z-20 w-full overflow-hidden rounded-b-md bg-white shadow">
          {topics.map(({ name, _count }) => (
            <li key={name}>
              <Link
                className="flex w-full gap-4 bg-white px-4 py-2 text-sm hover:bg-slate-900/5"
                href={`/t/${name}`}
                onClick={() => {
                  setTopics([]);
                  setSearchText("");
                }}
              >
                <span>{name}</span>
                <span className="ml-auto flex shrink-0 items-center gap-1">
                  <Users2 className="text-pink-300" size={18} />
                  {_count.subscribers}
                </span>
                <span className="flex shrink-0 items-center gap-1">
                  <ScrollText className="text-emerald-300" size={18} />
                  {_count.posts}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchTopic;
