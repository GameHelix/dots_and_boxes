'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState } from '@/types/game';

interface ScoreBoardProps {
  state: GameState;
}

export default function ScoreBoard({ state }: ScoreBoardProps) {
  const { scores, currentPlayer, phase, config } = state;
  const totalBoxes = config.rows * config.cols;
  const remaining = totalBoxes - scores[0] - scores[1];
  const progress = ((totalBoxes - remaining) / totalBoxes) * 100;

  return (
    <div className="flex flex-col gap-2">
      <PlayerCard
        label="You"
        score={scores[0]}
        color="cyan"
        isActive={currentPlayer === 1 && phase === 'playing'}
        player={1}
      />
      <div className="text-center text-xs font-bold text-white/30 uppercase tracking-widest">
        vs
      </div>
      <PlayerCard
        label="AI"
        score={scores[1]}
        color="pink"
        isActive={currentPlayer === 2 && phase === 'playing'}
        player={2}
      />
      <div className="mt-1 rounded-lg bg-white/5 border border-white/10 p-2 text-center">
        <div className="text-white/40 text-xs uppercase tracking-wider mb-0.5">
          Remaining
        </div>
        <div className="text-white font-bold text-base">{remaining}</div>
        <div className="text-white/30 text-xs">/ {totalBoxes} boxes</div>
        <div className="mt-1.5 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}

function PlayerCard({
  label,
  score,
  color,
  isActive,
  player,
}: {
  label: string;
  score: number;
  color: 'cyan' | 'pink';
  isActive: boolean;
  player: 1 | 2;
}) {
  const colorMap = {
    cyan: {
      border: 'border-cyan-400/50',
      glow: 'shadow-cyan-500/30',
      text: 'text-cyan-400',
      bg: 'bg-cyan-400/10',
      ring: 'ring-cyan-400',
      dot: 'bg-cyan-400',
    },
    pink: {
      border: 'border-pink-500/50',
      glow: 'shadow-pink-500/30',
      text: 'text-pink-400',
      bg: 'bg-pink-500/10',
      ring: 'ring-pink-500',
      dot: 'bg-pink-500',
    },
  }[color];

  return (
    <motion.div
      animate={{ scale: isActive ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
      className={`relative rounded-xl border p-2.5 backdrop-blur-sm transition-all duration-300 ${colorMap.border} ${colorMap.bg} ${
        isActive
          ? `shadow-lg ${colorMap.glow} ring-1 ${colorMap.ring}`
          : ''
      }`}
    >
      {isActive && (
        <div
          className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${colorMap.dot} animate-pulse`}
        />
      )}
      <div className="flex items-center justify-between">
        <div>
          <div
            className={`text-xs font-semibold uppercase tracking-widest ${colorMap.text} opacity-70`}
          >
            {label}
          </div>
          <div className="text-xs text-white/40">Player {player}</div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={score}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-2xl font-black ${colorMap.text} tabular-nums`}
          >
            {score}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
