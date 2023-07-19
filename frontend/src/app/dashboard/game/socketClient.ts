import { io } from "socket.io-client";

const socket = io('http://localhost:4042'); // Connect to the server using the default URL
export default socket;