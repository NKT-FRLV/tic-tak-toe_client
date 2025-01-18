import { motion } from "framer-motion";

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
  exit: {
    pathLength: 0,
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const CellContent = ({ value }: { value: 'X' | 'O' | '' | null }) => {
  if (value === 'X') {
    return (
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.line
          x1="4"
          y1="4"
          x2="20"
          y2="20"
          stroke="#FF0088"
          variants={draw}
        />
        <motion.line
          x1="20"
          y1="4"
          x2="4"
          y2="20"
          stroke="#FF0088"
          variants={draw}
          custom={0.5} // Задержка второй линии
        />
      </motion.svg>
    );
  }

  if (value === 'O') {
    return (
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.circle
          cx="12"
          cy="12"
          r="8"
          stroke="#0D63F8"
          variants={draw}
        />
      </motion.svg>
    );
  }

  return null; // Если клетка пустая
};

export default CellContent;
