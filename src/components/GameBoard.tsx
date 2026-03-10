'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import { GameState, LineId, Player } from '@/types/game';
import { sounds } from '@/lib/sounds';

interface GameBoardProps {
  state: GameState;
  onLineDraw: (line: LineId) => void;
  soundPlay: (name: keyof typeof sounds) => void;
  disabled?: boolean;
}

const PLAYER_COLORS: Record<Player, string> = {
  1: '#00f5ff',
  2: '#ff00e5',
};

const PLAYER_FILL: Record<Player, string> = {
  1: 'rgba(0, 245, 255, 0.15)',
  2: 'rgba(255, 0, 229, 0.15)',
};

const PADDING = 30;

export default function GameBoard({
  state,
  onLineDraw,
  soundPlay,
  disabled,
}: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredLine, setHoveredLine] = useState<LineId | null>(null);
  const [cellSize, setCellSize] = useState(70);

  const { rows, cols } = state.config;

  // Calculate cell size based on container
  useEffect(() => {
    const update = () => {
      const container = containerRef.current;
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const maxW = (w - PADDING * 2) / cols;
      const maxH = (h - PADDING * 2) / rows;
      setCellSize(Math.max(35, Math.min(90, Math.floor(Math.min(maxW, maxH)))));
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [rows, cols]);

  const canvasWidth = cols * cellSize + PADDING * 2;
  const canvasHeight = rows * cellSize + PADDING * 2;

  // Draw the board
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const dotX = (c: number) => PADDING + c * cellSize;
    const dotY = (r: number) => PADDING + r * cellSize;

    // Draw completed boxes
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const owner = state.boxes[r][c];
        if (owner) {
          ctx.fillStyle = PLAYER_FILL[owner];
          ctx.fillRect(dotX(c) + 2, dotY(r) + 2, cellSize - 4, cellSize - 4);

          // Player label in box
          ctx.font = `bold ${Math.max(10, cellSize * 0.3)}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = PLAYER_COLORS[owner];
          ctx.globalAlpha = 0.4;
          ctx.fillText(
            owner === 1 ? 'P' : 'AI',
            dotX(c) + cellSize / 2,
            dotY(r) + cellSize / 2
          );
          ctx.globalAlpha = 1;
        }
      }
    }

    // Draw ghost (undrawn) lines
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!state.hLines[r][c]) {
          ctx.beginPath();
          ctx.moveTo(dotX(c), dotY(r));
          ctx.lineTo(dotX(c + 1), dotY(r));
          ctx.stroke();
        }
      }
    }
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c <= cols; c++) {
        if (!state.vLines[r][c]) {
          ctx.beginPath();
          ctx.moveTo(dotX(c), dotY(r));
          ctx.lineTo(dotX(c), dotY(r + 1));
          ctx.stroke();
        }
      }
    }
    ctx.setLineDash([]);

    // Draw hovered line preview
    if (hoveredLine && !disabled) {
      const color = state.currentPlayer === 1 ? PLAYER_COLORS[1] : PLAYER_COLORS[2];
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.globalAlpha = 0.6;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      if (hoveredLine.type === 'h') {
        ctx.moveTo(dotX(hoveredLine.col), dotY(hoveredLine.row));
        ctx.lineTo(dotX(hoveredLine.col + 1), dotY(hoveredLine.row));
      } else {
        ctx.moveTo(dotX(hoveredLine.col), dotY(hoveredLine.row));
        ctx.lineTo(dotX(hoveredLine.col), dotY(hoveredLine.row + 1));
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }

    // Draw drawn horizontal lines
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (state.hLines[r][c]) {
          const isLast =
            state.lastMove?.type === 'h' &&
            state.lastMove.row === r &&
            state.lastMove.col === c;
          const owner = findLineOwner(state, { type: 'h', row: r, col: c });
          const color = owner ? PLAYER_COLORS[owner] : '#ffffff';
          ctx.strokeStyle = color;
          ctx.lineWidth = isLast ? 5 : 3;
          ctx.shadowColor = color;
          ctx.shadowBlur = isLast ? 18 : 8;
          ctx.beginPath();
          ctx.moveTo(dotX(c), dotY(r));
          ctx.lineTo(dotX(c + 1), dotY(r));
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }
    }

    // Draw drawn vertical lines
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c <= cols; c++) {
        if (state.vLines[r][c]) {
          const isLast =
            state.lastMove?.type === 'v' &&
            state.lastMove.row === r &&
            state.lastMove.col === c;
          const owner = findLineOwner(state, { type: 'v', row: r, col: c });
          const color = owner ? PLAYER_COLORS[owner] : '#ffffff';
          ctx.strokeStyle = color;
          ctx.lineWidth = isLast ? 5 : 3;
          ctx.shadowColor = color;
          ctx.shadowBlur = isLast ? 18 : 8;
          ctx.beginPath();
          ctx.moveTo(dotX(c), dotY(r));
          ctx.lineTo(dotX(c), dotY(r + 1));
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }
    }

    // Draw dots
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        const x = dotX(c);
        const y = dotY(r);
        ctx.beginPath();
        ctx.arc(x, y, Math.max(4, cellSize * 0.07), 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }, [state, hoveredLine, cellSize, canvasWidth, canvasHeight, rows, cols, disabled]);

  // Find nearest line to a canvas point
  const getNearestLine = useCallback(
    (x: number, y: number): LineId | null => {
      const dotX = (c: number) => PADDING + c * cellSize;
      const dotY = (r: number) => PADDING + r * cellSize;
      const threshold = cellSize * 0.35;

      let best: LineId | null = null;
      let bestDist = threshold;

      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (state.hLines[r][c]) continue;
          const x1 = dotX(c),
            y1 = dotY(r);
          const x2 = dotX(c + 1),
            y2 = dotY(r);
          const dist = distToSegment(x, y, x1, y1, x2, y2);
          if (dist < bestDist) {
            bestDist = dist;
            best = { type: 'h', row: r, col: c };
          }
        }
      }
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c <= cols; c++) {
          if (state.vLines[r][c]) continue;
          const x1 = dotX(c),
            y1 = dotY(r);
          const x2 = dotX(c),
            y2 = dotY(r + 1);
          const dist = distToSegment(x, y, x1, y1, x2, y2);
          if (dist < bestDist) {
            bestDist = dist;
            best = { type: 'v', row: r, col: c };
          }
        }
      }
      return best;
    },
    [state, cellSize, rows, cols]
  );

  const getCanvasPos = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvasWidth / rect.width;
      const scaleY = canvasHeight / rect.height;

      let clientX: number, clientY: number;
      if ('touches' in e) {
        const touch =
          e.touches[0] ?? e.changedTouches[0];
        clientX = touch?.clientX ?? 0;
        clientY = touch?.clientY ?? 0;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };
    },
    [canvasWidth, canvasHeight]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (disabled || state.currentPlayer !== 1) return;
      const pos = getCanvasPos(e);
      if (!pos) return;
      const line = getNearestLine(pos.x, pos.y);
      setHoveredLine(line);
    },
    [disabled, state.currentPlayer, getCanvasPos, getNearestLine]
  );

  const handleMouseLeave = useCallback(() => setHoveredLine(null), []);

  const handleClick = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (disabled || state.currentPlayer !== 1 || state.phase !== 'playing')
        return;
      const pos = getCanvasPos(e);
      if (!pos) return;
      const line = getNearestLine(pos.x, pos.y);
      if (line) {
        onLineDraw(line);
        soundPlay('drawLine');
        setHoveredLine(null);
      }
    },
    [
      disabled,
      state.currentPlayer,
      state.phase,
      getCanvasPos,
      getNearestLine,
      onLineDraw,
      soundPlay,
    ]
  );

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center w-full h-full min-h-[280px]"
    >
      <canvas
        ref={canvasRef}
        className="cursor-crosshair rounded-lg"
        style={{ touchAction: 'none' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onTouchEnd={handleClick}
      />
    </div>
  );
}

// --- Helpers ---

function distToSegment(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number
): number {
  const dx = bx - ax,
    dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - ax, py - ay);
  const t = Math.max(
    0,
    Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq)
  );
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function findLineOwner(state: GameState, line: LineId): Player | null {
  const { rows, cols } = state.config;
  if (line.type === 'h') {
    const { row, col } = line;
    if (row > 0 && state.boxes[row - 1][col]) return state.boxes[row - 1][col];
    if (row < rows && state.boxes[row][col]) return state.boxes[row][col];
  } else {
    const { row, col } = line;
    if (col > 0 && state.boxes[row][col - 1]) return state.boxes[row][col - 1];
    if (col < cols && state.boxes[row][col]) return state.boxes[row][col];
  }
  return null;
}
