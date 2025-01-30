import React from 'react';
import Cell from '../cell/Cell';

interface DeskProps {
  squares: ('X' | 'O' | 'X_HALF' | 'O_HALF' | '' | null)[];
  winCombination: number[] | null;
  isGameStarted: boolean;
  lockCounters: Record<number, number>;
  onSquareClick: (index: number) => void;
  isCurrentPlayer: boolean;
}

const Desk: React.FC<DeskProps> = ({ squares, winCombination, isGameStarted, isCurrentPlayer, lockCounters, onSquareClick }) => {

  return (
    <div className="deskWrapper">
        <div className="desk">
        {squares.map((value, index) => (
            <Cell
              key={index}
              id={index}
              isDisabled={isGameStarted || lockCounters[index] > 0}
              isWinCell={winCombination?.includes(index) || false}
              value={value}
              lockCounter={lockCounters[index] || 0} // Передаём счётчик блокировки
              isCurrentPlayer={isCurrentPlayer}
              onClick={() => onSquareClick(index)}
            />
        ))}
        </div>
    </div>
  );
};

export default Desk;