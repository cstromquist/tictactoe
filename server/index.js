const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const { cloneDeep } = require("lodash");
// const { join } = require("node:path");
// const path = require("path");
// const mysql = require('mysql');

// const con = mysql.createConnection({
//   host: "127.0.0.1",
//   user: "root",
//   password: "password",
// });
//
// con.connect(function(err){
//   if (err) throw err;
//   console.log("Connected");
// })

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001", // Change this to your client's URL
    methods: ["GET", "POST"], // Specify the methods you want to allow
    allowedHeaders: ["Content-Type", "Authorization", "my-custom-header"],
    credentials: true, // Enable credentials if needed
  },
});

// app.use(express.static(path.join(__dirname, "../../build")));

// app.get('/', (req, res) => {
//   res.sendFile(join(__dirname, '../../build/index.html'));
// });

const initialState = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

const checkWinner = (board) => {
  let w = null;
  // check rows
  board.forEach((row) => {
    if (row[0] && row[0] === row[1] && row[1] === row[2]) {
      w = row[0];
    }
  });

  //check columns
  for (let i = 0; i <= 2; i++) {
    if (board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
      w = board[0][i];
    }
  }

  //check diagonals
  if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    w = board[0][0];
  }
  if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    w = board[0][2];
  }
  return w;
};

io.on("connection", (socket) => {
  console.log("a user connected");
  // on initial connection set the initial state
  io.emit("initial state", initialState);
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("player move", (d) => {
    const data = JSON.parse(d);
    const { player: currentPlayer, playerMove } = data;
    const nextPlayer = currentPlayer === "x" ? "o" : "x";
    const { board } = data;
    const [row, col] = playerMove;
    const newBoard = cloneDeep(board);
    if (!newBoard[row][col]) {
      newBoard[row][col] = currentPlayer;
    }
    const newData = {
      board: newBoard,
      player: nextPlayer,
      winner: checkWinner(newBoard),
    };
    io.emit("player move", newData);
  });
  socket.on("reset", (data) => {
    io.emit("initial state", initialState);
  });
});

server.listen(3002, () => {
  console.log("server running at http://localhost:3002");
});
