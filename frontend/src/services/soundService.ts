export const soundService = {
  correct(enabled: boolean) {
    if (!enabled) return;
    try {
      const AudioContextClass =
          window.AudioContext ||
          (
            window as typeof window & {
              webkitAudioContext: typeof AudioContext;
            }
          ).webkitAudioContext,
        context = new AudioContextClass(),
        oscillator = context.createOscillator(),
        gain = context.createGain();
      oscillator.frequency.value = 660;
      gain.gain.setValueAtTime(0.025, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.12);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.12);
    } catch {
      /* Optional sound never blocks an activity. */
    }
  },
};
