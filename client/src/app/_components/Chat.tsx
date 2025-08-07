"use client";

import React, { useState } from "react";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import Conversation from "./Conversation";

const ChatPage = () => {
 

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">Chats</h2>
        {userData?.data?.map((user: any) => (
          <div
            key={user._id}
            onClick={() => setSelectedUser(user._id)}
            className={`p-2 cursor-pointer rounded ${
              selectedUser === user._id ? "bg-blue-300" : "hover:bg-blue-100"
            }`}
          >
            {user.userName}
          </div>
        ))}
      </div>

      {/* Conversation area */}
      <div className="flex-1 bg-white p-4 flex flex-col">
        {!selectedUser ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold mb-2">
              Select a user to start a conversation
            </h2>
          </div>
        ) : (
          <Conversation selectedUser={selectedUser} />
        )}
      </div>
    </div>
  );
};

export default ChatPage;
