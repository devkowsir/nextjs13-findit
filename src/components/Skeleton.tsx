"use client";

import { cn } from "@/lib/utils";
import { random } from "@/lib/utils";

interface SkeletonTextProps {
  noOfWords: number;
  fontSize: number;
  className?: string;
}

export const SkeletonText = ({
  noOfWords,
  fontSize,
  className,
}: SkeletonTextProps) => (
  <div
    className={cn("flex flex-wrap", className)}
    style={{ rowGap: `${fontSize * 0.3}px`, columnGap: `${fontSize * 0.5}px` }}
  >
    {new Array(noOfWords).fill(null).map((_, index) => (
      <div
        key={index}
        className="skeleton rounded-sm"
        style={{
          height: `${fontSize}px`,
          width: `${Math.round(fontSize * 0.5 * random(3, 10))}px`,
        }}
      />
    ))}
  </div>
);
