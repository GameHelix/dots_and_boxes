'use client';
import { motion } from 'framer-motion';
import { GameState } from '@/types/game';

interface EndScreenProps {
  state: GameState;
  onRestart: () => void;
  onMenu: () => void;
}

export default function EndScreen({ state, onRestart, onMenu }: EndScreenProps) {
  const { winner, scores } = state;
  const playerWon = winner === 1;
  const isDraw = winner === 'draw';

  const config = playerWon
    ? {
        emoji: '🏆',
        title: 'You Win!',
        subtitle: 'Brilliant play!',
        gradient: 'from-cyan-400 to-blue-500',
        glow: 'shadow-cyan-500/50',
        btnGlow: 'shadow-cyan-500/30',
      }
    : isDraw
    ? {
        emoji: '🤝',
        title: "It's a Draw!",
        subtitle: 'Evenly matched!',
        gradient: 'from-purple-400 to-pink-400',
        glow: 'shadow-purple-500/50',
        btnGlow: 'shadow-purple-500/30',
      }
    : {
        emoji: '🤖',
        title: 'AI Wins!',
        subtitle: 'Better luck next time!',
        gradient: 'from-pink-500 to-red-500',
        glow: 'shadow-pink-500/50',
        btnGlow: 'shadow-pink-500/30',
      };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-md rounded-2xl"
    >
      <div className="text-center px-8 py-10 max-w-xs w-full">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="text-6xl mb-4"
        >
          {config.emoji}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${config.gradient} mb-1`}
        >
          {config.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/50 text-sm mb-6"
        >
          {config.subtitle}
        </motion.p>

        {/* Final score display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, type: 'spring' }}
          className="flex gap-6 justify-center mb-8"
        >
          <div className="text-center">
            <div className="text-cyan-400 font-black text-4xl tabular-nums">
              {scores[0]}
            </div>
            <div className="text-white/40 text-xs uppercase tracking-wider mt-1">
              You
            </div>
          </div>
          <div className="text-white/20 self-center text-2xl font-thin">:</div>
          <div className="text-center">
            <div className="text-pink-400 font-black text-4xl tabular-nums">
              {scores[1]}
            </div>
            <div className="text-white/40 text-xs uppercase tracking-wider mt-1">
              AI
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-3"
        >
          <button
            onClick={onRestart}
            className={`px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r ${config.gradient} hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg ${config.btnGlow}`}
          >
            Play Again
          </button>
          <button
            onClick={onMenu}
            className="px-6 py-3 rounded-xl font-medium text-white/60 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 transition-all hover:scale-105 active:scale-95"
          >
            Change Difficulty
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
