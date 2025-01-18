import { io, Socket } from 'socket.io-client';
// const SERVER_URL = import.meta.env.VITE_SERVER_URL

const socket: Socket = io('https://tic-tac-toe-server-6nr9.onrender.com', {
  transports: ['websocket'],
});

export default socket;