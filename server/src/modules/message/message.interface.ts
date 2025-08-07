// message interface

import { Types } from "mongoose";

export interface IMessage {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  message: string;
  isSeen?: boolean;
}

/*


  // send message event
    // socket.on("sendMessage", async (payload: IMessage) => {
    //   const { sender, receiver, message } = payload;

    //   console.log(`Message from ${sender} to ${receiver}: ${message}`);

    //   try {
    //     // save message in db
    //     const newMessage = await Message.create({
    //       sender,
    //       receiver,
    //       message,
    //     });

    //     // emit message to receiver
    //     socket.emit("messageSent", newMessage);
    //   } catch (error) {}
    // });

*/
