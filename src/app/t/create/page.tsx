"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CreateTopicPayload } from "@/lib/validators/topic";
import { toast } from "@/hooks/useToast";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { NAME_REGEX } from "@/config";

const CreateCommunity = () => {
  const [name, setName] = useState("");
  const router = useRouter();
  const validName = NAME_REGEX.test(name);

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateTopicPayload = { name };
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

  return (
    <main className="container">
      <div className="rounded-lg bg-white px-4 py-6 shadow">
        <h1 className="text-2xl font-bold text-slate-700 md:text-3xl">
          Create Community
        </h1>
        <div className="my-4 h-[1px] w-full bg-slate-700" />

        <div className="space-y-4">
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
                name="name"
                className="w-full rounded-md border px-4 py-2 pl-6 text-slate-800"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
              className="disabled:contrast-[90]"
              disabled={isLoading || !validName}
              onClick={() => createCommunity()}
            >
              Create Community
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreateCommunity;
