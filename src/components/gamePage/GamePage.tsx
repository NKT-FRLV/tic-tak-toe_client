import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { processMove, isGameModeType } from './utils';
import type { GameModeType, ReternedServerState, PleyerType, SquareValue, ServerRestartState } from '../../types';
import socket from '../../socket/socket';
import Desk from '../desk/Desk';
import Header from '../header/Header';

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [players, setPlayers] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [winCombination, setWinCombination] = useState<number[] | null>(null);
  const [role, setRole] = useState<'X' | 'O' | ''>(''); // Роль игрока ("X" или "O")
  const [currentPlayer, setCurrentPlayer] = useState<string>('X'); // Игрок, который сейчас ходит
  const [scores, setScores] = useState<{ name: string; score: number }[]>([]);

  const [searchParams] = useSearchParams();
  const name = searchParams.get('name');
  const room = searchParams.get('room');
  const rawGameMode = searchParams.get('gameMode');
  const gameMode: GameModeType = isGameModeType(rawGameMode) ? rawGameMode : 'Standard';

  useEffect(() => {
    if (!name || !room || !gameMode) {
      navigate('/');
    } else if (role === '') {
      console.log('Отправка события readyForRole');
      socket.emit('readyForRole', { name, room });
    }
  }, [ name, room, gameMode, role, navigate ]);

  useEffect(() => {
    const handlePlayerRole = ({ role }: { role: 'X' | 'O' }) => {
      setRole(role);
      console.log(`Ваша роль: ${role}`);
    }
    
    socket.on('playerRole', handlePlayerRole);

    const handleUpdatePlayers = (updatedPlayers: PleyerType[]) => {
      setPlayers(updatedPlayers.map((player) => player.name));
      setIsGameStarted(updatedPlayers.length === 2);
    }

    socket.on('updatePlayers', handleUpdatePlayers);

    const handleStateUpdated = ({ players, currentPlayer, squares, winCombination, winner }: ReternedServerState) => {
      setScores(players.map((p) => ({ name: p.name, score: p.score })));
      setCurrentPlayer(currentPlayer);
      setSquares(squares);
      setWinCombination(winCombination);
      setWinner(winner);
    }
    
    socket.on('stateUpdated', handleStateUpdated);

    const handleGameRestarted = ({ currentPlayer, newSquares, players }: ServerRestartState) => {
        setSquares(newSquares);
        setScores(players.map((p) => ({ name: p.name, score: p.score })));
        setWinner(null);
        setWinCombination(null);
        setCurrentPlayer(currentPlayer);
    }

    socket.on('gameRestarted', handleGameRestarted)

    return () => {
        socket.off('playerRole', handlePlayerRole);
        socket.off('updatePlayers', handleUpdatePlayers);
        socket.off('stateUpdated', handleStateUpdated);
        socket.off('gameRestarted', handleGameRestarted);
    };
  }, [room, name]); // Squares is delited from dependencies

  const handleSquareClick = useCallback((index: number) => {
    if (role !== currentPlayer || winner) return;

    const { marker, isValid } = processMove({
        index,
        squares,
        role,
        gameMode,
    });

    if (!isValid) return;

    socket.emit('move', { room, index, marker, player: role });
  }, [role, currentPlayer, winner, squares, gameMode, room]);

  const handleRestart = () => {
    socket.emit('restartGame', { room });
  };

  const handleLeaveRoom = useCallback(() => {
    socket.emit('leaveRoom', { name, room });
    navigate('/');
}, [name, room, navigate]);

  return (
    <div className="game-page">
      <Header
        gameStatus={winner ? `Победитель: ${winner}` : `${currentPlayer}`}
        isGameStarted={isGameStarted}
        playerRole={role}
        playerName={name || 'unknown'}
        thisRoom={room || 'unknown'}
        mode={gameMode}
        scores={scores}
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
