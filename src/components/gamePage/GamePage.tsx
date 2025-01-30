import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { processMove, isGameModeType } from './utils';
import type { GameModeType, ReternedServerState, PleyerType, SquareValue, ServerRestartState, RoleProps, WinnerType, Skills, SkillType } from '../../types';
import socket from '../../socket/socket';
import Desk from '../desk/Desk';
import Header from '../header/Header';
import Footer from '../footer/Footer';


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
  const [skills, setSkills] = useState<Skills>({ borrow: 0, lock: 0, unlock: 0 });
  const [lockCounters, setLockCounters] = useState<Record<number, number>>({});
  const [activeSkill, setActiveSkill] = useState<'borrow'| 'lock' | 'unlock' | null>(null);
  const [steps, setSteps] = useState(0)

  

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
    const handlePlayerRole = ({ role, skills }: RoleProps ) => {
      setRole(role);
      if (skills !== undefined) {
        setSkills({...skills});
      }
      
      console.log(`Ваша роль: ${role} скиллы: ${JSON.stringify(skills)}`);
    }

    const handleUpdatePlayers = (updatedPlayers: PleyerType[]) => {
      setPlayers(updatedPlayers.map((player) => player.name));
      setScores( updatedPlayers.map((player) => ({ name: player.name, score: player.score })));
      setIsGameStarted(updatedPlayers.length === 2);
    }

    const handleStateUpdated = ({ players, currentPlayer, squares, updeteSkills, winCombination, winner }: ReternedServerState) => {
      setCurrentPlayer(currentPlayer);
      setSquares(squares);
      setWinCombination(winCombination);
      setWinner(winner);
      if (gameMode === 'Half') {
        if (updeteSkills) {
          setLockCounters({});
          setSkills(players.find((p) => p.name === name)?.skills as Skills || { borrow: 0, lock: 0, unlock: 0 });
        }
    
        setScores(players.map((p) => ({ name: p.name, score: p.score })));
        setSteps(0);
        if (winCombination && winner === name) {
          // Добавляем бонусный скилл borrow для победившего игрока
            setSkills(prev => ({...prev, borrow: prev.borrow + 1}));
        }

        if ( winner === 'Ничья') {
          socket.emit('restartGame', { room, saveScores: true, updateSkills: true });
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

    const handleLocksUpdated = (lockedSquares: Record<number, number>) => {
      setLockCounters(lockedSquares);
    }

    
    socket.off('playerRole').on('playerRole', handlePlayerRole);
    socket.off('updatePlayers').on('updatePlayers', handleUpdatePlayers);
    socket.off('stateUpdated').on('stateUpdated', handleStateUpdated);
    socket.off('locksUpdated').on('locksUpdated', handleLocksUpdated);
    socket.off('gameRestarted').on('gameRestarted', handleGameRestarted);

    return () => {
        socket.off('playerRole', handlePlayerRole);
        socket.off('updatePlayers', handleUpdatePlayers);
        socket.off('stateUpdated', handleStateUpdated);
        socket.off('locksUpdated', handleLocksUpdated);
        socket.off('gameRestarted', handleGameRestarted);
    };
  }, []); // Squares is delited from dependencies

  const handleSquareClick = useCallback(
    (index: number) => {
      if (winner) return;
      if (role !== currentPlayer) {
        setActiveSkill(null);
        alert('Сейчас не ваш ход!');
        return;
      }

      if (activeSkill === 'unlock' && skills.unlock > 0 && lockCounters[index] > 0) {
        
        socket.emit('lock', {
          room,
          index,
          player: role,
          lockAction: 'unlock',
        })
        setSkills((prev) => ({ ...prev, unlock: prev.unlock - 1 }));
        setActiveSkill(null);
        setSteps(prev => prev + 1);
        return;
      } else if (activeSkill === 'unlock' && skills.unlock > 0 && !lockCounters[index]) {
        setActiveSkill(null);
        alert('Разблокировать можно только заблокированную клетку.');
        return;
      }
      
      if (lockCounters[index] > 0) {
        alert('Эта клетка заблокирована!');
        return;
      }
  
      if (activeSkill === 'lock') {
        if (skills.lock > 0 && squares[index] === null) {
          socket.emit('lock', {
            room,
            index,
            player: role,
            lockAction: 'lock',
          });
          setSkills((prev) => ({ ...prev, lock: prev.lock - 1 }));
          setActiveSkill(null);
          setSteps(prev => prev + 1);
          return;
        } else {
          setActiveSkill(null);
          alert('Нельзя заблокировать эту клетку!');
          return;
        }
      }
      
      // Логика обычного хода
      const { marker, isValid } = processMove({
        index,
        squares,
        role,
        gameMode,
        skills,
        activeSkill,
        updateSkills: (newSkills) => setSkills(newSkills),
      });
      if (activeSkill) {
        setActiveSkill(null);
      }
      if (!isValid) return;
  
      socket.emit('move', { room, index, marker, player: role });
    },
    [role, currentPlayer, winner, squares, gameMode, activeSkill, skills, room, lockCounters]
  );

  const handleActivateSkill = (skill: SkillType | null) => {
    if (steps === 1) {
      alert('You can use only one skill per move');
      return;
    }

    if (skill === null) {
      setActiveSkill(null);
      return;
    }
    if (skills[skill] > 0) {
      setActiveSkill(skill);
    }
  };

  const handleRestart = useCallback(() => {
    const shouldUpdateSkills = gameMode === 'Half' ? true : false;
    socket.emit('restartGame', { room, saveScores: false, updateSkills: shouldUpdateSkills });
  },[room]);

  const handleLeaveRoom = useCallback(() => {
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
        lockCounters={lockCounters} // Передаём состояние блокировок
      />
      <Footer gameMode={gameMode} activeSkill={activeSkill} activateSkill={handleActivateSkill} restartGame={handleRestart} winner={winner} skills={skills} players={players} scores={scores} />
    </div>
  );
};

export default GamePage;
