// Simple confetti effect for celebration
export function launchConfetti() {
  if (typeof window === 'undefined') return;
  const duration = 1200;
  const end = Date.now() + duration;
  const colors = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6'];

  (function frame() {
  // @ts-expect-error: confetti is a global injected by the confetti library
    confetti({
      particleCount: 5,
      angle: 60 + Math.random() * 60,
      spread: 55 + Math.random() * 20,
      origin: { x: Math.random(), y: Math.random() * 0.5 },
      colors,
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
