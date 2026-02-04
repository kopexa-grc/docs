// src/components/footer/pixel-animation.tsx
"use client";

import { useEffect, useState } from "react";

// Simple cloud shape
const Cloud = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 32" className={className} fill="currentColor">
    <rect x="16" y="16" width="8" height="8" />
    <rect x="24" y="8" width="8" height="8" />
    <rect x="24" y="16" width="8" height="8" />
    <rect x="32" y="8" width="8" height="8" />
    <rect x="32" y="16" width="8" height="8" />
    <rect x="40" y="16" width="8" height="8" />
    <rect x="8" y="24" width="48" height="8" />
  </svg>
);

// Pixel grass
const Grass = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 16" className={className} fill="currentColor">
    <rect x="4" y="8" width="4" height="8" />
    <rect x="8" y="4" width="4" height="12" />
    <rect x="12" y="8" width="4" height="8" />
    <rect x="20" y="6" width="4" height="10" />
    <rect x="24" y="8" width="4" height="8" />
  </svg>
);

// Little shield icon (compliance themed) - Kopexa branded
const Shield = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 32" className={className}>
    <rect x="4" y="0" width="16" height="4" fill="#0F263E" />
    <rect x="0" y="4" width="24" height="4" fill="#0F263E" />
    <rect x="0" y="8" width="24" height="4" fill="#1a3a5c" />
    <rect x="2" y="12" width="20" height="4" fill="#1a3a5c" />
    <rect x="4" y="16" width="16" height="4" fill="#2d5a87" />
    <rect x="6" y="20" width="12" height="4" fill="#2d5a87" />
    <rect x="8" y="24" width="8" height="4" fill="#4a7fb3" />
    <rect x="10" y="28" width="4" height="4" fill="#22d3ee" />
    {/* Checkmark on shield */}
    <rect x="7" y="10" width="3" height="3" fill="#22d3ee" />
    <rect x="10" y="13" width="3" height="3" fill="#22d3ee" />
    <rect x="13" y="7" width="3" height="3" fill="#22d3ee" />
  </svg>
);

// Pixel tree - with brand-tinted leaves
const Tree = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 48" className={className}>
    {/* Leaves - gradient from brand teal to green */}
    <rect x="8" y="0" width="16" height="4" fill="#0d9488" />
    <rect x="4" y="4" width="24" height="4" fill="#0f766e" />
    <rect x="2" y="8" width="28" height="4" fill="#115e59" />
    <rect x="4" y="12" width="24" height="4" fill="#134e4a" />
    <rect x="0" y="16" width="32" height="4" fill="#1a3a5c" />
    <rect x="2" y="20" width="28" height="4" fill="#0F263E" />
    <rect x="4" y="24" width="24" height="4" fill="#1a3a5c" />
    <rect x="6" y="28" width="20" height="4" fill="#0F263E" />
    {/* Trunk */}
    <rect x="12" y="32" width="8" height="16" fill="#78350f" />
  </svg>
);

// Little robot character - Kopexa Bot
const Robot = ({ frame, className }: { frame: number; className?: string }) => (
  <svg viewBox="0 0 32 40" className={className}>
    {/* Antenna with glowing tip */}
    <rect x="14" y="0" width="4" height="4" fill="#22d3ee" className="animate-pulse" />
    <rect x="12" y="4" width="8" height="4" fill="#0F263E" />
    {/* Head */}
    <rect x="8" y="8" width="16" height="12" fill="#0F263E" />
    <rect x="10" y="10" width="4" height="4" fill="#22d3ee" />
    <rect x="18" y="10" width="4" height="4" fill="#22d3ee" />
    <rect x="12" y="16" width="8" height="2" fill="#22d3ee" />
    {/* Body */}
    <rect x="6" y="20" width="20" height="12" fill="#0F263E" />
    <rect x="10" y="22" width="12" height="8" fill="#1a3a5c" />
    {/* Kopexa "K" on chest */}
    <rect x="14" y="23" width="2" height="6" fill="#22d3ee" />
    <rect x="16" y="25" width="2" height="2" fill="#22d3ee" />
    <rect x="18" y="23" width="2" height="2" fill="#22d3ee" />
    <rect x="18" y="27" width="2" height="2" fill="#22d3ee" />
    {/* Status lights */}
    <rect x="11" y="24" width="2" height="2" fill={frame === 0 ? "#22c55e" : "#0F263E"} />
    {/* Legs - animated */}
    {frame === 0 ? (
      <>
        <rect x="8" y="32" width="6" height="8" fill="#1a3a5c" />
        <rect x="18" y="32" width="6" height="8" fill="#1a3a5c" />
      </>
    ) : (
      <>
        <rect x="6" y="32" width="6" height="8" fill="#1a3a5c" />
        <rect x="20" y="32" width="6" height="8" fill="#1a3a5c" />
      </>
    )}
  </svg>
);

