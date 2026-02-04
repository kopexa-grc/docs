"use client";

import "@/app/global.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ComplianceRunner } from "@/components/compliance-runner";

// Lost Robot - looking around confused
const LostRobot = ({ frame }: { frame: number }) => (
  <svg width="64" height="80" viewBox="0 0 32 40" className="animate-bounce" style={{ animationDuration: "2s" }}>
    {/* Antenna - flickering */}
    <rect x="14" y="0" width="4" height="4" fill={frame === 0 ? "#22d3ee" : "#ef4444"} />
    <rect x="12" y="4" width="8" height="4" fill="#0F263E" />
    {/* Head */}
    <rect x="8" y="8" width="16" height="12" fill="#0F263E" />
    {/* Eyes - looking around */}
    <rect x={frame === 0 ? 10 : 12} y="10" width="4" height="4" fill="#22d3ee" />
    <rect x={frame === 0 ? 18 : 20} y="10" width="4" height="4" fill="#22d3ee" />
    {/* Confused mouth */}
    <rect x="12" y="16" width="2" height="2" fill="#22d3ee" />
    <rect x="16" y="17" width="4" height="1" fill="#22d3ee" />
    {/* Question mark above head */}
    <rect x="22" y="2" width="4" height="2" fill="#22d3ee" />
    <rect x="24" y="4" width="2" height="2" fill="#22d3ee" />
    <rect x="22" y="6" width="2" height="2" fill="#22d3ee" />
    <rect x="22" y="10" width="2" height="2" fill="#22d3ee" />
    {/* Body */}
    <rect x="6" y="20" width="20" height="12" fill="#0F263E" />
    <rect x="10" y="22" width="12" height="8" fill="#1a3a5c" />
    {/* Error on chest */}
    <rect x="12" y="24" width="2" height="4" fill="#ef4444" />
    <rect x="16" y="24" width="2" height="4" fill="#ef4444" />
    <rect x="14" y="26" width="2" height="2" fill="#ef4444" />
    {/* Legs */}
    <rect x="8" y="32" width="6" height="8" fill="#1a3a5c" />
    <rect x="18" y="32" width="6" height="8" fill="#1a3a5c" />
  </svg>
);

export default function NotFound() {
  const [showGame, setShowGame] = useState(false);
  const [frame, setFrame] = useState(0);

  // Animate the robot
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % 2);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary-50 dark:to-primary-950 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
          {/* Lost Robot */}
          <div className="flex justify-center mb-8">
            <LostRobot frame={frame} />
          </div>

          {/* Error message */}
          <h1 className="text-6xl font-bold text-[#0F263E] dark:text-white mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-[#0F263E]/80 dark:text-white/80 mb-4">
            Seite nicht gefunden
          </h2>
          <p className="text-[#0F263E]/60 dark:text-white/60 mb-8 max-w-md mx-auto">
            Der Kopexa-Bot hat sich verlaufen und kann diese Seite nicht finden.
            Vielleicht wurde sie verschoben oder existiert nicht mehr.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/platform"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#0F263E] text-white hover:bg-[#1a3a5c] transition-colors"
            >
              Zur Startseite
            </Link>
            <button
              type="button"
              onClick={() => setShowGame(!showGame)}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-[#0F263E]/20 dark:border-white/20 text-[#0F263E] dark:text-white hover:bg-[#0F263E]/5 dark:hover:bg-white/5 transition-colors"
            >
              {showGame ? "Spiel ausblenden" : "🎮 Während du wartest..."}
            </button>
          </div>

          {/* Mini Game */}
          {showGame && (
            <div>
              <ComplianceRunner />
            </div>
          )}

          {/* Helpful links */}
          <div className="mt-12 pt-8 border-t border-[#0F263E]/10 dark:border-white/10">
            <p className="text-sm text-[#0F263E]/50 dark:text-white/50 mb-4">
              Vielleicht hilft dir einer dieser Links:
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <Link href="/platform/quickstart" className="text-[#22d3ee] hover:underline">
                Quickstart
              </Link>
              <Link href="/platform/compliance/controls" className="text-[#22d3ee] hover:underline">
                Controls
              </Link>
              <Link href="/platform/compliance/risks" className="text-[#22d3ee] hover:underline">
                Risiken
              </Link>
              <Link href="/catalogs" className="text-[#22d3ee] hover:underline">
                Katalog
              </Link>
            </div>
          </div>
      </div>
    </div>
  );
}
