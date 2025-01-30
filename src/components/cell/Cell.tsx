import React, { useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CellContent from './CellContent';
import styles from './cellSvg.module.css';

interface CellProps {
  value: 'X' | 'O' | 'X_HALF' | 'O_HALF' | '' | null;
  isWinCell: boolean;
  isDisabled: boolean;
  isCurrentPlayer: boolean;
  id: number;
  lockCounter: number;
  onClick: () => void;
}

const Cell: React.FC<CellProps> = ({ value, id, isWinCell, isDisabled, isCurrentPlayer, lockCounter, onClick }) => {
  const [isHoverable, setIsHoverable] = React.useState(false);
  const [isTouchPad, setIsTouchPad] = React.useState(false);

  useLayoutEffect(() => {
    const isHoverableValue = ['X_HALF', 'O_HALF', null, ''].includes(value);
    const mediaQuery = window.matchMedia('(hover: hover)');

    if (mediaQuery.matches) {
      setIsTouchPad(true)
    }

    if (!isWinCell && isHoverableValue && isCurrentPlayer) {
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
      whileHover={isWinCell || isTouchPad ? {} : {
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
      <AnimatePresence mode="wait">
        {lockCounter > 0 ? (
          <motion.div
            key={id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.lockIndicator}
          >
            <div className={styles.lockIcon} >🔒</div>
            <span className={styles.lockCounter}>{lockCounter}</span>
          </motion.div>
        ) : (
          <CellContent value={value} index={id} />
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default Cell;