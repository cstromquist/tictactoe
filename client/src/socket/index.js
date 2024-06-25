import { io } from "socket.io-client";

// Ensure your server URL is correct
export const socket = io("http://localhost:3001", {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

