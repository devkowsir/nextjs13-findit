"use client";

import { X } from "lucide-react";
import React, { useRef } from "react";
import { createPortal } from "react-dom";
import { create } from "zustand";

interface DialogProps {
  children: React.ReactNode;
  onCloseAction: () => void;
}

interface DialogStore {
  dialogToShow: string | null;
  setDialogToShow: (newDialogToShow: string | null) => void;
}

export const useDialogStore = create<DialogStore>((set) => ({
  dialogToShow: null,
  setDialogToShow: (newDialogToShow: string | null) =>
    set(() => ({ dialogToShow: newDialogToShow })),
}));

const Dialog: React.FC<DialogProps> = ({ children, onCloseAction }) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  return createPortal(
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        onClick={() => onCloseAction()}
        className="absolute inset-0 bg-slate-950/25"
      ></div>
      <div
        role="dialog"
        ref={dialogRef}
        className="relative w-96 max-w-[90%] rounded-md bg-slate-50 p-6 pt-10 text-center"
      >
        <X
          className="absolute right-1 top-1 cursor-pointer p-1 text-slate-500"
          size={32}
          onClick={() => onCloseAction()}
        />
        {children}
      </div>
    </div>,
    document.getElementById("dialog-container")!,
  );
};

export default Dialog;