// Bird
const Bird = ({ frame, className }: { frame: number; className?: string }) => (
  <svg viewBox="0 0 16 12" className={className} fill="currentColor">
    <rect x="6" y="4" width="4" height="4" />
    <rect x="10" y="4" width="4" height="2" />
    {frame === 0 ? (
      <>
        <rect x="2" y="2" width="4" height="2" />
        <rect x="4" y="4" width="2" height="2" />
      </>
    ) : (
      <>
        <rect x="2" y="6" width="4" height="2" />
        <rect x="4" y="4" width="2" height="2" />
      </>
    )}
  </svg>
);

// Document/Paper icon - Kopexa branded
const Document = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 28" className={className}>
    <rect x="0" y="0" width="16" height="28" fill="#f8fafc" />
    <rect x="16" y="4" width="4" height="24" fill="#e2e8f0" />
    <rect x="12" y="0" width="4" height="4" fill="#e2e8f0" />
    {/* Text lines in brand color */}
    <rect x="4" y="8" width="8" height="2" fill="#0F263E" />
    <rect x="4" y="12" width="10" height="2" fill="#1a3a5c" />
    <rect x="4" y="16" width="6" height="2" fill="#0F263E" />
    <rect x="4" y="20" width="10" height="2" fill="#1a3a5c" />
  </svg>
);

// Checkmark
const Checkmark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <rect x="0" y="0" width="24" height="24" rx="4" fill="#22c55e" />
    <rect x="4" y="12" width="4" height="4" fill="white" />
    <rect x="8" y="14" width="4" height="4" fill="white" />
    <rect x="12" y="10" width="4" height="4" fill="white" />
    <rect x="16" y="6" width="4" height="4" fill="white" />
  </svg>
);

// UFO - War of the Worlds style with Kopexa brand color
const UFO = ({ beamFrame, className }: { beamFrame: number; className?: string }) => (
  <svg viewBox="0 0 48 40" className={className}>
    {/* Tractor beam - pulsating green/cyan */}
    <polygon
      points="12,20 36,20 42,40 6,40"
      fill={beamFrame === 0 ? "#22d3ee50" : "#a5f3fc40"}
      className="animate-pulse"
    />
    <polygon
      points="16,20 32,20 38,40 10,40"
      fill={beamFrame === 0 ? "#22d3ee30" : "#a5f3fc25"}
    />
    {/* UFO body - Kopexa brand dark blue #0F263E */}
    <ellipse cx="24" cy="14" rx="20" ry="6" fill="#0F263E" />
    <ellipse cx="24" cy="12" rx="16" ry="4" fill="#1a3a5c" />
    {/* Dome - lighter brand tones */}
    <ellipse cx="24" cy="10" rx="8" ry="5" fill="#2d5a87" />
    <ellipse cx="24" cy="8" rx="6" ry="3" fill="#4a7fb3" />
    {/* Glowing window */}
    <ellipse cx="24" cy="8" rx="3" ry="1.5" fill="#22d3ee" className="animate-pulse" />
    {/* Lights - alternating */}
    <rect x="8" y="12" width="3" height="3" fill={beamFrame === 0 ? "#22d3ee" : "#0F263E"} />
    <rect x="16" y="14" width="3" height="3" fill={beamFrame === 0 ? "#0F263E" : "#22d3ee"} />
    <rect x="24" y="14" width="3" height="3" fill={beamFrame === 0 ? "#22d3ee" : "#0F263E"} />
    <rect x="32" y="14" width="3" height="3" fill={beamFrame === 0 ? "#0F263E" : "#22d3ee"} />
    <rect x="38" y="12" width="3" height="3" fill={beamFrame === 0 ? "#22d3ee" : "#0F263E"} />
  </svg>
);

