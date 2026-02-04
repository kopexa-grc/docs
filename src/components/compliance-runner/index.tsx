"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Game constants - larger for better gameplay
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_WIDTH = 56;
const PLAYER_HEIGHT = 42;
const ENEMY_WIDTH = 48;
const ENEMY_HEIGHT = 34;
const BULLET_SIZE = 10;
const PLAYER_SPEED = 6;
const BULLET_SPEED = 10;
const ENEMY_SPEED = 0.8;
const ENEMY_DROP = 20;

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

// Pixel art: Player (Kopexa Bot as a ship)
const PlayerShip = ({ size = "normal" }: { size?: "normal" | "small" }) => (
  <svg
    width={size === "small" ? 36 : PLAYER_WIDTH}
    height={size === "small" ? 27 : PLAYER_HEIGHT}
    viewBox="0 0 32 24"
    className="drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
  >
    {/* Ship body */}
    <rect x="12" y="0" width="8" height="4" fill="#22d3ee" />
    <rect x="8" y="4" width="16" height="4" fill="#0F263E" />
    <rect x="4" y="8" width="24" height="8" fill="#0F263E" />
    <rect x="8" y="10" width="16" height="4" fill="#1a3a5c" />
    {/* Shield emblem */}
    <rect x="14" y="11" width="4" height="2" fill="#22d3ee" />
    {/* Wings */}
    <rect x="0" y="16" width="8" height="4" fill="#1a3a5c" />
    <rect x="24" y="16" width="8" height="4" fill="#1a3a5c" />
    <rect x="4" y="16" width="24" height="8" fill="#0F263E" />
    {/* Engines */}
    <rect x="8" y="20" width="4" height="4" fill="#22d3ee" className="animate-pulse" />
    <rect x="20" y="20" width="4" height="4" fill="#22d3ee" className="animate-pulse" />
  </svg>
);

// Pixel art: Risk enemy (red threat)
const RiskEnemy = ({ type }: { type: Enemy["type"] }) => {
  const colors = {
    risk: { main: "#ef4444", dark: "#dc2626", glow: "rgba(239,68,68,0.4)" },
    vulnerability: { main: "#f97316", dark: "#ea580c", glow: "rgba(249,115,22,0.4)" },
    threat: { main: "#a855f7", dark: "#9333ea", glow: "rgba(168,85,247,0.4)" },
  };
  const { main, dark, glow } = colors[type];

  return (
    <svg
      width={ENEMY_WIDTH}
      height={ENEMY_HEIGHT}
      viewBox="0 0 28 20"
      style={{ filter: `drop-shadow(0 0 6px ${glow})` }}
    >
      {/* Body */}
      <rect x="8" y="0" width="12" height="4" fill={main} />
      <rect x="4" y="4" width="20" height="4" fill={main} />
      <rect x="0" y="8" width="28" height="8" fill={dark} />
      {/* Eyes */}
      <rect x="6" y="10" width="4" height="4" fill="white" />
      <rect x="18" y="10" width="4" height="4" fill="white" />
      <rect x="8" y="12" width="2" height="2" fill={main} />
      <rect x="20" y="12" width="2" height="2" fill={main} />
      {/* Legs/tentacles */}
      <rect x="2" y="16" width="4" height="4" fill={dark} />
      <rect x="10" y="16" width="4" height="4" fill={dark} />
      <rect x="18" y="16" width="4" height="4" fill={dark} />
      <rect x="22" y="16" width="4" height="4" fill={dark} />
    </svg>
  );
};

// Pixel art: UFO bonus
const BonusUFO = () => (
  <svg width="60" height="30" viewBox="0 0 40 20" className="drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]">
    <ellipse cx="20" cy="12" rx="18" ry="6" fill="#0F263E" />
    <ellipse cx="20" cy="10" rx="14" ry="4" fill="#1a3a5c" />
    <ellipse cx="20" cy="8" rx="8" ry="4" fill="#22d3ee" />
    <rect x="8" y="12" width="3" height="3" fill="#22c55e" className="animate-pulse" />
    <rect x="18" y="14" width="3" height="3" fill="#22c55e" className="animate-pulse" />
    <rect x="28" y="12" width="3" height="3" fill="#22c55e" className="animate-pulse" />
  </svg>
);

