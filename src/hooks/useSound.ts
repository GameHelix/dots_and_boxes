'use client';
import { useState, useCallback } from 'react';
import { sounds, resumeAudio } from '@/lib/sounds';

export function useSound() {
  const [enabled, setEnabled] = useState(true);

  const play = useCallback(
    (name: keyof typeof sounds) => {
      if (!enabled) return;
      resumeAudio();
      sounds[name]();
    },
    [enabled]
  );

  const toggle = useCallback(() => setEnabled(e => !e), []);

  return { enabled, toggle, play };
}
