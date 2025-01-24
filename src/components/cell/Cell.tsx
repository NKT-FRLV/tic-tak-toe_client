import React, { useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CellContent from './CellContent';

interface CellProps {
  value: 'X' | 'O' | 'X_HALF' | 'O_HALF' | '' | null;
  isWinCell: boolean;
  isDisabled: boolean;
  isCurrentPlayer: boolean;
  id: number;
  onClick: () => void;
}

const Cell: React.FC<CellProps> = ({ value, id, isWinCell, isDisabled, isCurrentPlayer, onClick }) => {
  const [isHoverable, setIsHoverable] = React.useState(false);

  useLayoutEffect(() => {
    const isHoverableValue = ['X_HALF', 'O_HALF', null, ''].includes(value);
    const mediaQuery = window.matchMedia('(hover: hover)');
    if (mediaQuery.matches && !isWinCell && isHoverableValue && isCurrentPlayer) {
      setIsHoverable(true);
    } else {
      setIsHoverable(false);
    }
  }, [value, isWinCell, isCurrentPlayer]);

  return (
    <motion.button
      animate={{
        scale: isWinCell ? 1.1 : 1,
        backgroundColor: isWinCell ? '#FFD700' : '#333',
        color: isWinCell ? '#000' : '#fff',
      }}
      whileHover={isWinCell ? {} : {
        scale: isHoverable ? 1.03 : 1,
        backgroundColor: isHoverable ? '#6a6a6a' : '#333',
      }}
      transition={{
        duration: 0.5,
        ease: 'easeInOut',
      }}
      className="cell"
      onClick={onClick}
      disabled={!isDisabled}
    >
      <AnimatePresence>
        <CellContent value={value} index={id}/>
      </AnimatePresence>
    </motion.button>
  );
};

export default Cell;