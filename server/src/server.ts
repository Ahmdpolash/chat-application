import mongoose from "mongoose";
import config from "./config";
import http from "http";
import app from "./app";

import { initSocketServer } from "./socketServer";
const server = http.createServer(app);

// initialize socket.io
initSocketServer(server);

// mongoose connection
async function main() {
  try {
    await mongoose.connect(config.db_uri as string);

    server.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
