import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CellContent from './CellContent';

interface CellProps {
  value: 'X' | 'O' | '' | null;
  isWinCell: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

const Cell: React.FC<CellProps> = ({ value, isWinCell, isDisabled, onClick }) => {

  return (
    <motion.button
      animate={{
        scale: isWinCell ? 1.1 : 1,
        backgroundColor: isWinCell ? '#FFD700' : '#333',
        color: isWinCell ? '#000' : '#fff',
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
        <CellContent value={value}/>
      </AnimatePresence>
    </motion.button>
  );
};

export default Cell;