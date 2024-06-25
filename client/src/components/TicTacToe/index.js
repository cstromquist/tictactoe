import React, { useState, useEffect } from "react";
import { cloneDeep } from "lodash";
import "./styles.css";
import { socket } from "../../socket";

const TicTacToe = () => {
  const [board, setBoard] = useState([]);
  const [player, setPlayer] = useState("x");
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    socket.on("initial state", (data) => {
      setBoard(data);
      setPlayer("x");
      setWinner(null);
    });
  }, []);

  const handleClick = (row, col) => {
    if (winner) return;
    if (board[row][col]) return; // already played this square
    const data = {
      board: board,
      playerMove: [row, col],
      player: player,
    };
    socket.emit("player move", JSON.stringify(data));
  };

  const handleReset = () => {
    socket.emit("reset");
  };

  useEffect(() => {
    socket.on("player move", (data) => {
      const { board, player, winner } = data;
      setBoard(board);
      setPlayer(player);
      setWinner(winner);
    });
  }, [board, player]);

  const Board = () => (
    <div className="board">
      {board.map((y, i) => {
        return (
          <div className="row" key={`row-${i}`}>
            {y.map((x, j) => {
              return (
                <div
                  className="cell"
                  onClick={() => handleClick(i, j)}
                  key={`cell-${i}${j}`}
                >
                  <div className={x}></div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );

  const ResetButton = () => {
    return <button onClick={handleReset}>Reset Game</button>;
  };

  const Winner = () => {
    return <div>Winner is: {winner}</div>;
  };

  console.log("rendering tictactoe and the winner is: ", winner);
  return (
    <div>
      <h1>Tic Tac Toe</h1>
      <Board />
      <ResetButton />
      {winner && <Winner />}
    </div>
  );
};

export default TicTacToe;
