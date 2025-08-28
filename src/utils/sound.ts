// Play a short beep for move, win, or draw

// Unique move sound (short click)
export function playMoveSound() {
  if (typeof window === 'undefined') return;
  const AudioCtx: typeof AudioContext = (window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)!;
  const ctx = new AudioCtx();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'square';
  o.frequency.value = 520;
  g.gain.value = 0.10;
  o.connect(g);
  g.connect(ctx.destination);
  o.start();
  o.stop(ctx.currentTime + 0.09);
  o.onended = () => ctx.close();
}


// Unique win sound (ascending arpeggio)
export function playWinSound() {
  if (typeof window === 'undefined') return;
  const AudioCtx: typeof AudioContext = (window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)!;
  const ctx = new AudioCtx();
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  const t = ctx.currentTime;
  notes.forEach((freq, i) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.value = freq;
    g.gain.value = 0.13 - i * 0.02;
    o.connect(g);
    g.connect(ctx.destination);
    o.start(t + i * 0.08);
    o.stop(t + i * 0.08 + 0.13);
    o.onended = () => ctx.close();
  });
}


// Unique draw sound (neutral chime)
export function playDrawSound() {
  if (typeof window === 'undefined') return;
  const AudioCtx: typeof AudioContext = (window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)!;
  const ctx = new AudioCtx();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine';
  o.frequency.value = 392; // G4
  g.gain.value = 0.11;
  o.connect(g);
  g.connect(ctx.destination);
  o.start();
  o.frequency.linearRampToValueAtTime(294, ctx.currentTime + 0.22); // D4
  o.stop(ctx.currentTime + 0.28);
  o.onended = () => ctx.close();
}

// Unique loss sound (descending, sad)
export function playLossSound() {
  if (typeof window === 'undefined') return;
  const AudioCtx: typeof AudioContext = (window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)!;
  const ctx = new AudioCtx();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sawtooth';
  o.frequency.value = 392; // G4
  g.gain.value = 0.12;
  o.connect(g);
  g.connect(ctx.destination);
  o.start();
  o.frequency.linearRampToValueAtTime(196, ctx.currentTime + 0.32); // G3
  o.stop(ctx.currentTime + 0.36);
  o.onended = () => ctx.close();
}
