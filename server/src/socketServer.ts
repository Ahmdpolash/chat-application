import http from "http";
import { Server as socketServer } from "socket.io";

export const initSocketServer = (server: http.Server) => {
  const io = new socketServer(server);

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // send message event
    socket.on("sendMessage", () => {});

    // receive message event
    socket.on("receiveMessage", (message) => {});

    // typing indicator event
    socket.on("typing", (data) => {
      console.log(`${data.username} is typing...`);
    });

    // stop typing indicator event
    socket.on("stopTyping", (data) => {
      console.log(`${data.username} stopped typing.`);
    });

    // group chat event
    socket.on("groupChat", (data) => {
      console.log(`Group chat message: ${data.message}`);
    });

    // socket disconnect event
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
};
