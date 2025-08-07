import http from "http";
import { Server as socketServer } from "socket.io";
import { IMessage } from "./modules/message/message.interface";
import { Message } from "./modules/message/message.model";

export const initSocketServer = (server: http.Server) => {
  const io = new socketServer(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`a user is connected ${socket.id}`);

    // user joined room
    socket.on("join", (userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    // user left room
    socket.on("leave", (userId: string) => {
      socket.leave(userId);
      console.log(`User ${userId} left room`);
    });

    // send msg
    socket.on("sendMessage", async (payload: IMessage) => {
      const { sender, receiver, message } = payload;

      if (!sender || !receiver || !message) {
        return console.error("Invalid message payload");
      }

      try {
        const createdMessage: IMessage = await Message.create({
          sender,
          receiver,
          message,
        });

        // emit message to receiver
        io.to(payload.receiver.toString()).emit(
          "receiveMessage",
          createdMessage
        );
        io.to(payload.sender.toString()).emit("receiveMessage", createdMessage);
      } catch (error) {
        console.error("Message send error:", error);
      }
    });

    // user disconnected
    socket.on("disconnect", () => {
      console.log(`user disconnected ${socket.id}`);
    });
  });
};
