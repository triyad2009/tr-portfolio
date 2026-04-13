import { useCallback, useEffect, useRef } from "react";
import { useAppStore } from "../store/useAppStore";

type SoundType =
  | "click"
  | "hover"
  | "transition"
  | "whoosh"
  | "impact"
  | "ambient"
  | "ai-send"
  | "ai-response";

interface SoundConfig {
  frequency?: number;
  duration?: number;
  type?: OscillatorType;
  volume?: number;
  attack?: number;
  decay?: number;
  detune?: number;
}

const SOUND_CONFIGS: Record<SoundType, SoundConfig> = {
  click: {
    frequency: 800,
    duration: 0.08,
    type: "sine",
    volume: 0.3,
    attack: 0.001,
    decay: 0.08,
  },
  hover: {
    frequency: 440,
    duration: 0.05,
    type: "sine",
    volume: 0.08,
    attack: 0.001,
    decay: 0.05,
  },
  transition: {
    frequency: 220,
    duration: 0.4,
    type: "sine",
    volume: 0.25,
    attack: 0.01,
    decay: 0.4,
  },
  whoosh: {
    frequency: 600,
    duration: 0.4,
    type: "sine",
    volume: 0.12,
    attack: 0.02,
    decay: 0.4,
  },
  impact: {
    frequency: 80,
    duration: 0.5,
    type: "triangle",
    volume: 0.35,
    attack: 0.001,
    decay: 0.5,
  },
  ambient: {
    frequency: 110,
    duration: 2,
    type: "sine",
    volume: 0.05,
    attack: 0.5,
    decay: 2,
  },
  "ai-send": {
    frequency: 880,
    duration: 0.08,
    type: "sine",
    volume: 0.25,
    attack: 0.002,
    decay: 0.08,
  },
  "ai-response": {
    frequency: 440,
    duration: 0.15,
    type: "sine",
    volume: 0.18,
    attack: 0.01,
    decay: 0.15,
  },
};

// ─── Shared singleton: Web Audio Context ─────────────────────────────────────
const sharedCtxRef: { current: AudioContext | null } = { current: null };

// ─── Shared singleton: HTML5 Audio background music ──────────────────────────
const bgMusic: {
  audio: HTMLAudioElement | null;
  running: boolean;
  fadeInterval: ReturnType<typeof setInterval> | null;
} = {
  audio: null,
  running: false,
  fadeInterval: null,
};

const BG_MUSIC_SRC = "/assets/audio/background-music.mp3";
const BG_MUSIC_TARGET_VOL = 0.5;
const FADE_IN_DURATION_MS = 7000;
const FADE_OUT_DURATION_MS = 1500;
const FADE_STEP_MS = 100;

function getOrCreateAudio(): HTMLAudioElement {
  if (!bgMusic.audio) {
    const audio = new Audio(BG_MUSIC_SRC);
    audio.loop = true;
    audio.volume = 0;
    audio.preload = "auto";
    bgMusic.audio = audio;
  }
  return bgMusic.audio;
}

function clearFadeInterval() {
  if (bgMusic.fadeInterval !== null) {
    clearInterval(bgMusic.fadeInterval);
    bgMusic.fadeInterval = null;
  }
}

