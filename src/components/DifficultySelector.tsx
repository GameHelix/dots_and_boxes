'use client';
import { motion } from 'framer-motion';
import { Difficulty } from '@/types/game';
import { getHighScores } from '@/lib/storage';
import { useEffect, useState } from 'react';

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void;
}

const difficulties: {
  key: Difficulty;
  label: string;
  desc: string;
  grid: string;
  color: string;
  emoji: string;
}[] = [
  {
    key: 'easy',
    label: 'Easy',
    desc: '4×4 grid',
    grid: '16 boxes',
    color: 'from-green-400 to-cyan-400',
    emoji: '🟢',
  },
  {
    key: 'medium',
    label: 'Medium',
    desc: '6×6 grid',
    grid: '36 boxes',
    color: 'from-yellow-400 to-orange-400',
    emoji: '🟡',
  },
  {
    key: 'hard',
    label: 'Hard',
    desc: '8×8 grid',
    grid: '64 boxes',
    color: 'from-red-400 to-pink-500',
    emoji: '🔴',
  },
];

export default function DifficultySelector({ onSelect }: DifficultySelectorProps) {
  const [highScores, setHighScores] = useState(() => getHighScores());

  useEffect(() => {
    setHighScores(getHighScores());
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm mx-auto px-2"
    >
      {/* Title */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="text-6xl mb-3"
          aria-hidden
        >
          ⬡
        </motion.div>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 mb-2">
          Dots &amp; Boxes
        </h1>
        <p className="text-white/40 text-sm tracking-wide">
          Neon Edition &mdash; Play vs AI
        </p>
      </div>

      {/* Difficulty cards */}
      <div className="flex flex-col gap-3 mb-6">
        {difficulties.map((d, i) => {
          const hs = highScores[d.key];
          return (
            <motion.button
              key={d.key}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.1, type: 'spring', stiffness: 150 }}
              onClick={() => onSelect(d.key)}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 text-left hover:border-white/25 hover:bg-white/10 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${d.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{d.emoji}</span>
                  <div>
                    <div
                      className={`text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r ${d.color}`}
                    >
                      {d.label}
                    </div>
                    <div className="text-white/40 text-sm">
                      {d.desc} &middot; {d.grid}
                    </div>
                    {hs && (
                      <div className="text-white/25 text-xs mt-0.5">
                        Best: You {hs.playerScore} – AI {hs.aiScore}
                      </div>
                    )}
                  </div>
                </div>
                <motion.div
                  initial={{ x: -5, opacity: 0 }}
                  whileHover={{ x: 0, opacity: 1 }}
                  className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${d.color}`}
                >
                  →
                </motion.div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Controls hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-white/20 text-xs space-y-1"
      >
        <p>Click near a line to draw it &nbsp;&middot;&nbsp; Touch on mobile</p>
        <p>Complete 4 sides of a box to claim it &nbsp;&middot;&nbsp; Most boxes wins!</p>
      </motion.div>
    </motion.div>
  );
}
