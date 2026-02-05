"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
  hasShield: boolean,
  frame: number
) {
  const s = 1.75;

  // Shield effect
  if (hasShield) {
    ctx.strokeStyle = COLORS.powerupShield;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5 + Math.sin(frame * 0.2) * 0.3;
    ctx.beginPath();
    ctx.ellipse(x + PLAYER_WIDTH / 2, y + PLAYER_HEIGHT / 2, PLAYER_WIDTH / 2 + 8, PLAYER_HEIGHT / 2 + 6, 0, 0, Math.PI * 2);
    ctx.stroke();
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

  const colorMap: Record<EnemyType, { main: string; dark: string }> = {
    risk: { main: COLORS.risk, dark: COLORS.riskDark },
    vulnerability: { main: COLORS.vulnerability, dark: COLORS.vulnerabilityDark },
    threat: { main: COLORS.threat, dark: COLORS.threatDark },
    boss: { main: COLORS.boss, dark: COLORS.bossDark },
  };

  const { main, dark } = colorMap[type];
  const size = type === "boss" ? 2.5 : 1;
  const w = ENEMY_WIDTH * size;
  const h = ENEMY_HEIGHT * size;

  // Wobble animation
  const wobble = Math.sin(frame * 0.15 + enemy.id) * 2;

  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(wobble * 0.05);
  ctx.translate(-w / 2, -h / 2);

  // Body
  drawPixelRect(ctx, w * 0.2, 0, w * 0.6, h * 0.15, main);
  drawPixelRect(ctx, w * 0.1, h * 0.15, w * 0.8, h * 0.15, main);
  drawPixelRect(ctx, 0, h * 0.3, w, h * 0.35, dark);

  // Eyes
  const eyeSize = type === "boss" ? 12 : 6;
  const eyeY = h * 0.35;
  drawPixelRect(ctx, w * 0.2, eyeY, eyeSize, eyeSize, "#ffffff");
  drawPixelRect(ctx, w * 0.6, eyeY, eyeSize, eyeSize, "#ffffff");

  // Angry eyebrows for boss
  if (type === "boss") {
    ctx.fillStyle = dark;
    ctx.fillRect(w * 0.15, eyeY - 4, eyeSize + 6, 4);
    ctx.fillRect(w * 0.55, eyeY - 4, eyeSize + 6, 4);
  }

  // Pupils (follow player direction implied by wobble)
  const pupilOffset = wobble > 0 ? 2 : -2;
  drawPixelRect(ctx, w * 0.25 + pupilOffset, eyeY + 2, eyeSize / 2, eyeSize / 2, main);
  drawPixelRect(ctx, w * 0.65 + pupilOffset, eyeY + 2, eyeSize / 2, eyeSize / 2, main);

  // Tentacles/legs
  const legCount = type === "boss" ? 6 : 4;
  const legWidth = w / (legCount * 2);
  for (let i = 0; i < legCount; i++) {
    const legX = (w / (legCount + 1)) * (i + 1) - legWidth / 2;
    const legWobble = Math.sin(frame * 0.2 + i) * 3;
    drawPixelRect(ctx, legX + legWobble, h * 0.65, legWidth, h * 0.35, dark);
  }

  ctx.restore();

  // Health bar for boss
  if (type === "boss" && health < maxHealth) {
    const barWidth = w;
    const barHeight = 6;
    const healthPercent = health / maxHealth;
    ctx.fillStyle = "#1f2937";
    ctx.fillRect(x, y - 12, barWidth, barHeight);
    ctx.fillStyle = healthPercent > 0.5 ? "#22c55e" : healthPercent > 0.25 ? "#fbbf24" : "#ef4444";
    ctx.fillRect(x, y - 12, barWidth * healthPercent, barHeight);
  }
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
  const size = 24;

  const colors: Record<typeof type, string> = {
    shield: COLORS.powerupShield,
    rapid: COLORS.powerupRapid,
    multi: COLORS.powerupMulti,
  };

  ctx.save();
  ctx.translate(x + size / 2, y + size / 2);

  // Pulsing glow
  const pulse = 1 + Math.sin(frame * 0.2) * 0.2;
  ctx.scale(pulse, pulse);

  // Outer circle
  ctx.fillStyle = colors[type];
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.arc(0, 0, size / 2 + 4, 0, Math.PI * 2);
  ctx.fill();

  // Inner circle
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
  ctx.fill();

  // Icon
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 14px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const icons: Record<typeof type, string> = {
    shield: "🛡",
    rapid: "⚡",
    multi: "✦",
  };
  ctx.fillText(icons[type], 0, 1);

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
    powerUp: string | null;
  }>({
    gameState: "idle",
    score: 0,
    highScore: 0,
    lives: 3,
    wave: 1,
    powerUp: null,
  });
  const [canvasSize, setCanvasSize] = useState({ width: GAME_WIDTH, height: GAME_HEIGHT });
  const [showShareCard, setShowShareCard] = useState(false);
  const [nickname, setNickname] = useState("");
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
    // Power-up states
    hasShield: false,
    shieldEndTime: 0,
    rapidFire: false,
    rapidFireEndTime: 0,
    multiShot: false,
    multiShotEndTime: 0,
    // Boss tracking
    bossWave: false,
    waveEnemiesSpawned: 0,
    waveEnemiesKilled: 0,
    waveTarget: 0,
  });

  const keysRef = useRef<Set<string>>(new Set());
  const touchRef = useRef({ left: false, right: false, shoot: false });
  const animationFrameRef = useRef<number | null>(null);

  // Initialize
  useEffect(() => {
    // Stars
    gameRef.current.stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * GAME_WIDTH,
      y: Math.random() * GAME_HEIGHT,
      size: Math.random() > 0.7 ? 2 : 1,
      speed: 0.5 + Math.random() * 1.5,
    }));

    // High score
    const saved = localStorage.getItem("grc-invaders-highscore-v2");
    if (saved) {
      gameRef.current.highScore = Number.parseInt(saved, 10);
      setDisplayState((s) => ({ ...s, highScore: gameRef.current.highScore }));
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
    const formation = createFormation(waveNum);
    game.activeFormation = formation;
    game.formationComplete = false;

    formation.enemies.forEach((e, i) => {
      setTimeout(() => {
        if (game.state !== "playing") return;
        game.enemies.push({
          id: game.enemyIdCounter++,
          x: e.x,
          y: e.y,
          type: e.type,
          health: e.type === "threat" ? 2 : 1,
          maxHealth: e.type === "threat" ? 2 : 1,
          pattern: e.pattern,
          patternTime: 0,
          startX: e.x,
          startY: e.y,
          angle: 0,
          speed: 0.5 + waveNum * 0.08,
        });
        game.waveEnemiesSpawned++;
      }, i * 150);
    });
  }, []);

  const spawnBoss = useCallback((waveNum: number) => {
    const game = gameRef.current;
    game.bossWave = true;
    game.enemies.push({
      id: game.enemyIdCounter++,
      x: GAME_WIDTH / 2 - 50,
      y: -100,
      type: "boss",
      health: 15 + waveNum * 3,
      maxHealth: 15 + waveNum * 3,
      pattern: "boss",
      patternTime: 0,
      startX: GAME_WIDTH / 2 - 50,
      startY: 60,
      angle: 0,
      speed: 0.8 + waveNum * 0.05,
    });
    game.waveEnemiesSpawned++;
    game.waveTarget = 1;
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
    game.hasShield = false;
    game.rapidFire = false;
    game.multiShot = false;
    game.bossWave = false;
    game.waveEnemiesSpawned = 0;
    game.waveEnemiesKilled = 0;
    game.waveTarget = 0;

    setDisplayState((s) => ({
      ...s,
      gameState: "playing",
      score: 0,
      lives: 3,
      wave: 1,
      powerUp: null,
    }));

    // Start first wave
    spawnFormation(1);
    game.waveTarget = game.activeFormation?.enemies.length || 0;
  }, [spawnFormation]);

  // Input handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "Space", " ", "a", "d", "A", "D"].includes(e.key)) {
        e.preventDefault();
        keysRef.current.add(e.key);
      }
      if ((e.key === " " || e.code === "Space") && gameRef.current.state !== "playing") {
        startGame();
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
  }, [startGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouch = (e: TouchEvent, isStart: boolean) => {
      e.preventDefault();
      if (isStart && gameRef.current.state !== "playing") {
        startGame();
        return;
      }

      const rect = canvas.getBoundingClientRect();
      touchRef.current = { left: false, right: false, shoot: false };

      for (let i = 0; i < e.touches.length; i++) {
        const relX = (e.touches[i].clientX - rect.left) / rect.width;
        if (relX < 0.35) touchRef.current.left = true;
        else if (relX > 0.65) touchRef.current.right = true;
        else touchRef.current.shoot = true;
      }
    };

    const onStart = (e: TouchEvent) => handleTouch(e, true);
    const onMove = (e: TouchEvent) => handleTouch(e, false);
    const onEnd = (e: TouchEvent) => {
      e.preventDefault();
      touchRef.current = { left: false, right: false, shoot: false };
    };

    canvas.addEventListener("touchstart", onStart, { passive: false });
    canvas.addEventListener("touchmove", onMove, { passive: false });
    canvas.addEventListener("touchend", onEnd, { passive: false });
    return () => {
      canvas.removeEventListener("touchstart", onStart);
      canvas.removeEventListener("touchmove", onMove);
      canvas.removeEventListener("touchend", onEnd);
    };
  }, [startGame]);

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
        if (game.hasShield && now > game.shieldEndTime) game.hasShield = false;
        if (game.rapidFire && now > game.rapidFireEndTime) game.rapidFire = false;
        if (game.multiShot && now > game.multiShotEndTime) game.multiShot = false;

        // Update display state for power-ups
        const currentPowerUp = game.hasShield ? "shield" : game.rapidFire ? "rapid" : game.multiShot ? "multi" : null;

        // Player movement
        const left = keysRef.current.has("ArrowLeft") || keysRef.current.has("a") || keysRef.current.has("A") || touchRef.current.left;
        const right = keysRef.current.has("ArrowRight") || keysRef.current.has("d") || keysRef.current.has("D") || touchRef.current.right;
        const shoot = keysRef.current.has("Space") || keysRef.current.has(" ") || touchRef.current.shoot;

        if (left) game.playerX = Math.max(0, game.playerX - PLAYER_SPEED);
        if (right) game.playerX = Math.min(GAME_WIDTH - PLAYER_WIDTH, game.playerX + PLAYER_SPEED);

        // Shooting
        const fireRate = game.rapidFire ? 100 : 200;
        if (shoot && now - game.lastShot > fireRate) {
          game.lastShot = now;
          const bulletX = game.playerX + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2;
          const bulletY = GAME_HEIGHT - 70;

          if (game.multiShot) {
            game.bullets.push(
              { id: game.bulletIdCounter++, x: bulletX, y: bulletY, angle: 0 },
              { id: game.bulletIdCounter++, x: bulletX - 10, y: bulletY, angle: -0.15 },
              { id: game.bulletIdCounter++, x: bulletX + 10, y: bulletY, angle: 0.15 }
            );
          } else {
            game.bullets.push({ id: game.bulletIdCounter++, x: bulletX, y: bulletY, angle: 0 });
          }
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

                // Boss drops findings - rate scales with wave
                const dropChance = 0.008 + game.wave * 0.002;
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

          // Random finding drops from regular enemies - scales with wave
          const enemyDropChance = 0.001 + game.wave * 0.0003;
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
        game.findings = game.findings.filter((f) => {
          if (
            f.x < game.playerX + PLAYER_WIDTH &&
            f.x + 16 > game.playerX &&
            f.y < playerY + PLAYER_HEIGHT &&
            f.y + 16 > playerY
          ) {
            if (game.hasShield) {
              // Shield absorbs
              game.hasShield = false;
            } else {
              game.lives--;
              // Hit flash particles
              for (let i = 0; i < 10; i++) {
                game.particles.push({
                  x: game.playerX + PLAYER_WIDTH / 2,
                  y: playerY + PLAYER_HEIGHT / 2,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  life: 1,
                  color: COLORS.risk,
                  size: 4,
                });
              }
            }
            return false;
          }
          return true;
        });

        // Collision: power-ups vs player
        game.powerUps = game.powerUps.filter((p) => {
          if (
            p.x < game.playerX + PLAYER_WIDTH &&
            p.x + 24 > game.playerX &&
            p.y < playerY + PLAYER_HEIGHT &&
            p.y + 24 > playerY
          ) {
            const duration = 8000;
            switch (p.type) {
              case "shield":
                game.hasShield = true;
                game.shieldEndTime = now + duration;
                break;
              case "rapid":
                game.rapidFire = true;
                game.rapidFireEndTime = now + duration;
                break;
              case "multi":
                game.multiShot = true;
                game.multiShotEndTime = now + duration;
                break;
            }
            return false;
          }
          return true;
        });

        // Check wave completion
        if (game.waveEnemiesKilled >= game.waveTarget && game.enemies.length === 0) {
          game.wave++;
          game.waveEnemiesSpawned = 0;
          game.waveEnemiesKilled = 0;
          game.score += 100 * game.wave;

          // Boss every 5 waves
          if (game.wave % 5 === 0) {
            spawnBoss(game.wave);
          } else {
            spawnFormation(game.wave);
            game.waveTarget = game.activeFormation?.enemies.length || 0;
          }
          game.bossWave = false;
        }

        // Spawn additional formations mid-wave (only after wave 3, and less aggressively)
        if (!game.bossWave && game.wave >= 3 && game.enemies.length < 2 && game.waveEnemiesKilled < game.waveTarget - 3) {
          spawnFormation(game.wave);
        }

        // Game over check
        if (game.lives <= 0) {
          game.state = "gameover";
          if (game.score > game.highScore) {
            game.highScore = game.score;
            localStorage.setItem("grc-invaders-highscore-v2", game.score.toString());
          }
        }

        // Draw game objects
        drawParticles(ctx, game.particles);

        game.powerUps.forEach((p) => drawPowerUp(ctx, p, game.frame));
        game.findings.forEach((f) => drawFinding(ctx, f, game.frame));
        game.enemies.forEach((e) => drawEnemy(ctx, e, game.frame));
        game.bullets.forEach((b) => drawBullet(ctx, b.x, b.y, b.angle));
        drawPlayer(ctx, game.playerX, playerY, game.hasShield, game.frame);

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
          powerUp: currentPowerUp,
        });
      }

      // Idle / Game Over screens
      if (game.state === "idle" || game.state === "gameover") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Animated enemies
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

        drawPlayer(ctx, GAME_WIDTH / 2 - PLAYER_WIDTH / 2, GAME_HEIGHT - 100, false, game.frame);

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (game.state === "idle") {
          ctx.fillStyle = COLORS.playerAccent;
          ctx.font = "bold 44px monospace";
          ctx.fillText("GRC INVADERS", GAME_WIDTH / 2, 60);

          ctx.fillStyle = COLORS.text;
          ctx.font = "16px monospace";
          ctx.fillText("Eliminate Risks, Vulnerabilities & Threats!", GAME_WIDTH / 2, 95);

          // Legend
          ctx.font = "13px monospace";
          ctx.fillStyle = COLORS.threat;
          ctx.fillText("Threat (30pt)", 200, 200);
          ctx.fillStyle = COLORS.vulnerability;
          ctx.fillText("Vulnerability (20pt)", 400, 200);
          ctx.fillStyle = COLORS.risk;
          ctx.fillText("Risk (10pt)", 560, 200);

          // Power-ups legend
          ctx.fillStyle = COLORS.textMuted;
          ctx.font = "12px monospace";
          ctx.fillText("Power-ups: 🛡 Shield | ⚡ Rapid Fire | ✦ Multi-Shot", GAME_WIDTH / 2, 240);

          ctx.fillStyle = COLORS.textMuted;
          ctx.font = "13px monospace";
          ctx.fillText("← → or A/D to move | SPACE or tap center to shoot", GAME_WIDTH / 2, 280);
          ctx.fillText("Dodge the ⚠ Findings!", GAME_WIDTH / 2, 305);

          ctx.fillStyle = COLORS.playerAccent;
          ctx.font = "bold 18px monospace";
          const pulse = 0.7 + Math.sin(game.frame * 0.1) * 0.3;
          ctx.globalAlpha = pulse;
          ctx.fillText("TAP OR PRESS SPACE TO START", GAME_WIDTH / 2, 380);
          ctx.globalAlpha = 1;

          if (game.highScore > 0) {
            ctx.fillStyle = COLORS.textMuted;
            ctx.font = "14px monospace";
            ctx.fillText(`High Score: ${game.highScore}`, GAME_WIDTH / 2, 420);
          }
        } else {
          ctx.fillStyle = COLORS.risk;
          ctx.font = "bold 38px monospace";
          ctx.fillText("SYSTEM BREACHED!", GAME_WIDTH / 2, 220);

          ctx.fillStyle = COLORS.text;
          ctx.font = "bold 26px monospace";
          ctx.fillText(`Score: ${game.score}`, GAME_WIDTH / 2, 280);

          ctx.fillStyle = COLORS.textMuted;
          ctx.font = "18px monospace";
          ctx.fillText(`Wave ${game.wave}`, GAME_WIDTH / 2, 320);

          if (game.score >= game.highScore && game.score > 0) {
            ctx.fillStyle = "#fbbf24";
            ctx.font = "bold 16px monospace";
            ctx.fillText("🏆 NEW HIGH SCORE! 🏆", GAME_WIDTH / 2, 370);
          }

          ctx.fillStyle = COLORS.playerAccent;
          ctx.font = "bold 16px monospace";
          const pulse = 0.7 + Math.sin(game.frame * 0.1) * 0.3;
          ctx.globalAlpha = pulse;
          ctx.fillText("TAP TO RESTART", GAME_WIDTH / 2, 430);
          ctx.globalAlpha = 1;

          setDisplayState((s) => ({
            ...s,
            gameState: "gameover",
            score: game.score,
            highScore: game.highScore,
            lives: 0,
            wave: game.wave,
          }));
        }
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [spawnFormation, spawnBoss]);

  const { gameState, score, highScore, lives, wave, powerUp } = displayState;

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

    // Subtitle
    ctx.fillStyle = COLORS.textMuted;
    ctx.font = "14px monospace";
    ctx.fillText("MISSION COMPLETE", w / 2, 80);

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
  }, [nickname, score, wave, highScore]);

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
    <div className="flex flex-col items-center gap-2 sm:gap-3 w-full" ref={containerRef}>
      {/* HUD */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-6 w-full max-w-[800px] px-2 text-xs sm:text-sm font-mono font-bold">
        <span className="text-white">
          SCORE: <span className="text-[#22d3ee]">{score.toString().padStart(6, "0")}</span>
        </span>
        <span className="text-[#22c55e]">WAVE {wave}</span>
        <span className="text-white/60">HI: {highScore.toString().padStart(6, "0")}</span>
      </div>

      {/* Lives & Power-up */}
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
        {powerUp && (
          <div className={`px-2 py-0.5 rounded text-xs font-bold ${
            powerUp === "shield" ? "bg-[#22d3ee]/30 text-[#22d3ee]" :
            powerUp === "rapid" ? "bg-[#22c55e]/30 text-[#22c55e]" :
            "bg-[#a855f7]/30 text-[#a855f7]"
          }`}>
            {powerUp === "shield" ? "🛡 SHIELD" : powerUp === "rapid" ? "⚡ RAPID" : "✦ MULTI"}
          </div>
        )}
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        onClick={() => gameState !== "playing" && startGame()}
        className="rounded-xl border-2 sm:border-4 border-[#22d3ee]/30 cursor-pointer touch-none"
        style={{ width: canvasSize.width, height: canvasSize.height }}
      />

      {/* Controls */}
      <p className="text-xs text-white/50 font-mono text-center px-4">
        <span className="hidden sm:inline">← → / A D = Move | SPACE = Shoot | Dodge ⚠ Findings!</span>
        <span className="sm:hidden">Left/Right = Move | Center = Shoot</span>
      </p>

      {/* Share Score Button - shown on game over */}
      {gameState === "gameover" && (
        <button
          type="button"
          onClick={() => setShowShareCard(true)}
          className="mt-2 px-4 py-2 bg-[#22d3ee]/20 hover:bg-[#22d3ee]/30 border border-[#22d3ee]/50 rounded-lg text-[#22d3ee] font-mono text-sm font-bold transition-colors"
        >
          📸 Share Score
        </button>
      )}

      {/* Share Card Overlay */}
      {showShareCard && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
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
    </div>
  );
}
