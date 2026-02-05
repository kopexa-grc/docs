"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Game constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_WIDTH = 56;
const PLAYER_HEIGHT = 42;
const ENEMY_WIDTH = 44;
const ENEMY_HEIGHT = 32;
const BULLET_WIDTH = 8;
const BULLET_HEIGHT = 16;
const PLAYER_SPEED = 6;
const BULLET_SPEED = 10;
const ENEMY_SPEED = 0.8;
const ENEMY_DROP = 20;

// Colors
const COLORS = {
  background: "#0a1929",
  backgroundMid: "#0F263E",
  backgroundLight: "#1a3a5c",
  player: "#0F263E",
  playerLight: "#1a3a5c",
  playerAccent: "#22d3ee",
  threat: "#a855f7",
  threatDark: "#9333ea",
  vulnerability: "#f97316",
  vulnerabilityDark: "#ea580c",
  risk: "#ef4444",
  riskDark: "#dc2626",
  bullet: "#22d3ee",
  bulletGreen: "#22c55e",
  ufo: "#0F263E",
  ufoLight: "#1a3a5c",
  ufoAccent: "#22d3ee",
  text: "#ffffff",
  textMuted: "#94a3b8",
};

type Enemy = {
  id: number;
  x: number;
  y: number;
  type: "risk" | "vulnerability" | "threat";
  alive: boolean;
};

type Bullet = {
  id: number;
  x: number;
  y: number;
};

type UFO = {
  x: number;
  active: boolean;
  direction: 1 | -1;
};

type GameState = "idle" | "playing" | "gameover";

// Draw pixel rect helper
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

// Draw player ship
function drawPlayer(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const scale = PLAYER_WIDTH / 32;
  const s = (px: number) => px * scale;

  // Ship body
  drawPixelRect(ctx, x + s(12), y, s(8), s(4), COLORS.playerAccent);
  drawPixelRect(ctx, x + s(8), y + s(4), s(16), s(4), COLORS.player);
  drawPixelRect(ctx, x + s(4), y + s(8), s(24), s(8), COLORS.player);
  drawPixelRect(ctx, x + s(8), y + s(10), s(16), s(4), COLORS.playerLight);
  // Shield emblem
  drawPixelRect(ctx, x + s(14), y + s(11), s(4), s(2), COLORS.playerAccent);
  // Wings
  drawPixelRect(ctx, x, y + s(16), s(8), s(4), COLORS.playerLight);
  drawPixelRect(ctx, x + s(24), y + s(16), s(8), s(4), COLORS.playerLight);
  drawPixelRect(ctx, x + s(4), y + s(16), s(24), s(8), COLORS.player);
  // Engines (pulsing effect based on time)
  const pulse = Math.sin(Date.now() / 100) > 0;
  if (pulse) {
    drawPixelRect(ctx, x + s(8), y + s(20), s(4), s(4), COLORS.playerAccent);
    drawPixelRect(ctx, x + s(20), y + s(20), s(4), s(4), COLORS.playerAccent);
  }
}

// Draw enemy
function drawEnemy(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  type: Enemy["type"]
) {
  const colors = {
    risk: { main: COLORS.risk, dark: COLORS.riskDark },
    vulnerability: { main: COLORS.vulnerability, dark: COLORS.vulnerabilityDark },
    threat: { main: COLORS.threat, dark: COLORS.threatDark },
  };
  const { main, dark } = colors[type];
  const scale = ENEMY_WIDTH / 28;
  const s = (px: number) => px * scale;

  // Body
  drawPixelRect(ctx, x + s(8), y, s(12), s(4), main);
  drawPixelRect(ctx, x + s(4), y + s(4), s(20), s(4), main);
  drawPixelRect(ctx, x, y + s(8), s(28), s(8), dark);
  // Eyes
  drawPixelRect(ctx, x + s(6), y + s(10), s(4), s(4), "#ffffff");
  drawPixelRect(ctx, x + s(18), y + s(10), s(4), s(4), "#ffffff");
  drawPixelRect(ctx, x + s(8), y + s(12), s(2), s(2), main);
  drawPixelRect(ctx, x + s(20), y + s(12), s(2), s(2), main);
  // Legs
  drawPixelRect(ctx, x + s(2), y + s(16), s(4), s(4), dark);
  drawPixelRect(ctx, x + s(10), y + s(16), s(4), s(4), dark);
  drawPixelRect(ctx, x + s(18), y + s(16), s(4), s(4), dark);
  drawPixelRect(ctx, x + s(22), y + s(16), s(4), s(4), dark);
}

