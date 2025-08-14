"use client";
import React, { useEffect, useRef } from "react";
import {
  PhoneCall,
  Video,
  Info,
  Send,
  Paperclip,
  Smile,
  CircleArrowLeft,
} from "lucide-react";
import { IoMdArrowRoundBack } from "react-icons/io";
import ChatBubble from "./ChatBubble";
import socket from "@/lib/socket";
import { useAppSelector } from "@/redux/hook";
import { useGetMessagesQuery } from "@/redux/features/chat/chatApi";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import { useGetSingleUserQuery } from "@/redux/features/user/userApi";
import clsx from "clsx";

interface IMessage {
  _id: string;
  sender: string;
  receiver: string;
  message: string;
  createdAt: Date;
}

const Conversation = ({ selectedUser, setSelectedUser }: any) => {
  // get api data
  const { data: user }: any = useGetMeQuery({});
  const userInfo = user?.data;

  const { data } = useGetMessagesQuery(selectedUser!, {
    skip: !selectedUser,
  });

  const { data: receiverInfo } = useGetSingleUserQuery(selectedUser);

  // state
  const [message, setMessage] = React.useState<IMessage[]>([]);
  const [inputMessage, setInputMessage] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);

  // scroll to bottom
  const endRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  // socket
  useEffect(() => {
    if (!userInfo?._id) return;

    socket.emit("join", userInfo._id);

    socket.on("receiveMessage", (msg: IMessage) => {
      setMessage((prev) => [...prev, msg]);
      setIsTyping(false); // Hide typing indicator when a new message is received
    });

    socket.on("typing", ({ senderId }) => {
      if (senderId === selectedUser) {
        setIsTyping(true);
      }
    });

    socket.on("stopTyping", ({ senderId }) => {
      if (senderId === selectedUser) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [userInfo?._id, selectedUser]);

  useEffect(() => {
    if (data?.messages) {
      setMessage(data?.messages);
    }
  }, [data]);

  // typing

  useEffect(() => {
    if (!userInfo?._id) return;

    socket.on("userTyping", ({ senderId }) => {
      if (senderId === selectedUser) setIsTyping(true);
    });

    socket.on("userStopTyping", ({ senderId }) => {
      if (senderId === selectedUser) setIsTyping(false);
    });

    return () => {
      socket.off("userTyping");
      socket.off("userStopTyping");
    };
  }, [selectedUser, userInfo?._id]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputMessage(value);

    if (!userInfo?._id || !selectedUser) return;

    // Emit 'typing' event
    socket.emit("typing", { senderId: userInfo._id, receiverId: selectedUser });

    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a new timeout to emit 'stopTyping' after a delay
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        senderId: userInfo._id,
        receiverId: selectedUser,
      });
    }, 1500); // 1.5 seconds delay
  };

  if (!selectedUser) {
    return null; // Or a placeholder for no selected user
  }

  // send msg handler
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // msg obj

    const msg = {
      sender: userInfo?._id,
      receiver: selectedUser,
      message: inputMessage,
    };

    socket.emit("sendMessage", msg);

    setInputMessage("");
  };

  return (
    <div className="relative h-screen flex flex-col justify-between">
      {/* Header */}
      <div className="sticky top-0 z-10">
        <div className="px-4 py-3 border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#101521]">
          <div className="flex justify-between items-center">
            {/* User Info */}
            <div className="flex items-center gap-x-3">
              <button
                onClick={() => setSelectedUser(null)}
                className="md:hidden  text-white  rounded cursor-pointer mr-3"
              >
                <IoMdArrowRoundBack size={25} />
              </button>
              <div className="relative cursor-pointer">
                <img
                  src="https://img.freepik.com/free-photo/cheerful-young-man-posing-isolated-grey_171337-10579.jpg"
                  alt="avatar"
                  className="w-[44px] h-[44px] rounded-full object-cover"
                />
                <div className="w-[12px] h-[12px] rounded-full bg-green-400 absolute bottom-0 right-0"></div>
              </div>
              <h2 className="text-lg font-semibold dark:text-white">
                {receiverInfo?.data?.userName}
              </h2>
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-x-6 text-gray-600 dark:text-gray-300">
              <PhoneCall
                size={23}
                className="hover:text-blue-500 cursor-pointer transition"
              />
              <Video
                size={23}
                className="hover:text-blue-500 cursor-pointer transition"
              />
              <Info
                size={23}
                className="hover:text-blue-500 cursor-pointer transition"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-[#0D1117]">
        {message?.map((msg: any) => (
          <div
            key={msg?._id}
            className={clsx(
              "flex items-start mb-2 px-4",
              msg.sender === userInfo?._id ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={clsx(
                "px-4 py-2 rounded-lg max-w-xs md:max-w-md text-sm",
                msg.sender === userInfo?._id
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none"
              )}
            >
              {msg?.message}

              <div className="text-[10px] opacity-60 text-right mt-1 flex flex-col justify-end items-end">
                {new Date(msg?.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {/* Typing indicator rendered as a separate element */}
        {isTyping && (
          <div
            className={clsx(
              "flex items-center italic text-gray-500 dark:text-gray-400 mt-2 px-4",
              "animate-pulse",
              "mb-2",
              selectedUser === receiverInfo?.data?._id
                ? "justify-start" // receiver typing → left
                : "justify-end" // you typing → right (optional)
            )}
          >
            {receiverInfo?.data?.userName} is typing...
          </div>
        )}

        {message.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">
              Start the conversation by sending a message!
            </p>
          </div>
        )}

        <div ref={endRef}></div>
      </div>

      {/* Bottom Input */}
      <div className="w-full border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101521] p-3">
        <div className="flex items-center gap-x-3">
          <button className="text-gray-500 hover:text-blue-500 cursor-pointer">
            <Paperclip size={22} />
          </button>

          <button className="text-gray-500 hover:text-yellow-500 cursor-pointer">
            <Smile size={22} />
          </button>

          <input
            type="text"
            name="inputMessage"
            value={inputMessage}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full bg-[#E6EBF5] dark:bg-[#1c1f2b] text-sm text-gray-800 dark:text-white outline-none"
          />

          <button
            onClick={handleSendMessage}
            type="submit"
            className="text-white bg-blue-600 hover:bg-blue-700 p-2 rounded-full cursor-pointer"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
