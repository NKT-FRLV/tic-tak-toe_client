import React from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
    isGameStarted: boolean;
    gameStatus: string;
    playerRole: string;
    thisRoom: string;
    playerName: string;
}

const Header: React.FC<HeaderProps> = ({isGameStarted, gameStatus, playerRole, thisRoom, playerName }) => {

    const isWinner = gameStatus.startsWith('Победитель:');

  return (

    <div className='header'>
        <div className='header__info'>
            <h1>Игрок: {playerName}</h1>
            <h1>Комната : {thisRoom}</h1>
        </div>
        <div className='header__current-step-info'>
            <motion.h2
                animate={{ color: isGameStarted ? 'green' : 'red'}}
                transition={{ duration: 0.3 }}
            >
                {isGameStarted ? 'Игра началась' : 'Дождитесь соперника и начните игру'}
            </motion.h2>
            <h2 style={{ color: 'green'}}>Вы играете за: {playerRole}</h2>
            {isWinner ? (
                <motion.h2
                    animate={{ 
                        color: gameStatus.includes(playerRole) ? 'gold' : '#FFC1C1',
                        scale: gameStatus.includes(playerRole) ? 1.2 : 0.8
                     }}
                    transition={{ duration: 0.5 }}
                    style={{ fontWeight: 'bold' }}
                >
                    {gameStatus}
                </motion.h2>
                ) : (
                <motion.h2
                    animate={{ color: gameStatus === playerRole ? 'green' : 'red' }}
                    transition={{ duration: 0.5 }}
                >
                    Ходит: {gameStatus}
                </motion.h2>
            )}
        </div>
    </div>
)
};

export default Header;