// Draw bullet
function drawBullet(ctx: CanvasRenderingContext2D, x: number, y: number) {
  drawPixelRect(ctx, x + 2, y, 4, 5, COLORS.playerAccent);
  drawPixelRect(ctx, x, y + 5, 8, 6, COLORS.bulletGreen);
  drawPixelRect(ctx, x + 2, y + 11, 4, 5, "#16a34a");
}

// Draw UFO
function drawUFO(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) {
  // Body
  ctx.fillStyle = COLORS.ufo;
  ctx.beginPath();
  ctx.ellipse(x + 30, y + 14, 27, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = COLORS.ufoLight;
  ctx.beginPath();
  ctx.ellipse(x + 30, y + 12, 21, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = COLORS.ufoAccent;
  ctx.beginPath();
  ctx.ellipse(x + 30, y + 10, 12, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Lights
  const lights = [x + 12, x + 24, x + 36, x + 48];
  lights.forEach((lx, i) => {
    ctx.fillStyle = (frame + i) % 2 === 0 ? COLORS.ufoAccent : COLORS.ufo;
    ctx.fillRect(lx, y + 14, 4, 4);
  });
}

// Draw stars
function drawStars(ctx: CanvasRenderingContext2D, stars: { x: number; y: number; size: number }[]) {
  stars.forEach((star) => {
    const opacity = 0.3 + Math.sin(Date.now() / 1000 + star.x) * 0.2;
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.fillRect(star.x, star.y, star.size, star.size);
  });
}

export function ComplianceRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const [canvasSize, setCanvasSize] = useState({ width: GAME_WIDTH, height: GAME_HEIGHT });

  // Game state refs (for animation loop)
  const gameStateRef = useRef<GameState>("idle");
  const playerXRef = useRef(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
  const enemiesRef = useRef<Enemy[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const ufoRef = useRef<UFO>({ x: -60, active: false, direction: 1 });
  const enemyDirectionRef = useRef<1 | -1>(1);
  const waveRef = useRef(1);
  const livesRef = useRef(3);
  const scoreRef = useRef(0);
  const keysRef = useRef<Set<string>>(new Set());
  const lastShotRef = useRef(0);
  const bulletIdRef = useRef(0);
  const frameRef = useRef(0);
  const starsRef = useRef<{ x: number; y: number; size: number }[]>([]);
  const touchRef = useRef<{ left: boolean; right: boolean; shoot: boolean }>({
    left: false,
    right: false,
    shoot: false,
  });
  const animationFrameRef = useRef<number | null>(null);

  // Initialize stars
  useEffect(() => {
    starsRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * GAME_WIDTH,
      y: Math.random() * GAME_HEIGHT,
      size: Math.random() > 0.7 ? 2 : 1,
    }));
  }, []);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem("kopexa-invaders-highscore");
    if (saved) setHighScore(Number.parseInt(saved, 10));
  }, []);

  // Handle responsive canvas
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const scale = Math.min(1, containerWidth / GAME_WIDTH);
        setCanvasSize({
          width: GAME_WIDTH * scale,
          height: GAME_HEIGHT * scale,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Initialize enemies
  const initEnemies = useCallback((waveNum: number) => {
    const newEnemies: Enemy[] = [];
    const rows = Math.min(3 + Math.floor(waveNum / 2), 5);
    const cols = Math.min(7 + waveNum, 10);
    const types: Enemy["type"][] = ["threat", "vulnerability", "risk"];

    let id = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        newEnemies.push({
          id: id++,
          x: 50 + col * (ENEMY_WIDTH + 12),
          y: 50 + row * (ENEMY_HEIGHT + 14),
          type: types[row % 3],
          alive: true,
        });
      }
    }
    return newEnemies;
  }, []);

  // Start game
  const startGame = useCallback(() => {
    gameStateRef.current = "playing";
    setGameState("playing");
    scoreRef.current = 0;
    setScore(0);
    setDisplayScore(0);
    livesRef.current = 3;
    setLives(3);
    waveRef.current = 1;
    setWave(1);
    playerXRef.current = GAME_WIDTH / 2 - PLAYER_WIDTH / 2;
    enemiesRef.current = initEnemies(1);
    bulletsRef.current = [];
    enemyDirectionRef.current = 1;
    ufoRef.current = { x: -60, active: false, direction: 1 };
  }, [initEnemies]);

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "Space", " ", "a", "d", "A", "D"].includes(e.key)) {
        e.preventDefault();
        keysRef.current.add(e.key);
      }
      if ((e.key === " " || e.code === "Space") && gameStateRef.current !== "playing") {
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

  // Touch input
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (gameStateRef.current !== "playing") {
        startGame();
        return;
      }

      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const relX = x / rect.width;

        if (relX < 0.35) {
          touchRef.current.left = true;
        } else if (relX > 0.65) {
          touchRef.current.right = true;
        } else {
          touchRef.current.shoot = true;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      // Check remaining touches
      const rect = canvas.getBoundingClientRect();
      touchRef.current = { left: false, right: false, shoot: false };

      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const x = touch.clientX - rect.left;
        const relX = x / rect.width;

        if (relX < 0.35) {
          touchRef.current.left = true;
        } else if (relX > 0.65) {
          touchRef.current.right = true;
        } else {
          touchRef.current.shoot = true;
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      touchRef.current = { left: false, right: false, shoot: false };

      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const x = touch.clientX - rect.left;
        const relX = x / rect.width;

        if (relX < 0.35) {
          touchRef.current.left = true;
        } else if (relX > 0.65) {
          touchRef.current.right = true;
        } else {
          touchRef.current.shoot = true;
        }
      }
    };

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchmove", handleTouchMove);
    };
  }, [startGame]);

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime = 0;

    const gameLoop = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      frameRef.current = Math.floor(timestamp / 500) % 2;

      // Clear and draw background
      const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
      gradient.addColorStop(0, COLORS.background);
      gradient.addColorStop(0.5, COLORS.backgroundMid);
      gradient.addColorStop(1, COLORS.backgroundLight);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Draw stars
      drawStars(ctx, starsRef.current);

      if (gameStateRef.current === "playing") {
        const now = Date.now();

        // Player movement
        const moveLeft = keysRef.current.has("ArrowLeft") || keysRef.current.has("a") || keysRef.current.has("A") || touchRef.current.left;
        const moveRight = keysRef.current.has("ArrowRight") || keysRef.current.has("d") || keysRef.current.has("D") || touchRef.current.right;
        const shooting = keysRef.current.has("Space") || keysRef.current.has(" ") || touchRef.current.shoot;

        if (moveLeft) {
          playerXRef.current = Math.max(0, playerXRef.current - PLAYER_SPEED);
        }
        if (moveRight) {
          playerXRef.current = Math.min(GAME_WIDTH - PLAYER_WIDTH, playerXRef.current + PLAYER_SPEED);
        }

        // Shooting
        if (shooting && now - lastShotRef.current > 250) {
          lastShotRef.current = now;
          bulletsRef.current.push({
            id: bulletIdRef.current++,
            x: playerXRef.current + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
            y: GAME_HEIGHT - 70,
          });
        }

        // Move bullets
        bulletsRef.current = bulletsRef.current
          .map((b) => ({ ...b, y: b.y - BULLET_SPEED }))
          .filter((b) => b.y > -BULLET_HEIGHT);

        // Move enemies
        let shouldDrop = false;
        let newDirection = enemyDirectionRef.current;
        const speedMultiplier = 1 + waveRef.current * 0.05;

        enemiesRef.current = enemiesRef.current.map((e) => {
          if (!e.alive) return e;
          const newX = e.x + ENEMY_SPEED * enemyDirectionRef.current * speedMultiplier;
          if (newX <= 0 || newX >= GAME_WIDTH - ENEMY_WIDTH) {
            shouldDrop = true;
            newDirection = enemyDirectionRef.current === 1 ? -1 : 1;
          }
          return { ...e, x: newX };
        });

        if (shouldDrop) {
          enemyDirectionRef.current = newDirection;
          enemiesRef.current = enemiesRef.current.map((e) => ({
            ...e,
            y: e.y + ENEMY_DROP,
          }));
        }

        // UFO logic
        if (!ufoRef.current.active && Math.random() < 0.003) {
          ufoRef.current = {
            x: ufoRef.current.direction === 1 ? -60 : GAME_WIDTH + 60,
            active: true,
            direction: ufoRef.current.direction === 1 ? -1 : 1,
          };
        }
        if (ufoRef.current.active) {
          ufoRef.current.x += 4 * ufoRef.current.direction;
          if (ufoRef.current.x < -60 || ufoRef.current.x > GAME_WIDTH + 60) {
            ufoRef.current.active = false;
          }
        }

        // Collision detection
        bulletsRef.current = bulletsRef.current.filter((bullet) => {
          // Check enemy collision
          for (const enemy of enemiesRef.current) {
            if (!enemy.alive) continue;
            if (
              bullet.x < enemy.x + ENEMY_WIDTH &&
              bullet.x + BULLET_WIDTH > enemy.x &&
              bullet.y < enemy.y + ENEMY_HEIGHT &&
              bullet.y + BULLET_HEIGHT > enemy.y
            ) {
              enemy.alive = false;
              const points = enemy.type === "threat" ? 30 : enemy.type === "vulnerability" ? 20 : 10;
              scoreRef.current += points;
              setScore(scoreRef.current);
              return false;
            }
          }

          // Check UFO collision
          if (ufoRef.current.active) {
            if (
              bullet.x < ufoRef.current.x + 60 &&
              bullet.x + BULLET_WIDTH > ufoRef.current.x &&
              bullet.y < 30 &&
              bullet.y + BULLET_HEIGHT > 10
            ) {
              ufoRef.current.active = false;
              scoreRef.current += 100;
              setScore(scoreRef.current);
              return false;
            }
          }

          return true;
        });

        // Check if enemies reached player
        const lowestEnemy = enemiesRef.current
          .filter((e) => e.alive)
          .reduce((max, e) => Math.max(max, e.y), 0);
        if (lowestEnemy > GAME_HEIGHT - 100) {
          livesRef.current = 0;
        }

        // Check win condition
        if (enemiesRef.current.filter((e) => e.alive).length === 0) {
          waveRef.current += 1;
          setWave(waveRef.current);
          enemiesRef.current = initEnemies(waveRef.current);
          enemyDirectionRef.current = 1;
          scoreRef.current += 50 * (waveRef.current - 1);
          setScore(scoreRef.current);
        }

        // Check game over
        if (livesRef.current <= 0) {
          gameStateRef.current = "gameover";
          setGameState("gameover");
          setLives(0);
          if (scoreRef.current > highScore) {
            setHighScore(scoreRef.current);
            localStorage.setItem("kopexa-invaders-highscore", scoreRef.current.toString());
          }
        }

        // Draw UFO
        if (ufoRef.current.active) {
          drawUFO(ctx, ufoRef.current.x, 10, frameRef.current);
        }

        // Draw enemies
        enemiesRef.current.forEach((enemy) => {
          if (enemy.alive) {
            drawEnemy(ctx, enemy.x, enemy.y, enemy.type);
          }
        });

        // Draw bullets
        bulletsRef.current.forEach((bullet) => {
          drawBullet(ctx, bullet.x, bullet.y);
        });

        // Draw player
        drawPlayer(ctx, playerXRef.current, GAME_HEIGHT - 65);

        // Draw touch zones (subtle hints)
        ctx.fillStyle = "rgba(34, 211, 238, 0.03)";
        ctx.fillRect(0, 0, GAME_WIDTH * 0.35, GAME_HEIGHT);
        ctx.fillRect(GAME_WIDTH * 0.65, 0, GAME_WIDTH * 0.35, GAME_HEIGHT);
      }

      // Draw idle/gameover screens
      if (gameStateRef.current === "idle" || gameStateRef.current === "gameover") {
        // Darken background
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Draw some enemies for decoration
        drawEnemy(ctx, GAME_WIDTH / 2 - 100, 150, "threat");
        drawEnemy(ctx, GAME_WIDTH / 2 - 30, 150, "vulnerability");
        drawEnemy(ctx, GAME_WIDTH / 2 + 40, 150, "risk");

        // Draw player
        drawPlayer(ctx, GAME_WIDTH / 2 - PLAYER_WIDTH / 2, GAME_HEIGHT - 120);

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (gameStateRef.current === "idle") {
          // Title
          ctx.fillStyle = COLORS.playerAccent;
          ctx.font = "bold 48px monospace";
          ctx.fillText("GRC INVADERS", GAME_WIDTH / 2, 80);

          // Subtitle
          ctx.fillStyle = COLORS.text;
          ctx.font = "18px monospace";
          ctx.fillText("Verteidige dein System gegen Risiken!", GAME_WIDTH / 2, 120);

          // Legend
          ctx.font = "14px monospace";
          ctx.fillStyle = COLORS.threat;
          ctx.fillText("Threat (30pt)", GAME_WIDTH / 2 - 150, 220);
          ctx.fillStyle = COLORS.vulnerability;
          ctx.fillText("Vulnerability (20pt)", GAME_WIDTH / 2, 220);
          ctx.fillStyle = COLORS.risk;
          ctx.fillText("Risk (10pt)", GAME_WIDTH / 2 + 150, 220);

          // Controls
          ctx.fillStyle = COLORS.textMuted;
          ctx.font = "14px monospace";
          ctx.fillText("← → oder A/D zum Bewegen", GAME_WIDTH / 2, 280);
          ctx.fillText("LEERTASTE oder Mitte tippen zum Schießen", GAME_WIDTH / 2, 305);

          // Start prompt
          ctx.fillStyle = COLORS.playerAccent;
          ctx.font = "bold 20px monospace";
          const pulse = Math.sin(Date.now() / 300) * 0.3 + 0.7;
          ctx.globalAlpha = pulse;
          ctx.fillText("TIPPEN ODER SPACE ZUM STARTEN", GAME_WIDTH / 2, 380);
          ctx.globalAlpha = 1;
        } else {
          // Game over
          ctx.fillStyle = COLORS.risk;
          ctx.font = "bold 42px monospace";
          ctx.fillText("SYSTEM COMPROMISED!", GAME_WIDTH / 2, 250);

          ctx.fillStyle = COLORS.text;
          ctx.font = "bold 28px monospace";
          ctx.fillText(`Score: ${scoreRef.current}`, GAME_WIDTH / 2, 310);

          ctx.fillStyle = COLORS.textMuted;
          ctx.font = "20px monospace";
          ctx.fillText(`Wave: ${waveRef.current}`, GAME_WIDTH / 2, 350);

          if (scoreRef.current >= highScore && scoreRef.current > 0) {
            ctx.fillStyle = "#fbbf24";
            ctx.font = "bold 18px monospace";
            ctx.fillText("🏆 NEUER HIGHSCORE! 🏆", GAME_WIDTH / 2, 400);
          }

          ctx.fillStyle = COLORS.playerAccent;
          ctx.font = "bold 18px monospace";
          const pulse = Math.sin(Date.now() / 300) * 0.3 + 0.7;
          ctx.globalAlpha = pulse;
          ctx.fillText("TIPPEN ZUM NEUSTARTEN", GAME_WIDTH / 2, 460);
          ctx.globalAlpha = 1;
        }
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [highScore, initEnemies]);

  // Animate displayed score
  useEffect(() => {
    if (displayScore < score) {
      const timer = setTimeout(() => {
        setDisplayScore((prev) => Math.min(prev + 10, score));
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [displayScore, score]);

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-4 w-full" ref={containerRef}>
      {/* Score display */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-6 w-full max-w-[800px] px-2 text-xs sm:text-base font-mono font-bold">
        <span className="text-white">
          SCORE: <span className="text-[#22d3ee]">{displayScore.toString().padStart(5, "0")}</span>
        </span>
        <span className="text-[#22c55e]">WAVE {wave}</span>
        <span className="text-white/60">HI: {highScore.toString().padStart(5, "0")}</span>
      </div>

      {/* Lives */}
      <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-white/70">
        <span>LIVES:</span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-6 h-4 sm:w-8 sm:h-5 rounded ${i < lives ? "bg-[#22d3ee]" : "bg-[#22d3ee]/20"}`}
            />
          ))}
        </div>
      </div>

      {/* Game canvas */}
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        onClick={() => gameState !== "playing" && startGame()}
        className="rounded-xl border-2 sm:border-4 border-[#22d3ee]/30 cursor-pointer touch-none"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
        }}
      />

      {/* Controls hint */}
      <p className="text-xs text-white/50 font-mono text-center px-4">
        <span className="hidden sm:inline">← → / A D = Bewegen | SPACE = Schießen</span>
        <span className="sm:hidden">Links/Rechts tippen = Bewegen | Mitte = Schießen</span>
      </p>
    </div>
  );
}
