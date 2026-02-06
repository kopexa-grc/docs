"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// =============================================================================
// SOUND ENGINE - Retro synth sounds using Web Audio API
// =============================================================================

type SoundType = "shoot" | "hit" | "explode" | "powerup" | "damage" | "gameover" | "wave" | "boss" | "victory";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled = true;
  private volume = 0.3;

  private getContext(): AudioContext | null {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      } catch {
        return null;
      }
    }
    return this.ctx;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  getEnabled() { return this.enabled; }
  getVolume() { return this.volume; }

  play(type: SoundType) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.value = this.volume;

    const now = ctx.currentTime;

    switch (type) {
      case "shoot": {
        // Pew pew - short high pitched
        const osc = ctx.createOscillator();
        osc.type = "square";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.1);
        gain.gain.setValueAtTime(this.volume * 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }
      case "hit": {
        // Short blip
        const osc = ctx.createOscillator();
        osc.type = "square";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
        gain.gain.setValueAtTime(this.volume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }
      case "explode": {
        // Noise burst explosion
        const bufferSize = ctx.sampleRate * 0.2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1000, now);
        filter.frequency.exponentialRampToValueAtTime(100, now + 0.2);
        noise.connect(filter);
        filter.connect(gain);
        gain.gain.setValueAtTime(this.volume * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        noise.start(now);
        break;
      }
      case "powerup": {
        // Ascending arpeggio
        [440, 554, 659, 880].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = freq;
          g.gain.setValueAtTime(0, now + i * 0.05);
          g.gain.linearRampToValueAtTime(this.volume * 0.3, now + i * 0.05 + 0.02);
          g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.1);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(now + i * 0.05);
          osc.stop(now + i * 0.05 + 0.1);
        });
        break;
      }
      case "damage": {
        // Low thud
        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
        gain.gain.setValueAtTime(this.volume * 0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }
      case "gameover": {
        // Descending sad tones
        [440, 392, 349, 262].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.value = freq;
          g.gain.setValueAtTime(0, now + i * 0.2);
          g.gain.linearRampToValueAtTime(this.volume * 0.4, now + i * 0.2 + 0.05);
          g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.2 + 0.3);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(now + i * 0.2);
          osc.stop(now + i * 0.2 + 0.3);
        });
        break;
      }
      case "wave": {
        // Victory fanfare
        [523, 659, 784, 1047].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = "square";
          osc.frequency.value = freq;
          g.gain.setValueAtTime(0, now + i * 0.08);
          g.gain.linearRampToValueAtTime(this.volume * 0.25, now + i * 0.08 + 0.02);
          g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.15);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.15);
        });
        break;
      }
      case "boss": {
        // Ominous bass
        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.setValueAtTime(60, now + 0.2);
        osc.frequency.setValueAtTime(80, now + 0.4);
        gain.gain.setValueAtTime(this.volume * 0.5, now);
        gain.gain.setValueAtTime(this.volume * 0.5, now + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + 0.6);
        break;
      }
      case "victory": {
        // Triumphant ascending fanfare
        [523, 659, 784, 1047, 1319].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = "square";
          osc.frequency.value = freq;
          g.gain.setValueAtTime(0, now + i * 0.12);
          g.gain.linearRampToValueAtTime(this.volume * 0.3, now + i * 0.12 + 0.03);
          g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.25);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(now + i * 0.12);
          osc.stop(now + i * 0.12 + 0.25);
        });
        break;
      }
    }
  }
}

const soundEngine = new SoundEngine();

// =============================================================================
// GAME CONSTANTS
// =============================================================================

// Game constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_WIDTH = 56;
const PLAYER_HEIGHT = 42;
const ENEMY_WIDTH = 40;
const ENEMY_HEIGHT = 36;
const BULLET_WIDTH = 6;
const BULLET_HEIGHT = 14;
const PLAYER_SPEED = 5;
const BULLET_SPEED = 12;
const MAX_POWER_LEVEL = 5;
const RAPID_FIRE_RATES = [200, 150, 120, 90, 70, 50]; // fire rate ms per level (0-5)

// Colors
const COLORS = {
  background: "#0a1929",
  backgroundMid: "#0F263E",
  backgroundLight: "#1a3a5c",
  player: "#0F263E",
  playerLight: "#1a3a5c",
  playerAccent: "#22d3ee",
  threat: "#a855f7",
  threatDark: "#7c3aed",
  vulnerability: "#f97316",
  vulnerabilityDark: "#ea580c",
  risk: "#ef4444",
  riskDark: "#dc2626",
  boss: "#ec4899",
  bossDark: "#be185d",
  bullet: "#22d3ee",
  bulletGlow: "#67e8f9",
  finding: "#fbbf24",
  findingDark: "#f59e0b",
  powerupShield: "#22d3ee",
  powerupRapid: "#22c55e",
  powerupMulti: "#a855f7",
  text: "#ffffff",
  textMuted: "#94a3b8",
};

type EnemyType = "risk" | "vulnerability" | "threat" | "boss";

type Enemy = {
  id: number;
  x: number;
  y: number;
  type: EnemyType;
  health: number;
  maxHealth: number;
  pattern: "swoop" | "dive" | "circle" | "zigzag" | "boss";
  patternTime: number;
  startX: number;
  startY: number;
  angle: number;
  speed: number;
};

type Bullet = {
  id: number;
  x: number;
  y: number;
  angle?: number; // For spread shots
};

type Finding = {
  id: number;
  x: number;
  y: number;
  speed: number;
  type: "gap" | "incident" | "finding";
};

type PowerUp = {
  id: number;
  x: number;
  y: number;
  type: "shield" | "rapid" | "multi";
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
};

type GameState = "idle" | "playing" | "gameover";

type Difficulty = "easy" | "normal" | "hard";
type MenuScreen = "main" | "difficulty";
type WaveModifier = null | "shadow-audit" | "mission-stage" | "boss-rush";

type DifficultyConfig = {
  label: string;
  color: string;
  speedMult: number;
  healthMult: number;
  dropMult: number;
  powerupDurationMult: number;
};

type MissionStage = {
  name: string;
  enemies: { type: EnemyType; count: number; pattern: Enemy["pattern"] }[];
  isBoss?: boolean;
  bossHealthOverride?: number;
};

type MissionDef = {
  id: string;
  name: string;
  description: string;
  color: string;
  stages: MissionStage[];
};

const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  easy: { label: "EASY", color: "#22c55e", speedMult: 0.7, healthMult: 0.8, dropMult: 0.7, powerupDurationMult: 1.3 },
  normal: { label: "NORMAL", color: "#eab308", speedMult: 1, healthMult: 1, dropMult: 1, powerupDurationMult: 1 },
  hard: { label: "HARD", color: "#ef4444", speedMult: 1.4, healthMult: 1.5, dropMult: 1.3, powerupDurationMult: 0.7 },
};

const MISSIONS: MissionDef[] = [
  {
    id: "iso27001",
    name: "ISO 27001",
    description: "Information Security Audit",
    color: "#22d3ee",
    stages: [
      { name: "Scope Definition", enemies: [{ type: "risk", count: 5, pattern: "swoop" }] },
      { name: "Risk Assessment", enemies: [{ type: "risk", count: 4, pattern: "dive" }, { type: "vulnerability", count: 3, pattern: "zigzag" }] },
      { name: "Control Selection", enemies: [{ type: "threat", count: 3, pattern: "circle" }, { type: "vulnerability", count: 4, pattern: "swoop" }] },
      { name: "Implementation Review", enemies: [{ type: "threat", count: 5, pattern: "zigzag" }, { type: "risk", count: 3, pattern: "dive" }] },
      { name: "The Certification Audit", isBoss: true, bossHealthOverride: 30, enemies: [] },
    ],
  },
  {
    id: "dora",
    name: "DORA",
    description: "Digital Operational Resilience",
    color: "#22c55e",
    stages: [
      { name: "ICT Risk Management", enemies: [{ type: "risk", count: 4, pattern: "swoop" }] },
      { name: "Incident Reporting", enemies: [{ type: "vulnerability", count: 5, pattern: "dive" }] },
      { name: "Resilience Testing", enemies: [{ type: "threat", count: 3, pattern: "zigzag" }, { type: "risk", count: 3, pattern: "circle" }] },
      { name: "Third-Party Risk", enemies: [{ type: "vulnerability", count: 4, pattern: "swoop" }, { type: "threat", count: 2, pattern: "dive" }] },
      { name: "Information Sharing", enemies: [{ type: "risk", count: 6, pattern: "zigzag" }] },
      { name: "Governance Review", enemies: [{ type: "threat", count: 4, pattern: "circle" }, { type: "vulnerability", count: 3, pattern: "swoop" }] },
      { name: "Compliance Verification", enemies: [{ type: "threat", count: 5, pattern: "dive" }, { type: "risk", count: 4, pattern: "zigzag" }] },
      { name: "The Supervisory Exam", isBoss: true, bossHealthOverride: 45, enemies: [] },
    ],
  },
  {
    id: "nis2",
    name: "NIS2",
    description: "Network & Information Security",
    color: "#a855f7",
    stages: [
      { name: "Asset Inventory", enemies: [{ type: "risk", count: 5, pattern: "swoop" }] },
      { name: "Supply Chain Audit", enemies: [{ type: "vulnerability", count: 4, pattern: "dive" }, { type: "risk", count: 3, pattern: "zigzag" }] },
      { name: "Access Controls", enemies: [{ type: "threat", count: 4, pattern: "circle" }] },
      { name: "Encryption Review", enemies: [{ type: "vulnerability", count: 5, pattern: "swoop" }, { type: "threat", count: 2, pattern: "dive" }] },
      { name: "Incident Response", enemies: [{ type: "risk", count: 4, pattern: "zigzag" }, { type: "vulnerability", count: 4, pattern: "circle" }] },
      { name: "Business Continuity", enemies: [{ type: "threat", count: 5, pattern: "swoop" }, { type: "risk", count: 3, pattern: "dive" }] },
      { name: "Vulnerability Mgmt", enemies: [{ type: "vulnerability", count: 6, pattern: "zigzag" }, { type: "threat", count: 2, pattern: "circle" }] },
      { name: "Cross-Border Ops", enemies: [{ type: "threat", count: 4, pattern: "dive" }, { type: "risk", count: 4, pattern: "swoop" }, { type: "vulnerability", count: 3, pattern: "zigzag" }] },
      { name: "Reporting Obligations", enemies: [{ type: "threat", count: 6, pattern: "circle" }, { type: "vulnerability", count: 4, pattern: "dive" }] },
      { name: "The EU Regulator", isBoss: true, bossHealthOverride: 60, enemies: [] },
    ],
  },
];

// Formation patterns
type Formation = {
  name: string;
  enemies: { x: number; y: number; type: EnemyType; pattern: Enemy["pattern"] }[];
};

