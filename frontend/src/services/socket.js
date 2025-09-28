import { io } from "socket.io-client";

// Your backend server URL
const URL = "http://localhost:3000";

const socket = io(URL, {
  autoConnect: true, // Automatically connect
});

export default socket;
