import { io } from "socket.io-client";

const socket = io(process.env.SITE_URL + ':4042'); // Connect to the server using the default URL
export default socket;