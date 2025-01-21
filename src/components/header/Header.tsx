import React from 'react';
import type { GameModeType } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
    isGameStarted: boolean;
    gameStatus: string;
    playerRole: string;
    thisRoom: string;
    playerName: string;
    mode: GameModeType;
    scores: {name: string; score: number}[];
    exitRoom: () => void
}

const Header: React.FC<HeaderProps> = ({
    isGameStarted,
    gameStatus,
    playerRole,
    thisRoom,
    playerName,
    mode,
    scores,
    exitRoom
}) => {

    const isWinner = gameStatus.startsWith('Победитель:');

    return (

        <div className='header'>
            <div className='header__info'>
                <h1>Игрок: {playerName}</h1>
                <h1>Комната : {thisRoom}</h1>
                <h1>Режим игры: {mode}</h1>
                {mode === 'Half' && (
                    <div className="scoreboard">
                    <h3>Счет:</h3>
                    {scores.map((player, index) => (
                      <div key={index}>
                        {player.name}: {player.score}
                      </div>
                    ))}
                  </div>
                )}
                <button className='standard-button' onClick={exitRoom}>Выйти из комнаты</button>
            </div>
            <div className='header__current-step-info'>
                <AnimatePresence mode="wait">
                    <motion.h2
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0, color: isGameStarted ? '#00FF00' : '#FF0000'}}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {isGameStarted ? 'Игра началась' : 'Дождитесь соперника и начните игру'}
                    </motion.h2>
                </AnimatePresence>
                <h2 style={{ color: '#00FF00'}}>Вы играете за: {playerRole}</h2>
                <AnimatePresence mode="wait">
                    {isWinner ? (
                        <motion.h2
                            animate={{ 
                                color: gameStatus.includes(playerName) ? '#FFD700' : '#FFC1C1',
                                scale: gameStatus.includes(playerName) ? 1.2 : 0.8
                            }}
                            transition={{ duration: 0.5 }}
                            style={{ fontWeight: 'bold' }}
                        >
                            {gameStatus}
                        </motion.h2>
                        ) : (
                            
                                <motion.h2
                                    key={gameStatus} // Обновляет компонент при изменении текста
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0, color: gameStatus === playerRole ? '#00FF00' : '#FF0000' }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.5 }}
                                    style={{ fontWeight: isWinner ? 'bold' : 'normal' }}
                                >
                                    {isWinner ? gameStatus : `Ходит: ${gameStatus}`}
                                </motion.h2>
                            
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
};

export default Header;