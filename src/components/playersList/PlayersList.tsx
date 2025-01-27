import { GameModeType } from '../../types'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './playersList.module.css'

interface PlayersListProps {
    gameMode: GameModeType;
    players: string[];
    scores: {name: string; score: number}[];
}

const PlayersList = ({ players, scores, gameMode }: PlayersListProps) => {

    return (
        <div className={styles.wrapper}>
          <h3 className={styles.title}>
            Игроки в комнате {gameMode === 'Half' ? 'и счет' : ''}:
          </h3>
          <ul className={styles.list}>
            <AnimatePresence>
              {scores.length > 0 && gameMode === 'Half'
                ? scores.map((player, index) => (
                    <motion.li
                      key={index}
                      className={styles.listItem}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 25 }}
                      transition={{ duration: 1 }}
                    >
                      <span className={styles.playerName}>{player.name}</span>
                      <span className={styles.playerScore}>{player.score}</span>
                    </motion.li>
                  ))
                : players.map((player, index) => (
                    <motion.li
                      key={index}
                      className={styles.listItem}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 25 }}
                      transition={{ duration: 1 }}
                    >
                      <span className={styles.playerName}>{player}</span>
                    </motion.li>
                  ))}
            </AnimatePresence>
          </ul>
        </div>
      );
    }; 

export default PlayersList