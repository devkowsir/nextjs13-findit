"use client";

import { toast } from "@/hooks/useToast";
import {
  TopicDescription,
  TopicDescriptionChangeValidator,
} from "@/lib/validators/topic";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "./ui/button";
import Dialog, { useDialogStore } from "./ui/dialog";

const EditTopic = ({ description }: { description: string | null }) => {
  const { dialogToShow, setDialogToShow } = useDialogStore();

  return (
    <>
      <Button
        variant={"outline"}
        className="w-full"
        onClick={() => setDialogToShow("topic")}
      >
        Edit Topic
      </Button>
      {dialogToShow === "topic" && (
        <Dialog onCloseAction={() => setDialogToShow(null)}>
          <div className="space-y-6 text-left">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-zinc-800 md:text-4xl">
                Edit Topic
              </h1>
              <p className="text-sm text-zinc-700">
                Description should conatain scope. rules and other relevant
                informations. It is highly appreciated to include a description.
              </p>
            </div>
          </div>

          <TopicInfoForm
            description={description}
            setDialogToShow={setDialogToShow}
          />
        </Dialog>
      )}
    </>
  );
};

export default EditTopic;

const TopicInfoForm = ({
  description,
  setDialogToShow,
}: {
  description: string | null;
  setDialogToShow: (newDialogToShow: string | null) => void;
}) => {
  const router = useRouter();

  const {
    formState: { errors, isValid, isDirty },
    handleSubmit,
    register,
  } = useForm<TopicDescription>({
    defaultValues: { description },
    resolver: zodResolver(TopicDescriptionChangeValidator),
  });

  const onSubmit = async (payload: TopicDescription) => {
    if (description === payload.description) {
      return toast({
        title: "You have to change description to change the data.",
      });
    }
    try {
      await axios.post(`/api/user`, payload);
      location.reload();
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  useEffect(() => {
    for (const [_, value] of Object.entries(errors)) {
      toast({ description: (value as { message: string }).message });
    }
  }, [errors]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-4 flex flex-col gap-4"
    >
      <label className="text-left text-sm text-slate-700">
        Description
        <TextareaAutosize
          {...register("description")}
          className="mt-1 w-full rounded-md border px-3 py-2 text-slate-800"
        />
      </label>
      <div className="flex gap-4 pt-2">
        <Button disabled={!isValid || !isDirty} type="submit">
          Submit
        </Button>
        <Button
          variant="secondary"
          type="button"
          onClick={() => setDialogToShow(null)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
