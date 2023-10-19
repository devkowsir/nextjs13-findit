"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";

const variants = {
  open: { x: 0, opacity: 1 },
  close: { x: -100, opacity: 0 },
};

const page = () => {
  // const [isOpen, setIsOpen] = useState(false);
  const x = useMotionValue(0);
  const xInput = [-100, 0, 100];
  const opacityOutput = [0, 1, 0];
  const colorOutput = ["#f00", "#fff", "#0f0"];

  const opacity = useTransform(x, xInput, opacityOutput);
  const color = useTransform(x, xInput, colorOutput);
  return (
    <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-white">
      <motion.div
        drag="x"
        style={{ x, opacity, background: color }}
        dragConstraints={{ left: -100, right: 100 }}
        className="aspect-square w-40 bg-slate-600"
      />
    </div>
  );
};

export default page;
