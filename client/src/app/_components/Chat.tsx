"use client";

import React, { useState, useEffect } from "react";
import ChatSidebar from "./ChatSidebar";
import Conversation from "./Conversation";


const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint
    };

    handleResize(); // Set on load
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //  Mobile Layout
  if (isMobile) {
    return (
      <div className="h-screen w-full">
        {!selectedUser ? (
          <ChatSidebar setSelectedUser={setSelectedUser} />
        ) : (
          <Conversation
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        )}
      </div>
    );
  }

  // handle logout



  // socket

  //  Desktop Layout
  return (
    <div className="h-screen w-full grid grid-cols-1 md:grid-cols-4">
      <div className="col-span-1 border-r dark:border-gray-600 border-gray-200 bg-[#F5F7FB] dark:bg-[#101828] h-screen">
        <ChatSidebar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </div>

      <div className="col-span-3 h-screen">
        {!selectedUser ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 dark:bg-gray-900 dark:text-white bg-white text-gray-700">
            <img
              src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png"
              alt="No chat"
              className="w-32 h-32 mb-6 opacity-80 dark:opacity-70"
            />
            <h2 className="text-3xl font-semibold mb-2">No Chat Selected</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Select a conversation from the list to start chatting or create a
              new one.
            </p>
          </div>
        ) : (
          <Conversation
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        )}
      </div>
    </div>
  );
};

export default ChatPage;
