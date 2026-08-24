import React, { useState, useEffect } from 'react';

export default function Loader({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Smooth progress increment simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Random incremental step for realistic loading feel
        const diff = Math.floor(Math.random() * 15) + 10;
        return Math.min(prev + diff, 100);
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, 300);

      const hideTimer = setTimeout(() => {
        setHidden(true);
        if (onFinish) onFinish();
      }, 1000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [progress, onFinish]);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-navy-950 flex flex-col items-center justify-center transition-all duration-500 ease-out select-none w-full max-w-full overflow-hidden ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none w-full max-w-full">
        <img
          src="/hero-bg.jpg"
          alt="HORLARS SERVICES Background"
          className="w-full h-full object-cover object-center filter brightness-90 scale-105 max-w-full"
        />
        <div className="absolute inset-0 bg-navy-950/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/80" />
      </div>

      {/* Subtle Logo Watermark Ambient Overlay */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-15 pointer-events-none">
        <img
          src="/logo.jpg"
          alt=""
          className="w-[450px] h-[450px] object-contain filter blur-sm rounded-full"
        />
      </div>

      {/* Glowing background ambient light */}
      <div className="absolute w-72 h-72 rounded-full bg-brand-orange/25 blur-3xl pointer-events-none animate-pulse" />

      {/* Main Loader Content */}
      <div className="relative z-10 max-w-sm w-full mx-4 flex flex-col items-center text-center space-y-6">
        
        {/* Logo */}
        <div className="relative group">
          <div className="bg-white p-2.5 rounded-full shadow-2xl flex items-center justify-center overflow-hidden w-28 h-28 sm:w-32 sm:h-32">
            <img
              src="/logo.jpg"
              alt="HORLARS SERVICES Logo"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* Company Title & Tagline */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-heading">
            HORLARS SERVICES
          </h2>
          <p className="text-xs font-bold text-brand-orange tracking-widest uppercase font-mono">
            Building Excellence
          </p>
        </div>

        {/* Progress Bar & Status */}
        <div className="w-full space-y-2 pt-2">
          <div className="w-full h-2.5 bg-navy-900/80 rounded-full overflow-hidden p-0.5 border border-navy-800/80 backdrop-blur-sm shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-brand-orange via-amber-500 to-orange-400 rounded-full transition-all duration-200 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
            <span className="animate-pulse">Loading experience...</span>
            <span className="font-mono text-brand-orange font-bold">{progress}%</span>
          </div>
        </div>

      </div>

      {/* Footer Branding Subtitle */}
      <div className="relative z-10 mt-8 text-xs text-slate-400 font-medium tracking-wide">
        ACP Cladding • Signage • Aluminium & Glass • Construction
      </div>
    </div>
  );
}
