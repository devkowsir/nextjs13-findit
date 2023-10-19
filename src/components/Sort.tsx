"use client";

import useOnClickOutside from "@/hooks/useOnClickOutside";
import { Award, ChevronRight, Flame, ListRestart } from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Button } from "./ui/button";
import type { SortMode } from "./feed/PostFeed";

interface SortProps {
  sortMode: SortMode;
  setSortMode: Dispatch<SetStateAction<SortMode>>;
}

export const sortIcons: Record<SortMode, JSX.Element> = {
  new: <ListRestart size={20} />,
  hot: <Flame size={20} />,
  top: <Award size={20} />,
};

const Sort: React.FC<SortProps> = ({ sortMode, setSortMode }) => {
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef(null);

  useOnClickOutside(() => setIsFocused(false), ref);

  return (
    <div className="relative mb-4 ml-auto flex text-base text-slate-700">
      <Button
        onClick={() => setIsFocused((prev) => !prev)}
        size={"sm"}
        variant={"outline"}
        className="flex w-[100px] gap-2 p-2"
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
              className="flex w-full cursor-pointer items-center gap-2 px-3 py-1 hover:bg-accent"
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

export default Sort;
