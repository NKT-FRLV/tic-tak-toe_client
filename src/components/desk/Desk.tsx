import React from 'react';
import Cell from '../cell/Cell';

interface DeskProps {
  squares: ('X' | 'O' | '' | null)[];
  winCombination: number[] | null;
  isGameStarted: boolean;
  onSquareClick: (index: number) => void;
}

const Desk: React.FC<DeskProps> = ({ squares, winCombination, isGameStarted, onSquareClick }) => {



  return (
    <div className="deskWrapper">
        <div className="desk">
        {squares.map((value, index) => (
            <Cell
              key={index}
              isDisabled={isGameStarted}
              isWinCell={winCombination?.includes(index) || false}
              value={value}
              onClick={() => onSquareClick(index)}
            />
        ))}
        </div>
    </div>
  );
};

export default Desk;