// Pixel art: Bullet (shield projectile)
const ShieldBullet = () => (
  <svg
    width={BULLET_SIZE}
    height={BULLET_SIZE * 2}
    viewBox="0 0 6 12"
    className="drop-shadow-[0_0_4px_rgba(34,197,94,0.8)]"
  >
    <rect x="1" y="0" width="4" height="4" fill="#22d3ee" />
    <rect x="0" y="4" width="6" height="4" fill="#22c55e" />
    <rect x="1" y="8" width="4" height="4" fill="#16a34a" />
  </svg>
);

export function ComplianceRunner() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover" | "win">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [playerX, setPlayerX] = useState(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [ufo, setUfo] = useState<UFO>({ x: -50, active: false, direction: 1 });
  const [enemyDirection, setEnemyDirection] = useState<1 | -1>(1);
  const [wave, setWave] = useState(1);
  const keysRef = useRef<Set<string>>(new Set());
  const lastShotRef = useRef(0);
  const bulletIdRef = useRef(0);
  const gameLoopRef = useRef<number | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem("kopexa-invaders-highscore");
    if (saved) setHighScore(Number.parseInt(saved, 10));
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
          x: 50 + col * (ENEMY_WIDTH + 15),
          y: 50 + row * (ENEMY_HEIGHT + 18),
          type: types[row % 3],
          alive: true,
        });
      }
    }
    return newEnemies;
  }, []);

  // Start game
  const startGame = useCallback(() => {
    setGameState("playing");
    setScore(0);
    setLives(3);
    setWave(1);
    setPlayerX(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
    setEnemies(initEnemies(1));
    setBullets([]);
    setEnemyDirection(1);
    setUfo({ x: -50, active: false, direction: 1 });
    // Focus game container for keyboard input
    gameContainerRef.current?.focus();
  }, [initEnemies]);

  // Handle input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "Space", " ", "a", "d", "A", "D"].includes(e.key)) {
        e.preventDefault();
        keysRef.current.add(e.key);
      }
      if (e.key === " " || e.code === "Space") {
        if (gameState === "idle" || gameState === "gameover" || gameState === "win") {
          startGame();
        }
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
  }, [gameState, startGame]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const gameLoop = () => {
      const now = Date.now();

      // Player movement (arrow keys and WASD)
      if (keysRef.current.has("ArrowLeft") || keysRef.current.has("a") || keysRef.current.has("A")) {
        setPlayerX((x) => Math.max(0, x - PLAYER_SPEED));
      }
      if (keysRef.current.has("ArrowRight") || keysRef.current.has("d") || keysRef.current.has("D")) {
        setPlayerX((x) => Math.min(GAME_WIDTH - PLAYER_WIDTH, x + PLAYER_SPEED));
      }

      // Shooting
      if ((keysRef.current.has("Space") || keysRef.current.has(" ")) && now - lastShotRef.current > 250) {
        lastShotRef.current = now;
        setBullets((b) => [
          ...b,
          { id: bulletIdRef.current++, x: playerX + PLAYER_WIDTH / 2 - BULLET_SIZE / 2, y: GAME_HEIGHT - 70 },
        ]);
      }

      // Move bullets
      setBullets((b) => b.map((bullet) => ({ ...bullet, y: bullet.y - BULLET_SPEED })).filter((bullet) => bullet.y > -BULLET_SIZE));

      // Move enemies
      setEnemies((prevEnemies) => {
        let shouldDrop = false;
        let newDirection = enemyDirection;

        const moved = prevEnemies.map((e) => {
          if (!e.alive) return e;
          // Gentle speed increase: only +5% per wave (was +15%)
          const newX = e.x + ENEMY_SPEED * enemyDirection * (1 + wave * 0.05);
          if (newX <= 0 || newX >= GAME_WIDTH - ENEMY_WIDTH) {
            shouldDrop = true;
            newDirection = enemyDirection === 1 ? -1 : 1;
          }
          return { ...e, x: newX };
        });

        if (shouldDrop) {
          setEnemyDirection(newDirection as 1 | -1);
          return moved.map((e) => ({ ...e, y: e.y + ENEMY_DROP }));
        }
        return moved;
      });

      // UFO logic
      setUfo((u) => {
        if (!u.active && Math.random() < 0.003) {
          return { x: u.direction === 1 ? -60 : GAME_WIDTH + 60, active: true, direction: u.direction === 1 ? -1 : 1 };
        }
        if (u.active) {
          const newX = u.x + 4 * u.direction;
          if (newX < -60 || newX > GAME_WIDTH + 60) {
            return { ...u, active: false };
          }
          return { ...u, x: newX };
        }
        return u;
      });

      // Check bullet-enemy collisions
      setBullets((prevBullets) => {
        const remainingBullets = [...prevBullets];

        setEnemies((prevEnemies) =>
          prevEnemies.map((enemy) => {
            if (!enemy.alive) return enemy;

            const hitIndex = remainingBullets.findIndex(
              (b) =>
                b.x < enemy.x + ENEMY_WIDTH &&
                b.x + BULLET_SIZE > enemy.x &&
                b.y < enemy.y + ENEMY_HEIGHT &&
                b.y + BULLET_SIZE * 2 > enemy.y
            );

            if (hitIndex !== -1) {
              remainingBullets.splice(hitIndex, 1);
              const points = enemy.type === "threat" ? 30 : enemy.type === "vulnerability" ? 20 : 10;
              setScore((s) => s + points);
              return { ...enemy, alive: false };
            }
            return enemy;
          })
        );

        // Check UFO hit
        if (ufo.active) {
          const ufoHitIndex = remainingBullets.findIndex(
            (b) => b.x < ufo.x + 60 && b.x + BULLET_SIZE > ufo.x && b.y < 40 && b.y + BULLET_SIZE * 2 > 10
          );
          if (ufoHitIndex !== -1) {
            remainingBullets.splice(ufoHitIndex, 1);
            setScore((s) => s + 100);
            setUfo((u) => ({ ...u, active: false }));
          }
        }

        return remainingBullets;
      });

      // Check if enemies reached player
      const lowestEnemy = enemies.filter((e) => e.alive).reduce((max, e) => Math.max(max, e.y), 0);
      if (lowestEnemy > GAME_HEIGHT - 100) {
        setLives(0);
      }

      // Check win condition
      if (enemies.filter((e) => e.alive).length === 0) {
        const nextWave = wave + 1;
        setWave(nextWave);
        setEnemies(initEnemies(nextWave));
        setEnemyDirection(1);
        setScore((s) => s + 50 * wave); // Bonus for clearing wave
      }

      // Check game over
      if (lives <= 0) {
        setGameState("gameover");
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem("kopexa-invaders-highscore", score.toString());
        }
        return;
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, playerX, enemies, enemyDirection, wave, lives, score, highScore, ufo, initEnemies]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Header with score and controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-[800px] gap-4 px-4">
        {/* Score display */}
        <div className="flex gap-6 text-base font-mono font-bold">
          <span className="text-[#0F263E] dark:text-white">
            SCORE: <span className="text-[#22d3ee]">{score.toString().padStart(5, '0')}</span>
          </span>
          <span className="text-[#22c55e]">WAVE {wave}</span>
        </div>

        {/* Lives */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono text-[#0F263E]/70 dark:text-white/70">LIVES:</span>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`w-9 h-7 ${i < lives ? 'opacity-100' : 'opacity-20'}`}>
                <PlayerShip size="small" />
              </div>
            ))}
          </div>
        </div>

        {/* High score */}
        <div className="text-sm font-mono text-[#0F263E]/60 dark:text-white/60">
          HI-SCORE: {highScore.toString().padStart(5, '0')}
        </div>
      </div>

      {/* Game area */}
      <div
        ref={gameContainerRef}
        onClick={() => (gameState !== "playing" ? startGame() : null)}
        onKeyDown={(e) => e.code === "Space" && gameState !== "playing" && startGame()}
        role="button"
        tabIndex={0}
        className="relative overflow-hidden rounded-xl border-4 border-[#0F263E]/30 dark:border-[#22d3ee]/30 cursor-pointer select-none bg-gradient-to-b from-[#0a1929] via-[#0F263E] to-[#1a3a5c] shadow-2xl shadow-[#0F263E]/50"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT, maxWidth: "100%" }}
      >
        {/* Animated stars background */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: i % 3 === 0 ? 2 : 1,
              height: i % 3 === 0 ? 2 : 1,
              left: `${(i * 37 + i * 13) % 100}%`,
              top: `${(i * 23 + i * 7) % 100}%`,
              opacity: 0.3 + (i % 5) * 0.1,
              animationDelay: `${i * 100}ms`,
              animationDuration: `${2000 + i * 100}ms`,
            }}
          />
        ))}

        {/* UFO */}
        {ufo.active && (
          <div className="absolute transition-transform" style={{ left: ufo.x, top: 15 }}>
            <BonusUFO />
          </div>
        )}

        {/* Enemies */}
        {enemies
          .filter((e) => e.alive)
          .map((enemy) => (
            <div key={enemy.id} className="absolute" style={{ left: enemy.x, top: enemy.y }}>
              <RiskEnemy type={enemy.type} />
            </div>
          ))}

        {/* Bullets */}
        {bullets.map((bullet) => (
          <div key={bullet.id} className="absolute" style={{ left: bullet.x, top: bullet.y }}>
            <ShieldBullet />
          </div>
        ))}

        {/* Player */}
        <div className="absolute transition-transform duration-75" style={{ left: playerX, bottom: 25 }}>
          <PlayerShip />
        </div>

        {/* Game states */}
        {gameState === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white backdrop-blur-sm">
            <h3 className="text-4xl font-bold mb-3 text-[#22d3ee] drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
              GRC INVADERS
            </h3>
            <p className="text-lg mb-4 opacity-90">Verteidige dein System gegen Risiken!</p>

            {/* Legend */}
            <div className="flex gap-6 mb-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-4 bg-[#a855f7] rounded" />
                <span>Threat (30pt)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-4 bg-[#f97316] rounded" />
                <span>Vulnerability (20pt)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-4 bg-[#ef4444] rounded" />
                <span>Risk (10pt)</span>
              </div>
            </div>

            <div className="text-sm opacity-70 mb-6 text-center space-y-1">
              <p>← → oder A/D zum Bewegen</p>
              <p>LEERTASTE zum Schießen</p>
            </div>
            <button
              type="button"
              className="px-8 py-3 bg-[#22d3ee] text-[#0F263E] font-bold rounded-lg hover:bg-[#22d3ee]/90 transition-all hover:scale-105 shadow-lg shadow-[#22d3ee]/30"
              onClick={startGame}
            >
              SPIEL STARTEN
            </button>
          </div>
        )}

        {gameState === "gameover" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white backdrop-blur-sm">
            <h3 className="text-3xl font-bold mb-4 text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
              SYSTEM COMPROMISED!
            </h3>
            <p className="text-2xl mb-2 font-mono">Score: <span className="text-[#22d3ee]">{score}</span></p>
            <p className="text-lg opacity-70 mb-2">Wave: {wave}</p>
            {score >= highScore && score > 0 && (
              <p className="text-lg text-yellow-400 mb-4 animate-pulse">🏆 NEUER HIGHSCORE! 🏆</p>
            )}
            <button
              type="button"
              className="px-8 py-3 bg-[#22d3ee] text-[#0F263E] font-bold rounded-lg hover:bg-[#22d3ee]/90 transition-all hover:scale-105 shadow-lg shadow-[#22d3ee]/30 mt-4"
              onClick={startGame}
            >
              NOCHMAL SPIELEN
            </button>
          </div>
        )}
      </div>

      <p className="text-sm text-[#0F263E]/60 dark:text-white/60 font-mono">
        ← → / A D = Bewegen | SPACE = Schießen
      </p>
    </div>
  );
}
