import { HighScore, Difficulty } from '@/types/game';

const KEY = 'dots-boxes-highscores';

export function getHighScores(): Record<Difficulty, HighScore | null> {
  if (typeof window === 'undefined') return { easy: null, medium: null, hard: null };
  try {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : { easy: null, medium: null, hard: null };
  } catch {
    return { easy: null, medium: null, hard: null };
  }
}

export function saveHighScore(score: HighScore): void {
  if (typeof window === 'undefined') return;
  const scores = getHighScores();
  const existing = scores[score.difficulty];
  if (!existing || score.playerScore > existing.playerScore) {
    scores[score.difficulty] = score;
    localStorage.setItem(KEY, JSON.stringify(scores));
  }
}
