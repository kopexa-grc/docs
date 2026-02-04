"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Game constants
const GAME_WIDTH = 400;
const GAME_HEIGHT = 500;
const PLAYER_WIDTH = 32;
const PLAYER_HEIGHT = 24;
const ENEMY_WIDTH = 28;
const ENEMY_HEIGHT = 20;
const BULLET_SIZE = 6;
const PLAYER_SPEED = 8;
const BULLET_SPEED = 10;
const ENEMY_SPEED = 1;
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
const PlayerShip = () => (
  <svg width={PLAYER_WIDTH} height={PLAYER_HEIGHT} viewBox="0 0 32 24">
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
    risk: { main: "#ef4444", dark: "#dc2626" },
    vulnerability: { main: "#f97316", dark: "#ea580c" },
    threat: { main: "#a855f7", dark: "#9333ea" },
  };
  const { main, dark } = colors[type];

  return (
    <svg width={ENEMY_WIDTH} height={ENEMY_HEIGHT} viewBox="0 0 28 20">
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
  <svg width="40" height="20" viewBox="0 0 40 20">
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
  <svg width={BULLET_SIZE} height={BULLET_SIZE * 2} viewBox="0 0 6 12">
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

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem("kopexa-invaders-highscore");
    if (saved) setHighScore(Number.parseInt(saved, 10));
  }, []);

  // Initialize enemies
  const initEnemies = useCallback((waveNum: number) => {
    const newEnemies: Enemy[] = [];
    const rows = Math.min(3 + Math.floor(waveNum / 2), 5);
    const cols = Math.min(6 + waveNum, 8);
    const types: Enemy["type"][] = ["threat", "vulnerability", "risk"];

    let id = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        newEnemies.push({
          id: id++,
          x: 30 + col * (ENEMY_WIDTH + 10),
          y: 40 + row * (ENEMY_HEIGHT + 12),
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
  }, [initEnemies]);

  // Handle input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "Space", " "].includes(e.key)) {
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

      // Player movement
      if (keysRef.current.has("ArrowLeft")) {
        setPlayerX((x) => Math.max(0, x - PLAYER_SPEED));
      }
      if (keysRef.current.has("ArrowRight")) {
        setPlayerX((x) => Math.min(GAME_WIDTH - PLAYER_WIDTH, x + PLAYER_SPEED));
      }

      // Shooting
      if ((keysRef.current.has("Space") || keysRef.current.has(" ")) && now - lastShotRef.current > 300) {
        lastShotRef.current = now;
        setBullets((b) => [
          ...b,
          { id: bulletIdRef.current++, x: playerX + PLAYER_WIDTH / 2 - BULLET_SIZE / 2, y: GAME_HEIGHT - 60 },
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
          const newX = e.x + ENEMY_SPEED * enemyDirection * (1 + wave * 0.2);
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
        if (!u.active && Math.random() < 0.002) {
          return { x: u.direction === 1 ? -50 : GAME_WIDTH + 50, active: true, direction: u.direction === 1 ? -1 : 1 };
        }
        if (u.active) {
          const newX = u.x + 3 * u.direction;
          if (newX < -50 || newX > GAME_WIDTH + 50) {
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
            (b) => b.x < ufo.x + 40 && b.x + BULLET_SIZE > ufo.x && b.y < 30 && b.y + BULLET_SIZE * 2 > 10
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
      if (lowestEnemy > GAME_HEIGHT - 80) {
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
    <div className="flex flex-col items-center gap-4">
      {/* Score display */}
      <div className="flex justify-between w-full max-w-[400px] px-2 text-sm font-mono">
        <span className="text-[#0F263E] dark:text-white">Score: {score}</span>
        <span className="text-[#22d3ee]">Wave: {wave}</span>
        <span className="text-[#0F263E]/60 dark:text-white/60">Best: {highScore}</span>
      </div>

      {/* Lives */}
      <div className="flex gap-2">
        {[...Array(lives)].map((_, i) => (
          <div key={i} className="w-6 h-4">
            <PlayerShip />
          </div>
        ))}
      </div>

      {/* Game area */}
      <div
        onClick={() => (gameState !== "playing" ? startGame() : null)}
        onKeyDown={(e) => e.code === "Space" && gameState !== "playing" && startGame()}
        role="button"
        tabIndex={0}
        className="relative overflow-hidden rounded-lg border-2 border-[#0F263E]/20 dark:border-white/20 cursor-pointer select-none bg-gradient-to-b from-[#0F263E] to-[#1a3a5c]"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT, maxWidth: "100%" }}
      >
        {/* Stars background */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 23) % 100}%`,
            }}
          />
        ))}

        {/* UFO */}
        {ufo.active && (
          <div className="absolute" style={{ left: ufo.x, top: 10 }}>
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
        <div className="absolute" style={{ left: playerX, bottom: 20 }}>
          <PlayerShip />
        </div>

        {/* Game states */}
        {gameState === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white">
            <h3 className="text-xl font-bold mb-2">GRC Invaders</h3>
            <p className="text-sm mb-2 opacity-80 text-center px-4">Verteidige dein System gegen Risiken!</p>
            <div className="text-xs opacity-60 mb-4 text-center">
              <p>← → Bewegen</p>
              <p>Leertaste = Schießen</p>
            </div>
            <p className="text-xs animate-pulse">Klick oder Leertaste zum Starten</p>
          </div>
        )}

        {gameState === "gameover" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white">
            <h3 className="text-xl font-bold mb-2 text-red-400">System Compromised!</h3>
            <p className="text-lg mb-1">Score: {score}</p>
            <p className="text-sm opacity-60">Wave: {wave}</p>
            {score >= highScore && score > 0 && <p className="text-sm text-yellow-400 mt-2">Neuer Highscore!</p>}
            <p className="text-xs animate-pulse mt-4">Klick zum Neustarten</p>
          </div>
        )}
      </div>

      <p className="text-xs text-[#0F263E]/50 dark:text-white/50">← → Bewegen | Leertaste = Schießen</p>
    </div>
  );
}