function createFormation(waveNum: number): Formation {
  const formations: (() => Formation)[] = [
    // V-Formation - starts with 3, max 7
    () => {
      const enemies: Formation["enemies"] = [];
      const count = Math.min(3 + Math.floor(waveNum / 2), 7);
      for (let i = 0; i < count; i++) {
        const row = Math.abs(i - Math.floor(count / 2));
        enemies.push({
          x: GAME_WIDTH / 2 + (i - count / 2) * 65,
          y: -50 - row * 45,
          type: i === Math.floor(count / 2) ? "threat" : row === 0 ? "vulnerability" : "risk",
          pattern: "swoop",
        });
      }
      return { name: "V-Formation", enemies };
    },
    // Line wave - starts with 4, max 10
    () => {
      const enemies: Formation["enemies"] = [];
      const count = Math.min(4 + Math.floor(waveNum * 0.8), 10);
      for (let i = 0; i < count; i++) {
        enemies.push({
          x: 60 + (i * (GAME_WIDTH - 120)) / count,
          y: -50 - (i % 2) * 35,
          type: i % 3 === 0 ? "threat" : i % 3 === 1 ? "vulnerability" : "risk",
          pattern: "dive",
        });
      }
      return { name: "Wave", enemies };
    },
    // Circle formation - starts with 4, max 8
    () => {
      const enemies: Formation["enemies"] = [];
      const count = Math.min(4 + Math.floor(waveNum / 2), 8);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        enemies.push({
          x: GAME_WIDTH / 2 + Math.cos(angle) * 110,
          y: -100 + Math.sin(angle) * 50,
          type: i % 2 === 0 ? "vulnerability" : "risk",
          pattern: "circle",
        });
      }
      return { name: "Circle", enemies };
    },
    // Zigzag attackers - starts with 2, max 6
    () => {
      const enemies: Formation["enemies"] = [];
      const count = Math.min(2 + Math.floor(waveNum / 2), 6);
      for (let i = 0; i < count; i++) {
        enemies.push({
          x: 120 + (i * (GAME_WIDTH - 240)) / Math.max(count - 1, 1),
          y: -50 - i * 25,
          type: "threat",
          pattern: "zigzag",
        });
      }
      return { name: "Zigzag", enemies };
    },
  ];

  return formations[Math.floor(Math.random() * formations.length)]();
}

// Drawing functions
function drawPixelRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), w, h);
}

