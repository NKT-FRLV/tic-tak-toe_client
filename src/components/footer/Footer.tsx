import { Skills } from '../../types';
import { motion, AnimatePresence } from 'framer-motion'
import { GameModeType } from '../../types';
import styles from './footer.module.css'
import PlayersList from '../playersList/PlayersList';


interface FooterProps {
    winner: string | null;
    gameMode: GameModeType;
    skills: Skills;
    players: string[];
    scores: { name: string; score: number }[];
    restartGame: () => void
}

const Footer = ({ winner, gameMode, players, scores, skills, restartGame }: FooterProps) => {

    const isWinnerInHalfMode = scores.some(({ name, score}) => score === 3 && name);
    const conditionHalf = gameMode === 'Half' && isWinnerInHalfMode && winner
    const conditionStandard = gameMode === 'Standard' && winner

  return (
    <footer className={styles.footer}>
        <AnimatePresence mode="wait">
            {conditionHalf || conditionStandard  ? (
            <motion.button
                className={styles.button}
                initial={{ opacity: 0, translateY: 0 }}
                animate={{ opacity: 1, translateY: -10 }}
                exit={{ opacity: 0, translateY: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                onClick={restartGame}
            >
                Начать заново
            </motion.button>
            ) : gameMode === 'Half' ? (
            <motion.div
                className={styles.skillsContainer}
                initial={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: 10 }}
                transition={{ duration: 0.5 }}
            >
                {Object.keys(skills).map((skill) => (
                <div key={skill} className={styles.skillItem}>
                    <span className={styles.skillName}>{skill}:</span>
                    <span className={styles.skillValue}>{skills[skill]}</span>
                </div>
                ))}
            </motion.div>
            ) : null}
        </AnimatePresence>
        <PlayersList players={players} scores={scores} gameMode={gameMode} />
      </footer>
  )
}

export default Footer