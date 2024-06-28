const { cloneDeep } = require("lodash");

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
    if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
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

module.exports = { initialState, checkWinner };
class Connection {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
    this.board = initialState;

    this.players = [];

    this.socket.on("disconnect", () => this.disconnect());
    this.socket.on("player move", (data) => this.playerMove(data));
    this.socket.on("register player", () => this.registerPlayer());
    this.socket.on("reset", () => this.reset());

    this.init();
    console.log(`a user connected socket id: ${this.socket.id}`);
  }

  init() {
    this.board = initialState;
    this.players = [];
    this.io.emit("initial state", {
      board: this.board,
      players: this.players,
    });
  }

  disconnect() {
    console.log("user disconnected");
  }

  reset() {
    this.init();
  }

  registerPlayer() {
    if (this.players.includes(this.socket.id)) return;
    if (this.players.length < this.maxPlayers) {
      this.players.push(this.socket.id);
      console.log(`Player added: ${this.socket.id}`);
      this.io.emit("register player", this.socket.id);
      
    }
  }

  playerMove(d) {
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
    this.board = newBoard;
    this.io.emit("player move", newData);
  }
}

function tictactoe(io) {
  io.on("connection", (socket) => {
    new Connection(io, socket);
  });
}
module.exports = tictactoe;
