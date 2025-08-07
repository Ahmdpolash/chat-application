import React from "react";
import clsx from "clsx";
import { CheckCheck } from "lucide-react";

const ChatBubble = ({
  message,
  isSender,
  createdAt,
}: {
  message: string;
  isSender: boolean;
  createdAt: Date;
}) => {
  return (
    <div
      className={clsx(
        "flex items-start mb-2 px-4",
        isSender ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={clsx(
          "px-4 py-2 rounded-lg max-w-xs md:max-w-md text-sm",
          isSender
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none"
        )}
      >
        {message}

        <div className="text-[10px] opacity-60 text-right mt-1 flex flex-col justify-end items-end">
          {new Date(createdAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
