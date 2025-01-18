import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import socket from '../../socket/socket';
import Desk from '../desk/Desk';
import Header from '../header/Header';

interface WinnerAndCombination {
  winner: string | null;
  combination: number[] | null;
}

const calculateWinner = (squares: (string | null)[]): WinnerAndCombination | null => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], combination: [a, b, c] };;
    }
  }
  if (squares.every((square) => square !== null)) {
    return { winner: 'Ничья', combination: null };;
  }
  return null;
};

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const [squares, setSquares] = useState<('X' | 'O' | '' | null)[]>(Array(9).fill(null));
  const [isGameStarted, setIsGameStarted] = useState(false);
//   const [isGameFinished, setIsGameFinished] = useState(false);
  const [players, setPlayers] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [winCombination, setWinCombination] = useState<number[] | null>(null);
  const [role, setRole] = useState<'X' | 'O' | ''>(''); // Роль игрока ("X" или "O")
  const [currentPlayer, setCurrentPlayer] = useState<string>('X'); // Игрок, который сейчас ходит

  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') || 'Гость';
  const room = searchParams.get('room') || 'Без комнаты';

  useEffect(() => {
    if (role === '') socket.emit('readyForRole', { name, room });
  }, []);

  useEffect(() => {
    
    socket.on('playerRole', ({ role }) => {
        setRole(role);
        console.log(`Ваша роль: ${role}`);
    });

    socket.on('updatePlayers', (updatedPlayers) => {
      setPlayers(updatedPlayers.map((player: { name: string }) => player.name));
      setIsGameStarted(updatedPlayers.length === 2);
    });

    socket.on('moveMade', ({ index, player }) => {
      const newSquares = squares.slice();
      newSquares[index] = player;
      setSquares(newSquares);
      setCurrentPlayer(player === 'X' ? 'O' : 'X');
      const gameResult = calculateWinner(newSquares);
      const partWinner = gameResult ? gameResult.winner : null;
      const partWinningCombination = gameResult ? gameResult.combination : null;
      if (gameResult) {
        setWinner(partWinner);
        setWinCombination(partWinningCombination);
      }
    });

    socket.on('gemeRestarted', () => {
        setSquares(Array(9).fill(null));
        setWinner(null);
        setWinCombination(null);
        setCurrentPlayer('X');

    })

    return () => {
        socket.off('playerRole');
        socket.off('updatePlayers');
        socket.off('moveMade');
        socket.off('gemeRestarted');
    };
  }, [room, name, squares]);

  const handleSquareClick = (index: number) => {
    if (squares[index] || winner || role !== currentPlayer) {
      // Блокируем ход, если клетка занята, есть победитель или игрок не на своем ходу
      return;
    }

    const newSquares = squares.slice();
    newSquares[index] = role;
    setSquares(newSquares);
    socket.emit('move', { room, index, player: role });
  };

  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setWinner(null);
    setWinCombination(null);
    socket.emit('restartGame', { room });
  };

  const handleLeaveRoom = useCallback(() => {
    socket.emit('leaveRoom', { name, room });
    navigate('/');
  },[])

  return (
    <div className="game-page">
      <Header
        gameStatus={winner ? `Победитель: ${winner}` : `${currentPlayer}`}
        isGameStarted={isGameStarted}
        playerRole={role}
        playerName={name}
        thisRoom={room}
        exitRoom={handleLeaveRoom}
      />
      <Desk
        squares={squares}
        winCombination={winCombination}
        onSquareClick={handleSquareClick}
        isGameStarted={isGameStarted}
      />
      
      <footer className="footer">
        <AnimatePresence>
          {winner && (
            <motion.button
              className="standard-button"
              initial={{ opacity: 0, translateY: 0 }}
              animate={{ opacity: 1, translateY: -10 }}
              exit={{ opacity: 0, translateY: 0  }}
              transition={{ duration: 0.5, delay: 1 }}
              onClick={handleRestart}
            >
              Начать заново
            </motion.button>
          )}
        </AnimatePresence>
        <h3>Игроки в комнате:</h3>
        <ul className="room-players-list">
          {players.map((player, index) => (
            <li key={index}>{player}</li>
          ))}
        </ul>
      </footer>
    </div>
  );
};

export default GamePage;
