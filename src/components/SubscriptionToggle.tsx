"use client";

import axios, { AxiosError } from "axios";
import { Button, buttonVariants } from "./ui/button";
import { toast } from "@/hooks/useToast";
import Link from "next/link";
import { subscribe } from "diagnostics_channel";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { startTransition } from "react";

interface SubscriptionToggleProps {
  topicName: string;
  subscribed: boolean;
}

const SubscriptionToggle: React.FC<SubscriptionToggleProps> = ({
  topicName,
  subscribed,
}) => {
  const router = useRouter();

  const { mutate: toggleSubscriptionHandler, isLoading } = useMutation({
    mutationFn: async function () {
      const { data } = await axios.post("/api/subscription", { topicName });
      return data as string;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        switch (error.response?.status) {
          case 401:
            return toast({
              title: "You are not authorized.",
              description: "Sign in to modify suscription status.",
              action: (
                <Link
                  className={buttonVariants({ variant: "secondary" })}
                  href="/sign-in"
                >
                  Sing In
                </Link>
              ),
              variant: "destructive",
            });

          case 422:
            return toast({
              title: "Topic does not exist.",
              description: "Please contact with us at info@findit.com",
              variant: "destructive",
            });
        }
      } else {
        return toast({
          title: "Something went wrong.",
          description: "Please contact with us at info@findit.com",
          variant: "destructive",
        });
      }
    },
    onSuccess: (data) => {
      startTransition(() => {
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh();
      });
      toast({
        title: `${data.split(" ")[0]}!`,
        description: data,
      });
    },
  });

  return (
    <>
      <Button
        onClick={() => toggleSubscriptionHandler()}
        disabled={isLoading}
        className="w-full"
      >
        {subscribed ? "Leave Community" : "Join Community"}
      </Button>
      {subscribed ? (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            router.push(`${topicName}/submit`);
          }}
        >
          Create Post
        </Button>
      ) : null}
    </>
  );
};

export default SubscriptionToggle;
