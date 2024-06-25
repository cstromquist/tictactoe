import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import TicTacToe from "./components/TicTacToe";
import { ConnectionState } from "./components/ConnectionState";
import { socket } from "./socket";

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconntect', onDisconnect);
    };
  }, []);

  return (
    <div className="App">
      <ConnectionState isConnected={isConnected} />
      <TicTacToe />
    </div>
  );
}

export default App;
