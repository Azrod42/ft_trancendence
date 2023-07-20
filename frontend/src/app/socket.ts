import { io } from 'socket.io-client';

const URL = 'http://localhost:4042';
export const socket = io(URL, {autoConnect: false});

