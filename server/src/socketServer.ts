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
    console.log("A user connected:", socket.id);

    socket.on("sendMessage", async (payload: IMessage) => {
      try {
        const message = await Message.create(payload);

        // emit to the receiver only (private message)
        io.to(payload.receiver).emit("receiveMessage", message);

        // optionally sender keo emit korte paro
        io.to(payload.sender).emit("receiveMessage", message);
      } catch (error) {
        console.error("Message send error:", error);
      }
    });

    socket.on("join", (userId) => {
      socket.join(userId); // userId মানে ekta unique room
      console.log(`User ${userId} joined room: ${userId}`);
    });

    // receive message event
    socket.on("receiveMessage", (message) => {});

    // typing
    socket.on("typing", ({ to }) => {
      socket.to(to).emit("typing");
    });

    // stop typing
    socket.on("stopTyping", ({ to }) => {
      socket.to(to).emit("stopTyping");
    });

    // socket disconnect event
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
};
