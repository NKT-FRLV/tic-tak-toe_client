import React, { useState, useEffect, useCallback, use } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateWinner, processMove, isGameModeType } from './utils';
import type { GameModeType } from '../../types';
import socket from '../../socket/socket';
import Desk from '../desk/Desk';
import Header from '../header/Header';

type SquareValue = 'X' | 'O' | 'X_HALF' | 'O_HALF' | '' | null;

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [players, setPlayers] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [winCombination, setWinCombination] = useState<number[] | null>(null);
  const [role, setRole] = useState<'X' | 'O' | ''>(''); // Роль игрока ("X" или "O")
  const [currentPlayer, setCurrentPlayer] = useState<string>('X'); // Игрок, который сейчас ходит

  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') || 'Гость';
  const room = searchParams.get('room') || 'Без комнаты';
  const rawGameMode = searchParams.get('gameMode');
  const gameMode: GameModeType = isGameModeType(rawGameMode) ? rawGameMode : 'Standard';

  useEffect(() => {
    if (!name || !room || !gameMode) {
      navigate('/');
    }
  })
  
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

    socket.on('moveMade', ({ currentPlayer, newSquares }) => {
      setSquares(newSquares);
      setCurrentPlayer(currentPlayer);
      const gameResult = calculateWinner(newSquares);
      const partWinner = gameResult ? gameResult.winner : null;
      const partWinningCombination = gameResult ? gameResult.combination : null;
      if (gameResult) {
        setWinner(partWinner);
        setWinCombination(partWinningCombination);
      }
    });

    socket.on('gemeRestarted', ({ currentPlayer, newSquares }) => {
        setSquares(newSquares);
        setWinner(null);
        setWinCombination(null);
        setCurrentPlayer(currentPlayer);
    })

    return () => {
        socket.off('playerRole');
        socket.off('updatePlayers');
        socket.off('moveMade');
        socket.off('gemeRestarted');
    };
  }, [room, name, squares]);

  const handleSquareClick = (index: number) => {
    if (winner || role !== currentPlayer) return;

    const { marker, isValid } = processMove({
      index,
      squares,
      role,
      gameMode: gameMode as 'Standard' | 'Half',
    });

    if (!isValid) return; // Неправильный ход

    const updatedSquares = [...squares];
    updatedSquares[index] = marker;

    setSquares(updatedSquares);

    socket.emit('move', {
      room,
      index,
      marker,
      player: role,
    });
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
        mode={gameMode}
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
