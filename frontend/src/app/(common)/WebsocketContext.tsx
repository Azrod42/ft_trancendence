import {createContext} from 'react';
import {io, Socket} from 'socket.io-client';

export const socket = io('http://localhost:4001');
export const WebsocketContext = createContext<Socket>(socket);
export const WebSocketProvider = WebsocketContext.Provider;