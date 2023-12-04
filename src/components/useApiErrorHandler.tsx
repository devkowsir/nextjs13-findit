"use client";

import { useToast } from "@/hooks/useToast";
import { AxiosError } from "axios";
import { Button } from "./ui/button";
import { useDialogStore } from "./ui/dialog";

interface ApiErrorHandlerProps {
  error: unknown;
  config?: Record<number, string[]>;
}

const useApiErrorHandler = () => {
  const { setDialogToShow } = useDialogStore();
  const { toast, dismiss } = useToast();

  return ({ error, config }: ApiErrorHandlerProps) => {
    if (error instanceof AxiosError) {
      switch (error.response?.status) {
        case 400:
          console.table({ name: error.name, message: error.message });
          return toast({
            title: config?.[400][0] || "Bad Request",
            description:
              config?.[400][1] || "Please let us know at error@findit.com",
            variant: "destructive",
          });

        case 401:
          console.table({ name: error.name, message: error.message });
          return toast({
            title: config?.[401][0] || "Unauthorized",
            description: config?.[401][1] || "Please Sign In to create topic.",
            variant: "destructive",
            action: (
              <Button
                variant={"outline"}
                onClick={() => {
                  setDialogToShow("sign-in");
                  dismiss();
                }}
                className="bg-transparent"
              >
                Sign In
              </Button>
            ),
          });

        case 403:
          console.table({ name: error.name, message: error.message });
          return toast({
            title: config?.[403][0] || "Forbidden",
            description:
              config?.[403][1] || "Server is refusing to perform your request",
            variant: "destructive",
          });

        case 409:
          console.table({ name: error.name, message: error.message });
          return toast({
            title: config?.[409][0] || "Conflict",
            description:
              config?.[409][1] || "Content conflicts with older content.",
            variant: "destructive",
          });

        case 500:
          console.table({ name: error.name, message: error.message });
          return toast({
            title: config?.[500][0] || "Internal Server Error",
            description:
              config?.[500][1] || "Please let us know at error@findit.com",
            variant: "destructive",
          });

        default:
          console.table({ name: error.name, message: error.message });
          return toast({
            title: error.name,
            description: error.message,
            variant: "destructive",
          });
      }
    } else {
      console.error(error);
      return toast({
        title: "Something went wrong.",
        description: "Please let us know at error@findit.com",
        variant: "destructive",
      });
    }
  };
};

export default useApiErrorHandler;
