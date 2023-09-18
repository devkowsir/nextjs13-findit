"use client";

import { useEffect } from "react";

const useOnClickOutside = (
  execute: () => void,
  referecne: React.RefObject<any>,
) => {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      const target = referecne.current;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        execute();
      }
    };
    document.addEventListener("click", listener);

    return () => document.removeEventListener("click", listener);
  }, [execute, referecne]);
};

export default useOnClickOutside;
