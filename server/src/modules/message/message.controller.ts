// // message controller

// import { Request, Response } from "express";
// import httpStatus from "http-status";
// import { messageService } from "./message.service";

// const getMessagesWithUser = async (req: Request, res: Response) => {
//   const currentUserId = req.user.userId; // from auth middleware
//   const otherUserId = req.params.userId;

//   const messages = await messageService.getMessagesBetweenUsers(
//     currentUserId,
//     otherUserId
//   );

//   res.status(httpStatus.OK).json({
//     success: true,
//     data: messages,
//   });
// };

// export const messageController = {
//   getMessagesWithUser,
// };

import { Request, Response } from "express";
import { messageServices } from "./message.service";

const sendMessage = async (req: Request, res: Response) => {
  const message = await messageServices.createMessage(req.body);
  res.status(201).json({ success: true, message });
};

const getMessagesWithUser = async (req: Request, res: Response) => {
  const myId = req.user?.userId;
  const otherId = req.params.userId;

  const messages = await messageServices.getMessages(myId, otherId);
  res.json({ success: true, messages });
};

export const messageControllers = {
  sendMessage,
  getMessagesWithUser,
};
