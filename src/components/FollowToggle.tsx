"use client";

import { toast } from "@/hooks/useToast";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { Button, buttonVariants } from "./ui/button";

interface FollowToggleProps {
  username: string;
  isFollowing: boolean;
}

const FollowToggle: React.FC<FollowToggleProps> = ({
  username,
  isFollowing,
}) => {
  const router = useRouter();

  const { mutate: toggleFollowHandler, isLoading } = useMutation({
    mutationFn: async function () {
      const { data } = await axios.post("/api/follow", { username });
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
              title: "User does not exist.",
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
      onClick={() => toggleFollowHandler()}
      disabled={isLoading}
      className="w-full"
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowToggle;
