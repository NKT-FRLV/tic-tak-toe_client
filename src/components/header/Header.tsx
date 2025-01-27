import React from 'react';
import styles from './header.module.css';
import type { GameModeType } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
    isGameStarted: boolean;
    gameStatus: string;
    playerRole: string;
    thisRoom: string;
    playerName: string;
    mode: GameModeType;
    exitRoom: () => void;
}

const Header: React.FC<HeaderProps> = ({
    isGameStarted,
    gameStatus,
    playerRole,
    thisRoom,
    playerName,
    mode,
    exitRoom,
}) => {
    const isWinner = gameStatus.startsWith('Победитель:');

    return (
        <header className={styles.header}>
            <motion.div
                className={styles.info}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1>Игрок: {playerName}</h1>
                <h1>Комната: {thisRoom}</h1>
                <h1>Режим игры: {mode}</h1>
                <motion.button
                    className={styles.button}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={exitRoom}
                >
                    Выйти из комнаты
                </motion.button>
            </motion.div>
            <div className={styles.stepInfo}>
                <AnimatePresence mode="wait">
                    <motion.h2
                        key={`status-${isGameStarted}`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            color: isGameStarted ? '#00FF00' : '#FF0000',
                        }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.5 }}
                    >
                        {isGameStarted ? 'Игра началась' : 'Дождитесь соперника'}
                    </motion.h2>
                </AnimatePresence>
                <h2 style={{ color: '#00FF00' }}>Вы играете за: {playerRole}</h2>
                <AnimatePresence mode="wait">
                    {isWinner ? (
                        <motion.h2
                            key="winner"
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 1,
                                scale: gameStatus.includes(playerName) ? 1.2 : 1,
                                color: gameStatus.includes(playerName)
                                    ? '#FFD700'
                                    : '#FFC1C1',
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {gameStatus}
                        </motion.h2>
                    ) : (
                        <motion.h2
                            key={gameStatus}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                color: gameStatus === playerRole ? '#00FF00' : '#FF0000',
                            }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.5 }}
                        >
                            {`Ходит: ${gameStatus}`}
                        </motion.h2>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};

export default Header;
