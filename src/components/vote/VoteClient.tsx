"use client";

import { toast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import { VoteRequest } from "@/lib/validators/vote";
import { VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

interface VoteClientProps {
  className?: string;
  initialUserVote: VoteType | null;
  initialVoteAmount: number;
  id: string;
  mutationUrl: string;
}

const VoteClient: React.FC<VoteClientProps> = ({
  initialUserVote,
  initialVoteAmount,
  id,
  mutationUrl,
  className,
}) => {
  const router = useRouter();
  const [userVote, setUserVote] = useState(initialUserVote || null);
  const [votesAmount, setVoteAmount] = useState(initialVoteAmount);

  const { mutate: vote } = useMutation({
    async mutationFn(type: VoteType) {
      const payload: VoteRequest = { type, id };
      const { data } = await axios.post(mutationUrl, payload);
      return data as { userVote: VoteType; votesAmount: number };
    },
    onMutate: (voteType) => {
      setUserVote((currVote) => (currVote === voteType ? null : voteType));
      setVoteAmount((currVoteAmount) =>
        userVote === voteType
          ? voteType === "UP"
            ? currVoteAmount - 1
            : currVoteAmount + 1
          : userVote === null
          ? voteType === "UP"
            ? currVoteAmount + 1
            : currVoteAmount - 1
          : voteType === "UP"
          ? currVoteAmount + 2
          : currVoteAmount - 2,
      );
    },
    onSuccess: (data) => {
      setUserVote(data.userVote);
      setVoteAmount(data.votesAmount);
    },
    onError(error) {
      router.refresh();
      if (error instanceof AxiosError) {
        switch (error.response?.status) {
          case 401:
            return toast({
              title: "You are not authorized.",
              description: "Please Sign In to create topic.",
              action: <Link href="/sign-in">Sign In</Link>,
              variant: "destructive",
            });

          case 409:
            return toast({
              title: "This topic already exists.",
              description: "Please provide a different name.",
              variant: "destructive",
            });

          case 500:
            return toast({
              title: "Something went wrong.",
              description: "Please let us know info@findit.com",
              variant: "destructive",
            });
        }
      } else {
        return toast({
          title: "Something went wrong.",
          description: "Please let us know info@findit.com",
          variant: "destructive",
        });
      }
    },
  });

  return (
    <div className={cn("flex items-center", className)}>
      <Button
        className="px-2"
        variant={"ghost"}
        size={"sm"}
        onClick={() => vote("UP")}
      >
        <ArrowBigUp
          className={`${
            userVote === "UP"
              ? "fill-emerald-400 stroke-emerald-400"
              : "stroke-slate-700"
          }`}
        />
      </Button>
      <span>{votesAmount}</span>
      <Button
        className="px-2"
        variant={"ghost"}
        size={"sm"}
        onClick={() => vote("DOWN")}
      >
        <ArrowBigDown
          className={`${
            userVote === "DOWN"
              ? "fill-rose-400 stroke-rose-400"
              : "stroke-slate-700"
          }`}
        />
      </Button>
    </div>
  );
};

export default VoteClient;
