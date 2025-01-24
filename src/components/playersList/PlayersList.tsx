import '../../App.css'
import { GameModeType } from '../../types'
import { motion, AnimatePresence } from 'framer-motion'

interface PlayersListProps {
    gameMode: GameModeType;
    players: string[];
    scores: {name: string; score: number}[];
}

const PlayersList = ({ players, scores, gameMode }: PlayersListProps) => {

  return (
    <div className="room-players-wrapper">
        <h3>Игроки в комнате{gameMode === 'Half' ? ' и счет' : ''}:</h3>
        <ul className="room-players-list">
            <AnimatePresence>
                { scores.length > 0 && gameMode === 'Half' ? (
                        scores.map((player, index) => (
                        <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 25 }}
                            transition={{ duration: 1 }}
                        >
                            {player.name}: {player.score}
                        </motion.li>
                        ))
                    ) : (
                        players.map((player, index) => (
                        <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 25 }}
                            transition={{ duration: 1 }}
                        >
                            {player}
                        </motion.li>
                    )))
                }
            </AnimatePresence>
        </ul>
    </div>
  )
}

export default PlayersList