"use client";

import { toast } from "@/hooks/useToast";
import { VoteRequest } from "@/lib/validators/vote";
import { VoteType } from "@prisma/client";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UseVoteClientProps {
  postIdOrCommentId: string;
  initialUserVote: VoteType | null;
  initialVotesAmount: number;
  mutationUrl: string;
  cacheUpdater: (data: any, queryClient: QueryClient) => void;
}

const useVoteClient = ({
  postIdOrCommentId: id,
  initialUserVote,
  initialVotesAmount,
  mutationUrl,
  cacheUpdater,
}: UseVoteClientProps) => {
  const router = useRouter();
  const [userVote, setUserVote] = useState(initialUserVote);
  const [votesAmount, setVoteAmount] = useState(initialVotesAmount);
  const queryClient = useQueryClient();

  const { mutate: updateVote } = useMutation({
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
      cacheUpdater(data, queryClient);
    },
    onError(error) {
      router.refresh();
      if (error instanceof AxiosError) {
        switch (error.response?.status) {
          case 401:
            return toast({
              title: "You are not authorized.",
              description: "Please Sign In to create topic.",
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

  return { userVote, votesAmount, updateVote };
};

export default useVoteClient;
