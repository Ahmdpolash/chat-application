import http from "http";
import { Server as socketServer } from "socket.io";
import { IMessage } from "./modules/message/message.interface";
import { Message } from "./modules/message/message.model";
import { User } from "./modules/user/user.model";

export const initSocketServer = (server: http.Server) => {
  const io = new socketServer(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Store socket.id to userId mapping
  const socketUserMap = new Map();

  io.on("connection", async (socket) => {
    console.log(`a user is connected ${socket.id}`);

    // Handle setting online status
    socket.on("setOnlineStatus", async (userId: string) => {
      try {
        // Map socket.id to userId
        socketUserMap.set(socket.id, userId);

        // Update user's isOnline status to true
        await User.findByIdAndUpdate(userId, { isOnline: true });
        console.log(`User ${userId} set as online`);

        // Fetch updated user list
        const users = await User.find({ $ne: { _id: userId } });
        // Emit updated user list to all clients
        io.emit("onlineUsers", users);
      } catch (error) {
        console.error("Error setting online status:", error);
      }
    });

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

    // When a user starts typing
    socket.on("typing", ({ senderId, receiverId }) => {
      io.to(receiverId).emit("userTyping", { senderId });

      
    });

    // When a user stops typing
    socket.on("stopTyping", ({ senderId, receiverId }) => {
      io.to(receiverId).emit("userStopTyping", { senderId });
    });

    // user disconnected
    socket.on("disconnect", async () => {
      try {
        // Get userId from socketUserMap
        const userId = socketUserMap.get(socket.id);

        if (userId) {
          // Update user's isOnline status to false
          await User.findByIdAndUpdate(userId, { isOnline: false });
          console.log(`User ${userId} set as offline`);

          // Remove from socketUserMap
          socketUserMap.delete(socket.id);

          // Fetch updated user list
          const users = await User.find({ $ne: { _id: userId } });
          // Emit updated user list to all clients
          io.emit("onlineUsers", users);
        }
      } catch (error) {
        console.error("Error setting offline status:", error);
      }
      console.log(`user disconnected ${socket.id}`);
    });
  });
};
