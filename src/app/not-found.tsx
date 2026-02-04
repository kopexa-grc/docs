"use client";

import "@/app/global.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ComplianceRunner } from "@/components/compliance-runner";

// Pixel art: Lost Robot - bigger and more detailed
const LostRobot = ({ frame }: { frame: number }) => (
  <svg
    width="120"
    height="150"
    viewBox="0 0 32 40"
    className="drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]"
  >
    {/* Antenna - flickering with signal */}
    <rect x="14" y="0" width="4" height="2" fill={frame === 0 ? "#22d3ee" : "#ef4444"} />
    <rect x="15" y="2" width="2" height="2" fill="#0F263E" />
    <rect x="12" y="4" width="8" height="2" fill="#0F263E" />
    {/* Signal waves */}
    {frame === 0 && (
      <>
        <rect x="20" y="0" width="2" height="1" fill="#22d3ee" opacity="0.6" />
        <rect x="22" y="1" width="2" height="1" fill="#22d3ee" opacity="0.4" />
        <rect x="8" y="0" width="2" height="1" fill="#22d3ee" opacity="0.6" />
        <rect x="6" y="1" width="2" height="1" fill="#22d3ee" opacity="0.4" />
      </>
    )}
    {/* Head */}
    <rect x="6" y="6" width="20" height="14" fill="#0F263E" />
    <rect x="8" y="8" width="16" height="10" fill="#1a3a5c" />
    {/* Eyes - looking around confused */}
    <rect x={frame === 0 ? 9 : 11} y="10" width="5" height="5" fill="#0a1929" />
    <rect x={frame === 0 ? 18 : 20} y="10" width="5" height="5" fill="#0a1929" />
    <rect x={frame === 0 ? 10 : 12} y="11" width="3" height="3" fill="#22d3ee" className="animate-pulse" />
    <rect x={frame === 0 ? 19 : 21} y="11" width="3" height="3" fill="#22d3ee" className="animate-pulse" />
    {/* Confused expression */}
    <rect x="12" y="16" width="2" height="1" fill="#22d3ee" />
    <rect x="15" y="17" width="4" height="1" fill="#22d3ee" />
    {/* Question marks floating */}
    <rect x="26" y="4" width="3" height="1" fill="#f97316" className="animate-bounce" />
    <rect x="28" y="5" width="1" height="2" fill="#f97316" className="animate-bounce" />
    <rect x="26" y="7" width="2" height="1" fill="#f97316" className="animate-bounce" />
    <rect x="26" y="9" width="1" height="1" fill="#f97316" className="animate-bounce" />
    {/* Body */}
    <rect x="4" y="20" width="24" height="14" fill="#0F263E" />
    <rect x="6" y="22" width="20" height="10" fill="#1a3a5c" />
    {/* Chest display - error state */}
    <rect x="10" y="24" width="12" height="6" fill="#0a1929" />
    <rect x="11" y="25" width="3" height="4" fill="#ef4444" className="animate-pulse" />
    <rect x="15" y="25" width="2" height="4" fill="#ef4444" className="animate-pulse" />
    <rect x="18" y="25" width="3" height="4" fill="#ef4444" className="animate-pulse" />
    {/* Arms */}
    <rect x="0" y="22" width="4" height="8" fill="#0F263E" />
    <rect x="28" y="22" width="4" height="8" fill="#0F263E" />
    {frame === 1 && <rect x="28" y="18" width="4" height="4" fill="#0F263E" />}
    {/* Legs */}
    <rect x="8" y="34" width="6" height="6" fill="#0F263E" />
    <rect x="18" y="34" width="6" height="6" fill="#0F263E" />
  </svg>
);

// Floating pixel shield
const PixelShield = ({ className }: { className?: string }) => (
  <svg width="32" height="40" viewBox="0 0 16 20" className={className}>
    <rect x="2" y="0" width="12" height="2" fill="#22d3ee" />
    <rect x="0" y="2" width="16" height="2" fill="#22d3ee" />
    <rect x="0" y="4" width="16" height="8" fill="#0F263E" />
    <rect x="2" y="6" width="12" height="4" fill="#1a3a5c" />
    <rect x="6" y="7" width="4" height="2" fill="#22c55e" />
    <rect x="2" y="12" width="12" height="4" fill="#0F263E" />
    <rect x="4" y="16" width="8" height="2" fill="#0F263E" />
    <rect x="6" y="18" width="4" height="2" fill="#0F263E" />
  </svg>
);

