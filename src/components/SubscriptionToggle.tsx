"use client";

import { toast } from "@/hooks/useToast";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { Button, buttonVariants } from "./ui/button";

interface SubscriptionToggleProps {
  topicName: string;
  isSubscribed: boolean;
}

const SubscriptionToggle: React.FC<SubscriptionToggleProps> = ({
  topicName,
  isSubscribed,
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
        title: data,
      });
    },
  });

  return (
    <Button
      onClick={() => toggleSubscriptionHandler()}
      disabled={isLoading}
      className="w-full"
      variant={isSubscribed ? "outline" : "default"}
    >
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  );
};

export default SubscriptionToggle;
