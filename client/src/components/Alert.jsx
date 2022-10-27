import React from "react";
import { BsEmojiSmileUpsideDown } from "react-icons/bs";
import { motion } from "framer-motion";

const Alert = ({ type }) => {
  return (
    <motion.div
      initial={{ translateX: 100, opacity: 0 }}
      animate={{ translateX: 0, opacity: 1 }}
      exit={{ translateX: 100, opacity: 0 }}
      key={type}
      className={`fixed top-16 right-12 p-4 px-4 py-2 rounded-md backdrop-blur-md flex items-center justify-center shadow-xl ${
        type === "success" && "bg-green-400"
      } ${type === "danger" && "bg-red-400"}`}
    >
      {type === "success" && (
        <div className="flex items-center justify-center gap-4">
          <BsEmojiSmileUpsideDown className="text-3xl text-secondary" />
          <p className="text-xl font-semibold text-secondary">
            Successfully Uploaded
          </p>
        </div>
      )}
      {type === "danger" && (
        <div className="flex items-center justify-center gap-4">
          <BsEmojiSmileUpsideDown className="text-3xl text-secondary" />
          <p className="text-xl font-semibold text-secondary">
            Something went wrong...
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default Alert;
