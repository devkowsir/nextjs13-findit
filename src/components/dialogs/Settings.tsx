"use client";

import { toast } from "@/hooks/useToast";
import {
  ProfileChangeRequestPayload,
  ProfileChangeRequestValidator,
} from "@/lib/validators/user";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "../ui/button";
import Dialog, { useDialogStore } from "../ui/dialog";

interface UserSummary {
  username: string;
  bio?: string;
  usernameHasBeenChanged: boolean;
}

const Settings = ({ userId }: { userId?: string | null }) => {
  const { dialogToShow, setDialogToShow } = useDialogStore();
  const [userData, setUserData] = useState<UserSummary | undefined>();

  useEffect(() => {
    const fetchHandler = async () => {
      const response = await fetch(`/api/user?userId=${userId}`);
      const data = await response.json();
      setUserData(data);
    };

    if (dialogToShow === "settings") fetchHandler();
  }, [dialogToShow]);

  return (
    <>
      <button className="text-left" onClick={() => setDialogToShow("settings")}>
        Settings
      </button>
      {dialogToShow === "settings" && (
        <Dialog onCloseAction={() => setDialogToShow(null)}>
          <div className="space-y-6 text-left">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-zinc-800 md:text-4xl">
                Settings
              </h1>
              <p className="text-sm text-zinc-700">
                You can change this random username only ONCE.
                <br />
                <span className="font-semibold">
                  Be sure of changing your username.
                </span>
              </p>
            </div>
          </div>
          {!userData ? (
            <div className="text-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <UserInfoForm
              userData={userData}
              setDialogToShow={setDialogToShow}
            />
          )}
        </Dialog>
      )}
    </>
  );
};

export default Settings;

const UserInfoForm = ({
  userData,
  setDialogToShow,
}: {
  userData: UserSummary;
  setDialogToShow: (newDialogToShow: string | null) => void;
}) => {
  const router = useRouter();
  const {
    formState: { errors, isValid, isDirty },
    handleSubmit,
    register,
  } = useForm<ProfileChangeRequestPayload>({
    defaultValues: { username: userData.username, bio: userData.bio },
    resolver: zodResolver(ProfileChangeRequestValidator),
  });

  const onSubmit = async (payload: ProfileChangeRequestPayload) => {
    if (
      userData.bio === payload.bio &&
      userData.username === payload.username
    ) {
      return toast({ title: "Both username and bio are not changed." });
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
        Username
        <input
          className="mt-1 w-full rounded-md border px-3 py-2 text-slate-800 disabled:contrast-50"
          {...register("username")}
          disabled={userData.usernameHasBeenChanged}
        />
        {userData.usernameHasBeenChanged && (
          <span className="text-xs text-red-400">
            You have already changed your username once.
          </span>
        )}
      </label>
      <label className="text-left text-sm text-slate-700">
        Bio
        <TextareaAutosize
          {...register("bio")}
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
