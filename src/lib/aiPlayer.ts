import { GameState, LineId, Difficulty } from '@/types/game';
import { getAvailableLines, countBoxSides } from './gameLogic';

export function getAIMove(state: GameState, difficulty: Difficulty): LineId {
  switch (difficulty) {
    case 'easy':
      return getEasyMove(state);
    case 'medium':
      return getMediumMove(state);
    case 'hard':
      return getHardMove(state);
  }
}

function getRandomMove(state: GameState): LineId {
  const lines = getAvailableLines(state);
  return lines[Math.floor(Math.random() * lines.length)];
}

function getEasyMove(state: GameState): LineId {
  return getRandomMove(state);
}

function getMediumMove(state: GameState): LineId {
  const lines = getAvailableLines(state);
  if (lines.length === 0) return getRandomMove(state);

  // Complete any available box first
  const completing = lines.filter(l => completesBox(state, l));
  if (completing.length > 0)
    return completing[Math.floor(Math.random() * completing.length)];

  // Otherwise random
  return lines[Math.floor(Math.random() * lines.length)];
}

function getHardMove(state: GameState): LineId {
  const lines = getAvailableLines(state);
  if (lines.length === 0) return getRandomMove(state);

  // 1. Complete any box
  const completing = lines.filter(l => completesBox(state, l));
  if (completing.length > 0)
    return completing[Math.floor(Math.random() * completing.length)];

  // 2. Safe moves that don't give opponent a free box
  const safe = lines.filter(l => !givesOpponentBox(state, l));
  if (safe.length > 0)
    return safe[Math.floor(Math.random() * safe.length)];

  // 3. Sacrifice the move that gives fewest boxes to opponent
  return getSacrifice(state, lines);
}

function completesBox(state: GameState, line: LineId): boolean {
  const { rows, cols } = state.config;
  const adjacent = getAdjacentBoxes(line, rows, cols);
  return adjacent.some(([r, c]) => countBoxSides(state, r, c) === 3);
}

function givesOpponentBox(state: GameState, line: LineId): boolean {
  const { rows, cols } = state.config;
  const adjacent = getAdjacentBoxes(line, rows, cols);
  // After drawing this line, a box with currently 2 sides would have 3 → opponent can complete it
  return adjacent.some(([r, c]) => countBoxSides(state, r, c) === 2);
}

function getAdjacentBoxes(
  line: LineId,
  rows: number,
  cols: number
): [number, number][] {
  const result: [number, number][] = [];
  if (line.type === 'h') {
    if (line.row > 0) result.push([line.row - 1, line.col]);
    if (line.row < rows) result.push([line.row, line.col]);
  } else {
    if (line.col > 0) result.push([line.row, line.col - 1]);
    if (line.col < cols) result.push([line.row, line.col]);
  }
  return result.filter(([r, c]) => r >= 0 && r < rows && c >= 0 && c < cols);
}

function getSacrifice(state: GameState, lines: LineId[]): LineId {
  // Pick the move that creates fewest 3-sided boxes for the opponent
  const { rows, cols } = state.config;
  let best = lines[0];
  let bestCount = Infinity;
  for (const line of lines) {
    const count = getAdjacentBoxes(line, rows, cols).filter(
      ([r, c]) => countBoxSides(state, r, c) === 2
    ).length;
    if (count < bestCount) {
      bestCount = count;
      best = line;
    }
  }
  return best;
}
