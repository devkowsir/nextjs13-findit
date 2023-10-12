"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

interface ChooseTopicProps {
  setTopicName: Dispatch<SetStateAction<string>>;
  topicName: string | undefined;
}

const ChooseTopic: React.FC<ChooseTopicProps> = ({
  setTopicName,
  topicName,
}) => {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [searchText, setSearchText] = useState(
    topicName ? `t/${topicName}` : "",
  );
  const [isFocused, setIsFocused] = useState(false);
  const chooseTopicRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSusbscriptions = () => {
      fetch("/api/subscription")
        .then((res) => res.json())
        .then((data: string[]) =>
          setSubscriptions(data.map((subscription) => `t/${subscription}`)),
        );
    };
    fetchSusbscriptions();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      // @ts-ignore
      if (!chooseTopicRef.current?.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("click", handler);

    return () => document.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    if (
      subscriptions
        .map((subscription) => subscription.toLowerCase())
        .includes(searchText.toLowerCase())
    ) {
      setTopicName(searchText.replace(/^t\//, ""));
      router.replace(`/${searchText}/create`);
    }
  }, [searchText, subscriptions]);

  return (
    <div className="flex text-sm text-slate-700">
      <div ref={chooseTopicRef} className="relative">
        <div className="flex items-center rounded-md border border-slate-300 bg-transparent p-2 pr-4">
          <ChevronRight
            className={`${
              isFocused ? "rotate-90" : "rotate-0"
            } stroke-slate-600 transition-transform`}
            size={16}
          />
          <input
            type="text"
            name="Choose Topic To Post"
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            onFocus={() => setIsFocused(true)}
            placeholder="Choose Topic To Post"
            style={{ all: "unset" }}
            className="text-sm"
          />
        </div>
        {isFocused && (
          <ul className="absolute left-0 top-full m-0 max-h-48 w-full translate-y-1 list-none divide-y overflow-y-scroll rounded-md bg-slate-100 p-0 shadow-md [&>*]:m-0">
            {subscriptions
              .filter((subscription) =>
                subscription.toLowerCase().includes(searchText.toLowerCase()),
              )
              .map((subscription) => (
                <li
                  className="cursor-pointer px-4 py-1 hover:cursor-pointer hover:bg-slate-200"
                  key={subscription}
                  tabIndex={1}
                  onClick={() => {
                    setSearchText(subscription);
                    setIsFocused(false);
                  }}
                >
                  {subscription}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChooseTopic;
