let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.3,
  delay = 0
) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
  gain.gain.setValueAtTime(0, ctx.currentTime + delay);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration + 0.01);
}

export const sounds = {
  drawLine: () => playTone(440, 0.1, 'square', 0.15),
  scoreBox: () => {
    playTone(523, 0.15, 'sine', 0.25);
    playTone(659, 0.15, 'sine', 0.2, 0.1);
    playTone(784, 0.2, 'sine', 0.25, 0.2);
  },
  win: () => {
    [523, 659, 784, 1047].forEach((f, i) => playTone(f, 0.25, 'sine', 0.3, i * 0.15));
  },
  lose: () => {
    [523, 440, 349, 262].forEach((f, i) => playTone(f, 0.25, 'sine', 0.25, i * 0.15));
  },
  draw: () => {
    [440, 440, 440].forEach((f, i) =>
      playTone(f, 0.2, 'triangle', 0.2, i * 0.2)
    );
  },
  hover: () => playTone(660, 0.05, 'sine', 0.05),
  aiMove: () => playTone(330, 0.1, 'triangle', 0.1),
};

export function resumeAudio() {
  getCtx()?.resume();
}
