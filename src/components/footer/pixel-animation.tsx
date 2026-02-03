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

// Little shield icon (compliance themed)
const Shield = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 32" className={className} fill="currentColor">
    <rect x="4" y="0" width="16" height="4" />
    <rect x="0" y="4" width="24" height="4" />
    <rect x="0" y="8" width="24" height="4" />
    <rect x="2" y="12" width="20" height="4" />
    <rect x="4" y="16" width="16" height="4" />
    <rect x="6" y="20" width="12" height="4" />
    <rect x="8" y="24" width="8" height="4" />
    <rect x="10" y="28" width="4" height="4" />
  </svg>
);

// Pixel tree
const Tree = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 48" className={className}>
    {/* Leaves */}
    <rect x="8" y="0" width="16" height="4" fill="currentColor" />
    <rect x="4" y="4" width="24" height="4" fill="currentColor" />
    <rect x="2" y="8" width="28" height="4" fill="currentColor" />
    <rect x="4" y="12" width="24" height="4" fill="currentColor" />
    <rect x="0" y="16" width="32" height="4" fill="currentColor" />
    <rect x="2" y="20" width="28" height="4" fill="currentColor" />
    <rect x="4" y="24" width="24" height="4" fill="currentColor" />
    <rect x="6" y="28" width="20" height="4" fill="currentColor" />
    {/* Trunk */}
    <rect x="12" y="32" width="8" height="16" fill="#8B4513" />
  </svg>
);

// Little robot character
const Robot = ({ frame, className }: { frame: number; className?: string }) => (
  <svg viewBox="0 0 32 40" className={className}>
    {/* Antenna */}
    <rect x="14" y="0" width="4" height="4" fill="currentColor" />
    <rect x="12" y="4" width="8" height="4" fill="currentColor" />
    {/* Head */}
    <rect x="8" y="8" width="16" height="12" fill="currentColor" />
    <rect x="10" y="10" width="4" height="4" fill="#60a5fa" />
    <rect x="18" y="10" width="4" height="4" fill="#60a5fa" />
    <rect x="12" y="16" width="8" height="2" fill="#60a5fa" />
    {/* Body */}
    <rect x="6" y="20" width="20" height="12" fill="currentColor" />
    <rect x="10" y="22" width="12" height="8" fill="#3b82f6" />
    <rect x="12" y="24" width="2" height="2" fill="#22c55e" />
    <rect x="16" y="24" width="2" height="2" fill="#22c55e" />
    {/* Legs - animated */}
    {frame === 0 ? (
      <>
        <rect x="8" y="32" width="6" height="8" fill="currentColor" />
        <rect x="18" y="32" width="6" height="8" fill="currentColor" />
      </>
    ) : (
      <>
        <rect x="6" y="32" width="6" height="8" fill="currentColor" />
        <rect x="20" y="32" width="6" height="8" fill="currentColor" />
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

// Document/Paper icon
const Document = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 28" className={className} fill="currentColor">
    <rect x="0" y="0" width="16" height="28" />
    <rect x="16" y="4" width="4" height="24" />
    <rect x="12" y="0" width="4" height="4" fill="transparent" />
    <rect x="4" y="8" width="8" height="2" fill="#3b82f6" />
    <rect x="4" y="12" width="10" height="2" fill="#3b82f6" />
    <rect x="4" y="16" width="6" height="2" fill="#3b82f6" />
    <rect x="4" y="20" width="10" height="2" fill="#3b82f6" />
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

export function PixelAnimation() {
  const [robotPosition, setRobotPosition] = useState(0);
  const [frame, setFrame] = useState(0);
  const [bird1Pos, setBird1Pos] = useState(20);
  const [bird2Pos, setBird2Pos] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setRobotPosition((prev) => (prev + 0.5) % 100);
      setBird1Pos((prev) => (prev + 0.8) % 120);
      setBird2Pos((prev) => (prev + 0.6) % 120);
      setFrame((prev) => (prev + 1) % 2);
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-x-0 bottom-0 h-40 overflow-hidden pointer-events-none">
      {/* Gradient overlay for smooth transition */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-primary-50 to-transparent dark:from-primary-950 dark:to-transparent" />

      {/* Sky area with clouds */}
      <Cloud className="absolute top-6 left-[5%] w-20 h-10 text-white/50 dark:text-white/20 animate-pulse" />
      <Cloud className="absolute top-10 left-[25%] w-14 h-7 text-white/40 dark:text-white/15" />
      <Cloud className="absolute top-4 left-[45%] w-24 h-12 text-white/45 dark:text-white/20" />
      <Cloud className="absolute top-8 left-[70%] w-16 h-8 text-white/35 dark:text-white/15" />
      <Cloud className="absolute top-12 left-[90%] w-18 h-9 text-white/40 dark:text-white/18" />

      {/* Flying birds */}
      <div
        className="absolute top-8 transition-all duration-150"
        style={{ left: `${bird1Pos - 20}%` }}
      >
        <Bird frame={frame} className="w-4 h-3 text-primary-700/60 dark:text-primary-300/40" />
      </div>
      <div
        className="absolute top-14 transition-all duration-150"
        style={{ left: `${bird2Pos - 20}%` }}
      >
        <Bird frame={(frame + 1) % 2} className="w-3 h-2 text-primary-600/50 dark:text-primary-400/30" />
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-primary-400 dark:bg-primary-700" />
      <div className="absolute bottom-6 left-0 right-0 h-3 bg-primary-500/80 dark:bg-primary-600/80" />

      {/* Trees */}
      <Tree className="absolute bottom-6 left-[3%] w-8 h-12 text-primary-600 dark:text-primary-500" />
      <Tree className="absolute bottom-6 left-[92%] w-10 h-14 text-primary-700 dark:text-primary-400" />

      {/* Grass patches */}
      <Grass className="absolute bottom-6 left-[12%] w-8 h-4 text-primary-600 dark:text-primary-500" />
      <Grass className="absolute bottom-6 left-[22%] w-6 h-3 text-primary-500 dark:text-primary-600" />
      <Grass className="absolute bottom-6 left-[35%] w-7 h-4 text-primary-600 dark:text-primary-500" />
      <Grass className="absolute bottom-6 left-[50%] w-8 h-4 text-primary-600 dark:text-primary-500" />
      <Grass className="absolute bottom-6 left-[65%] w-6 h-3 text-primary-500 dark:text-primary-600" />
      <Grass className="absolute bottom-6 left-[78%] w-8 h-4 text-primary-600 dark:text-primary-500" />
      <Grass className="absolute bottom-6 left-[88%] w-5 h-3 text-primary-500 dark:text-primary-600" />

      {/* Compliance themed objects */}
      <Shield className="absolute bottom-8 left-[18%] w-5 h-6 text-primary-500/70 dark:text-primary-400/50" />
      <Document className="absolute bottom-9 left-[42%] w-4 h-5 text-white/80 dark:text-white/60" />
      <Checkmark className="absolute bottom-8 left-[58%] w-5 h-5" />
      <Shield className="absolute bottom-10 left-[75%] w-4 h-5 text-primary-400/60 dark:text-primary-500/40" />

      {/* Walking robot */}
      <div
        className="absolute bottom-8 transition-transform duration-150 ease-linear"
        style={{ left: `${robotPosition}%` }}
      >
        <Robot frame={frame} className="w-8 h-10 text-primary-800 dark:text-primary-200" />
      </div>
    </div>
  );
}