// Running person (panicked) - Kopexa brand styled
const RunningPerson = ({ frame, className }: { frame: number; className?: string }) => (
  <svg viewBox="0 0 16 24" className={className}>
    {/* Head */}
    <rect x="6" y="0" width="4" height="4" fill="#0F263E" />
    {/* Body - with Kopexa shirt */}
    <rect x="6" y="4" width="4" height="8" fill="#1a3a5c" />
    <rect x="7" y="5" width="2" height="2" fill="#22d3ee" /> {/* Logo on shirt */}
    {/* Arms - waving in panic */}
    {frame === 0 ? (
      <>
        <rect x="2" y="4" width="4" height="2" fill="#0F263E" />
        <rect x="10" y="6" width="4" height="2" fill="#0F263E" />
      </>
    ) : (
      <>
        <rect x="2" y="6" width="4" height="2" fill="#0F263E" />
        <rect x="10" y="4" width="4" height="2" fill="#0F263E" />
      </>
    )}
    {/* Legs - running */}
    {frame === 0 ? (
      <>
        <rect x="4" y="12" width="3" height="6" fill="#2d5a87" />
        <rect x="9" y="12" width="3" height="6" fill="#2d5a87" />
        <rect x="2" y="18" width="3" height="4" fill="#0F263E" />
        <rect x="11" y="18" width="3" height="4" fill="#0F263E" />
      </>
    ) : (
      <>
        <rect x="6" y="12" width="3" height="6" fill="#2d5a87" />
        <rect x="7" y="12" width="3" height="6" fill="#2d5a87" />
        <rect x="4" y="18" width="3" height="4" fill="#0F263E" />
        <rect x="9" y="18" width="3" height="4" fill="#0F263E" />
      </>
    )}
  </svg>
);

// Scared bird (flying away fast) - with brand accent
const ScaredBird = ({ frame, className }: { frame: number; className?: string }) => (
  <svg viewBox="0 0 16 12" className={className}>
    <rect x="6" y="4" width="4" height="4" fill="#0F263E" />
    <rect x="10" y="4" width="4" height="2" fill="#1a3a5c" />
    {/* Wings flapping frantically */}
    {frame === 0 ? (
      <>
        <rect x="0" y="0" width="6" height="2" fill="#0F263E" />
        <rect x="2" y="2" width="4" height="2" fill="#1a3a5c" />
      </>
    ) : (
      <>
        <rect x="0" y="6" width="6" height="2" fill="#0F263E" />
        <rect x="2" y="4" width="4" height="2" fill="#1a3a5c" />
      </>
    )}
  </svg>
);

