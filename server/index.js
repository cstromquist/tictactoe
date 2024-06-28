const { Server } = require("socket.io");
const { createServer } = require("node:http");
const express = require("express");
const tictactoe = require("./game");

const app = express();
const server = createServer(app);
server.listen(3002, () => {
  console.log("server running at http://localhost:3002");
});
const io = new Server(server, {
  cors: {
    origin: "*", // Change this to your client's URL
    methods: ["GET", "POST"], // Specify the methods you want to allow
  },
});
tictactoe(io);
