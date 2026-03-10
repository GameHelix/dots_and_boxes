import { GameState, GameConfig, Player, LineId, Difficulty, GameAction } from '@/types/game';

const GRID_SIZES: Record<Difficulty, { rows: number; cols: number }> = {
  easy: { rows: 4, cols: 4 },
  medium: { rows: 6, cols: 6 },
  hard: { rows: 8, cols: 8 },
};

export function getGridSize(difficulty: Difficulty) {
  return GRID_SIZES[difficulty];
}

export function createInitialState(config: GameConfig): GameState {
  const { rows, cols } = config;
  return {
    config,
    hLines: Array.from({ length: rows + 1 }, () => Array(cols).fill(false)),
    vLines: Array.from({ length: rows }, () => Array(cols + 1).fill(false)),
    boxes: Array.from({ length: rows }, () => Array(cols).fill(null)),
    currentPlayer: 1,
    scores: [0, 0],
    phase: 'playing',
    winner: null,
    moveCount: 0,
    lastMove: null,
  };
}

export function isLineDrawn(state: GameState, line: LineId): boolean {
  return line.type === 'h'
    ? state.hLines[line.row][line.col]
    : state.vLines[line.row][line.col];
}

export function drawLine(
  state: GameState,
  line: LineId
): { newState: GameState; boxesCompleted: number } {
  if (isLineDrawn(state, line)) return { newState: state, boxesCompleted: 0 };

  const newH = state.hLines.map(r => [...r]);
  const newV = state.vLines.map(r => [...r]);
  if (line.type === 'h') newH[line.row][line.col] = true;
  else newV[line.row][line.col] = true;

  const newBoxes = state.boxes.map(r => [...r]) as (Player | null)[][];
  let boxesCompleted = 0;
  const { rows, cols } = state.config;

  const checkBox = (r: number, c: number) => {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    if (newBoxes[r][c] !== null) return;
    if (newH[r][c] && newH[r + 1][c] && newV[r][c] && newV[r][c + 1]) {
      newBoxes[r][c] = state.currentPlayer;
      boxesCompleted++;
    }
  };

  if (line.type === 'h') {
    checkBox(line.row - 1, line.col);
    checkBox(line.row, line.col);
  } else {
    checkBox(line.row, line.col - 1);
    checkBox(line.row, line.col);
  }

  const newScores: [number, number] = [
    state.scores[0] + (state.currentPlayer === 1 ? boxesCompleted : 0),
    state.scores[1] + (state.currentPlayer === 2 ? boxesCompleted : 0),
  ];

  const nextPlayer: Player =
    boxesCompleted === 0 ? (state.currentPlayer === 1 ? 2 : 1) : state.currentPlayer;
  const totalBoxes = rows * cols;
  const gameOver = newScores[0] + newScores[1] === totalBoxes;

  let winner: GameState['winner'] = null;
  if (gameOver) {
    if (newScores[0] > newScores[1]) winner = 1;
    else if (newScores[1] > newScores[0]) winner = 2;
    else winner = 'draw';
  }

  return {
    newState: {
      ...state,
      hLines: newH,
      vLines: newV,
      boxes: newBoxes,
      currentPlayer: nextPlayer,
      scores: newScores,
      phase: gameOver ? 'gameover' : 'playing',
      winner,
      moveCount: state.moveCount + 1,
      lastMove: line,
    },
    boxesCompleted,
  };
}

export function getAvailableLines(state: GameState): LineId[] {
  const lines: LineId[] = [];
  const { rows, cols } = state.config;
  for (let r = 0; r <= rows; r++)
    for (let c = 0; c < cols; c++)
      if (!state.hLines[r][c]) lines.push({ type: 'h', row: r, col: c });
  for (let r = 0; r < rows; r++)
    for (let c = 0; c <= cols; c++)
      if (!state.vLines[r][c]) lines.push({ type: 'v', row: r, col: c });
  return lines;
}

export function countBoxSides(state: GameState, row: number, col: number): number {
  if (state.boxes[row][col] !== null) return 4;
  let n = 0;
  if (state.hLines[row][col]) n++;
  if (state.hLines[row + 1][col]) n++;
  if (state.vLines[row][col]) n++;
  if (state.vLines[row][col + 1]) n++;
  return n;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const size = getGridSize(action.difficulty);
      return createInitialState({ ...size, difficulty: action.difficulty });
    }
    case 'DRAW_LINE': {
      if (state.phase !== 'playing') return state;
      const { newState } = drawLine(state, action.line);
      return newState;
    }
    case 'PAUSE':
      return state.phase === 'playing' ? { ...state, phase: 'paused' } : state;
    case 'RESUME':
      return state.phase === 'paused' ? { ...state, phase: 'playing' } : state;
    case 'RESTART':
      return createInitialState(state.config);
    case 'MENU':
      return { ...state, phase: 'menu' };
    default:
      return state;
  }
}
