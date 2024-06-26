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

module.exports = { initialState, checkWinner };
