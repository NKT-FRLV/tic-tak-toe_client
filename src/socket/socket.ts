import { io, Socket } from 'socket.io-client';
// const SERVER_URL = import.meta.env.VITE_SERVER_URL 
const SERVER_URL = 'https://tic-tac-toe-server-6nr9.onrender.com';
// const LOCAL_SERVER_URL = 'http://localhost:8080';

const socket: Socket = io(SERVER_URL, {
  autoConnect: false,
  transports: ['websocket'],
});

export const connectServer = (socket: Socket): Promise<void> =>
  new Promise<void>((resolve, reject) => {

    if (socket.connected) {
        console.log('Соединение уже установлено до этого');
        resolve();
        return;
    }

    socket.connect();

    const timeout = setTimeout(() => {
      console.log('Сервер не отвечает');
      reject(new Error("Сервер не отвечает"));
    }, 10000); // Тайм-аут 10 секунд

    socket.on("connect", () => {
      console.log('Ответил сервер');
      clearTimeout(timeout);
      resolve();
    });

    socket.on("connect_error", () => {
      console.log('ошибка соединения');
      clearTimeout(timeout);
      reject(new Error("Ошибка подключения к серверу"));
    });
  });

export default socket;