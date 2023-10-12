"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/useToast";
import {
  CreateTopicPayload,
  TopicCreationRequestValidator,
} from "@/lib/validators/topic";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";

const CreateTopic = () => {
  const router = useRouter();

  const {
    formState: { errors, isValid, isLoading },
    register,
    handleSubmit,
  } = useForm({
    defaultValues: { name: "", description: "" },
    resolver: zodResolver(TopicCreationRequestValidator),
  });

  const { mutate: createTopic } = useMutation({
    mutationFn: async (payload: CreateTopicPayload) => {
      const { data } = await axios.post("/api/topic", payload);
      return data as string;
    },
    onError(error) {
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

          case 422:
            return toast({
              title: "Name is not valid.",
              description:
                "Name should be 3 to 20 characters long, cannot contain spaces or any special character except _.",
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
    onSuccess: (data) => {
      router.push(`/t/${data}`);
    },
  });

  useEffect(() => {
    for (const [_, value] of Object.entries(errors)) {
      toast({ description: (value as { message: string }).message });
    }
  }, [errors]);

  const onSubmit = (payload: CreateTopicPayload) => {
    createTopic(payload);
  };

  return (
    <main className="container max-w-xl">
      <div className="rounded-lg bg-white px-4 py-6 shadow">
        <h1 className="text-2xl font-bold text-slate-700 md:text-3xl">
          Create Community
        </h1>
        <div className="my-4 h-[1px] w-full bg-slate-700" />

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h2 className="text-2xl text-slate-700">Name</h2>
            <p className="text-sm text-slate-600">
              {`
              Cannot include spaces and any special character except '_'.
              Community names including capitalization cannot be changed.`}
            </p>

            <div className="relative mt-2">
              <p className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">
                t/
              </p>
              <input
                type="text"
                className="w-full rounded-md border px-4 py-2 pl-6 text-slate-800"
                {...register("name")}
              />
            </div>
          </div>

          <div>
            <h2 className="text-2xl text-slate-700">Description</h2>
            <p className="text-sm text-slate-600">
              {`Add a optional description which is highly appreciated. You can include 
              the scope of this topic, rules to be followed etc.`}
            </p>

            <TextareaAutosize
              className="my-2 w-full rounded-md border px-3 py-2 text-slate-800"
              {...register("description")}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={() => router.back()}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              className="disabled:contrast-50"
              disabled={isLoading || !isValid}
              type="submit"
            >
              Create Topic
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateTopic;
