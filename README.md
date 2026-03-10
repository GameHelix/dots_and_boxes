# Dots & Boxes — Neon Edition

A full-stack browser implementation of the classic Dots and Boxes game, built with Next.js 15, TypeScript, and Tailwind CSS. Features a neon/cyberpunk visual theme, three AI difficulty levels, responsive design, and Web Audio sound effects.

---

## Features

- **Neon Cyberpunk Theme** — dark background with cyan & magenta glow effects, glassmorphism UI
- **HTML5 Canvas Game Board** — DPR-aware rendering, hover previews, glow effects on drawn lines
- **3 Difficulty Levels** — Easy (4×4), Medium (6×6), Hard (8×8) grids
- **AI Opponent** — three strategy tiers: random, greedy, and chain-aware
- **Responsive Layout** — works on desktop, tablet, and mobile; no horizontal scroll
- **Touch Support** — draw lines with tap/touch on mobile
- **Smooth Animations** — Framer Motion transitions on scores, end screen, and UI elements
- **Sound Effects** — Web Audio API generated tones (no audio files); toggleable on/off
- **Pause / Resume** — pause the game mid-session
- **High Score Persistence** — best score per difficulty saved to localStorage
- **Win / Lose / Draw Detection** — animated end screen with result and replay options
- **Move Counter** — tracks total moves in the current game
- **Progress Bar** — visual indicator of game completion

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion v11 |
| Game Rendering | HTML5 Canvas |
| Sound | Web Audio API (programmatic tones) |
| Storage | localStorage |
| Deployment | Vercel |

---

## Controls

### Desktop (Mouse & Keyboard)
| Action | Control |
|--------|---------|
| Draw a line | Click near a line on the board |
| Hover preview | Move mouse close to an available line |
| Pause | Click the Pause button |
| Restart | Click the Restart (↺) button |
| Back to menu | Click the Menu (☰) button |
| Toggle sound | Click the 🔊/🔇 button |

### Mobile (Touch)
| Action | Control |
|--------|---------|
| Draw a line | Tap near a line on the board |
| Pause / menu | On-screen buttons |

---

## Game Rules

1. Players alternate drawing lines between adjacent dots.
2. When a player completes the **4th side** of a box, they **claim it** and **take another turn**.
3. The game ends when all boxes are claimed.
4. The player with the **most boxes** wins. A tie is possible.

---

## AI Difficulty

| Level | Strategy |
|-------|---------|
| Easy | Random available moves |
| Medium | Completes boxes when available, otherwise random |
| Hard | Completes boxes first; avoids giving opponent free chains; sacrifices smallest chain when forced |

---

## How to Run Locally

**Prerequisites:** Node.js 18+ and npm

```bash
# Clone the repository
git clone <your-repo-url>
cd dots-and-boxes

# Install dependencies
npm install

# Start development server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## Deploy to Vercel

The project is pre-configured for zero-config Vercel deployment.

**Option 1 — Vercel CLI:**
```bash
npm install -g vercel
vercel
```

**Option 2 — GitHub Integration:**
1. Push the repository to GitHub.
2. Go to [vercel.com](https://vercel.com) → New Project.
3. Import your GitHub repository.
4. Leave all settings at their defaults.
5. Click **Deploy**.

Vercel auto-detects Next.js and configures the build pipeline. No environment variables are required.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout with metadata
│   ├── page.tsx          # Main game page (orchestrator)
│   └── globals.css       # Tailwind base + neon utilities
├── components/
│   ├── GameBoard.tsx      # HTML5 Canvas board with hit detection
│   ├── ScoreBoard.tsx     # Animated player score cards
│   ├── GameControls.tsx   # Pause / restart / menu / sound buttons
│   ├── EndScreen.tsx      # Win/lose/draw overlay
│   ├── DifficultySelector.tsx  # Main menu
│   └── Header.tsx         # Gradient title bar
├── hooks/
│   ├── useGameState.ts    # Game state reducer + AI timer
│   └── useSound.ts        # Sound toggle wrapper
├── lib/
│   ├── gameLogic.ts       # Pure game functions + reducer
│   ├── aiPlayer.ts        # AI strategy implementations
│   ├── sounds.ts          # Web Audio tone generators
│   └── storage.ts         # localStorage high-score helpers
└── types/
    └── game.ts            # Shared TypeScript types
```

---

## License

MIT