// Floating pixel document
const PixelDocument = ({ className }: { className?: string }) => (
  <svg width="28" height="36" viewBox="0 0 14 18" className={className}>
    <rect x="0" y="0" width="10" height="2" fill="#f8fafc" />
    <rect x="10" y="0" width="2" height="2" fill="#94a3b8" />
    <rect x="12" y="2" width="2" height="2" fill="#f8fafc" />
    <rect x="0" y="2" width="14" height="14" fill="#f8fafc" />
    <rect x="2" y="4" width="8" height="1" fill="#64748b" />
    <rect x="2" y="6" width="10" height="1" fill="#94a3b8" />
    <rect x="2" y="8" width="6" height="1" fill="#94a3b8" />
    <rect x="2" y="10" width="10" height="1" fill="#94a3b8" />
    <rect x="2" y="12" width="4" height="1" fill="#22c55e" />
    <rect x="0" y="16" width="14" height="2" fill="#e2e8f0" />
  </svg>
);

// Floating pixel warning
const PixelWarning = ({ className }: { className?: string }) => (
  <svg width="36" height="32" viewBox="0 0 18 16" className={className}>
    <rect x="8" y="0" width="2" height="2" fill="#f97316" />
    <rect x="6" y="2" width="6" height="2" fill="#f97316" />
    <rect x="4" y="4" width="10" height="2" fill="#f97316" />
    <rect x="2" y="6" width="14" height="2" fill="#f97316" />
    <rect x="0" y="8" width="18" height="2" fill="#f97316" />
    <rect x="0" y="10" width="18" height="4" fill="#ea580c" />
    <rect x="0" y="14" width="18" height="2" fill="#c2410c" />
    {/* Exclamation mark */}
    <rect x="8" y="4" width="2" height="6" fill="#fff" />
    <rect x="8" y="11" width="2" height="2" fill="#fff" />
  </svg>
);

// Floating pixel checkmark
const PixelCheck = ({ className }: { className?: string }) => (
  <svg width="32" height="32" viewBox="0 0 16 16" className={className}>
    <rect x="2" y="2" width="12" height="12" fill="#22c55e" />
    <rect x="4" y="4" width="8" height="8" fill="#16a34a" />
    <rect x="10" y="4" width="2" height="2" fill="#fff" />
    <rect x="8" y="6" width="2" height="2" fill="#fff" />
    <rect x="6" y="8" width="2" height="2" fill="#fff" />
    <rect x="4" y="6" width="2" height="2" fill="#fff" />
  </svg>
);

// Pixel 404 text
const Pixel404 = () => (
  <svg width="280" height="80" viewBox="0 0 70 20" className="drop-shadow-[0_0_30px_rgba(239,68,68,0.6)]">
    {/* 4 */}
    <rect x="0" y="0" width="4" height="12" fill="#ef4444" />
    <rect x="4" y="8" width="8" height="4" fill="#ef4444" />
    <rect x="12" y="0" width="4" height="20" fill="#ef4444" />
    {/* 0 */}
    <rect x="22" y="0" width="14" height="4" fill="#ef4444" />
    <rect x="22" y="0" width="4" height="20" fill="#ef4444" />
    <rect x="32" y="0" width="4" height="20" fill="#ef4444" />
    <rect x="22" y="16" width="14" height="4" fill="#ef4444" />
    {/* 4 */}
    <rect x="42" y="0" width="4" height="12" fill="#ef4444" />
    <rect x="46" y="8" width="8" height="4" fill="#ef4444" />
    <rect x="54" y="0" width="4" height="20" fill="#ef4444" />
    {/* Glitch effect rects */}
    <rect x="2" y="4" width="8" height="2" fill="#22d3ee" opacity="0.5" className="animate-pulse" />
    <rect x="24" y="10" width="6" height="2" fill="#22d3ee" opacity="0.5" className="animate-pulse" />
    <rect x="48" y="14" width="4" height="2" fill="#22d3ee" opacity="0.5" className="animate-pulse" />
  </svg>
);

