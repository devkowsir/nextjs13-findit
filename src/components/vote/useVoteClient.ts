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
import { useReducer } from "react";

interface UseVoteClientProps {
  postIdOrCommentId: string;
  initialUserVote: VoteType | null;
  initialRating: number;
  mutationUrl: string;
  cacheUpdater: (
    data: { userVote: VoteType | null; rating: number },
    queryClient: QueryClient,
  ) => void;
}

interface VoteStore {
  currRating: number;
  prevRating: number;
  currVote: VoteType | null;
  prevVote: VoteType | null;
}

type ACTIONTYPE =
  | { type: "VOTE"; payload: VoteType }
  | { type: "SET"; payload: { rating: number; vote: VoteType | null } }
  | { type: "RESET" };

function reducer(state: VoteStore, action: ACTIONTYPE): VoteStore {
  switch (action.type) {
    case "VOTE":
      let currRating: number;
      const currVote =
        state.currVote === action.payload ? null : action.payload;

      if (state.currVote === action.payload) {
        currRating =
          action.payload === "UP" ? state.currRating - 1 : state.currRating + 1;
      } else if (state.currVote === null) {
        currRating =
          action.payload === "UP" ? state.currRating + 1 : state.currRating - 1;
      } else {
        currRating =
          action.payload === "UP" ? state.currRating + 2 : state.currRating - 2;
      }

      return {
        currRating,
        prevRating: state.currRating,
        currVote,
        prevVote: state.currVote,
      };

    case "SET":
      return {
        ...state,
        currRating: action.payload.rating,
        currVote: action.payload.vote,
      };

    case "RESET":
      return {
        currRating: state.prevRating,
        prevRating: state.prevRating,
        currVote: state.prevVote,
        prevVote: state.prevVote,
      };

    default:
      throw new Error("Invalid action to the reducer.");
  }
}

const useVoteClient = ({
  postIdOrCommentId: id,
  initialUserVote,
  initialRating,
  mutationUrl,
  cacheUpdater,
}: UseVoteClientProps) => {
  const queryClient = useQueryClient();
  const initialState: VoteStore = {
    currRating: initialRating,
    prevRating: initialRating,
    currVote: initialUserVote,
    prevVote: initialUserVote,
  };
  const [{ currRating, currVote }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  const { mutate: updateVote, isLoading } = useMutation({
    async mutationFn(type: VoteType) {
      const payload: VoteRequest = { type, id };
      const { data } = await axios.post(mutationUrl, payload);
      return data as { userVote: VoteType | null; rating: number };
    },
    onMutate: (voteType) => {
      dispatch({ type: "VOTE", payload: voteType });
    },
    onSuccess: (data) => {
      dispatch({
        type: "SET",
        payload: { rating: data.rating, vote: data.userVote },
      });
      cacheUpdater(data, queryClient);
    },
    onError(error) {
      dispatch({ type: "RESET" });
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

  return { userVote: currVote, rating: currRating, updateVote, isLoading };
};

export default useVoteClient;
