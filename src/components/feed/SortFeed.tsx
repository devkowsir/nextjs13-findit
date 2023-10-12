"use client";

import { Award, ChevronRight, Flame, ListRestart } from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Button } from "../ui/button";
import type { SortMode } from "./PostFeed";
import useOnClickOutside from "@/hooks/useOnClickOutside";

interface SortFeedProps {
  sortMode: SortMode;
  setSortMode: Dispatch<SetStateAction<SortMode>>;
}

const sortIcons: Record<SortMode, JSX.Element> = {
  new: <ListRestart size={20} />,
  hot: <Flame size={20} />,
  top: <Award size={20} />,
};

const SortButton = ({ sortMode }: { sortMode: SortMode }) => (
  <Button size={"sm"} variant={"outline"} className="flex gap-2 text-slate-700">
    <span className="capitalize">{sortMode}</span>
    {sortIcons[sortMode]}
  </Button>
);

const SortFeed: React.FC<SortFeedProps> = ({ sortMode, setSortMode }) => {
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef(null);

  useOnClickOutside(() => setIsFocused(false), ref);

  return (
    <div className="relative ml-auto flex text-slate-700">
      <Button
        onClick={() => setIsFocused((prev) => !prev)}
        variant={"outline"}
        className="flex w-32 gap-2 pl-1"
      >
        <ChevronRight
          size={20}
          className={`transition-transform ${
            isFocused ? "rotate-90" : "rotate-0"
          }`}
        />
        <span className="capitalize">{sortMode}</span>
        {sortIcons[sortMode]}
      </Button>
      {isFocused && (
        <ul
          ref={ref}
          className="absolute left-0 top-full z-10 flex w-full translate-y-0.5 flex-col rounded border bg-white"
        >
          {Object.keys(sortIcons).map((name) => (
            <li
              key={name}
              onClick={() => {
                setSortMode(name as SortMode);
                setIsFocused(false);
              }}
              className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 hover:bg-accent"
            >
              <span className="text-sm capitalize">{name}</span>
              {sortIcons[name as SortMode]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SortFeed;
