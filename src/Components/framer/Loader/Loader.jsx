import { motion } from "framer-motion";
import React from "react";

const Loader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="grid place-content-center">
        <BarLoader />
      </div>
    </div>
  );
};

const variants = {
  initial: {
    scaleY: 0.5,
    opacity: 0,
  },
  animate: {
    scaleY: 1,
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 0.2,
      ease: "circIn",
    },
  },
};

const BarLoader = () => {
  return (
    <motion.div
      transition={{
        staggerChildren: 0.2,
      }}
      initial="initial"
      animate="animate"
      className="flex gap-1"
    >
      <motion.div variants={variants} className="h-12 w-2 bg-blue-partners" />
      <motion.div variants={variants} className="h-12 w-2 bg-blue-partners" />
      <motion.div variants={variants} className="h-12 w-2 bg-blue-partners-500" />
      <motion.div variants={variants} className="h-12 w-2 bg-purple-partners" />
      <motion.div variants={variants} className="h-12 w-2 bg-purple-partners" />
    </motion.div>
  );
};

export default Loader;