export function useSound() {
  const soundEnabled = useAppStore((s) => s.soundEnabled);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioCtx = useCallback((): AudioContext | null => {
    if (sharedCtxRef.current) {
      audioCtxRef.current = sharedCtxRef.current;
      if (sharedCtxRef.current.state === "suspended") {
        void sharedCtxRef.current.resume();
      }
      return sharedCtxRef.current;
    }
    if (!soundEnabled) return null;
    try {
      const ctx = new AudioContext();
      sharedCtxRef.current = ctx;
      audioCtxRef.current = ctx;
      return ctx;
    } catch {
      return null;
    }
  }, [soundEnabled]);

  const ensureCtx = useCallback((): AudioContext | null => {
    if (sharedCtxRef.current) {
      if (sharedCtxRef.current.state === "suspended") {
        void sharedCtxRef.current.resume();
      }
      return sharedCtxRef.current;
    }
    try {
      const ctx = new AudioContext();
      sharedCtxRef.current = ctx;
      audioCtxRef.current = ctx;
      return ctx;
    } catch {
      return null;
    }
  }, []);

  const ensureCtxRef = useRef(ensureCtx);
  ensureCtxRef.current = ensureCtx;

  // ─── One-shot sound player ────────────────────────────────────────────────
  const play = useCallback(
    (type: SoundType) => {
      if (!soundEnabled) return;
      const ctx = getAudioCtx();
      if (!ctx) return;

      const config = SOUND_CONFIGS[type];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.type = config.type ?? "sine";
      osc.frequency.setValueAtTime(config.frequency ?? 440, ctx.currentTime);

      if (type === "whoosh") {
        osc.frequency.exponentialRampToValueAtTime(
          200,
          ctx.currentTime + (config.duration ?? 0.4),
        );
      }

      if (type === "ai-response") {
        osc.frequency.exponentialRampToValueAtTime(
          660,
          ctx.currentTime + (config.duration ?? 0.15),
        );
      }

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(4000, ctx.currentTime);

      const vol = config.volume ?? 0.2;
      const attack = config.attack ?? 0.001;
      const decay = config.decay ?? 0.1;

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + attack);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + decay);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + decay + 0.01);
    },
    [soundEnabled, getAudioCtx],
  );

  // ─── Glitch burst ─────────────────────────────────────────────────────────
  const playGlitch = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getAudioCtx();
    if (!ctx) return;

    [440, 880, 660, 220].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05);
      gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + i * 0.05 + 0.04,
      );
      osc.start(ctx.currentTime + i * 0.05);
      osc.stop(ctx.currentTime + i * 0.05 + 0.05);
    });
  }, [soundEnabled, getAudioCtx]);

  /**
   * Gentle cinematic entry tone — soft, space-like, non-fatiguing.
   * Only sine and triangle waveforms. Master gain max 0.15.
   * Duration ~3.5 seconds with smooth decay.
   */
  const playCinematicEntry = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getAudioCtx();
    if (!ctx) return;

    const audioCtx: AudioContext = ctx;
    const now = audioCtx.currentTime;

    const entryMaster = audioCtx.createGain();
    entryMaster.gain.setValueAtTime(0, now);
    entryMaster.gain.linearRampToValueAtTime(0.15, now + 0.6);
    entryMaster.gain.setValueAtTime(0.15, now + 1.6);
    entryMaster.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);
    entryMaster.connect(audioCtx.destination);

    function makeLayer(
      freq: number,
      type: OscillatorType,
      detuneCents: number,
      vol: number,
      attack: number,
      sustain: number,
      release: number,
      startAt: number,
    ) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(entryMaster);

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startAt);
      osc.detune.setValueAtTime(detuneCents, startAt);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2400, startAt);

      gain.gain.setValueAtTime(0, startAt);
      gain.gain.linearRampToValueAtTime(vol, startAt + attack);
      gain.gain.setValueAtTime(vol, startAt + attack + sustain);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        startAt + attack + sustain + release,
      );

      const totalDuration = attack + sustain + release + 0.05;
      osc.start(startAt);
      osc.stop(startAt + totalDuration);
    }

    // Layer 1: Deep sub note — 55 Hz triangle, warm and resonant
    makeLayer(55, "triangle", 0, 0.55, 0.5, 1.0, 1.0, now);
    // Layer 2: Gentle mid tone — 110 Hz sine, slightly detuned
    makeLayer(110, "sine", 4, 0.4, 0.4, 1.2, 0.9, now);
    // Layer 3: Chorus layer — 110 Hz sine, slight negative detune
    makeLayer(110, "sine", -4, 0.35, 0.45, 1.1, 0.85, now + 0.08);
    // Layer 4: Airy harmonic — 220 Hz sine, very soft
    makeLayer(220, "sine", 0, 0.2, 0.3, 0.8, 0.8, now + 0.1);
    // Layer 5: Subtle shimmer — 330 Hz sine, barely-there
    makeLayer(330, "sine", 0, 0.1, 0.35, 0.6, 0.7, now + 0.2);
  }, [soundEnabled, getAudioCtx]);

  // ─── HTML5 Audio Background Music System ──────────────────────────────────
  /**
   * Fades in and starts the background music MP3.
   * Volume rises from 0 → 0.5 over 7 seconds for a gentle introduction.
   * Loops seamlessly. Safe to call multiple times (idempotent).
   */
  const startAmbientMusic = useCallback(() => {
    if (bgMusic.running) return;
    bgMusic.running = true;

    const audio = getOrCreateAudio();

    clearFadeInterval();
    audio.volume = 0;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("[BG Music] Playback failed:", err);
        bgMusic.running = false;
      });
    }

    // Fade in: step volume up over FADE_IN_DURATION_MS
    const steps = Math.ceil(FADE_IN_DURATION_MS / FADE_STEP_MS);
    const increment = BG_MUSIC_TARGET_VOL / steps;
    let currentStep = 0;

    bgMusic.fadeInterval = setInterval(() => {
      currentStep++;
      const newVol = Math.min(increment * currentStep, BG_MUSIC_TARGET_VOL);
      if (bgMusic.audio) bgMusic.audio.volume = newVol;
      if (currentStep >= steps) clearFadeInterval();
    }, FADE_STEP_MS);
  }, []);

  /**
   * Fades out and pauses the background music.
   * Volume drops to 0 over ~1.5 seconds then pauses.
   */
  const stopAmbientMusic = useCallback((_immediate = false) => {
    if (!bgMusic.running) return;
    bgMusic.running = false;

    clearFadeInterval();

    const audio = bgMusic.audio;
    if (!audio) return;

    const startVol = audio.volume;
    const steps = Math.ceil(FADE_OUT_DURATION_MS / FADE_STEP_MS);
    const decrement = startVol / steps;
    let currentStep = 0;

    bgMusic.fadeInterval = setInterval(() => {
      currentStep++;
      const newVol = Math.max(startVol - decrement * currentStep, 0);
      audio.volume = newVol;
      if (currentStep >= steps) {
        clearFadeInterval();
        audio.pause();
      }
    }, FADE_STEP_MS);
  }, []);

  // ─── React to soundEnabled changes: pause / resume ambient ───────────────
  useEffect(() => {
    if (!soundEnabled && bgMusic.running) {
      stopAmbientMusic();
    }
  }, [soundEnabled, stopAmbientMusic]);

  return {
    play,
    playGlitch,
    playCinematicEntry,
    startAmbientMusic,
    stopAmbientMusic,
    soundEnabled,
    isAmbientPlaying: { current: bgMusic.running },
  };
}