function drawPlayer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  shieldLevel: number,
  frame: number
) {
  const s = 1.75;

  // Shield effect - concentric rings per level
  if (shieldLevel > 0) {
    ctx.strokeStyle = COLORS.powerupShield;
    const pulse = Math.sin(frame * 0.2) * 0.3;
    for (let i = 0; i < shieldLevel; i++) {
      ctx.lineWidth = 2;
      ctx.globalAlpha = (0.4 + pulse) * (1 - i * 0.1);
      const grow = i * 5;
      ctx.beginPath();
      ctx.ellipse(x + PLAYER_WIDTH / 2, y + PLAYER_HEIGHT / 2, PLAYER_WIDTH / 2 + 8 + grow, PLAYER_HEIGHT / 2 + 6 + grow, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Fill innermost shield with faint glow
    ctx.globalAlpha = 0.08 * shieldLevel;
    ctx.fillStyle = COLORS.powerupShield;
    ctx.beginPath();
    ctx.ellipse(x + PLAYER_WIDTH / 2, y + PLAYER_HEIGHT / 2, PLAYER_WIDTH / 2 + 8, PLAYER_HEIGHT / 2 + 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // Ship body
  drawPixelRect(ctx, x + 12 * s, y, 8 * s, 4 * s, COLORS.playerAccent);
  drawPixelRect(ctx, x + 8 * s, y + 4 * s, 16 * s, 4 * s, COLORS.player);
  drawPixelRect(ctx, x + 4 * s, y + 8 * s, 24 * s, 8 * s, COLORS.player);
  drawPixelRect(ctx, x + 8 * s, y + 10 * s, 16 * s, 4 * s, COLORS.playerLight);
  drawPixelRect(ctx, x + 14 * s, y + 11 * s, 4 * s, 2 * s, COLORS.playerAccent);
  drawPixelRect(ctx, x, y + 16 * s, 8 * s, 4 * s, COLORS.playerLight);
  drawPixelRect(ctx, x + 24 * s, y + 16 * s, 8 * s, 4 * s, COLORS.playerLight);
  drawPixelRect(ctx, x + 4 * s, y + 16 * s, 24 * s, 8 * s, COLORS.player);

  // Engine flames
  const flicker = Math.sin(frame * 0.5) > 0;
  if (flicker) {
    drawPixelRect(ctx, x + 8 * s, y + 22 * s, 4 * s, 4 * s, COLORS.playerAccent);
    drawPixelRect(ctx, x + 20 * s, y + 22 * s, 4 * s, 4 * s, COLORS.playerAccent);
  }
}

function drawEnemy(
  ctx: CanvasRenderingContext2D,
  enemy: Enemy,
  frame: number
) {
  const { x, y, type, health, maxHealth } = enemy;
  const wobble = Math.sin(frame * 0.15 + enemy.id) * 2;
  const bounce = Math.sin(frame * 0.1 + enemy.id) * 2;

  ctx.save();

  if (type === "boss") {
    // =========================================================================
    // THE REGULATOR - Big intimidating EU-style regulatory boss
    // =========================================================================
    const w = ENEMY_WIDTH * 2.5;
    const h = ENEMY_HEIGHT * 2.5;

    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate(wobble * 0.03);
    ctx.translate(-w / 2, -h / 2);

    // Body - suit shape
    ctx.fillStyle = "#1e3a5f";
    ctx.fillRect(8, 25, w - 16, h - 30);

    // Suit lapels
    ctx.fillStyle = "#0f2744";
    ctx.beginPath();
    ctx.moveTo(w / 2, 25);
    ctx.lineTo(w / 2 - 20, 55);
    ctx.lineTo(w / 2, 70);
    ctx.lineTo(w / 2 + 20, 55);
    ctx.closePath();
    ctx.fill();

    // Tie (red for danger)
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(w / 2 - 5, 35, 10, 35);
    ctx.beginPath();
    ctx.moveTo(w / 2 - 8, 70);
    ctx.lineTo(w / 2, 85);
    ctx.lineTo(w / 2 + 8, 70);
    ctx.closePath();
    ctx.fill();

    // Head
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(w / 2 - 22, 0, 44, 30);
    ctx.fillRect(w / 2 - 18, 28, 36, 8);

    // EU Stars crown (regulatory power!)
    ctx.fillStyle = "#fbbf24";
    const starRadius = 6;
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI - Math.PI / 2;
      const starX = w / 2 + Math.cos(angle) * 28;
      const starY = 15 + Math.sin(angle) * 12 - 18;
      ctx.beginPath();
      ctx.arc(starX, starY, starRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Angry eyes
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(w / 2 - 16, 8, 10, 10);
    ctx.fillRect(w / 2 + 6, 8, 10, 10);

    // Angry eyebrows
    ctx.fillStyle = "#0f2744";
    ctx.fillRect(w / 2 - 18, 4, 14, 4);
    ctx.fillRect(w / 2 + 4, 4, 14, 4);

    // Red glowing pupils
    ctx.fillStyle = "#dc2626";
    const pupilX = wobble > 0 ? 2 : -2;
    ctx.fillRect(w / 2 - 13 + pupilX, 11, 5, 5);
    ctx.fillRect(w / 2 + 9 + pupilX, 11, 5, 5);

    // Frown
    ctx.fillStyle = "#0f2744";
    ctx.fillRect(w / 2 - 10, 22, 20, 3);

    // Magnifying glass (audit tool!)
    ctx.save();
    ctx.translate(w - 15, 40);
    ctx.rotate(0.3 + wobble * 0.05);
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(251, 191, 36, 0.3)";
    ctx.fill();
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(10, 10, 6, 20);
    ctx.restore();

    // "AUDIT" text on clipboard he's holding
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(5, 45, 25, 35);
    ctx.fillStyle = "#dc2626";
    ctx.font = "bold 7px monospace";
    ctx.fillText("AUDIT", 7, 58);
    ctx.fillStyle = "#1e3a5f";
    ctx.fillRect(8, 62, 18, 2);
    ctx.fillRect(8, 67, 15, 2);
    ctx.fillRect(8, 72, 18, 2);

    ctx.restore();

    // Health bar
    if (health < maxHealth) {
      const barWidth = w;
      const healthPercent = health / maxHealth;
      ctx.fillStyle = "#1f2937";
      ctx.fillRect(x, y - 12, barWidth, 6);
      ctx.fillStyle = healthPercent > 0.5 ? "#22c55e" : healthPercent > 0.25 ? "#fbbf24" : "#ef4444";
      ctx.fillRect(x, y - 12, barWidth * healthPercent, 6);
    }

  } else if (type === "risk") {
    // =========================================================================
    // AUDIT FINDING - Evil clipboard with red X
    // =========================================================================
    const w = ENEMY_WIDTH;
    const h = ENEMY_HEIGHT;

    ctx.translate(x + w / 2, y + h / 2 + bounce);
    ctx.rotate(wobble * 0.08);
    ctx.translate(-w / 2, -h / 2);

    // Clipboard body
    ctx.fillStyle = "#fef3c7";
    ctx.fillRect(4, 6, w - 8, h - 8);

    // Clipboard clip
    ctx.fillStyle = "#78716c";
    ctx.fillRect(w / 2 - 8, 0, 16, 10);
    ctx.fillStyle = "#a8a29e";
    ctx.fillRect(w / 2 - 6, 2, 12, 6);

    // Red X mark
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(10, 14);
    ctx.lineTo(w - 10, h - 10);
    ctx.moveTo(w - 10, 14);
    ctx.lineTo(10, h - 10);
    ctx.stroke();

    // Angry eyes on the X
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(w / 2 - 8, 16, 6, 6);
    ctx.fillRect(w / 2 + 2, 16, 6, 6);
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(w / 2 - 6 + (wobble > 0 ? 1 : -1), 18, 3, 3);
    ctx.fillRect(w / 2 + 4 + (wobble > 0 ? 1 : -1), 18, 3, 3);

    ctx.restore();

  } else if (type === "vulnerability") {
    // =========================================================================
    // SHADOW IT - Ghostly unauthorized computer
    // =========================================================================
    const w = ENEMY_WIDTH;
    const h = ENEMY_HEIGHT;

    ctx.translate(x + w / 2, y + h / 2 + bounce);
    ctx.rotate(wobble * 0.06);
    ctx.translate(-w / 2, -h / 2);

    // Ghost transparency effect
    ctx.globalAlpha = 0.7 + Math.sin(frame * 0.2) * 0.2;

    // Monitor body
    ctx.fillStyle = "#374151";
    ctx.fillRect(4, 2, w - 8, h - 14);

    // Screen
    ctx.fillStyle = "#1f2937";
    ctx.fillRect(7, 5, w - 14, h - 20);

    // Spooky face on screen
    ctx.fillStyle = "#f97316";
    // Eyes (hollow)
    ctx.fillRect(12, 10, 6, 8);
    ctx.fillRect(w - 18, 10, 6, 8);
    ctx.fillStyle = "#1f2937";
    ctx.fillRect(14, 12, 3, 4);
    ctx.fillRect(w - 16, 12, 3, 4);

    // Spooky mouth
    ctx.fillStyle = "#f97316";
    ctx.fillRect(14, 22, w - 28, 4);
    ctx.fillStyle = "#1f2937";
    ctx.fillRect(16, 22, 3, 4);
    ctx.fillRect(w / 2 - 1, 22, 3, 4);
    ctx.fillRect(w - 19, 22, 3, 4);

    // Monitor stand
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = "#4b5563";
    ctx.fillRect(w / 2 - 4, h - 12, 8, 6);
    ctx.fillRect(w / 2 - 10, h - 6, 20, 4);

    // Ghost wisps
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "#9ca3af";
    const wispOffset = Math.sin(frame * 0.3) * 3;
    ctx.fillRect(2, h / 2 + wispOffset, 3, 8);
    ctx.fillRect(w - 5, h / 2 - wispOffset, 3, 8);

    ctx.globalAlpha = 1;
    ctx.restore();

  } else if (type === "threat") {
    // =========================================================================
    // REGULATORY FINES - GDPR, NIS2, DORA rotating based on enemy ID
    // =========================================================================
    const w = ENEMY_WIDTH;
    const h = ENEMY_HEIGHT;
    const fineType = enemy.id % 3; // 0 = GDPR, 1 = NIS2, 2 = DORA

    ctx.translate(x + w / 2, y + h / 2 + bounce);
    ctx.rotate(wobble * 0.07);
    ctx.translate(-w / 2, -h / 2);

    // Different colors per regulation
    const fineColors = [
      { bg: "#fef2f2", border: "#dc2626", text: "#991b1b", accent: "#dc2626" }, // GDPR - Red
      { bg: "#fefce8", border: "#ca8a04", text: "#854d0e", accent: "#eab308" }, // NIS2 - Yellow/Gold
      { bg: "#f0fdf4", border: "#16a34a", text: "#166534", accent: "#22c55e" }, // DORA - Green
    ];
    const fineNames = ["GDPR", "NIS2", "DORA"];
    const fineSymbols = ["€", "🔒", "🏦"];
    const colors = fineColors[fineType];
    const fineName = fineNames[fineType];

    // Document/fine background
    ctx.fillStyle = colors.bg;
    ctx.fillRect(2, 2, w - 4, h - 4);

    // Border
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, w - 4, h - 4);

    // Header bar
    ctx.fillStyle = colors.accent;
    ctx.fillRect(2, 2, w - 4, 10);

    // Regulation name in header
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 7px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(fineName, w / 2, 8);

    // Big warning symbol
    ctx.fillStyle = colors.border;
    ctx.font = "bold 16px monospace";
    ctx.fillText("⚠", w / 2, h / 2 + 2);

    // Angry pixel eyes
    ctx.fillStyle = "#1f2937";
    ctx.fillRect(w / 2 - 10, h / 2 - 4, 4, 4);
    ctx.fillRect(w / 2 + 6, h / 2 - 4, 4, 4);

    // "FINE" text at bottom
    ctx.fillStyle = colors.text;
    ctx.font = "bold 7px monospace";
    ctx.fillText("FINE!", w / 2, h - 6);

    // Flying particles based on type
    ctx.fillStyle = colors.accent;
    ctx.globalAlpha = 0.7;
    const particleY = (frame * 2 + enemy.id * 20) % 16;
    ctx.font = "7px monospace";
    if (fineType === 0) { // GDPR - Euros
      ctx.fillText("€", 5, 14 + particleY);
      ctx.fillText("€", w - 8, 18 + (16 - particleY));
    } else if (fineType === 1) { // NIS2 - Locks
      ctx.fillRect(4, 14 + particleY, 4, 5);
      ctx.fillRect(w - 8, 18 + (16 - particleY), 4, 5);
    } else { // DORA - Coins
      ctx.beginPath();
      ctx.arc(6, 16 + particleY, 3, 0, Math.PI * 2);
      ctx.arc(w - 6, 20 + (16 - particleY), 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.restore();
  }

  ctx.restore();
}

function drawBullet(ctx: CanvasRenderingContext2D, x: number, y: number, angle = 0) {
  ctx.save();
  ctx.translate(x + BULLET_WIDTH / 2, y + BULLET_HEIGHT / 2);
  ctx.rotate(angle);
  ctx.translate(-BULLET_WIDTH / 2, -BULLET_HEIGHT / 2);

  // Glow
  ctx.shadowColor = COLORS.bulletGlow;
  ctx.shadowBlur = 8;
  drawPixelRect(ctx, 1, 0, 4, 4, COLORS.bulletGlow);
  drawPixelRect(ctx, 0, 4, 6, 6, COLORS.bullet);
  drawPixelRect(ctx, 1, 10, 4, 4, COLORS.playerAccent);
  ctx.shadowBlur = 0;
  ctx.restore();
}

function drawFinding(ctx: CanvasRenderingContext2D, finding: Finding, frame: number) {
  const { x, y, type } = finding;
  const size = 16;

  // Rotating warning symbol
  ctx.save();
  ctx.translate(x + size / 2, y + size / 2);
  ctx.rotate(frame * 0.1);

  ctx.fillStyle = COLORS.finding;
  ctx.shadowColor = COLORS.findingDark;
  ctx.shadowBlur = 6;

  // Triangle warning shape
  ctx.beginPath();
  ctx.moveTo(0, -size / 2);
  ctx.lineTo(size / 2, size / 2);
  ctx.lineTo(-size / 2, size / 2);
  ctx.closePath();
  ctx.fill();

  // Exclamation mark
  ctx.fillStyle = COLORS.backgroundMid;
  ctx.shadowBlur = 0;
  ctx.fillRect(-1, -4, 3, 6);
  ctx.fillRect(-1, 4, 3, 3);

  ctx.restore();
}

function drawPowerUp(ctx: CanvasRenderingContext2D, powerUp: PowerUp, frame: number) {
  const { x, y, type } = powerUp;
  const float = Math.sin(frame * 0.15) * 3;
  const p = 2; // pixel size for retro look

  ctx.save();
  ctx.translate(x, y + float);

  // Pulsing glow effect
  const glowSize = 2 + Math.sin(frame * 0.2) * 1;
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = type === "shield" ? COLORS.powerupShield : type === "rapid" ? COLORS.powerupRapid : COLORS.powerupMulti;
  ctx.fillRect(-glowSize, -glowSize, 28 + glowSize * 2, 28 + glowSize * 2);
  ctx.globalAlpha = 1;

  if (type === "shield") {
    // =========================================================================
    // ISO CERTIFICATION - Pixel art shield/certificate
    // =========================================================================
    const c = COLORS.powerupShield;
    const d = "#0891b2"; // darker cyan

    // Shield outline (pixel by pixel)
    //     ████████
    //   ██        ██
    //   ██  ISO   ██
    //   ██ 27001  ██
    //   ██        ██
    //     ██    ██
    //       ████
    ctx.fillStyle = c;
    // Top row
    ctx.fillRect(6, 0, 16, p);
    // Second row
    ctx.fillRect(4, p, 4, p); ctx.fillRect(20, p, 4, p);
    // Sides
    ctx.fillRect(2, p*2, 4, p*8); ctx.fillRect(22, p*2, 4, p*8);
    // Inner fill
    ctx.fillStyle = d;
    ctx.fillRect(6, p, 16, p*9);
    // Bottom taper
    ctx.fillStyle = c;
    ctx.fillRect(4, p*10, 4, p); ctx.fillRect(20, p*10, 4, p);
    ctx.fillRect(6, p*11, 4, p); ctx.fillRect(18, p*11, 4, p);
    ctx.fillRect(10, p*12, 8, p);

    // "ISO" text (pixel letters)
    ctx.fillStyle = "#ffffff";
    // I
    ctx.fillRect(8, p*3, p, p*3);
    // S
    ctx.fillRect(11, p*3, p*2, p); ctx.fillRect(11, p*4, p, p); ctx.fillRect(11, p*5, p*2, p);
    ctx.fillRect(12, p*6, p, p); ctx.fillRect(11, p*7, p*2, p);
    // O
    ctx.fillRect(15, p*3, p*2, p); ctx.fillRect(14, p*4, p, p*2); ctx.fillRect(17, p*4, p, p*2);
    ctx.fillRect(15, p*6, p*2, p);

    // Checkmark
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(10, p*8, p, p); ctx.fillRect(11, p*9, p, p);
    ctx.fillRect(12, p*8, p, p); ctx.fillRect(13, p*7, p, p); ctx.fillRect(14, p*6, p, p);

  } else if (type === "rapid") {
    // =========================================================================
    // KOPEXA AUTOMATION - Pixel art lightning/speed
    // =========================================================================
    const c = COLORS.powerupRapid;
    const d = "#16a34a"; // darker green

    // Box/monitor shape
    ctx.fillStyle = c;
    ctx.fillRect(2, 2, 24, 20);
    ctx.fillStyle = d;
    ctx.fillRect(4, 4, 20, 16);

    // Screen content - "K" made of pixels
    ctx.fillStyle = "#ffffff";
    // K letter pixel art
    ctx.fillRect(8, 6, p, p*6);  // vertical line
    ctx.fillRect(10, 8, p, p);   // middle
    ctx.fillRect(12, 6, p, p);   // top right
    ctx.fillRect(12, 12, p, p);  // bottom right
    ctx.fillRect(14, 6, p, p);
    ctx.fillRect(14, 12, p, p);

    // Lightning bolt next to K
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(16, 6, p*2, p);
    ctx.fillRect(15, 7, p*2, p);
    ctx.fillRect(14, 8, p*3, p);
    ctx.fillRect(15, 9, p*2, p);
    ctx.fillRect(16, 10, p*2, p);
    ctx.fillRect(17, 11, p, p);

    // Stand
    ctx.fillStyle = c;
    ctx.fillRect(10, 22, 8, p);
    ctx.fillRect(8, 24, 12, p);

    // Speed lines (animated)
    ctx.fillStyle = c;
    ctx.globalAlpha = 0.6;
    const lineOffset = frame % 8;
    ctx.fillRect(26, 6 + lineOffset, 4, p);
    ctx.fillRect(28, 10 + (8 - lineOffset), 3, p);
    ctx.globalAlpha = 1;

  } else if (type === "multi") {
    // =========================================================================
    // CONSULTING TEAM - Pixel art people/team
    // =========================================================================
    const c = COLORS.powerupMulti;
    const d = "#7c3aed"; // darker purple

    // Three pixel people
    const drawPerson = (px: number, py: number, color: string) => {
      ctx.fillStyle = color;
      // Head
      ctx.fillRect(px + p, py, p*2, p*2);
      // Body
      ctx.fillRect(px, py + p*2, p*4, p*3);
      // Legs
      ctx.fillRect(px, py + p*5, p, p*2);
      ctx.fillRect(px + p*3, py + p*5, p, p*2);
    };

    // Background circle
    ctx.fillStyle = d;
    ctx.fillRect(4, 4, 20, 20);

    // Three people (team)
    drawPerson(4, 8, c);   // Left
    drawPerson(11, 4, "#ffffff"); // Center (highlighted)
    drawPerson(18, 8, c);  // Right

    // "x3" badge
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(18, 18, 10, 8);
    ctx.fillStyle = "#0a1929";
    // x
    ctx.fillRect(19, 20, p, p); ctx.fillRect(21, 20, p, p);
    ctx.fillRect(20, 21, p, p);
    ctx.fillRect(19, 22, p, p); ctx.fillRect(21, 22, p, p);
    // 3
    ctx.fillRect(23, 20, p*2, p); ctx.fillRect(24, 21, p, p);
    ctx.fillRect(23, 22, p*2, p); ctx.fillRect(24, 23, p, p);
    ctx.fillRect(23, 24, p*2, p);

    // Floating sparkles
    ctx.fillStyle = c;
    ctx.globalAlpha = 0.5 + Math.sin(frame * 0.3) * 0.3;
    ctx.fillRect(2, 2 + (frame % 6), p, p);
    ctx.fillRect(26, 8 - (frame % 6), p, p);
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  particles.forEach((p) => {
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  });
  ctx.globalAlpha = 1;
}

function drawStars(ctx: CanvasRenderingContext2D, stars: { x: number; y: number; size: number; speed: number }[], offset: number) {
  stars.forEach((star) => {
    const y = (star.y + offset * star.speed) % GAME_HEIGHT;
    const twinkle = 0.4 + Math.sin(Date.now() / 500 + star.x) * 0.3;
    ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
    ctx.fillRect(star.x, y, star.size, star.size);
  });
}

export function ComplianceRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayState, setDisplayState] = useState<{
    gameState: GameState;
    score: number;
    highScore: number;
    lives: number;
    wave: number;
    shieldLevel: number;
    rapidLevel: number;
    multiLevel: number;
    difficulty: Difficulty;
    waveModifier: WaveModifier;
    waveModifierLabel: string;
    rewardWaveActive: boolean;
  }>({
    gameState: "idle",
    score: 0,
    highScore: 0,
    lives: 3,
    wave: 1,
    shieldLevel: 0,
    rapidLevel: 0,
    multiLevel: 0,
    difficulty: "normal",
    waveModifier: null,
    waveModifierLabel: "",
    rewardWaveActive: false,
  });
  const [canvasSize, setCanvasSize] = useState({ width: GAME_WIDTH, height: GAME_HEIGHT });
  const [showShareCard, setShowShareCard] = useState(false);
  const [nickname, setNickname] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(0.3);
  const [showSettings, setShowSettings] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const shareCanvasRef = useRef<HTMLCanvasElement>(null);

  // Game state refs
  const gameRef = useRef({
    state: "idle" as GameState,
    score: 0,
    highScore: 0,
    lives: 3,
    wave: 1,
    playerX: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
    enemies: [] as Enemy[],
    bullets: [] as Bullet[],
    findings: [] as Finding[],
    powerUps: [] as PowerUp[],
    particles: [] as Particle[],
    stars: [] as { x: number; y: number; size: number; speed: number }[],
    activeFormation: null as Formation | null,
    formationComplete: false,
    enemyIdCounter: 0,
    bulletIdCounter: 0,
    findingIdCounter: 0,
    powerUpIdCounter: 0,
    lastShot: 0,
    frame: 0,
    starOffset: 0,
    // Power-up states (stacking levels 0-5)
    shieldLevel: 0,
    shieldEndTime: 0,
    rapidLevel: 0,
    rapidFireEndTime: 0,
    multiLevel: 0,
    multiShotEndTime: 0,
    // Boss tracking
    bossWave: false,
    waveEnemiesSpawned: 0,
    waveEnemiesKilled: 0,
    waveTarget: 0,
    // Invincibility after hit
    invincibleUntil: 0,
    // Game over cooldown
    gameOverTime: 0,
    // Share button bounds for click detection
    shareButtonBounds: null as { x: number; y: number; w: number; h: number } | null,
    // Difficulty & menu
    difficulty: "normal" as Difficulty,
    menuScreen: "main" as MenuScreen,
    menuCursor: 0,
    // Dynamic wave modifiers
    waveModifier: null as WaveModifier,
    waveModifierLabel: "",
    missionStageData: null as MissionStage | null,
    // Reward wave
    rewardWaveActive: false,
    rewardWaveEndTime: 0,
    // Shadow audit (darkness overlay)
    darknessRadius: 130,
    // Unused but kept for potential future use
    victoryTime: 0,
    // Menu item bounds for click detection
    menuItemBounds: [] as { x: number; y: number; w: number; h: number; action: string }[],
  });

  const keysRef = useRef<Set<string>>(new Set());
  const touchRef = useRef({ left: false, right: false, shoot: false });
  const animationFrameRef = useRef<number | null>(null);

  // Sync sound settings with engine
  useEffect(() => {
    soundEngine.setEnabled(soundEnabled);
    soundEngine.setVolume(soundVolume);
    localStorage.setItem("grc-invaders-sound", JSON.stringify({ enabled: soundEnabled, volume: soundVolume }));
  }, [soundEnabled, soundVolume]);

  // Initialize
  useEffect(() => {
    // Detect touch device
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(hasTouch);

    // Stars
    gameRef.current.stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * GAME_WIDTH,
      y: Math.random() * GAME_HEIGHT,
      size: Math.random() > 0.7 ? 2 : 1,
      speed: 0.5 + Math.random() * 1.5,
    }));

    // High score (legacy key, shown on main menu)
    const saved = localStorage.getItem("grc-invaders-highscore-v2");
    if (saved) {
      gameRef.current.highScore = Number.parseInt(saved, 10);
      setDisplayState((s) => ({ ...s, highScore: gameRef.current.highScore }));
    }

    // Initialize menu state
    gameRef.current.menuScreen = "main";
    gameRef.current.menuCursor = 0;

    // Sound settings
    const soundSettings = localStorage.getItem("grc-invaders-sound");
    if (soundSettings) {
      try {
        const { enabled, volume } = JSON.parse(soundSettings);
        setSoundEnabled(enabled ?? true);
        setSoundVolume(volume ?? 0.3);
      } catch { /* ignore */ }
    }
  }, []);

  // Responsive canvas
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        const scale = Math.min(1, w / GAME_WIDTH);
        setCanvasSize({ width: GAME_WIDTH * scale, height: GAME_HEIGHT * scale });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Spawn helpers
  const spawnFormation = useCallback((waveNum: number) => {
    const game = gameRef.current;
    const diff = DIFFICULTIES[game.difficulty];
    const formation = createFormation(waveNum);
    game.activeFormation = formation;
    game.formationComplete = false;

    formation.enemies.forEach((e, i) => {
      setTimeout(() => {
        if (game.state !== "playing") return;
        const baseHealth = e.type === "threat" ? 2 : 1;
        const health = Math.max(1, Math.round(baseHealth * diff.healthMult));
        game.enemies.push({
          id: game.enemyIdCounter++,
          x: e.x,
          y: e.y,
          type: e.type,
          health,
          maxHealth: health,
          pattern: e.pattern,
          patternTime: 0,
          startX: e.x,
          startY: e.y,
          angle: 0,
          speed: (0.5 + waveNum * 0.08) * diff.speedMult,
        });
        game.waveEnemiesSpawned++;
      }, i * 150);
    });
  }, []);

  const spawnBoss = useCallback((waveNum: number, healthOverride?: number) => {
    const game = gameRef.current;
    const diff = DIFFICULTIES[game.difficulty];
    game.bossWave = true;
    const baseHealth = healthOverride ?? (15 + waveNum * 3);
    const health = Math.round(baseHealth * diff.healthMult);
    game.enemies.push({
      id: game.enemyIdCounter++,
      x: GAME_WIDTH / 2 - 50,
      y: -100,
      type: "boss",
      health,
      maxHealth: health,
      pattern: "boss",
      patternTime: 0,
      startX: GAME_WIDTH / 2 - 50,
      startY: 60,
      angle: 0,
      speed: (0.8 + waveNum * 0.05) * diff.speedMult,
    });
    game.waveEnemiesSpawned++;
    game.waveTarget = 1;
  }, []);

  // Spawn enemies from a mission stage config (used by mission-stage wave modifier)
  const spawnMissionStage = useCallback((stage: MissionStage, waveNum: number) => {
    const game = gameRef.current;
    const diff = DIFFICULTIES[game.difficulty];

    let spawnIndex = 0;
    stage.enemies.forEach((group) => {
      for (let i = 0; i < group.count; i++) {
        const idx = spawnIndex++;
        setTimeout(() => {
          if (game.state !== "playing") return;
          const baseHealth = group.type === "threat" ? 2 : 1;
          const health = Math.max(1, Math.round(baseHealth * diff.healthMult));
          const spread = GAME_WIDTH - 120;
          game.enemies.push({
            id: game.enemyIdCounter++,
            x: 60 + (idx % 8) * (spread / 8),
            y: -50 - Math.floor(idx / 8) * 45,
            type: group.type,
            health,
            maxHealth: health,
            pattern: group.pattern,
            patternTime: 0,
            startX: 60 + (idx % 8) * (spread / 8),
            startY: -50,
            angle: 0,
            speed: (0.5 + waveNum * 0.08) * diff.speedMult,
          });
          game.waveEnemiesSpawned++;
        }, idx * 150);
      }
    });

    const totalEnemies = stage.enemies.reduce((sum, g) => sum + g.count, 0);
    game.waveTarget = totalEnemies;
  }, []);

  // Reward wave: spawn falling power-ups
  const startRewardWave = useCallback(() => {
    const game = gameRef.current;
    game.rewardWaveActive = true;
    game.rewardWaveEndTime = Date.now() + 3000;

    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        if (game.state !== "playing") return;
        game.powerUps.push({
          id: game.powerUpIdCounter++,
          x: 40 + (i * (GAME_WIDTH - 80)) / 8 + Math.random() * 30,
          y: -20 - Math.random() * 40,
          type: (["shield", "rapid", "multi"] as const)[Math.floor(Math.random() * 3)],
        });
      }, i * 300);
    }
  }, []);

  // Pick a random wave modifier for non-boss waves
  // Cycle: normal → normal → shadow-audit → mission-stage → normal → boss-rush → ...
  const pickWaveModifier = useCallback((waveNum: number): { modifier: WaveModifier; label: string; stage: MissionStage | null } => {
    // Boss waves (every 5th) never get a modifier
    if (waveNum % 5 === 0) return { modifier: null, label: "", stage: null };

    // First 2 waves are always normal
    if (waveNum <= 2) return { modifier: null, label: "", stage: null };

    // Cycle through modifiers on certain waves
    const cycle = waveNum % 7; // 7-wave repeating cycle
    if (cycle === 3) {
      return { modifier: "shadow-audit", label: "SHADOW AUDIT", stage: null };
    }
    if (cycle === 5) {
      // Pick a random non-boss stage from a random mission
      const mission = MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
      const regularStages = mission.stages.filter((s) => !s.isBoss);
      const stage = regularStages[Math.floor(Math.random() * regularStages.length)];
      return { modifier: "mission-stage", label: `${mission.name}: ${stage.name}`, stage };
    }
    if (cycle === 6 && waveNum > 8) {
      return { modifier: "boss-rush", label: "BOSS RUSH", stage: null };
    }

    return { modifier: null, label: "", stage: null };
  }, []);

  // Check if restart is allowed (2 second cooldown after game over)
  const canRestart = useCallback(() => {
    const game = gameRef.current;
    if (game.state === "idle") return true;
    if (game.state === "gameover") {
      return Date.now() - game.gameOverTime > 2000;
    }
    return false;
  }, []);

  const startGame = useCallback(() => {
    const game = gameRef.current;
    game.state = "playing";
    game.score = 0;
    game.lives = 3;
    game.wave = 1;
    game.playerX = GAME_WIDTH / 2 - PLAYER_WIDTH / 2;
    game.enemies = [];
    game.bullets = [];
    game.findings = [];
    game.powerUps = [];
    game.particles = [];
    game.shieldLevel = 0;
    game.rapidLevel = 0;
    game.multiLevel = 0;
    game.bossWave = false;
    game.waveEnemiesSpawned = 0;
    game.waveEnemiesKilled = 0;
    game.waveTarget = 0;
    game.invincibleUntil = 0;
    game.gameOverTime = 0;
    game.victoryTime = 0;
    game.rewardWaveActive = false;
    game.rewardWaveEndTime = 0;
    game.waveModifier = null;
    game.waveModifierLabel = "";
    game.missionStageData = null;
    game.shareButtonBounds = null;

    // Load difficulty-specific high score
    const hsKey = `grc-invaders-hs-${game.difficulty}`;
    const saved = localStorage.getItem(hsKey);
    game.highScore = saved ? Number.parseInt(saved, 10) : 0;

    setDisplayState((s) => ({
      ...s,
      gameState: "playing",
      score: 0,
      lives: 3,
      wave: 1,
      shieldLevel: 0,
      rapidLevel: 0,
      multiLevel: 0,
      difficulty: game.difficulty,
      waveModifier: null,
      waveModifierLabel: "",
      rewardWaveActive: false,
      highScore: game.highScore,
    }));

    // Start first wave - always a normal formation
    spawnFormation(1);
    game.waveTarget = game.activeFormation?.enemies.length || 0;
  }, [spawnFormation]);

  // Menu navigation helpers
  const handleMenuSelect = useCallback(() => {
    const game = gameRef.current;
    const cursor = game.menuCursor;

    if (game.menuScreen === "main") {
      game.menuScreen = "difficulty";
      game.menuCursor = 1; // default normal
      setDisplayState((s) => ({ ...s, menuScreen: "difficulty" as MenuScreen }));
    } else if (game.menuScreen === "difficulty") {
      const diffs: Difficulty[] = ["easy", "normal", "hard"];
      game.difficulty = diffs[cursor] || "normal";
      startGame();
    }
  }, [startGame]);

  const handleMenuBack = useCallback(() => {
    const game = gameRef.current;
    if (game.menuScreen === "difficulty") {
      game.menuScreen = "main";
      game.menuCursor = 0;
      setDisplayState((s) => ({ ...s, menuScreen: "main" as MenuScreen }));
    }
  }, []);

  const getMenuItemCount = useCallback(() => {
    const game = gameRef.current;
    if (game.menuScreen === "main") return 1;
    if (game.menuScreen === "difficulty") return 3;
    return 1;
  }, []);

  // Input handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture game keys when typing in inputs or when dialogs are open
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      const game = gameRef.current;

      // Menu navigation when idle
      if (game.state === "idle") {
        if (e.key === "ArrowUp") {
          e.preventDefault();
          game.menuCursor = (game.menuCursor - 1 + getMenuItemCount()) % getMenuItemCount();
          return;
        }
        if (e.key === "ArrowDown") {
          e.preventDefault();
          game.menuCursor = (game.menuCursor + 1) % getMenuItemCount();
          return;
        }
        if (e.key === "Enter" || e.key === " " || e.code === "Space") {
          e.preventDefault();
          handleMenuSelect();
          return;
        }
        if (e.key === "Escape") {
          e.preventDefault();
          handleMenuBack();
          return;
        }
        return;
      }

      // Game over → return to menu
      if (game.state === "gameover" && (e.key === " " || e.code === "Space") && canRestart()) {
        e.preventDefault();
        // Go back to menu
        game.state = "idle";
        game.menuScreen = "main";
        game.menuCursor = 0;
        setDisplayState((s) => ({ ...s, gameState: "idle", menuScreen: "main" }));
        return;
      }

      if (["ArrowLeft", "ArrowRight", "Space", " ", "a", "d", "A", "D"].includes(e.key)) {
        e.preventDefault();
        keysRef.current.add(e.key);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [startGame, canRestart, handleMenuSelect, handleMenuBack, getMenuItemCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleCanvasTouchOrClick = (clientX: number, clientY: number) => {
      const game = gameRef.current;
      const rect = canvas.getBoundingClientRect();
      const scaleX = GAME_WIDTH / rect.width;
      const scaleY = GAME_HEIGHT / rect.height;
      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;

      if (game.state === "idle") {
        // Check menu item bounds
        for (const item of game.menuItemBounds) {
          if (x >= item.x && x <= item.x + item.w && y >= item.y && y <= item.y + item.h) {
            // Set cursor to matching item and select
            const idx = game.menuItemBounds.indexOf(item);
            game.menuCursor = idx;
            handleMenuSelect();
            return;
          }
        }
        return;
      }

      if (game.state === "gameover" && canRestart()) {
        // Check share button
        if (game.shareButtonBounds) {
          const btn = game.shareButtonBounds;
          if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
            setShowShareCard(true);
            return;
          }
        }
        // Return to menu
        game.state = "idle";
        game.menuScreen = "main";
        game.menuCursor = 0;
        setDisplayState((s) => ({ ...s, gameState: "idle", menuScreen: "main" }));
        return;
      }
    };

    const onCanvasTouch = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) handleCanvasTouchOrClick(touch.clientX, touch.clientY);
    };

    const onCanvasClick = (e: MouseEvent) => {
      const game = gameRef.current;
      if (game.state === "playing") return;
      handleCanvasTouchOrClick(e.clientX, e.clientY);
    };

    canvas.addEventListener("touchstart", onCanvasTouch, { passive: false });
    canvas.addEventListener("click", onCanvasClick);
    return () => {
      canvas.removeEventListener("touchstart", onCanvasTouch);
      canvas.removeEventListener("click", onCanvasClick);
    };
  }, [startGame, canRestart, handleMenuSelect]);

  // Virtual control button handlers
  const handleControlStart = useCallback((control: "left" | "right" | "shoot") => {
    touchRef.current[control] = true;
  }, []);

  const handleControlEnd = useCallback((control: "left" | "right" | "shoot") => {
    touchRef.current[control] = false;
  }, []);

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gameLoop = () => {
      const game = gameRef.current;
      const now = Date.now();
      game.frame++;
      game.starOffset += 0.5;

      // Background
      const grad = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
      grad.addColorStop(0, COLORS.background);
      grad.addColorStop(0.5, COLORS.backgroundMid);
      grad.addColorStop(1, COLORS.backgroundLight);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      drawStars(ctx, game.stars, game.starOffset);

      if (game.state === "playing") {
        // Check power-up expiration
        if (game.shieldLevel > 0 && now > game.shieldEndTime) game.shieldLevel = 0;
        if (game.rapidLevel > 0 && now > game.rapidFireEndTime) game.rapidLevel = 0;
        if (game.multiLevel > 0 && now > game.multiShotEndTime) game.multiLevel = 0;

        // Player movement
        const left = keysRef.current.has("ArrowLeft") || keysRef.current.has("a") || keysRef.current.has("A") || touchRef.current.left;
        const right = keysRef.current.has("ArrowRight") || keysRef.current.has("d") || keysRef.current.has("D") || touchRef.current.right;
        const shoot = keysRef.current.has("Space") || keysRef.current.has(" ") || touchRef.current.shoot;

        if (left) game.playerX = Math.max(0, game.playerX - PLAYER_SPEED);
        if (right) game.playerX = Math.min(GAME_WIDTH - PLAYER_WIDTH, game.playerX + PLAYER_SPEED);

        // Shooting - fire rate scales with rapid level
        const fireRate = RAPID_FIRE_RATES[Math.min(game.rapidLevel, MAX_POWER_LEVEL)];
        if (shoot && now - game.lastShot > fireRate) {
          game.lastShot = now;
          const bulletX = game.playerX + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2;
          const bulletY = GAME_HEIGHT - 70;

          if (game.multiLevel > 0) {
            // Center bullet always fires
            game.bullets.push({ id: game.bulletIdCounter++, x: bulletX, y: bulletY, angle: 0 });
            // Symmetric spread pairs based on level (lv1=3, lv2=5, lv3=7, lv4=9, lv5=11 total)
            const spreadStep = 0.12;
            for (let i = 1; i <= game.multiLevel; i++) {
              const angle = spreadStep * i;
              const offset = i * 6;
              game.bullets.push(
                { id: game.bulletIdCounter++, x: bulletX - offset, y: bulletY, angle: -angle },
                { id: game.bulletIdCounter++, x: bulletX + offset, y: bulletY, angle: angle }
              );
            }
          } else {
            game.bullets.push({ id: game.bulletIdCounter++, x: bulletX, y: bulletY, angle: 0 });
          }
          soundEngine.play("shoot");
        }

        // Move bullets
        game.bullets = game.bullets
          .map((b) => ({
            ...b,
            x: b.x + Math.sin(b.angle || 0) * BULLET_SPEED * 0.5,
            y: b.y - BULLET_SPEED,
          }))
          .filter((b) => b.y > -BULLET_HEIGHT && b.x > 0 && b.x < GAME_WIDTH);

        // Move enemies with patterns
        game.enemies = game.enemies.map((e) => {
          e.patternTime += 0.016;
          const t = e.patternTime;

          switch (e.pattern) {
            case "swoop": {
              // Swoop down then oscillate
              if (e.y < 120) {
                e.y += e.speed * 1.2;
              } else {
                e.x = e.startX + Math.sin(t * 1.2) * 60;
                e.y = 120 + Math.sin(t * 0.8) * 25;
              }
              break;
            }
            case "dive": {
              // Dive toward player area
              if (e.y < 80) {
                e.y += e.speed * 1.5;
              } else if (e.y < 350) {
                e.y += e.speed * 0.6;
                e.x += Math.sin(t * 2) * 1.5;
              } else {
                // Pull back up
                e.y -= e.speed * 0.4;
                e.startY = e.y;
              }
              break;
            }
            case "circle": {
              e.angle += 0.012 + game.wave * 0.001;
              e.x = GAME_WIDTH / 2 + Math.cos(e.angle + e.id * 0.5) * (140 + Math.sin(t * 0.5) * 20);
              e.y = 140 + Math.sin(e.angle + e.id * 0.5) * 60;
              break;
            }
            case "zigzag": {
              e.y += e.speed * 0.5;
              e.x = e.startX + Math.sin(t * 2.5) * 80;
              if (e.y > 420) {
                e.y = -50;
                e.patternTime = 0;
              }
              break;
            }
            case "boss": {
              // Boss movement - scales with wave
              const bossSpeedMult = 0.4 + game.wave * 0.03;
              if (e.y < e.startY) {
                e.y += 0.8;
              } else {
                e.x = GAME_WIDTH / 2 - 50 + Math.sin(t * bossSpeedMult) * 180;
                e.y = e.startY + Math.sin(t * bossSpeedMult * 0.6) * 25;

                // Boss drops findings - rate scales with wave and difficulty
                const dropChance = (0.008 + game.wave * 0.002) * DIFFICULTIES[game.difficulty].dropMult;
                if (Math.random() < dropChance) {
                  game.findings.push({
                    id: game.findingIdCounter++,
                    x: e.x + 40 + Math.random() * 20,
                    y: e.y + 80,
                    speed: 1.5 + Math.random() * 1 + game.wave * 0.1,
                    type: ["gap", "incident", "finding"][Math.floor(Math.random() * 3)] as Finding["type"],
                  });
                }
              }
              break;
            }
          }

          // Random finding drops from regular enemies - scales with wave and difficulty
          const enemyDropChance = (0.001 + game.wave * 0.0003) * DIFFICULTIES[game.difficulty].dropMult;
          if (e.pattern !== "boss" && Math.random() < enemyDropChance) {
            game.findings.push({
              id: game.findingIdCounter++,
              x: e.x + ENEMY_WIDTH / 2,
              y: e.y + ENEMY_HEIGHT,
              speed: 1.2 + Math.random() * 0.8 + game.wave * 0.08,
              type: ["gap", "incident", "finding"][Math.floor(Math.random() * 3)] as Finding["type"],
            });
          }

          return e;
        });

        // Move findings
        game.findings = game.findings
          .map((f) => ({ ...f, y: f.y + f.speed }))
          .filter((f) => f.y < GAME_HEIGHT + 20);

        // Move power-ups
        game.powerUps = game.powerUps
          .map((p) => ({ ...p, y: p.y + 2 }))
          .filter((p) => p.y < GAME_HEIGHT + 30);

        // Update particles
        game.particles = game.particles
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.02,
            vy: p.vy + 0.1,
          }))
          .filter((p) => p.life > 0);

        // Collision: bullets vs enemies
        game.bullets = game.bullets.filter((bullet) => {
          for (const enemy of game.enemies) {
            const ew = enemy.type === "boss" ? ENEMY_WIDTH * 2.5 : ENEMY_WIDTH;
            const eh = enemy.type === "boss" ? ENEMY_HEIGHT * 2.5 : ENEMY_HEIGHT;

            if (
              bullet.x < enemy.x + ew &&
              bullet.x + BULLET_WIDTH > enemy.x &&
              bullet.y < enemy.y + eh &&
              bullet.y + BULLET_HEIGHT > enemy.y
            ) {
              enemy.health--;
              soundEngine.play("hit");

              // Hit particles
              for (let i = 0; i < 5; i++) {
                game.particles.push({
                  x: bullet.x,
                  y: bullet.y,
                  vx: (Math.random() - 0.5) * 4,
                  vy: (Math.random() - 0.5) * 4,
                  life: 1,
                  color: enemy.type === "boss" ? COLORS.boss : enemy.type === "threat" ? COLORS.threat : enemy.type === "vulnerability" ? COLORS.vulnerability : COLORS.risk,
                  size: 3,
                });
              }

              if (enemy.health <= 0) {
                soundEngine.play("explode");
                // Death explosion
                for (let i = 0; i < 15; i++) {
                  game.particles.push({
                    x: enemy.x + ew / 2,
                    y: enemy.y + eh / 2,
                    vx: (Math.random() - 0.5) * 8,
                    vy: (Math.random() - 0.5) * 8,
                    life: 1,
                    color: Math.random() > 0.5 ? "#ffffff" : COLORS.playerAccent,
                    size: 4 + Math.random() * 4,
                  });
                }

                // Score
                const points = enemy.type === "boss" ? 500 : enemy.type === "threat" ? 30 : enemy.type === "vulnerability" ? 20 : 10;
                game.score += points;
                game.waveEnemiesKilled++;

                // Drop power-up chance
                if (Math.random() < (enemy.type === "boss" ? 1 : 0.1)) {
                  game.powerUps.push({
                    id: game.powerUpIdCounter++,
                    x: enemy.x + ew / 2 - 12,
                    y: enemy.y + eh / 2,
                    type: ["shield", "rapid", "multi"][Math.floor(Math.random() * 3)] as PowerUp["type"],
                  });
                }

                game.enemies = game.enemies.filter((e) => e.id !== enemy.id);
              }

              return false;
            }
          }
          return true;
        });

        // Collision: findings vs player
        const playerY = GAME_HEIGHT - 65;
        const isInvincible = now < game.invincibleUntil;

        // Helper function for taking damage
        const takeDamage = () => {
          if (isInvincible) return false;
          if (game.shieldLevel > 0) {
            game.shieldLevel--;
            return false;
          }
          game.lives--;
          game.invincibleUntil = now + 1500;
          soundEngine.play("damage");
          // Hit flash particles
          for (let i = 0; i < 15; i++) {
            game.particles.push({
              x: game.playerX + PLAYER_WIDTH / 2,
              y: playerY + PLAYER_HEIGHT / 2,
              vx: (Math.random() - 0.5) * 8,
              vy: (Math.random() - 0.5) * 8,
              life: 1,
              color: COLORS.risk,
              size: 5,
            });
          }
          return true;
        };

        game.findings = game.findings.filter((f) => {
          if (
            f.x < game.playerX + PLAYER_WIDTH &&
            f.x + 16 > game.playerX &&
            f.y < playerY + PLAYER_HEIGHT &&
            f.y + 16 > playerY
          ) {
            takeDamage();
            return false;
          }
          return true;
        });

        // Collision: enemies vs player
        for (const enemy of game.enemies) {
          const ew = enemy.type === "boss" ? ENEMY_WIDTH * 2.5 : ENEMY_WIDTH;
          const eh = enemy.type === "boss" ? ENEMY_HEIGHT * 2.5 : ENEMY_HEIGHT;
          if (
            game.playerX < enemy.x + ew &&
            game.playerX + PLAYER_WIDTH > enemy.x &&
            playerY < enemy.y + eh &&
            playerY + PLAYER_HEIGHT > enemy.y
          ) {
            takeDamage();
            break; // Only take damage once per frame
          }
        }

        // Collision: power-ups vs player
        game.powerUps = game.powerUps.filter((p) => {
          if (
            p.x < game.playerX + PLAYER_WIDTH &&
            p.x + 24 > game.playerX &&
            p.y < playerY + PLAYER_HEIGHT &&
            p.y + 24 > playerY
          ) {
            const diff = DIFFICULTIES[game.difficulty];
            const duration = Math.round(8000 * diff.powerupDurationMult);
            soundEngine.play("powerup");
            switch (p.type) {
              case "shield":
                game.shieldLevel = Math.min(game.shieldLevel + 1, MAX_POWER_LEVEL);
                game.shieldEndTime = now + duration;
                break;
              case "rapid":
                game.rapidLevel = Math.min(game.rapidLevel + 1, MAX_POWER_LEVEL);
                game.rapidFireEndTime = now + duration;
                break;
              case "multi":
                game.multiLevel = Math.min(game.multiLevel + 1, MAX_POWER_LEVEL);
                game.multiShotEndTime = now + duration;
                break;
            }
            return false;
          }
          return true;
        });

        // Check reward wave expiry
        if (game.rewardWaveActive && now > game.rewardWaveEndTime) {
          game.rewardWaveActive = false;
        }

        // Check wave completion (skip during reward waves)
        if (!game.rewardWaveActive && game.waveEnemiesKilled >= game.waveTarget && game.waveTarget > 0 && game.enemies.length === 0) {
          game.score += 100 * game.wave;
          soundEngine.play("wave");

          game.wave++;
          game.waveEnemiesSpawned = 0;
          game.waveEnemiesKilled = 0;
          game.waveModifier = null;
          game.waveModifierLabel = "";
          game.missionStageData = null;

          // Boss every 5 waves - reward wave after boss
          if (game.wave % 5 === 0) {
            game.waveModifier = null;
            spawnBoss(game.wave);
            soundEngine.play("boss");
          } else if ((game.wave - 1) % 5 === 0 && game.wave > 1) {
            // Wave right after a boss - reward wave first
            startRewardWave();
            // After reward, pick modifier and spawn next wave
            const { modifier, label, stage } = pickWaveModifier(game.wave);
            game.waveModifier = modifier;
            game.waveModifierLabel = label;
            game.missionStageData = stage;
            setTimeout(() => {
              if (game.state !== "playing") return;
              if (modifier === "mission-stage" && stage) {
                spawnMissionStage(stage, game.wave);
              } else if (modifier === "boss-rush") {
                const rushHp = 20 + Math.floor(game.wave / 5) * 8;
                spawnBoss(game.wave, rushHp);
                soundEngine.play("boss");
              } else {
                spawnFormation(game.wave);
                game.waveTarget = game.activeFormation?.enemies.length || 0;
              }
            }, 3200); // after reward wave ends
          } else {
            // Normal wave advance - pick modifier
            const { modifier, label, stage } = pickWaveModifier(game.wave);
            game.waveModifier = modifier;
            game.waveModifierLabel = label;
            game.missionStageData = stage;

            if (modifier === "mission-stage" && stage) {
              spawnMissionStage(stage, game.wave);
            } else if (modifier === "boss-rush") {
              const rushHp = 20 + Math.floor(game.wave / 5) * 8;
              spawnBoss(game.wave, rushHp);
              soundEngine.play("boss");
            } else {
              spawnFormation(game.wave);
              game.waveTarget = game.activeFormation?.enemies.length || 0;
            }
          }
          game.bossWave = false;
        }

        // Spawn additional formations mid-wave (only for normal/shadow-audit waves after wave 3)
        if (!game.bossWave && game.waveModifier !== "mission-stage" && game.waveModifier !== "boss-rush" && game.wave >= 3 && game.enemies.length < 2 && game.waveEnemiesKilled < game.waveTarget - 3) {
          spawnFormation(game.wave);
        }

        // Game over check
        if (game.lives <= 0) {
          game.state = "gameover";
          game.gameOverTime = now;
          soundEngine.play("gameover");
          const hsKey = `grc-invaders-hs-${game.difficulty}`;
          if (game.score > game.highScore) {
            game.highScore = game.score;
            localStorage.setItem(hsKey, game.score.toString());
          }
          // Also update legacy key for backwards compat
          const legacyHs = localStorage.getItem("grc-invaders-highscore-v2");
          if (!legacyHs || game.score > Number.parseInt(legacyHs, 10)) {
            localStorage.setItem("grc-invaders-highscore-v2", game.score.toString());
          }
        }

        // Draw game objects
        drawParticles(ctx, game.particles);

        game.powerUps.forEach((p) => drawPowerUp(ctx, p, game.frame));
        game.findings.forEach((f) => drawFinding(ctx, f, game.frame));
        game.enemies.forEach((e) => drawEnemy(ctx, e, game.frame));
        game.bullets.forEach((b) => drawBullet(ctx, b.x, b.y, b.angle));

        // Draw player with invincibility flashing
        const isCurrentlyInvincible = now < game.invincibleUntil;
        if (!isCurrentlyInvincible || Math.floor(game.frame / 4) % 2 === 0) {
          drawPlayer(ctx, game.playerX, playerY, game.shieldLevel, game.frame);
        }

        // Shadow Audit darkness overlay (dynamic wave modifier)
        if (game.waveModifier === "shadow-audit") {
          const playerCenterX = game.playerX + PLAYER_WIDTH / 2;
          const playerCenterY = playerY + PLAYER_HEIGHT / 2;
          game.darknessRadius = 120 + Math.sin(game.frame * 0.03) * 10;
          const r = game.darknessRadius;

          ctx.save();
          ctx.beginPath();
          // Outer rectangle
          ctx.rect(0, 0, GAME_WIDTH, GAME_HEIGHT);
          // Inner circle cutout (evenodd)
          ctx.arc(playerCenterX, playerCenterY, r, 0, Math.PI * 2, true);
          ctx.fillStyle = "rgba(0, 0, 0, 0.92)";
          ctx.fill("evenodd");

          // Soft gradient edge
          const gradient = ctx.createRadialGradient(playerCenterX, playerCenterY, r * 0.7, playerCenterX, playerCenterY, r * 1.3);
          gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
          gradient.addColorStop(1, "rgba(0, 0, 0, 0.6)");
          ctx.beginPath();
          ctx.arc(playerCenterX, playerCenterY, r * 1.3, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
          ctx.restore();
        }

        // Reward wave text
        if (game.rewardWaveActive) {
          ctx.save();
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#fbbf24";
          ctx.font = "bold 28px monospace";
          const pulse = 0.7 + Math.sin(game.frame * 0.15) * 0.3;
          ctx.globalAlpha = pulse;
          ctx.fillText("REWARD WAVE!", GAME_WIDTH / 2, 80);
          ctx.globalAlpha = 1;
          ctx.restore();
        }

        // Wave modifier announcement (fades after 3 seconds)
        if (game.waveModifier && game.waveModifierLabel && !game.rewardWaveActive) {
          ctx.save();
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const modColor = game.waveModifier === "shadow-audit" ? "#a855f7"
            : game.waveModifier === "mission-stage" ? "#22d3ee"
            : "#ec4899";
          ctx.fillStyle = modColor;
          ctx.font = "bold 16px monospace";
          ctx.fillText(game.waveModifierLabel, GAME_WIDTH / 2, 30);
          ctx.restore();
        }

        // Touch zone hints
        ctx.fillStyle = "rgba(34, 211, 238, 0.02)";
        ctx.fillRect(0, 0, GAME_WIDTH * 0.35, GAME_HEIGHT);
        ctx.fillRect(GAME_WIDTH * 0.65, 0, GAME_WIDTH * 0.35, GAME_HEIGHT);

        // Update display
        setDisplayState({
          gameState: "playing",
          score: game.score,
          highScore: game.highScore,
          lives: game.lives,
          wave: game.wave,
          shieldLevel: game.shieldLevel,
          rapidLevel: game.rapidLevel,
          multiLevel: game.multiLevel,
          difficulty: game.difficulty,
          waveModifier: game.waveModifier,
          waveModifierLabel: game.waveModifierLabel,
          rewardWaveActive: game.rewardWaveActive,
        });
      }

      // Idle menu screen
      if (game.state === "idle") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Animated enemies in background
        const demoEnemies: Enemy[] = [
          { id: 1, x: 200, y: 120, type: "threat", health: 2, maxHealth: 2, pattern: "swoop", patternTime: game.frame * 0.016, startX: 200, startY: 120, angle: 0, speed: 1 },
          { id: 2, x: 350, y: 140, type: "vulnerability", health: 1, maxHealth: 1, pattern: "circle", patternTime: game.frame * 0.016, startX: 350, startY: 140, angle: game.frame * 0.02, speed: 1 },
          { id: 3, x: 500, y: 120, type: "risk", health: 1, maxHealth: 1, pattern: "zigzag", patternTime: game.frame * 0.016, startX: 500, startY: 120, angle: 0, speed: 1 },
        ];
        demoEnemies.forEach((e) => {
          e.x = e.startX + Math.sin(game.frame * 0.03 + e.id) * 30;
          e.y = e.startY + Math.cos(game.frame * 0.02 + e.id) * 15;
          drawEnemy(ctx, e, game.frame);
        });

        drawPlayer(ctx, GAME_WIDTH / 2 - PLAYER_WIDTH / 2, GAME_HEIGHT - 100, 0, game.frame);

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Title always shown
        ctx.fillStyle = COLORS.playerAccent;
        ctx.font = "bold 44px monospace";
        ctx.fillText("GRC INVADERS", GAME_WIDTH / 2, 55);

        game.menuItemBounds = [];

        const drawMenuItem = (text: string, y: number, idx: number, color?: string) => {
          const isSelected = game.menuCursor === idx;
          const w = 320;
          const h = 36;
          const x = GAME_WIDTH / 2 - w / 2;

          if (isSelected) {
            ctx.fillStyle = `${COLORS.playerAccent}30`;
            ctx.fillRect(x, y - h / 2, w, h);
            ctx.strokeStyle = COLORS.playerAccent;
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y - h / 2, w, h);
          }

          ctx.fillStyle = color || (isSelected ? COLORS.playerAccent : COLORS.text);
          ctx.font = isSelected ? "bold 18px monospace" : "16px monospace";
          ctx.fillText(text, GAME_WIDTH / 2, y);

          game.menuItemBounds.push({ x, y: y - h / 2, w, h, action: text });
        };

        if (game.menuScreen === "main") {
          ctx.fillStyle = COLORS.text;
          ctx.font = "14px monospace";
          ctx.fillText("Survive Audits, Shadow IT & Regulatory Fines!", GAME_WIDTH / 2, 90);

          // Legend
          ctx.font = "11px monospace";
          ctx.fillStyle = COLORS.risk;
          ctx.fillText("Audit Finding", 120, 195);
          ctx.fillStyle = COLORS.vulnerability;
          ctx.fillText("Shadow IT", 280, 195);
          ctx.fillStyle = COLORS.threat;
          ctx.fillText("Reg. Fines", 440, 195);
          ctx.fillStyle = COLORS.boss;
          ctx.fillText("The Regulator", 620, 195);

          ctx.fillStyle = COLORS.textMuted;
          ctx.font = "11px monospace";
          ctx.fillText("Power-ups stack! Collect same type to upgrade (max Lv5)", GAME_WIDTH / 2, 225);

          ctx.fillStyle = COLORS.textMuted;
          ctx.font = "12px monospace";
          ctx.fillText("← → / A D = Move | SPACE = Shoot | ↑↓ = Menu | ENTER = Select", GAME_WIDTH / 2, 260);

          const pulse = 0.7 + Math.sin(game.frame * 0.1) * 0.3;
          ctx.globalAlpha = pulse;
          drawMenuItem("▶  PLAY", 340, 0);
          ctx.globalAlpha = 1;

          if (game.highScore > 0) {
            ctx.fillStyle = COLORS.textMuted;
            ctx.font = "14px monospace";
            ctx.fillText(`High Score: ${game.highScore}`, GAME_WIDTH / 2, 400);
          }

        } else if (game.menuScreen === "difficulty") {
          ctx.fillStyle = COLORS.textMuted;
          ctx.font = "16px monospace";
          ctx.fillText("SELECT DIFFICULTY", GAME_WIDTH / 2, 100);
          ctx.font = "11px monospace";
          ctx.fillText("ESC = Back", GAME_WIDTH / 2, 122);

          const diffs: { key: Difficulty; label: string; desc: string }[] = [
            { key: "easy", label: "EASY", desc: "Slower enemies, weaker foes, longer power-ups" },
            { key: "normal", label: "NORMAL", desc: "The standard compliance experience" },
            { key: "hard", label: "HARD", desc: "Faster enemies, tougher foes, shorter power-ups" },
          ];
          diffs.forEach((d, i) => {
            const y = 230 + i * 65;
            drawMenuItem(d.label, y, i, DIFFICULTIES[d.key].color);
            ctx.fillStyle = COLORS.textMuted;
            ctx.font = "11px monospace";
            ctx.fillText(d.desc, GAME_WIDTH / 2, y + 24);
          });

          // Features preview
          ctx.fillStyle = COLORS.textMuted;
          ctx.font = "10px monospace";
          ctx.fillText("Dynamic events: Shadow Audits • Mission Stages • Boss Rushes", GAME_WIDTH / 2, 440);
          ctx.fillText("Boss every 5 waves • Reward waves after bosses", GAME_WIDTH / 2, 456);
        }
      }

      // Game Over screen
      if (game.state === "gameover") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const timeSinceGameOver = now - game.gameOverTime;
        const canRestartNow = timeSinceGameOver > 2000;

        ctx.fillStyle = COLORS.risk;
        ctx.font = "bold 34px monospace";
        ctx.fillText("SYSTEM BREACHED!", GAME_WIDTH / 2, 160);

        // Difficulty badge
        const diff = DIFFICULTIES[game.difficulty];
        ctx.fillStyle = diff.color;
        ctx.font = "bold 12px monospace";
        ctx.fillText(diff.label, GAME_WIDTH / 2, 195);

        ctx.fillStyle = COLORS.text;
        ctx.font = "bold 32px monospace";
        ctx.fillText(`${game.score.toString().padStart(6, "0")}`, GAME_WIDTH / 2, 240);

        ctx.fillStyle = COLORS.textMuted;
        ctx.font = "16px monospace";
        ctx.fillText(`Wave ${game.wave}`, GAME_WIDTH / 2, 275);

        if (game.score >= game.highScore && game.score > 0) {
          ctx.fillStyle = "#fbbf24";
          ctx.font = "bold 14px monospace";
          ctx.fillText("★ NEW HIGH SCORE ★", GAME_WIDTH / 2, 310);
        }

        // Share button
        const shareButtonY = 350;
        const shareButtonWidth = 180;
        const shareButtonHeight = 40;
        const shareButtonX = GAME_WIDTH / 2 - shareButtonWidth / 2;
        game.shareButtonBounds = { x: shareButtonX, y: shareButtonY, w: shareButtonWidth, h: shareButtonHeight };

        ctx.fillStyle = `${COLORS.playerAccent}30`;
        ctx.fillRect(shareButtonX, shareButtonY, shareButtonWidth, shareButtonHeight);
        ctx.strokeStyle = COLORS.playerAccent;
        ctx.lineWidth = 2;
        ctx.strokeRect(shareButtonX, shareButtonY, shareButtonWidth, shareButtonHeight);

        ctx.fillStyle = COLORS.playerAccent;
        ctx.font = "bold 16px monospace";
        ctx.fillText("📸 SHARE SCORE", GAME_WIDTH / 2, shareButtonY + 24);

        if (canRestartNow) {
          ctx.fillStyle = COLORS.text;
          ctx.font = "bold 14px monospace";
          const pulse = 0.7 + Math.sin(game.frame * 0.1) * 0.3;
          ctx.globalAlpha = pulse;
          ctx.fillText("TAP OR SPACE FOR MENU", GAME_WIDTH / 2, 430);
          ctx.globalAlpha = 1;
        } else {
          const secondsLeft = Math.ceil((2000 - timeSinceGameOver) / 1000);
          ctx.fillStyle = COLORS.textMuted;
          ctx.font = "14px monospace";
          ctx.fillText(`Menu in ${secondsLeft}...`, GAME_WIDTH / 2, 430);
        }

        setDisplayState((s) => ({
          ...s,
          gameState: "gameover",
          score: game.score,
          highScore: game.highScore,
          lives: 0,
          wave: game.wave,
          shieldLevel: 0,
          rapidLevel: 0,
          multiLevel: 0,
        }));
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [spawnFormation, spawnBoss, spawnMissionStage, startRewardWave, pickWaveModifier]);

  const { gameState, score, highScore, lives, wave, shieldLevel: dispShield, rapidLevel: dispRapid, multiLevel: dispMulti, difficulty: dispDiff, waveModifier: dispModifier, waveModifierLabel: dispModLabel } = displayState;

  // Generate and download scorecard
  const generateScorecard = useCallback(() => {
    const canvas = shareCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = 600;
    const h = 400;
    canvas.width = w;
    canvas.height = h;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, COLORS.background);
    grad.addColorStop(0.5, COLORS.backgroundMid);
    grad.addColorStop(1, COLORS.backgroundLight);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Stars
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.4})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, Math.random() > 0.7 ? 2 : 1, Math.random() > 0.7 ? 2 : 1);
    }

    // Border
    ctx.strokeStyle = COLORS.playerAccent;
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    // Inner glow border
    ctx.strokeStyle = `${COLORS.playerAccent}40`;
    ctx.lineWidth = 8;
    ctx.strokeRect(14, 14, w - 28, h - 28);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Title
    ctx.fillStyle = COLORS.playerAccent;
    ctx.font = "bold 36px monospace";
    ctx.fillText("GRC INVADERS", w / 2, 50);

    // Subtitle - difficulty
    ctx.fillStyle = COLORS.textMuted;
    ctx.font = "14px monospace";
    ctx.fillText(DIFFICULTIES[dispDiff].label, w / 2, 80);

    // Nickname
    const displayName = nickname.trim() || "ANONYMOUS";
    ctx.fillStyle = COLORS.text;
    ctx.font = "bold 24px monospace";
    ctx.fillText(displayName.toUpperCase(), w / 2, 130);

    // Score box
    ctx.fillStyle = `${COLORS.playerAccent}20`;
    ctx.fillRect(w / 2 - 140, 160, 280, 80);
    ctx.strokeStyle = COLORS.playerAccent;
    ctx.lineWidth = 2;
    ctx.strokeRect(w / 2 - 140, 160, 280, 80);

    // Score
    ctx.fillStyle = COLORS.playerAccent;
    ctx.font = "bold 42px monospace";
    ctx.fillText(score.toString().padStart(6, "0"), w / 2, 200);

    // Score label
    ctx.fillStyle = COLORS.textMuted;
    ctx.font = "12px monospace";
    ctx.fillText("FINAL SCORE", w / 2, 225);

    // Stats
    ctx.fillStyle = COLORS.text;
    ctx.font = "18px monospace";
    ctx.fillText(`WAVE ${wave}`, w / 2 - 80, 280);

    // High score indicator
    if (score >= highScore && score > 0) {
      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 16px monospace";
      ctx.fillText("★ NEW HIGH SCORE ★", w / 2 + 80, 280);
    }

    // Draw mini enemies as decoration
    const enemyColors = [COLORS.threat, COLORS.vulnerability, COLORS.risk];
    const enemyX = [w / 2 - 100, w / 2, w / 2 + 100];
    enemyColors.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(enemyX[i] - 12, 320, 24, 8);
      ctx.fillRect(enemyX[i] - 16, 328, 32, 12);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(enemyX[i] - 10, 330, 4, 4);
      ctx.fillRect(enemyX[i] + 6, 330, 4, 4);
    });

    // Footer
    ctx.fillStyle = COLORS.textMuted;
    ctx.font = "11px monospace";
    const date = new Date().toLocaleDateString("de-DE");
    ctx.fillText(`docs.kopexa.com • ${date}`, w / 2, 370);
  }, [nickname, score, wave, highScore, dispDiff]);

  // Update scorecard when values change
  useEffect(() => {
    if (showShareCard) {
      generateScorecard();
    }
  }, [showShareCard, nickname, generateScorecard]);

  const downloadScorecard = () => {
    const canvas = shareCanvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `grc-invaders-${score}-wave${wave}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <>
      {/* Game Container - stays in DOM, fullscreen is just a style change */}
      <div
        ref={containerRef}
        className={`flex flex-col items-center gap-2 sm:gap-3 ${
          isFullscreen
            ? "fixed inset-0 z-50 bg-gradient-to-b from-[#0a1929] via-[#0F263E] to-[#1a3a5c] justify-center p-4"
            : "w-full"
        }`}
      >
        {/* HUD */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 w-full max-w-[800px] px-2 text-xs sm:text-sm font-mono font-bold">
          <span className="text-white">
            SCORE: <span className="text-[#22d3ee]">{score.toString().padStart(6, "0")}</span>
          </span>
          <span className="text-[#22c55e]">WAVE {wave}</span>
          {gameState === "playing" && dispModifier && dispModLabel && (
            <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${
              dispModifier === "shadow-audit" ? "bg-[#a855f7]/30 text-[#a855f7]"
              : dispModifier === "mission-stage" ? "bg-[#22d3ee]/30 text-[#22d3ee]"
              : "bg-[#ec4899]/30 text-[#ec4899]"
            }`}>
              {dispModLabel}
            </span>
          )}
          <span className="text-white/60">HI: {highScore.toString().padStart(6, "0")}</span>
          {gameState === "playing" && (
            <span
              className="px-1.5 py-0.5 rounded text-[10px] font-bold"
              style={{ backgroundColor: `${DIFFICULTIES[dispDiff].color}30`, color: DIFFICULTIES[dispDiff].color }}
            >
              {DIFFICULTIES[dispDiff].label}
            </span>
          )}
        </div>

        {/* Lives & Power-up & Controls */}
        <div className="flex items-center gap-4 text-xs sm:text-sm font-mono">
          <div className="flex items-center gap-2 text-white/70">
            <span>LIVES:</span>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-5 h-3 sm:w-6 sm:h-4 rounded ${i < lives ? "bg-[#22d3ee]" : "bg-[#22d3ee]/20"}`}
                />
              ))}
            </div>
          </div>
          {dispShield > 0 && (
            <div className="px-2 py-0.5 rounded text-xs font-bold bg-[#22d3ee]/30 text-[#22d3ee] flex items-center gap-1">
              <span>🛡 ISO</span>
              <span className="text-[10px] opacity-80">{"⚡".repeat(dispShield)}</span>
            </div>
          )}
          {dispRapid > 0 && (
            <div className="px-2 py-0.5 rounded text-xs font-bold bg-[#22c55e]/30 text-[#22c55e] flex items-center gap-1">
              <span>⚡ KOPEXA</span>
              <span className="text-[10px] opacity-80">{"⚡".repeat(dispRapid)}</span>
            </div>
          )}
          {dispMulti > 0 && (
            <div className="px-2 py-0.5 rounded text-xs font-bold bg-[#a855f7]/30 text-[#a855f7] flex items-center gap-1">
              <span>👥 x{1 + dispMulti * 2}</span>
              <span className="text-[10px] opacity-80">{"⚡".repeat(dispMulti)}</span>
            </div>
          )}
          {/* Sound & Fullscreen buttons */}
          <div className="flex gap-2 ml-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
              title={soundEnabled ? "Mute" : "Unmute"}
            >
              {soundEnabled ? "🔊" : "🔇"}
            </button>
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
              title="Settings"
            >
              ⚙️
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? "✕" : "⛶"}
            </button>
          </div>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          onClick={() => {
            // Click handling is done in the useEffect canvas click handler
          }}
          className="rounded-xl border-2 sm:border-4 border-[#22d3ee]/30 cursor-pointer touch-none"
          style={
            isFullscreen
              ? { width: "min(100%, calc(100vh - 120px) * 4 / 3)", height: "auto", maxHeight: "calc(100vh - 120px)", aspectRatio: "4/3" }
              : { width: canvasSize.width, height: canvasSize.height }
          }
        />

        {/* Controls hint - desktop only */}
        {!isFullscreen && (
          <p className="text-xs text-white/50 font-mono text-center px-4 hidden sm:block">
            ← → / A D = Move | SPACE = Shoot | Dodge ⚠ Findings!
          </p>
        )}

        {/* Virtual Controls - Mobile only */}
        {isTouchDevice && (
          <div className="flex justify-between items-center w-full max-w-[500px] px-4 mt-2 sm:hidden">
            {/* D-Pad Left/Right */}
            <div className="flex gap-2">
              <button
                type="button"
                className="w-16 h-16 rounded-xl bg-white/10 active:bg-white/30 border-2 border-white/20 flex items-center justify-center select-none touch-none"
                onTouchStart={(e) => { e.preventDefault(); handleControlStart("left"); }}
                onTouchEnd={(e) => { e.preventDefault(); handleControlEnd("left"); }}
                onTouchCancel={(e) => { e.preventDefault(); handleControlEnd("left"); }}
              >
                {/* Pixel Arrow Left */}
                <svg width="24" height="24" viewBox="0 0 24 24" className="fill-white">
                  <rect x="12" y="4" width="4" height="4" />
                  <rect x="8" y="8" width="4" height="4" />
                  <rect x="4" y="12" width="4" height="4" />
                  <rect x="8" y="16" width="4" height="4" />
                  <rect x="12" y="20" width="4" height="4" />
                  <rect x="12" y="8" width="8" height="4" />
                  <rect x="12" y="12" width="8" height="4" />
                  <rect x="12" y="16" width="8" height="4" />
                </svg>
              </button>
              <button
                type="button"
                className="w-16 h-16 rounded-xl bg-white/10 active:bg-white/30 border-2 border-white/20 flex items-center justify-center select-none touch-none"
                onTouchStart={(e) => { e.preventDefault(); handleControlStart("right"); }}
                onTouchEnd={(e) => { e.preventDefault(); handleControlEnd("right"); }}
                onTouchCancel={(e) => { e.preventDefault(); handleControlEnd("right"); }}
              >
                {/* Pixel Arrow Right */}
                <svg width="24" height="24" viewBox="0 0 24 24" className="fill-white">
                  <rect x="8" y="4" width="4" height="4" />
                  <rect x="12" y="8" width="4" height="4" />
                  <rect x="16" y="12" width="4" height="4" />
                  <rect x="12" y="16" width="4" height="4" />
                  <rect x="8" y="20" width="4" height="4" />
                  <rect x="0" y="8" width="12" height="4" />
                  <rect x="0" y="12" width="12" height="4" />
                  <rect x="0" y="16" width="12" height="4" />
                </svg>
              </button>
            </div>

            {/* Fire Button - Pixel Crosshair/Target */}
            <button
              type="button"
              className="w-20 h-20 rounded-full bg-[#ef4444]/80 active:bg-[#ef4444] border-4 border-[#ef4444] flex items-center justify-center select-none touch-none shadow-lg shadow-[#ef4444]/30"
              onTouchStart={(e) => { e.preventDefault(); handleControlStart("shoot"); }}
              onTouchEnd={(e) => { e.preventDefault(); handleControlEnd("shoot"); }}
              onTouchCancel={(e) => { e.preventDefault(); handleControlEnd("shoot"); }}
            >
              {/* Pixel Crosshair */}
              <svg width="36" height="36" viewBox="0 0 36 36" className="fill-white">
                {/* Vertical line */}
                <rect x="16" y="2" width="4" height="10" />
                <rect x="16" y="24" width="4" height="10" />
                {/* Horizontal line */}
                <rect x="2" y="16" width="10" height="4" />
                <rect x="24" y="16" width="10" height="4" />
                {/* Center dot */}
                <rect x="14" y="14" width="8" height="8" />
                {/* Inner square cutout effect */}
                <rect x="16" y="16" width="4" height="4" className="fill-[#ef4444]" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Settings Overlay */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <div className="bg-[#0F263E] border-2 border-[#22d3ee]/50 rounded-xl p-4 sm:p-6 max-w-sm w-full flex flex-col gap-4">
            <h3 className="text-[#22d3ee] font-mono font-bold text-lg text-center">Settings</h3>

            {/* Sound toggle */}
            <div className="flex items-center justify-between">
              <span className="text-white font-mono text-sm">Sound</span>
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-14 h-8 rounded-full transition-colors ${soundEnabled ? "bg-[#22d3ee]" : "bg-white/20"}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full transition-transform mx-1 ${soundEnabled ? "translate-x-6" : ""}`} />
              </button>
            </div>

            {/* Volume slider */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-white font-mono text-sm">Volume</span>
                <span className="text-white/60 font-mono text-xs">{Math.round(soundVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={soundVolume * 100}
                onChange={(e) => setSoundVolume(Number(e.target.value) / 100)}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#22d3ee]"
              />
            </div>

            {/* Test sound button */}
            <button
              type="button"
              onClick={() => soundEngine.play("powerup")}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-mono text-sm transition-colors"
            >
              🔊 Test Sound
            </button>

            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="px-4 py-2 bg-[#22d3ee] hover:bg-[#22d3ee]/80 rounded-lg text-[#0a1929] font-mono text-sm font-bold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Share Card Overlay */}
      {showShareCard && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <div className="bg-[#0F263E] border-2 border-[#22d3ee]/50 rounded-xl p-4 sm:p-6 max-w-lg w-full flex flex-col items-center gap-4">
            <h3 className="text-[#22d3ee] font-mono font-bold text-lg">Share Your Score</h3>

            {/* Nickname input */}
            <div className="w-full">
              <label htmlFor="nickname" className="text-white/70 font-mono text-xs mb-1 block">
                Enter your nickname:
              </label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value.slice(0, 16))}
                placeholder="ANONYMOUS"
                maxLength={16}
                className="w-full px-3 py-2 bg-[#0a1929] border border-[#22d3ee]/30 rounded-lg text-white font-mono text-center uppercase focus:outline-none focus:border-[#22d3ee]"
              />
            </div>

            {/* Preview canvas */}
            <canvas
              ref={shareCanvasRef}
              className="w-full max-w-[400px] rounded-lg border border-[#22d3ee]/30"
              style={{ aspectRatio: "600/400" }}
            />

            {/* Buttons */}
            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={() => setShowShareCard(false)}
                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-mono text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={downloadScorecard}
                className="flex-1 px-4 py-2 bg-[#22d3ee] hover:bg-[#22d3ee]/80 rounded-lg text-[#0a1929] font-mono text-sm font-bold transition-colors"
              >
                📥 Download
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
