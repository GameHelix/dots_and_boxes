'use client';
import { useReducer, useEffect, useCallback, useRef } from 'react';
import { GameState, LineId, Difficulty } from '@/types/game';
import { gameReducer, createInitialState, getGridSize } from '@/lib/gameLogic';
import { getAIMove } from '@/lib/aiPlayer';

const INITIAL_DIFFICULTY: Difficulty = 'easy';

function getInitialState(): GameState {
  const size = getGridSize(INITIAL_DIFFICULTY);
  return {
    ...createInitialState({ ...size, difficulty: INITIAL_DIFFICULTY }),
    phase: 'menu',
  };
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, null, getInitialState);
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAiTimer = useCallback(() => {
    if (aiTimerRef.current) {
      clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }
  }, []);

  const startGame = useCallback((difficulty: Difficulty) => {
    clearAiTimer();
    dispatch({ type: 'START_GAME', difficulty });
  }, [clearAiTimer]);

  const drawLine = useCallback(
    (line: LineId) => {
      if (state.currentPlayer !== 1) return;
      dispatch({ type: 'DRAW_LINE', line });
    },
    [state.currentPlayer]
  );

  const pause = useCallback(() => {
    clearAiTimer();
    dispatch({ type: 'PAUSE' });
  }, [clearAiTimer]);

  const resume = useCallback(() => dispatch({ type: 'RESUME' }), []);

  const restart = useCallback(() => {
    clearAiTimer();
    dispatch({ type: 'RESTART' });
  }, [clearAiTimer]);

  const goToMenu = useCallback(() => {
    clearAiTimer();
    dispatch({ type: 'MENU' });
  }, [clearAiTimer]);

  // AI turn
  useEffect(() => {
    if (state.phase !== 'playing') return;
    if (state.currentPlayer !== 2) return;

    const delay =
      state.config.difficulty === 'easy'
        ? 600
        : state.config.difficulty === 'medium'
        ? 800
        : 1000;

    aiTimerRef.current = setTimeout(() => {
      const move = getAIMove(state, state.config.difficulty);
      dispatch({ type: 'DRAW_LINE', line: move });
    }, delay);

    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.currentPlayer, state.moveCount]);

  return { state, startGame, drawLine, pause, resume, restart, goToMenu };
}