export function PixelAnimation() {
  const [robotPosition, setRobotPosition] = useState(0);
  const [frame, setFrame] = useState(0);
  const [bird1Pos, setBird1Pos] = useState(20);
  const [bird2Pos, setBird2Pos] = useState(60);
  const [ufoPosition, setUfoPosition] = useState(110); // Start off-screen right
  const [scaredBird1, setScaredBird1] = useState(-20);
  const [scaredBird2, setScaredBird2] = useState(-30);
  const [panicPerson1, setPanicPerson1] = useState(45);
  const [panicPerson2, setPanicPerson2] = useState(55);

  useEffect(() => {
    const interval = setInterval(() => {
      setRobotPosition((prev) => (prev + 0.5) % 100);
      setBird1Pos((prev) => (prev + 0.8) % 120);
      setBird2Pos((prev) => (prev + 0.6) % 120);
      setFrame((prev) => (prev + 1) % 2);

      // UFO moves slowly from right to left
      setUfoPosition((prev) => {
        const next = prev - 0.15;
        return next < -20 ? 110 : next;
      });

      // Scared birds fly away fast when UFO is near
      setScaredBird1((prev) => {
        if (ufoPosition < 70 && ufoPosition > 20) {
          return Math.min(prev + 1.5, 120);
        }
        return ufoPosition > 70 ? -20 : prev;
      });
      setScaredBird2((prev) => {
        if (ufoPosition < 75 && ufoPosition > 25) {
          return Math.min(prev + 1.2, 120);
        }
        return ufoPosition > 75 ? -30 : prev;
      });

      // Panicked people run when UFO is overhead
      setPanicPerson1((prev) => {
        if (ufoPosition < 60 && ufoPosition > 20) {
          return Math.max(prev - 0.8, -10);
        }
        return ufoPosition > 60 ? 45 : prev;
      });
      setPanicPerson2((prev) => {
        if (ufoPosition < 65 && ufoPosition > 25) {
          return Math.min(prev + 0.6, 110);
        }
        return ufoPosition > 65 ? 55 : prev;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [ufoPosition]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Clouds scattered throughout - positioned relative to full footer */}
      <Cloud className="absolute top-[15%] left-[5%] w-20 h-10 text-primary-300/30 dark:text-primary-600/20 animate-pulse" />
      <Cloud className="absolute top-[25%] left-[25%] w-14 h-7 text-primary-300/25 dark:text-primary-600/15" />
      <Cloud className="absolute top-[10%] left-[45%] w-24 h-12 text-primary-300/30 dark:text-primary-600/20" />
      <Cloud className="absolute top-[20%] left-[70%] w-16 h-8 text-primary-300/20 dark:text-primary-600/15" />
      <Cloud className="absolute top-[30%] left-[85%] w-18 h-9 text-primary-300/25 dark:text-primary-600/18" />
      <Cloud className="absolute top-[40%] left-[15%] w-12 h-6 text-primary-400/20 dark:text-primary-500/15" />
      <Cloud className="absolute top-[35%] left-[60%] w-16 h-8 text-primary-400/25 dark:text-primary-500/18" />

      {/* Flying birds - higher in the sky */}
      <div
        className="absolute top-[20%] transition-all duration-150"
        style={{ left: `${bird1Pos - 20}%` }}
      >
        <Bird frame={frame} className="w-4 h-3 text-primary-700/40 dark:text-primary-300/30" />
      </div>
      <div
        className="absolute top-[35%] transition-all duration-150"
        style={{ left: `${bird2Pos - 20}%` }}
      >
        <Bird frame={(frame + 1) % 2} className="w-3 h-2 text-primary-600/35 dark:text-primary-400/25" />
      </div>

      {/* UFO - War of the Worlds! */}
      <div
        className="absolute top-[8%] transition-all duration-300 ease-linear z-20"
        style={{ left: `${ufoPosition}%` }}
      >
        <UFO beamFrame={frame} className="w-16 h-14" />
      </div>

      {/* Scared birds fleeing from UFO */}
      <div
        className="absolute top-[15%] transition-all duration-100 opacity-70"
        style={{ left: `${scaredBird1}%` }}
      >
        <ScaredBird frame={frame} className="w-4 h-3" />
      </div>
      <div
        className="absolute top-[22%] transition-all duration-100 opacity-60"
        style={{ left: `${scaredBird2}%` }}
      >
        <ScaredBird frame={(frame + 1) % 2} className="w-3 h-2" />
      </div>

      {/* Panicked people running away */}
      <div
        className="absolute bottom-9 transition-all duration-150 opacity-80"
        style={{ left: `${panicPerson1}%` }}
      >
        <RunningPerson frame={frame} className="w-4 h-6" />
      </div>
      <div
        className="absolute bottom-9 transition-all duration-150 opacity-70"
        style={{ left: `${panicPerson2}%` }}
      >
        <RunningPerson frame={(frame + 1) % 2} className="w-4 h-6" />
      </div>

      {/* Ground - at very bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-primary-400/80 dark:bg-primary-700/80" />
      <div className="absolute bottom-6 left-0 right-0 h-3 bg-primary-500/60 dark:bg-primary-600/60" />

      {/* Trees */}
      <Tree className="absolute bottom-6 left-[3%] w-8 h-12 opacity-70" />
      <Tree className="absolute bottom-6 left-[92%] w-10 h-14 opacity-60" />

      {/* Grass patches */}
      <Grass className="absolute bottom-6 left-[12%] w-8 h-4 text-[#0F263E]/60" />
      <Grass className="absolute bottom-6 left-[22%] w-6 h-3 text-[#1a3a5c]/50" />
      <Grass className="absolute bottom-6 left-[35%] w-7 h-4 text-[#0F263E]/60" />
      <Grass className="absolute bottom-6 left-[50%] w-8 h-4 text-[#1a3a5c]/60" />
      <Grass className="absolute bottom-6 left-[65%] w-6 h-3 text-[#0F263E]/50" />
      <Grass className="absolute bottom-6 left-[78%] w-8 h-4 text-[#1a3a5c]/60" />
      <Grass className="absolute bottom-6 left-[88%] w-5 h-3 text-[#0F263E]/50" />

      {/* Compliance themed objects */}
      <Shield className="absolute bottom-8 left-[18%] w-5 h-6 opacity-60" />
      <Document className="absolute bottom-9 left-[42%] w-4 h-5 opacity-70" />
      <Checkmark className="absolute bottom-8 left-[58%] w-5 h-5 opacity-70" />
      <Shield className="absolute bottom-10 left-[75%] w-4 h-5 opacity-50" />

      {/* Walking robot - Kopexa Bot */}
      <div
        className="absolute bottom-8 transition-transform duration-150 ease-linear"
        style={{ left: `${robotPosition}%` }}
      >
        <Robot frame={frame} className="w-8 h-10 opacity-90" />
      </div>
    </div>
  );
}
