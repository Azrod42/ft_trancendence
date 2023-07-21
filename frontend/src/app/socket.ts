import { io } from 'socket.io-client';

const URL = process.env.SITE_URL + ':4042';
export const socket = io(URL, {autoConnect: false});

