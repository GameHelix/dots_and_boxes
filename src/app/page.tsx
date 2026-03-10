'use client';
import { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/hooks/useGameState';
import { useSound } from '@/hooks/useSound';
import { saveHighScore } from '@/lib/storage';
import GameBoard from '@/components/GameBoard';
import ScoreBoard from '@/components/ScoreBoard';
import GameControls from '@/components/GameControls';
import EndScreen from '@/components/EndScreen';
import DifficultySelector from '@/components/DifficultySelector';
import Header from '@/components/Header';

export default function Home() {
  const { state, startGame, drawLine, pause, resume, restart, goToMenu } =
    useGameState();
  const { enabled: soundEnabled, toggle: toggleSound, play } = useSound();

  const prevScoresRef = useRef<[number, number]>([0, 0]);
  const prevPhaseRef = useRef(state.phase);
  const prevPlayerRef = useRef(state.currentPlayer);

  // Score-box sound
  useEffect(() => {
    const [p1, p2] = state.scores;
    const [pp1, pp2] = prevScoresRef.current;
    if (p1 > pp1 || p2 > pp2) play('scoreBox');
    prevScoresRef.current = [p1, p2];
  }, [state.scores, play]);

  // Game-over sound + save high score
  useEffect(() => {
    if (
      state.phase === 'gameover' &&
      prevPhaseRef.current !== 'gameover'
    ) {
      if (state.winner === 1) play('win');
      else if (state.winner === 2) play('lose');
      else play('draw');

      saveHighScore({
        playerScore: state.scores[0],
        aiScore: state.scores[1],
        difficulty: state.config.difficulty,
        date: new Date().toISOString(),
      });
    }
    prevPhaseRef.current = state.phase;
  }, [state.phase, state.winner, state.scores, state.config.difficulty, play]);

  // AI-move sound
  useEffect(() => {
    if (
      state.currentPlayer === 2 &&
      prevPlayerRef.current === 1 &&
      state.phase === 'playing'
    ) {
      play('aiMove');
    }
    prevPlayerRef.current = state.currentPlayer;
  }, [state.currentPlayer, state.phase, play]);

  const handleDrawLine = useCallback(
    (line: Parameters<typeof drawLine>[0]) => drawLine(line),
    [drawLine]
  );

  const isMenu = state.phase === 'menu';
  const isPaused = state.phase === 'paused';
  const isGameOver = state.phase === 'gameover';
  const boardDisabled =
    isPaused || isGameOver || state.currentPlayer === 2;

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#050510] relative flex flex-col">
      {/* Animated ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/3 rounded-full blur-3xl"
        />
      </div>

      <AnimatePresence mode="wait">
        {isMenu ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 flex-1 flex items-center justify-center p-4 overflow-y-auto"
          >
            <DifficultySelector onSelect={startGame} />
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 flex flex-col h-full"
          >
            <Header />

            {/* Main game area */}
            <div className="flex-1 flex flex-col lg:flex-row gap-3 px-3 pb-3 min-h-0">
              {/* Canvas board */}
              <div className="relative flex-1 min-h-0 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
                <GameBoard
                  state={state}
                  onLineDraw={handleDrawLine}
                  soundPlay={play}
                  disabled={boardDisabled}
                />

                {/* Pause overlay */}
                <AnimatePresence>
                  {isPaused && (
                    <motion.div
                      key="pause"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md"
                    >
                      <div className="text-5xl mb-4">⏸</div>
                      <h2 className="text-2xl font-black text-white mb-2">
                        Paused
                      </h2>
                      <button
                        onClick={resume}
                        className="mt-4 px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/20"
                      >
                        Resume
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* End screen */}
                <AnimatePresence>
                  {isGameOver && (
                    <EndScreen
                      key="endscreen"
                      state={state}
                      onRestart={restart}
                      onMenu={goToMenu}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Side panel */}
              <div className="flex flex-row lg:flex-col gap-2 lg:w-48 xl:w-52 shrink-0">
                {/* Turn indicator */}
                <motion.div
                  animate={{
                    borderColor:
                      state.currentPlayer === 1
                        ? 'rgba(0,245,255,0.4)'
                        : 'rgba(255,0,229,0.4)',
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 lg:flex-none rounded-xl border bg-white/5 backdrop-blur-sm px-3 py-2 text-center"
                >
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-1">
                    Turn
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={state.currentPlayer}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      className={`font-bold text-sm ${
                        state.currentPlayer === 1
                          ? 'text-cyan-400'
                          : 'text-pink-400'
                      }`}
                    >
                      {state.currentPlayer === 1 ? '👤 You' : '🤖 AI'}
                      {state.currentPlayer === 2 && (
                        <span className="block text-xs font-normal text-white/30 animate-pulse mt-0.5">
                          thinking...
                        </span>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                {/* Score board */}
                <div className="flex-1 lg:flex-none">
                  <ScoreBoard state={state} />
                </div>

                {/* Controls */}
                <div className="flex-1 lg:flex-none">
                  <GameControls
                    state={state}
                    onPause={pause}
                    onResume={resume}
                    onRestart={restart}
                    onMenu={goToMenu}
                    soundEnabled={soundEnabled}
                    onSoundToggle={toggleSound}
                  />
                </div>

                {/* Difficulty badge */}
                <div className="hidden lg:flex rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-center flex-col gap-0.5">
                  <div className="text-white/30 text-xs uppercase tracking-wider">
                    Difficulty
                  </div>
                  <div
                    className={`text-xs font-bold capitalize ${
                      state.config.difficulty === 'easy'
                        ? 'text-green-400'
                        : state.config.difficulty === 'medium'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}
                  >
                    {state.config.difficulty}
                  </div>
                </div>

                {/* Move counter */}
                <div className="hidden lg:flex rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-center flex-col gap-0.5">
                  <div className="text-white/30 text-xs uppercase tracking-wider">
                    Moves
                  </div>
                  <div className="text-white/70 text-xs font-bold tabular-nums">
                    {state.moveCount}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
