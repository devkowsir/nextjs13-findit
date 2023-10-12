"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";

const BackButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  let backText: null | string = null;

  backText = pathname === "/" ? null : "Home";

  return backText ? (
    <Button
      onClick={() => router.push("/")}
      variant={"outline"}
      size={"sm"}
      className="flex items-center gap-2 text-slate-700"
    >
      <ChevronLeft size={20} />
      <span className="pr-2">{backText}</span>
    </Button>
  ) : null;
};

export default BackButton;
