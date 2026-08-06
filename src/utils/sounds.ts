export const playResultBamSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // C Major Chord: C5, E5, G5
    const frequencies = [523.25, 659.25, 783.99];
    
    frequencies.forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      // Start 50Hz below and ramp to true pitch over 180ms
      osc.frequency.setValueAtTime(freq - 50, now);
      osc.frequency.exponentialRampToValueAtTime(freq, now + 0.18);
      
      // Volume envelope: quick attack, quick release
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      
      osc.start(now);
      osc.stop(now + 0.35);
    });
  } catch (e) {
    console.error('Audio error:', e);
  }
};

export const playTapSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    // Randomized frequency between 420 and 500
    const startFreq = 420 + Math.random() * 80;
    
    osc.frequency.setValueAtTime(startFreq, now);
    // Rapidly drops to 100Hz over 60ms
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.06);
    
    // Volume envelope
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    osc.start(now);
    osc.stop(now + 0.12);
  } catch (e) {
    console.error('Audio error:', e);
  }
};

export const playOpenLensSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const frequencies = [330, 440];
    
    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      // Stagger slightly
      const startTime = now + (index * 0.03);
      
      osc.frequency.setValueAtTime(freq, startTime);
      // Frequencies multiplied by 1.5 over 120ms
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, startTime + 0.12);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
      
      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  } catch (e) {
    console.error('Audio error:', e);
  }
};

export const playPlopSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    // Plop sound: starts around 600Hz, drops fast to 200Hz
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
    
    // Volume envelope: very fast attack, fast release
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    osc.start(now);
    osc.stop(now + 0.12);
  } catch (e) {
    console.error('Audio error:', e);
  }
};
