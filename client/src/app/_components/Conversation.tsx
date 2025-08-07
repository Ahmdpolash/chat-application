"use client";

import React, { useEffect, useRef, useState } from "react";
import socket from "@/lib/socket";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import { useGetMessagesQuery } from "@/redux/features/chat/chatApi";

interface IMessage {
  _id: string;
  sender: string;
  receiver: string;
  message: string;
  createdAt: string;
}

const Conversation = ({ selectedUser }: { selectedUser: string | null }) => {
  const { data: meData } = useGetMeQuery({});
  const me = meData?.data;
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  // typing indication
  const [isTyping, setIsTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  let typingTimeout: NodeJS.Timeout;

  // detect typing
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { to: selectedUser });
    }

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      setIsTyping(false);
      socket.emit("stopTyping", { to: selectedUser });
    }, 1000);
  };

  useEffect(() => {
    socket.on("typing", () => {
      setPartnerTyping(true);
    });

    socket.on("stopTyping", () => {
      setPartnerTyping(false);
    });

    return () => {
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, []);

  const { data: msgData, isLoading } = useGetMessagesQuery(selectedUser!, {
    skip: !selectedUser,
  });

  useEffect(() => {
    if (!me?._id) return;

    socket.emit("join", me._id);

    socket.on("receiveMessage", (msg: IMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [me?._id]);

  useEffect(() => {
    if (msgData?.messages) {
      setMessages(msgData.messages);
    }
  }, [msgData]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !me?._id || !selectedUser) return;

    const newMsg = {
      sender: me._id,
      receiver: selectedUser,
      message: input,
    };

    socket.emit("sendMessage", newMsg);
    setInput("");
  };



  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b font-semibold">Chat with {selectedUser}</div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {isLoading ? (
          <div className="text-center text-sm text-gray-500">
            Loading messages...
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex  ${
                  msg.sender === me?._id ? "justify-end" : "justify-start"
                }`}
              >
                <div>
                  <div
                    className={`px-4 py-2 rounded-lg max-w-xs ${
                      msg.sender === me?._id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    <div>{msg.message}</div>

                    <div className="text-[10px] opacity-60 text-right">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {partnerTyping && (
              <div className="text-gray-500 italic text-sm">
                Partner is typing...
              </div>
            )}
          </>
        )}

        <div ref={endRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={handleTyping}
          placeholder="Write a message..."
          className="flex-1 border px-3 py-2 rounded-full focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Conversation;
