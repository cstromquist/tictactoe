import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import { socket } from "../../socket";

const TicTacToe = () => {
  const [board, setBoard] = useState([]);
  const [player, setPlayer] = useState("x");
  const [players, setPlayers] = useState([]);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    socket.on("initial state", (data) => {
      setBoard(data.board ?? []);
      setPlayer("x");
      setWinner(null);
      setPlayers(data.players ?? []);
    });
    socket.on("register player", (data) => {
      setPlayers((prevPlayers) => {
        if (prevPlayers.includes(data)) {
          return prevPlayers;
        }
        const newPlayers = [...prevPlayers];
        newPlayers.push(data);
        return newPlayers;
      });
    });
  }, []);

  const handleClick = (row, col) => {
    if (winner) return;
    if (board[row][col]) return; // already played this square
    if (!players.includes(socket.id)) return; // only first two users can play
    // make sure the player only moves on their turn
    if (players.indexOf(socket.id) === 0 && player === "o") return;
    if (players.indexOf(socket.id) === 1 && player === "x") return;
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
    return <div>Winner is: {winner === "x" ? "Player 1" : "Player 2"}</div>;
  };

  const registerPlayer = () => {
    socket.emit("register player");
  };

  const Player = ({ playerNumber }) => {
    return (
      <div className="player">
        <div>Player {playerNumber}</div>
        {players.length < playerNumber ? (
          <>
            <br />
            <button onClick={registerPlayer}>Play!</button>
          </>
        ) : (
          <div className={playerNumber === 1 ? "x" : "o"}></div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h1>Tic Tac Toe</h1>
      {players.length === 2 && <div>Current move: {player}</div>}
      <div className="boardContainer">
        <Player playerNumber={1} />
        <div className="boardSection">
          <Board />
          {players.includes(socket.id) && <ResetButton />}
          {winner && <Winner />}
        </div>
        <Player playerNumber={2} />
      </div>
    </div>
  );
};

export default TicTacToe;
