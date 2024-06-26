const { initialState, checkWinner } = require("./game");
const { cloneDeep } = require("lodash");

class Connection {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
    this.board = initialState;
    this.maxPlayers = 2;
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