// Animated floating element wrapper
const FloatingElement = ({
  children,
  delay = 0,
  duration = 3,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) => (
  <div
    className={`absolute animate-bounce ${className}`}
    style={{
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
    }}
  >
    {children}
  </div>
);

export default function NotFound() {
  const [showGame, setShowGame] = useState(false);
  const [frame, setFrame] = useState(0);
  const [glitchOffset, setGlitchOffset] = useState(0);

  // Animate the robot and glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % 2);
      setGlitchOffset(Math.random() > 0.9 ? Math.random() * 4 - 2 : 0);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1929] via-[#0F263E] to-[#1a3a5c] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated star field */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: i % 4 === 0 ? 3 : i % 3 === 0 ? 2 : 1,
              height: i % 4 === 0 ? 3 : i % 3 === 0 ? 2 : 1,
              left: `${(i * 17 + i * 7) % 100}%`,
              top: `${(i * 13 + i * 11) % 100}%`,
              opacity: 0.2 + (i % 6) * 0.1,
              animationDelay: `${i * 50}ms`,
              animationDuration: `${1500 + i * 50}ms`,
            }}
          />
        ))}
      </div>

      {/* Floating GRC elements */}
      <FloatingElement delay={0} duration={4} className="top-[10%] left-[5%] opacity-60">
        <PixelShield />
      </FloatingElement>
      <FloatingElement delay={0.5} duration={3.5} className="top-[20%] right-[10%] opacity-50">
        <PixelDocument />
      </FloatingElement>
      <FloatingElement delay={1} duration={4.5} className="bottom-[30%] left-[8%] opacity-40">
        <PixelWarning />
      </FloatingElement>
      <FloatingElement delay={1.5} duration={3} className="top-[40%] right-[5%] opacity-50">
        <PixelCheck />
      </FloatingElement>
      <FloatingElement delay={2} duration={5} className="bottom-[20%] right-[15%] opacity-60">
        <PixelShield />
      </FloatingElement>
      <FloatingElement delay={0.8} duration={4} className="top-[60%] left-[15%] opacity-40">
        <PixelDocument />
      </FloatingElement>
      <FloatingElement delay={1.2} duration={3.8} className="bottom-[50%] right-[20%] opacity-30">
        <PixelCheck />
      </FloatingElement>

      {/* Scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)`,
        }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Pixel 404 */}
        <div
          className="flex justify-center mb-6"
          style={{ transform: `translateX(${glitchOffset}px)` }}
        >
          <Pixel404 />
        </div>

        {/* Lost Robot */}
        <div className="flex justify-center mb-6">
          <LostRobot frame={frame} />
        </div>

        {/* Error message */}
        <h2 className="text-3xl font-bold text-white mb-3 font-mono tracking-wider">
          <span className="text-[#ef4444]">ERROR:</span> SEITE NICHT GEFUNDEN
        </h2>
        <p className="text-[#94a3b8] mb-8 max-w-lg mx-auto text-lg">
          Der Kopexa-Bot hat sich im Compliance-Universum verlaufen.
          <br />
          <span className="text-[#22d3ee]">Diese Route existiert nicht in unserer Risk-Matrix.</span>
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/platform"
            className="group relative inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#22d3ee] text-[#0F263E] font-bold text-lg hover:bg-[#22d3ee]/90 transition-all hover:scale-105 shadow-lg shadow-[#22d3ee]/30"
          >
            <span className="mr-2">🏠</span> ZUR STARTSEITE
          </Link>
          <button
            type="button"
            onClick={() => setShowGame(!showGame)}
            className="group relative inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-[#22d3ee]/50 text-[#22d3ee] font-bold text-lg hover:bg-[#22d3ee]/10 transition-all hover:scale-105 hover:border-[#22d3ee]"
          >
            <span className="mr-2">{showGame ? "❌" : "🎮"}</span>
            {showGame ? "SPIEL BEENDEN" : "GRC INVADERS SPIELEN"}
          </button>
        </div>

        {/* Mini Game */}
        {showGame && (
          <div className="mb-8 animate-in fade-in zoom-in duration-300">
            <ComplianceRunner />
          </div>
        )}

        {/* Quick navigation - pixel style */}
        <div className="bg-[#0a1929]/80 backdrop-blur-sm rounded-xl p-6 border border-[#22d3ee]/20">
          <p className="text-sm text-[#64748b] mb-4 font-mono">
            // ALTERNATIVE ROUTEN GEFUNDEN:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { href: "/platform/quickstart", label: "Quickstart", icon: "🚀" },
              { href: "/platform/compliance/controls", label: "Controls", icon: "🛡️" },
              { href: "/platform/compliance/risks", label: "Risiken", icon: "⚠️" },
              { href: "/catalogs", label: "Kataloge", icon: "📚" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a3a5c]/50 border border-[#22d3ee]/20 text-[#22d3ee] hover:bg-[#22d3ee]/10 hover:border-[#22d3ee]/50 transition-all text-sm font-mono"
              >
                <span>{link.icon}</span>
                <span className="group-hover:underline">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Easter egg hint */}
        <p className="mt-8 text-xs text-[#475569] font-mono animate-pulse">
          {'>'} Drück SPACE um GRC Invaders zu spielen...
        </p>
      </div>
    </div>
  );
}
