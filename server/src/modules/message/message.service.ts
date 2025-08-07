// message service

// import { Message } from "./message.model";

// const getMessagesBetweenUsers = async (userId1: string, userId2: string) => {
//   return await Message.find({
//     $or: [
//       { sender: userId1, receiver: userId2 },
//       { sender: userId2, receiver: userId1 },
//     ],
//   }).sort({ createdAt: 1 });
// };

// export const messageService = {
//   getMessagesBetweenUsers,
// };

import { Message } from "./message.model";

const createMessage = async (data: any) => {
  return await Message.create(data);
};

const getMessages = async (userId1: string, userId2: string) => {
  return await Message.find({
    $or: [
      { sender: userId1, receiver: userId2 },
      { sender: userId2, receiver: userId1 },
    ],
  })
    .sort({ createdAt: 1 })
    .lean();
};

export const messageServices = {
  createMessage,
  getMessages,
};
