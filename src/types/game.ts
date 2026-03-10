export type Player = 1 | 2;
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GamePhase = 'menu' | 'playing' | 'paused' | 'gameover';

export interface GameConfig {
  rows: number;
  cols: number;
  difficulty: Difficulty;
}

export interface GameState {
  config: GameConfig;
  /** (rows+1) × cols horizontal lines */
  hLines: boolean[][];
  /** rows × (cols+1) vertical lines */
  vLines: boolean[][];
  /** rows × cols box owners */
  boxes: (Player | null)[][];
  currentPlayer: Player;
  scores: [number, number];
  phase: GamePhase;
  winner: Player | 'draw' | null;
  moveCount: number;
  lastMove: LineId | null;
}

export interface LineId {
  type: 'h' | 'v';
  row: number;
  col: number;
}

export interface HighScore {
  playerScore: number;
  aiScore: number;
  difficulty: Difficulty;
  date: string;
}

export type GameAction =
  | { type: 'START_GAME'; difficulty: Difficulty }
  | { type: 'DRAW_LINE'; line: LineId }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESTART' }
  | { type: 'MENU' };
