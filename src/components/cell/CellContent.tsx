import { motion, AnimatePresence } from "framer-motion";
import styles from './cellSvg.module.css'

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { type: "spring", duration: 1.5, bounce: 0 },
      opacity: { duration: 0.01 },
    },
  },
  half: {
    pathLength: 0.5, // Половина длины пути
    opacity: 1,
    transition: {
      pathLength: { type: "spring", duration: 1, bounce: 0 },
    },
  },
  exit: {
    pathLength: 0,
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
};

interface Props {
  value: 'X' | 'O' | 'X_HALF' | 'O_HALF' | '' | null;
  index: number;
}

const CellContent = ({ value, index }: Props) => {
  // console.log(`${index}x`)
  return (
    <AnimatePresence mode="wait">
      {value === 'X' || value === 'X_HALF' ? (
        <motion.svg
          key={`${index}x`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.svg}
          initial="hidden"
          animate={'visible'}
          exit="exit"
        >
          <motion.line
            x1="4"
            y1="4"
            x2="20"
            y2="20"
            // stroke="#FF0088"
            className={styles.line}
            variants={draw}
          />
          {value !== 'X_HALF' && (
            <motion.line
              x1="20"
              y1="4"
              x2="4"
              y2="20"
              // stroke="#FF0088"
              className={styles.line}
              variants={draw}
            />
          )}
        </motion.svg>
      ) : null}

      {value === 'O' || value === 'O_HALF' ? (
        <motion.svg
          key={`${index}o`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          className={styles.svg}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial="hidden"
          animate={value === 'O' ? 'visible' : 'half'}
          exit="exit"
        >
          <motion.circle
            cx="12"
            cy="12"
            r="8"
            // stroke="#0D63F8"
            className={styles.circle}
            variants={draw}
          />
        </motion.svg>
      ) : null}
    </AnimatePresence>
  );
};

export default CellContent;