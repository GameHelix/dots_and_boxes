'use client';
import { GameState } from '@/types/game';

interface GameControlsProps {
  state: GameState;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
}

export default function GameControls({
  state,
  onPause,
  onResume,
  onRestart,
  onMenu,
  soundEnabled,
  onSoundToggle,
}: GameControlsProps) {
  const { phase } = state;

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {phase === 'playing' ? (
        <button
          onClick={onPause}
          className="flex-1 min-w-[72px] px-2 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
        >
          ⏸ Pause
        </button>
      ) : phase === 'paused' ? (
        <button
          onClick={onResume}
          className="flex-1 min-w-[72px] px-2 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
        >
          ▶ Resume
        </button>
      ) : null}

      <button
        onClick={onRestart}
        className="flex-1 min-w-[72px] px-2 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-400 text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
      >
        ↺ Restart
      </button>

      <button
        onClick={onMenu}
        className="flex-1 min-w-[72px] px-2 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white/70 text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
      >
        ☰ Menu
      </button>

      <button
        onClick={onSoundToggle}
        className="px-2 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white/70 text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
        title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
      >
        {soundEnabled ? '🔊' : '🔇'}
      </button>
    </div>
  );
}
