// Web Audio synthesizer for alarms and notifications
import { AlarmSound } from '../types';

let audioCtx: AudioContext | null = null;
let currentAlarmInterval: number | null = null;
let currentOscillators: OscillatorNode[] = [];

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playNotificationSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  } catch (e) {
    console.warn('Audio play failed:', e);
  }
}

export function playCompletionSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.setValueAtTime(659.25, now + 0.08); // E5
    osc1.frequency.setValueAtTime(783.99, now + 0.16); // G5
    osc1.frequency.setValueAtTime(1046.50, now + 0.24); // C6

    osc2.frequency.setValueAtTime(1046.50, now + 0.24);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.24);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.24);
    osc1.stop(now + 0.6);
    osc2.stop(now + 0.6);
  } catch (e) {
    console.warn('Completion sound failed:', e);
  }
}

export function playAlarmLoop(sound: AlarmSound = 'morning', volume: number = 80) {
  stopAlarmSound();
  const ctx = getAudioContext();
  const masterVolume = (volume / 100) * 0.5;

  const playToneSequence = () => {
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(masterVolume, now);

    if (sound === 'morning' || sound === 'gentle') {
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.50]; // C5, E5, G5, B5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);

        noteGain.gain.setValueAtTime(0, now + idx * 0.15);
        noteGain.gain.linearRampToValueAtTime(masterVolume * 0.8, now + idx * 0.15 + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.6);

        osc.connect(noteGain);
        noteGain.connect(ctx.destination);

        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 0.6);
        currentOscillators.push(osc);
      });
    } else if (sound === 'radar') {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.3);

      gain.gain.setValueAtTime(masterVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
      currentOscillators.push(osc);
    } else if (sound === 'digital') {
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const beeperGain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1200, now + i * 0.12);

        beeperGain.gain.setValueAtTime(masterVolume * 0.4, now + i * 0.12);
        beeperGain.gain.setValueAtTime(0, now + i * 0.12 + 0.06);

        osc.connect(beeperGain);
        beeperGain.connect(ctx.destination);

        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.07);
        currentOscillators.push(osc);
      }
    } else { // 'chime'
      const chimeFreqs = [784, 1046, 1318];
      chimeFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.2);

        chimeGain.gain.setValueAtTime(masterVolume, now + idx * 0.2);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.2 + 0.9);

        osc.connect(chimeGain);
        chimeGain.connect(ctx.destination);

        osc.start(now + idx * 0.2);
        osc.stop(now + idx * 0.2 + 0.9);
        currentOscillators.push(osc);
      });
    }
  };

  playToneSequence();
  currentAlarmInterval = window.setInterval(playToneSequence, 1500);
}

export function stopAlarmSound() {
  if (currentAlarmInterval !== null) {
    clearInterval(currentAlarmInterval);
    currentAlarmInterval = null;
  }
  currentOscillators.forEach(osc => {
    try {
      osc.stop();
      osc.disconnect();
    } catch {
      // already stopped
    }
  });
  currentOscillators = [];
}

export function previewSound(sound: AlarmSound, volume: number = 80) {
  stopAlarmSound();
  playAlarmLoop(sound, volume);
  setTimeout(() => {
    stopAlarmSound();
  }, 2000);
}
