import { io, Socket } from 'socket.io-client';
// const SERVER_URL = import.meta.env.VITE_SERVER_URL 
const SERVER_URL = 'https://tic-tac-toe-server-6nr9.onrender.com';

const socket: Socket = io('http://localhost:8080', {
  transports: ['websocket'],
});

export default socket;