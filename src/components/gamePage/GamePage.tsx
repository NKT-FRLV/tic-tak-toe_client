import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { processMove, isGameModeType } from './utils';
import type { GameModeType, ReternedServerState, PleyerType, SquareValue, ServerRestartState, RoleProps, WinnerType } from '../../types';
import socket from '../../socket/socket';
import Desk from '../desk/Desk';
import Header from '../header/Header';
import PlayersList from '../playersList/PlayersList';


const GamePage: React.FC = () => {
  const navigate = useNavigate();
  console.log('render gamePage'); // Надо пофиксить перерендеры, сейчас их 3 в момент подключения к комнате
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [players, setPlayers] = useState<string[]>([]);
  const [winner, setWinner] = useState<WinnerType | null>(null);
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
      socket.disconnect();
      navigate('/', { state: { from: '/game' } });
    } else if (role === '') {
      socket.emit('readyForRole', { name, room });
    }
  }, []);

  useEffect(() => {
    const handlePlayerRole = ({ role }: RoleProps ) => {
      setRole(role);
      console.log(`Ваша роль: ${role}`);
    }

    const handleUpdatePlayers = (updatedPlayers: PleyerType[]) => {
      setPlayers(updatedPlayers.map((player) => player.name));
      setScores( updatedPlayers.map((player) => ({ name: player.name, score: player.score })));
      setIsGameStarted(updatedPlayers.length === 2);
    }

    const handleStateUpdated = ({ players, currentPlayer, squares, winCombination, winner }: ReternedServerState) => {
      setCurrentPlayer(currentPlayer);
      setSquares(squares);
      setWinCombination(winCombination);
      setWinner(winner);
      if (gameMode === 'Half') {
        setScores(players.map((p) => ({ name: p.name, score: p.score })));
        if ( winner === 'Ничья') {
          socket.emit('restartGame', { room });
        }
      }

    }

    const handleGameRestarted = ({ currentPlayer, newSquares, players }: ServerRestartState) => {
        setSquares(newSquares);
        setWinner(null);
        setWinCombination(null);
        setCurrentPlayer(currentPlayer);
        if (gameMode === 'Half') {
          setScores(players.map((p) => ({ name: p.name, score: p.score })));
        }
    }

    socket.off('playerRole').on('playerRole', handlePlayerRole);
    socket.off('updatePlayers').on('updatePlayers', handleUpdatePlayers);
    socket.off('stateUpdated').on('stateUpdated', handleStateUpdated);
    socket.off('gameRestarted').on('gameRestarted', handleGameRestarted);

    return () => {
        socket.off('playerRole', handlePlayerRole);
        socket.off('updatePlayers', handleUpdatePlayers);
        socket.off('stateUpdated', handleStateUpdated);
        socket.off('gameRestarted', handleGameRestarted);
    };
  }, []); // Squares is delited from dependencies

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
    // socket.emit('manualDisconnect', { room });
    socket.disconnect();
    navigate('/', { state: { from: '/game' } });
  }, [room, navigate]);

  return (
    <div className="game-page">
      <Header
        gameStatus={winner ? `Победитель: ${winner}` : `${currentPlayer}`}
        isGameStarted={isGameStarted}
        playerRole={role}
        playerName={name || 'unknown'}
        thisRoom={room || 'unknown'}
        mode={gameMode}
        exitRoom={handleLeaveRoom}
      />
      <Desk
        squares={squares}
        winCombination={winCombination}
        onSquareClick={handleSquareClick}
        isGameStarted={isGameStarted}
        isCurrentPlayer={role === currentPlayer}
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
        <PlayersList players={players} scores={scores} gameMode={gameMode} />
      </footer>
    </div>
  );
};

export default GamePage;
