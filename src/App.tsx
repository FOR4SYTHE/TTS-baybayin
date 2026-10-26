import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, Loader2, Copy, Check, History, X, ArrowLeftRight, Download, Lightbulb, Camera } from 'lucide-react'; // Added Camera
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import SupremeLens from './SupremeLens'; // Added SupremeLens component
import { playResultBamSound, playTapSound, playOpenLensSound, playPlopSound } from './utils/sounds';

// Character Components
const Sampaguita = () => (
  <motion.svg width="120" height="120" viewBox="0 0 100 100"
    animate={{ rotate: [0, 5, -5, 0], scale: [0.98, 1.05, 0.98] }}
    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
    className="overflow-visible"
  >
    {/* Petals */}
    <g fill="#FFF" stroke="#1A1A1A" strokeWidth="4" strokeLinejoin="round">
      {[0, 72, 144, 216, 288].map(angle => (
        <path key={angle} d="M 50 50 C 15 -15, 85 -15, 50 50" style={{ transformOrigin: '50px 50px', transform: `rotate(${angle}deg)` }} />
      ))}
    </g>

    {/* Spikes / Stamen */}
    <g stroke="#1A1A1A" strokeWidth="3.5" strokeLinecap="round">
      {[36, 108, 180, 252, 324].map(angle => (
        <line key={angle} x1="50" y1="50" x2="50" y2="20" style={{ transformOrigin: '50px 50px', transform: `rotate(${angle}deg)` }} />
      ))}
    </g>

    {/* Center Face */}
    <circle cx="50" cy="50" r="18" fill="#FFF" stroke="#1A1A1A" strokeWidth="4" />

    {/* Blushes */}
    <circle cx="38" cy="53" r="3" fill="#FFB6C1" />
    <circle cx="62" cy="53" r="3" fill="#FFB6C1" />

    {/* Eyes */}
    <ellipse cx="43" cy="47" rx="3.5" ry="5.5" fill="#1A1A1A" />
    <ellipse cx="57" cy="47" rx="3.5" ry="5.5" fill="#1A1A1A" />

    {/* Eye Highlights */}
    <circle cx="42" cy="45" r="1.5" fill="#FFF" />
    <circle cx="56" cy="45" r="1.5" fill="#FFF" />

    {/* Smile */}
    <path d="M 41 55 Q 50 63 59 55" fill="none" stroke="#1A1A1A" strokeWidth="3.5" strokeLinecap="round" />
  </motion.svg>
);

const Butterfly = () => (
  <motion.svg width="90" height="90" viewBox="0 0 100 100"
    animate={{ y: [0, -8, 0], rotate: [-2, 4, -2] }}
    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
    <path d="M 50 50 C 20 20, 10 50, 45 55 C 10 70, 30 90, 50 60 C 70 90, 90 70, 55 55 C 90 50, 80 20, 50 50 Z" fill="#FFF" stroke="#1A1A1A" strokeWidth="5" strokeLinejoin="round" />
    <circle cx="35" cy="40" r="4" fill="#1A1A1A" />
    <circle cx="65" cy="40" r="4" fill="#1A1A1A" />
    <circle cx="40" cy="70" r="3" fill="#1A1A1A" />
    <circle cx="60" cy="70" r="3" fill="#1A1A1A" />
    <rect x="47" y="35" width="6" height="40" rx="3" fill="#1A1A1A" />
    <path d="M 48 35 Q 40 20 35 25 M 52 35 Q 60 20 65 25" fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </motion.svg>
);

const EagleWing = ({ className, flipped = false }: { className?: string, flipped?: boolean }) => (
  <svg 
    width="85" 
    height="155" 
    viewBox="0 0 120 220" 
    className={className} 
    style={flipped ? { transform: 'scaleX(-1)' } : undefined}
  >
    <defs>
      <mask id={flipped ? "wing-cutout-flipped" : "wing-cutout"}>
        <rect width="120" height="220" fill="white" />
        
        {/* Flowing separation lines between feathers */}
        <path d="M120 40 Q80 35 30 65" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
        <path d="M120 65 Q70 65 15 110" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
        <path d="M120 90 Q65 95 10 150" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
        <path d="M120 115 Q60 125 15 190" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
        
        {/* Shoulder tribal filigree */}
        <circle cx="105" cy="25" r="5" fill="black" />
        <path d="M120 25 Q105 10 90 20 Q75 30 85 45" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
        <path d="M120 15 Q100 0 75 10 Q50 20 60 40" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" />
      </mask>
    </defs>
    
    <g fill="#1A1A1A" mask={`url(#${flipped ? "wing-cutout-flipped" : "wing-cutout"})`}>
      {/* Shoulder Solid */}
      <path d="M120 0 Q80 0 50 20 Q90 30 120 25 Z" />
      
      {/* 5 Prominent Primary Feathers */}
      <path d="M120 15 Q70 10 15 55 Q70 65 120 45 Z" />
      <path d="M120 35 Q60 40 0 105 Q60 110 120 75 Z" />
      <path d="M120 65 Q55 75 0 145 Q65 145 120 105 Z" />
      <path d="M120 95 Q50 110 5 185 Q75 180 120 135 Z" />
      <path d="M120 125 Q60 145 25 220 Q85 200 120 160 Z" />
      
      {/* Spine to connect seamlessly to the jeep-card border */}
      <rect x="110" y="0" width="10" height="220" />
    </g>
  </svg>
);

const TribalSunCamera = () => (
  <motion.svg width="200" height="100" viewBox="0 0 100 50"
    whileTap={{ scale: 0.95 }}
    className="overflow-hidden block"
  >
    {/* Tribal Sun Rays */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
      <g key={angle} transform={`rotate(${angle} 50 50)`}>
        {/* White Silhouette with Black Stroke */}
        <g fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="1.25" strokeLinejoin="round">
          {/* Main Central Beam */}
          <polygon points="47,29 45,10 50,0 55,10 53,29" />
          {/* Left Side Beam */}
          <polygon points="46,29 42,10 40,14 43,29" />
          {/* Right Side Beam */}
          <polygon points="54,29 58,10 60,14 57,29" />
        </g>
        
        {/* Black Tribal Prints inside Rays */}
        <g fill="#1A1A1A" stroke="none">
          {/* Central Ray Chevrons & Diamond */}
          <polygon points="50,4 47.5,9 47.5,12 50,7 52.5,12 52.5,9" />
          <polygon points="50,11 47.5,16 47.5,19 50,14 52.5,19 52.5,16" />
          <polygon points="50,21 47.5,25 50,29 52.5,25" />
          
          {/* Side Rays Solid Top Triangles */}
          <polygon points="42,10 40,14 41.5,18" />
          <polygon points="58,10 60,14 58.5,18" />
        </g>
      </g>
    ))}

    {/* Center Sun Body (Tribal Ring) */}
    {/* Base white circle to cover ray bases seamlessly */}
    <circle cx="50" cy="50" r="22" fill="#FFFFFF" />
    
    {/* Outer and Inner Borders */}
    <circle cx="50" cy="50" r="22" fill="none" stroke="#1A1A1A" strokeWidth="1.5" />
    <circle cx="50" cy="50" r="16" fill="none" stroke="#1A1A1A" strokeWidth="1.5" />
    
    {/* Zigzag Tribal Pattern */}
    {[...Array(24)].map((_, i) => {
      const a1 = (i * 15) * Math.PI / 180;
      const a2 = ((i + 0.5) * 15) * Math.PI / 180;
      const a3 = ((i + 1) * 15) * Math.PI / 180;
      return (
        <polyline key={`zig-${i}`}
          points={`
            ${50 + 16 * Math.cos(a1)},${50 + 16 * Math.sin(a1)}
            ${50 + 22 * Math.cos(a2)},${50 + 22 * Math.sin(a2)}
            ${50 + 16 * Math.cos(a3)},${50 + 16 * Math.sin(a3)}
          `}
          fill="none" stroke="#1A1A1A" strokeWidth="1.25" strokeLinejoin="round"
        />
      )
    })}
  </motion.svg>
);

const Sparkle = () => (
  <motion.svg width="60" height="60" viewBox="0 0 100 100"
    animate={{ rotate: [0, 90, 180], scale: [0.8, 1.1, 0.8] }}
    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}>
    <path d="M 50 10 C 50 40, 60 50, 90 50 C 60 50, 50 60, 50 90 C 50 60, 40 50, 10 50 C 40 50, 50 40, 50 10 Z" fill="#FFF" stroke="#1A1A1A" strokeWidth="5" strokeLinejoin="round" />
  </motion.svg>
);

const UKFlag = ({ className = "" }: { className?: string }) => (
  <svg width="32" height="24" viewBox="0 0 28 20" className={`inline-block rounded-[3px] shadow-[2px_2px_0px_0px_#1A1A1A] bg-[#1e3a8a] ${className}`}>
    <path d="M-2 -2L30 22M-2 22L30 -2" stroke="white" strokeWidth="4" />
    <path d="M-2 -2L30 22M-2 22L30 -2" stroke="#ef4444" strokeWidth="2" />
    <path d="M14 0V20M0 10H28" stroke="white" strokeWidth="6" />
    <path d="M14 0V20M0 10H28" stroke="#ef4444" strokeWidth="4" />
    <rect width="28" height="20" fill="none" stroke="#1A1A1A" strokeWidth="4" />
  </svg>
);

const PHFlag = ({ className = "" }: { className?: string }) => (
  <svg width="32" height="24" viewBox="0 0 28 20" className={`inline-block rounded-[3px] shadow-[2px_2px_0px_0px_#1A1A1A] bg-white ${className}`}>
    <rect width="28" height="10" fill="#3b82f6" />
    <rect y="10" width="28" height="10" fill="#ef4444" />
    <polygon points="-2,-2 14,10 -2,22" fill="white" stroke="#1A1A1A" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="4.5" cy="10" r="2.5" fill="#eab308" stroke="#1A1A1A" strokeWidth="1" />
    <rect width="28" height="20" fill="none" stroke="#1A1A1A" strokeWidth="4" />
  </svg>
);

// --- SVGs for Baybayin Mode ---
const TribalSun = () => (
  <svg width="120" height="120" viewBox="0 0 100 100" className="opacity-80">
    <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="4" />
    <circle cx="50" cy="50" r="8" fill="currentColor" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
      <path key={angle} d="M 50 30 L 50 10 M 45 15 L 50 10 L 55 15" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transformOrigin: '50px 50px', transform: `rotate(${angle}deg)` }} />
    ))}
  </svg>
);

const TribalPetroglyph1 = () => (
  <svg width="100" height="150" viewBox="0 0 100 150" className="text-[#2C2825] opacity-15">
    {/* Wave & Sun Motif */}
    <path d="M 20 40 L 35 55 L 50 40 L 65 55 L 80 40 M 20 55 L 35 70 L 50 55 L 65 70 L 80 55" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="50" cy="100" r="12" fill="none" stroke="currentColor" strokeWidth="4" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
      <line key={angle} x1="50" y1="80" x2="50" y2="72" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={{ transformOrigin: '50px 100px', transform: `rotate(${angle}deg)` }} />
    ))}
    <path d="M 40 10 L 50 20 L 60 10 M 50 20 L 50 30" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TribalPetroglyph2 = () => (
  <svg width="80" height="180" viewBox="0 0 80 180" className="text-[#2C2825] opacity-15">
    {/* Centipede (Alupihan) & Diamond Motif */}
    <path d="M 40 20 L 25 35 M 40 20 L 55 35 M 40 35 L 25 50 M 40 35 L 55 50 M 40 50 L 25 65 M 40 50 L 55 65 M 40 20 L 40 65" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 40 90 L 55 105 L 40 120 L 25 105 Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    <circle cx="40" cy="105" r="4" fill="currentColor" />
    <path d="M 30 140 L 40 130 L 50 140 M 30 155 L 40 145 L 50 155 M 30 170 L 40 160 L 50 170 M 40 130 L 40 170" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// --- Baybayin Converter Logic ---
const toBaybayin = (text: string) => {
  if (!text) return "";
  let str = text.toLowerCase();
  str = str.replace(/f/g, 'p').replace(/v/g, 'b').replace(/z/g, 's').replace(/j/g, 'dy').replace(/c/g, 'k').replace(/x/g, 'ks').replace(/q/g, 'k');
  const vowels: Record<string, string> = { 'a': '\u1700', 'e': '\u1701', 'i': '\u1701', 'o': '\u1702', 'u': '\u1702' };
  const consonants: Record<string, string> = { 'k': '\u1703', 'g': '\u1704', 'ng': '\u1705', 't': '\u1706', 'd': '\u1707', 'r': '\u1707', 'n': '\u1708', 'p': '\u1709', 'b': '\u170A', 'm': '\u170B', 'y': '\u170C', 'l': '\u170E', 'w': '\u170F', 's': '\u1710', 'h': '\u1711' };
  let result = ""; let i = 0;
  while (i < str.length) {
    let char = str[i];
    let nextChar = str[i + 1]; let twoChar = char + (nextChar || "");

    if (twoChar === 'ng' && consonants['ng']) {
      let third = str[i + 2];
      if (vowels[third]) {
        if (third === 'a') result += consonants['ng'];
        else if (third === 'e' || third === 'i') result += consonants['ng'] + '\u1712';
        else if (third === 'o' || third === 'u') result += consonants['ng'] + '\u1713';
        i += 3;
      } else { result += consonants['ng'] + '\u1714'; i += 2; }
      continue;
    }
    if (consonants[char]) {
      if (vowels[nextChar]) {
        if (nextChar === 'a') result += consonants[char];
        else if (nextChar === 'e' || nextChar === 'i') result += consonants[char] + '\u1712';
        else if (nextChar === 'o' || nextChar === 'u') result += consonants[char] + '\u1713';
        i += 2;
      } else {
        result += consonants[char] + '\u1714'; i += 1;
      }
    } else if (vowels[char]) {
      result += vowels[char]; i += 1;
    }
    else { result += char; i += 1; }
  }
  return result;
};

const PhParticles = ({ triggerKey }: { triggerKey: string }) => (
  <div key={triggerKey} className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
    {/* Left Star */}
    <motion.svg initial={{ scale: 0, x: 0, y: 0, rotate: 0, opacity: 1 }} animate={{ scale: [0, 1.5, 1.5, 0], x: -80, y: -50, rotate: -120, opacity: [1, 1, 1, 0] }} transition={{ duration: 0.7, ease: "easeOut" }} className="absolute w-8 h-8 text-[#FED141] fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></motion.svg>
    {/* Right Star */}
    <motion.svg initial={{ scale: 0, x: 0, y: 0, rotate: 0, opacity: 1 }} animate={{ scale: [0, 1.5, 1.5, 0], x: 80, y: -50, rotate: 120, opacity: [1, 1, 1, 0] }} transition={{ duration: 0.7, ease: "easeOut" }} className="absolute w-8 h-8 text-[#FED141] fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></motion.svg>
    {/* Top Sun */}
    <motion.svg initial={{ scale: 0, y: 0, rotate: -45, opacity: 1 }} animate={{ scale: [0, 2, 2, 0], y: -90, rotate: 45, opacity: [1, 1, 1, 0] }} transition={{ duration: 0.8, ease: "easeOut" }} className="absolute w-12 h-12 text-[#FED141] fill-current" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="20" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
        <polygon key={angle} points="50,15 54,28 46,28" style={{ transformOrigin: '50px 50px', transform: `rotate(${angle}deg)` }} />
      ))}
    </motion.svg>
  </div>
);

const BAYBAYIN_BG_SVG = encodeURIComponent(`
<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Basic Diamond -->
    <g id="bg-diamond">
      <polygon points="0,-12 12,0 0,12 -12,0" />
      <circle cx="0" cy="0" r="2.5" fill="#2C2825" stroke="none" />
    </g>
    <!-- Upward Chevrons -->
    <g id="bg-up-chev">
      <path d="M 0 -20 L 0 20 M -12 -5 L 0 -15 L 12 -5 M -12 10 L 0 0 L 12 10" />
      <circle cx="0" cy="-25" r="1.5" fill="#2C2825" stroke="none" />
      <circle cx="0" cy="25" r="1.5" fill="#2C2825" stroke="none" />
    </g>
    <!-- Downward Chevrons -->
    <g id="bg-down-chev">
      <path d="M 0 -20 L 0 20 M -12 -10 L 0 0 L 12 -10 M -12 5 L 0 15 L 12 5" />
      <circle cx="0" cy="-25" r="1.5" fill="#2C2825" stroke="none" />
      <circle cx="0" cy="25" r="1.5" fill="#2C2825" stroke="none" />
    </g>
    <!-- Tribal Sun -->
    <g id="bg-sun">
      <circle cx="0" cy="0" r="8" />
      <circle cx="0" cy="0" r="3" fill="#2C2825" stroke="none" />
      <path d="M 0 -12 L 0 -18 M 0 12 L 0 18 M -12 0 L -18 0 M 12 0 L 18 0 M -8 -8 L -12 -12 M 8 8 L 12 12 M -8 8 L -12 12 M 8 -8 L 12 -12" />
      <circle cx="0" cy="-22" r="1.5" fill="#2C2825" stroke="none" />
      <circle cx="0" cy="22" r="1.5" fill="#2C2825" stroke="none" />
      <circle cx="-22" cy="0" r="1.5" fill="#2C2825" stroke="none" />
      <circle cx="22" cy="0" r="1.5" fill="#2C2825" stroke="none" />
    </g>
    <!-- Rotated Tic-Tac-Toe -->
    <g id="bg-tic-tac">
      <path d="M 12 -16 L -16 12 M 16 -12 L -12 16 M -12 -16 L 16 12 M -16 -12 L 12 16" />
      <polygon points="0,-8 8,0 0,8 -8,0" />
      <circle cx="0" cy="0" r="2" fill="#2C2825" stroke="none" />
      <circle cx="0" cy="-16" r="1.5" fill="#2C2825" stroke="none" />
      <circle cx="0" cy="16" r="1.5" fill="#2C2825" stroke="none" />
      <circle cx="-16" cy="0" r="1.5" fill="#2C2825" stroke="none" />
      <circle cx="16" cy="0" r="1.5" fill="#2C2825" stroke="none" />
    </g>
    <!-- Hourglass -->
    <g id="bg-hourglass">
      <path d="M -10 -15 L 10 -15 L 0 0 Z M -10 15 L 10 15 L 0 0 Z" />
      <circle cx="0" cy="-20" r="1.5" fill="#2C2825" stroke="none" />
      <circle cx="0" cy="20" r="1.5" fill="#2C2825" stroke="none" />
    </g>
    <!-- Stacked Nested Diamonds -->
    <g id="bg-stacked-dia">
      <polygon points="0,-20 8,-12 0,-4 -8,-12" />
      <polygon points="0,-16 4,-12 0,-8 -4,-12" />
      <polygon points="0,-8 8,0 0,8 -8,0" />
      <polygon points="0,-4 4,0 0,4 -4,0" />
      <polygon points="0,4 8,12 0,20 -8,12" />
      <polygon points="0,8 4,12 0,16 -4,12" />
    </g>
    <!-- Zigzag Brackets -->
    <g id="bg-zigzag">
      <path d="M -15 -20 L -10 -10 L -15 0 L -10 10 L -15 20" />
      <path d="M 15 -20 L 10 -10 L 15 0 L 10 10 L 15 20" />
      <polygon points="0,-6 6,0 0,6 -6,0" />
      <circle cx="0" cy="0" r="1.5" fill="#2C2825" stroke="none" />
      <circle cx="-20" cy="0" r="1.5" fill="#2C2825" stroke="none" />
      <circle cx="20" cy="0" r="1.5" fill="#2C2825" stroke="none" />
    </g>
  </defs>

  <g stroke="#2C2825" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.12">
    <!-- Col 1 -->
    <use href="#bg-diamond" x="50" y="25" />
    <use href="#bg-up-chev" x="50" y="75" />
    <use href="#bg-sun" x="50" y="125" />
    <use href="#bg-down-chev" x="50" y="175" />
    <use href="#bg-diamond" x="50" y="225" />
    <use href="#bg-up-chev" x="50" y="275" />
    <use href="#bg-sun" x="50" y="325" />
    <use href="#bg-down-chev" x="50" y="375" />

    <!-- Col 2 -->
    <use href="#bg-stacked-dia" x="150" y="25" />
    <use href="#bg-hourglass" x="150" y="75" />
    <use href="#bg-tic-tac" x="150" y="125" />
    <use href="#bg-hourglass" x="150" y="175" />
    <use href="#bg-stacked-dia" x="150" y="225" />
    <use href="#bg-hourglass" x="150" y="275" />
    <use href="#bg-tic-tac" x="150" y="325" />
    <use href="#bg-hourglass" x="150" y="375" />

    <!-- Col 3 -->
    <use href="#bg-down-chev" x="250" y="25" />
    <use href="#bg-diamond" x="250" y="75" />
    <use href="#bg-up-chev" x="250" y="125" />
    <use href="#bg-sun" x="250" y="175" />
    <use href="#bg-down-chev" x="250" y="225" />
    <use href="#bg-diamond" x="250" y="275" />
    <use href="#bg-up-chev" x="250" y="325" />
    <use href="#bg-sun" x="250" y="375" />

    <!-- Col 4 -->
    <use href="#bg-zigzag" x="350" y="25" />
    <use href="#bg-tic-tac" x="350" y="75" />
    <use href="#bg-hourglass" x="350" y="125" />
    <use href="#bg-tic-tac" x="350" y="175" />
    <use href="#bg-zigzag" x="350" y="225" />
    <use href="#bg-tic-tac" x="350" y="275" />
    <use href="#bg-hourglass" x="350" y="325" />
    <use href="#bg-tic-tac" x="350" y="375" />
  </g>
</svg>
`);

export default function App() {
  // App Mode State
  const [appMode, setAppMode] = useState<'translator' | 'baybayin'>('translator');
  const [nextMode, setNextMode] = useState<'translator' | 'baybayin'>('translator');

  // Main App Tour State
  const [tourStep, setTourStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [spotlightRect, setSpotlightRect] = useState({ top: 0, left: 0, width: 0, height: 0, borderRadius: '24px' });
  const baybayinBtnRef = useRef<HTMLButtonElement>(null);
  const historyBtnRef = useRef<HTMLButtonElement>(null);
  const inputCardRef = useRef<HTMLDivElement>(null);
  const supremeLensBtnRef = useRef<HTMLButtonElement>(null);

  const [isTransitioning, setIsTransitioning] = useState(false);

  // Lens State (Added for Supreme Lens)
  const [isLensOpen, setIsLensOpen] = useState(false);
  const [lensHasCapture, setLensHasCapture] = useState(false);

  // Translator States
  const [englishWord, setEnglishWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fun Fact States
  const [funFact, setFunFact] = useState<string | null>(null);
  const [isLoadingFunFact, setIsLoadingFunFact] = useState(false);

  const [example, setExample] = useState<{ tagalogSentence?: string; englishTranslation?: string } | null>(null);
  const [isLoadingExample, setIsLoadingExample] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [exampleAudioUrl, setExampleAudioUrl] = useState<string | null>(null);

  const [isCopied, setIsCopied] = useState(false);
  const [isExampleCopied, setIsExampleCopied] = useState(false);

  const [history, setHistory] = useState<{ english: string, tagalog: string, direction?: 'en-tl' | 'tl-en' }[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const [direction, setDirection] = useState<'en-tl' | 'tl-en'>('en-tl');
  const [inputMode, setInputMode] = useState<'word' | 'conversation'>('word');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [exampleCooldown, setExampleCooldown] = useState<number | null>(null);

  // Baybayin States
  const [baybayinMode, setBaybayinMode] = useState<'encode' | 'decode'>('encode');
  const [decodeTarget, setDecodeTarget] = useState<'TL' | 'EN'>('TL');
  const [decodedCache, setDecodedCache] = useState<{ TL?: string, EN?: string }>({});
  const [isDecoding, setIsDecoding] = useState(false);

  const [baybayinInput, setBaybayinInput] = useState('');
  const [baybayinOutput, setBaybayinOutput] = useState('');
  const [isBaybayinCopied, setIsBaybayinCopied] = useState(false);

  const [isArtMode, setIsArtMode] = useState(false);
  const [isGeneratingArt, setIsGeneratingArt] = useState(false);
  const [artBgIndex, setArtBgIndex] = useState(1);

  const [baybayinHistory, setBaybayinHistory] = useState<{ input: string, output: string }[]>([]);
  const [showBaybayinHistory, setShowBaybayinHistory] = useState(false);

  const resultSectionRef = useRef<HTMLDivElement>(null);
  const exampleSectionRef = useRef<HTMLDivElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentAudioUrlRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const englishSuggestions = ['hello', 'how are you?', 'thank you', 'good morning', 'I love you'];
  const tagalogSuggestions = ['kumusta', 'salamat', 'magandang umaga', 'mahal kita', 'paalam'];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (exampleCooldown === null || exampleCooldown <= 0) return;
    const timer = setTimeout(() => setExampleCooldown(prev => (prev ?? 1) - 1), 1000);
    return () => clearTimeout(timer);
  }, [exampleCooldown]);

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  }, [audioUrl]);

  // Main App Tour Logic
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('main_app_intro_seen');
    if (!hasSeenTour) setTourStep(1);
  }, []);

  useEffect(() => {
    let targetRef: React.RefObject<HTMLElement> | null = null;
    if (tourStep === 1) targetRef = baybayinBtnRef;
    if (tourStep === 2) targetRef = historyBtnRef;
    if (tourStep === 3) targetRef = inputCardRef;
    if (tourStep === 4) targetRef = supremeLensBtnRef;

    if (targetRef && targetRef.current) {
      const measure = () => {
        if (!targetRef?.current) return;
        const rect = targetRef.current.getBoundingClientRect();
        const style = window.getComputedStyle(targetRef.current);
        setSpotlightRect({
          top: rect.top, left: rect.left, width: rect.width, height: rect.height, borderRadius: style.borderRadius || '12px'
        });
      };
      measure();
      window.addEventListener('resize', measure);
      window.addEventListener('scroll', measure);
      return () => {
        window.removeEventListener('resize', measure);
        window.removeEventListener('scroll', measure);
      };
    }
  }, [tourStep, appMode, nextMode]);

  const currentPlaceholder = direction === 'en-tl'
    ? englishSuggestions[placeholderIndex % englishSuggestions.length]
    : tagalogSuggestions[placeholderIndex % tagalogSuggestions.length];

  const handleModeSwitch = (mode: 'translator' | 'baybayin') => {
    if (mode === appMode) return;
    playPlopSound();
    setNextMode(mode);
    setIsTransitioning(true);
    setTimeout(() => {
      setAppMode(mode);
      setIsTransitioning(false);
    }, 800);
  };

  const handleSwap = () => {
    setDirection(prev => prev === 'en-tl' ? 'tl-en' : 'en-tl');
    setEnglishWord(''); 
    setTranslation('');
    setExample(null);
    setFunFact(null);
    setAudioUrl(null);
    setExampleAudioUrl(null);
    setErrorMsg(null);
  };

  const handleInputModeChange = (mode: 'word' | 'conversation') => {
    if (mode === inputMode) return;
    setInputMode(mode);
    setEnglishWord('');
    setTranslation('');
    setExample(null);
    setFunFact(null);
    setAudioUrl(null);
    setExampleAudioUrl(null);
    setErrorMsg(null);
  };

  const handleGenerateBaybayin = () => {
    if (!baybayinInput.trim()) return;
    const output = toBaybayin(baybayinInput);
    setBaybayinOutput(output);
    setBaybayinHistory(prev => [{ input: baybayinInput, output: output }, ...prev]);
    setIsArtMode(false);
  };

  const handleDecodeBaybayin = async (targetOverride?: 'TL' | 'EN') => {
    if (!baybayinInput.trim()) return;

    const target = targetOverride || decodeTarget;
    if (targetOverride) setDecodeTarget(target);

    if (decodedCache[target]) {
      setBaybayinOutput(decodedCache[target]!);
      return;
    }

    setIsDecoding(true);
    setBaybayinOutput('');
    try {
      const direction = target === 'TL' ? 'bay-tl' : 'bay-en';
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: baybayinInput, direction })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.translation) {
        setDecodedCache(prev => ({ ...prev, [target]: data.translation }));
        setBaybayinOutput(data.translation);
        if (!targetOverride) {
          setBaybayinHistory(prev => [{ input: baybayinInput, output: data.translation }, ...prev]);
        }
        setIsArtMode(false);
      }
    } catch (error: any) {
      console.error('Decode error:', error);
      if (error.message === 'server_busy') {
        setBaybayinOutput("ORACLE OVERLOADED: GOOGLE SERVERS BUSY. PLEASE TRY AGAIN LATER.");
      } else if (error.message === 'rate_limited') {
        setBaybayinOutput("Error: Rate Limited");
      } else {
        setBaybayinOutput("Error communicating with the oracle.");
      }
    } finally {
      setIsDecoding(false);
    }
  };

  const baybayinRef = useRef<HTMLDivElement>(null);

  const handleDownloadImage = () => {
    if (!baybayinRef.current) return;
    toPng(baybayinRef.current, { 
      cacheBust: true, 
      pixelRatio: 4, 
      style: { transform: 'scale(1) rotate(0deg) translateY(0px)' } 
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `sinaunang-baybayin-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error('Failed to export image', err));
  };

  const handleMorphToArt = () => {
    if (isArtMode) return;
    setIsGeneratingArt(true);
    setTimeout(() => {
      setArtBgIndex(Math.floor(Math.random() * 11) + 1);
      setIsArtMode(true);
      setIsGeneratingArt(false);
    }, 3500); 
  };

  const handleCopyBaybayin = async () => {
    if (!baybayinOutput) return;
    try {
      await navigator.clipboard.writeText(baybayinOutput);
      setIsBaybayinCopied(true);
      setTimeout(() => setIsBaybayinCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleCopy = async () => {
    if (!translation) return;
    try {
      await navigator.clipboard.writeText(translation);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleCopyExample = async () => {
    if (!example?.tagalogSentence) return;
    try {
      await navigator.clipboard.writeText(example.tagalogSentence);
      setIsExampleCopied(true);
      setTimeout(() => setIsExampleCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const prefetchAudio = async (text: string, setter: React.Dispatch<React.SetStateAction<string | null>>, lang: string = 'fil-PH') => {
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang })
      });
      if (res.ok) {
        const blob = await res.blob();
        setter(URL.createObjectURL(blob));
      }
    } catch (err) {
      console.error('Audio prefetch failed', err);
    }
  };

  const fetchFunFact = async (english: string, tagalog: string) => {
    setIsLoadingFunFact(true);
    setFunFact(null);
    try {
      const res = await fetch('/api/funfact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ englishWord: english, tagalogWord: tagalog })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.fact) setFunFact(data.fact);
      }
    } catch (err) {
      console.error('Fun fact fetch failed', err);
    } finally {
      setIsLoadingFunFact(false);
    }
  };

  const handleTranslate = async () => {
    if (!englishWord.trim()) return;
    playTapSound();

    setIsLoading(true);
    setTranslation('');
    setExample(null);
    setFunFact(null);
    setAudioUrl(null);
    setExampleAudioUrl(null);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: englishWord, direction, inputMode }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.translation) {
        setTranslation(data.translation);
        playResultBamSound();
        setTimeout(() => {
          resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
        
        setHistory(prev => {
          const newEntry = { english: englishWord, tagalog: data.translation, direction };
          const filtered = prev.filter(item => item.english.toLowerCase() !== englishWord.toLowerCase());
          return [newEntry, ...filtered].slice(0, 10);
        });

        prefetchAudio(data.translation, setAudioUrl, direction === 'en-tl' ? 'fil-PH' : 'en-US');
        fetchFunFact(englishWord, data.translation);
      }
    } catch (error: any) {
      console.error('Translation error:', error);
      setErrorMsg(error.message || 'Translation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (url: string | null) => {
    if (!url) return;
    
    if (currentAudioRef.current) {
      const isSameAudio = currentAudioUrlRef.current === url;
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
      currentAudioUrlRef.current = null;
      
      if (isSameAudio) return; 
    }
    
    const audio = new Audio(url);
    currentAudioRef.current = audio;
    currentAudioUrlRef.current = url;
    
    audio.play().catch(e => console.error("Audio play failed:", e));
    
    audio.onended = () => {
      if (currentAudioUrlRef.current === url) {
        currentAudioRef.current = null;
        currentAudioUrlRef.current = null;
      }
    };
  };

  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = direction === 'en-tl' ? 'en-US' : 'fil-PH';
    recognition.interimResults = false;

    recognition.onstart = () => { setIsRecording(true); };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setEnglishWord(transcript);
    };
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
    };
    recognition.onend = () => { setIsRecording(false); };

    recognition.start();
  };

  const handleShowExample = async () => {
    if (!translation || exampleCooldown) return;
    setIsLoadingExample(true);

    try {
      const response = await fetch('/api/example', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          englishWord: direction === 'en-tl' ? englishWord : translation,
          tagalogWord: direction === 'tl-en' ? englishWord : translation,
          direction
        }),
      });

      if (response.status === 429) {
        const data = await response.json();
        setExampleCooldown(data.retryAfter ?? 60);
        return;
      }

      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const data = await response.json();
      const targetSentence = data.targetSentence || data.tagalogSentence;

      if (targetSentence) {
        setExample({
          tagalogSentence: targetSentence,
          englishTranslation: data.sourceTranslation || data.englishTranslation
        });
        setTimeout(() => {
          exampleSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
        const textToSpeak = direction === 'en-tl' ? targetSentence : (data.sourceTranslation || data.englishTranslation);
        prefetchAudio(textToSpeak, setExampleAudioUrl, direction === 'en-tl' ? 'fil-PH' : 'en-US');
      }
    } catch (error) {
      console.error('Example generation error:', error);
    } finally {
      setIsLoadingExample(false);
    }
  };

  return (
    <>
      <h1 className="sr-only">Baybayin Translate — Elite Tagalog & Filipino Image Translator</h1>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&family=Permanent+Marker&family=Knewave&family=Neucha&family=Dela+Gothic+One&family=Oswald:wght@700&family=DynaPuff:wght@600;700&family=Chewy&family=Fredoka:wght@600;700&family=Anton&family=Barlow+Condensed:ital,wght@0,900;1,900&display=swap');
          .font-title { font-family: 'Permanent Marker', cursive; }
          .font-box { font-family: 'Gloria Hallelujah', cursive; }
          .font-tribal-title { font-family: 'Knewave', cursive; }
          .font-tribal-text { font-family: 'Neucha', cursive; }
          .font-cubao { font-family: 'CubaoFree', 'Anton', sans-serif; letter-spacing: 0.04em; }
          .font-quiapo { font-family: 'QuiapoFree', cursive; letter-spacing: 0.04em; }
          html {
            overflow-y: scroll;
            scrollbar-gutter: stable;
          }
          button:focus, button:active, button:focus-visible, svg:focus, svg:active {
            outline: none !important;
            outline-style: none !important;
            box-shadow: none !important;
          }
        `}
      </style>

      {/* Loading Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${nextMode === 'baybayin' ? 'bg-[#12100E]' : 'bg-[#D6CEB5]'}`}
            style={nextMode !== 'baybayin' ? {
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.12'/%3E%3C/svg%3E")`
            } : undefined}
          >
            {nextMode === 'baybayin' ? (
              <div className="flex flex-col items-center text-white">
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                  transition={{ rotate: { duration: 3, repeat: Infinity, ease: "linear" }, scale: { duration: 1.5, repeat: Infinity } }}
                  className="mb-8"
                >
                  <TribalSun />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="font-tribal-title text-2xl tracking-[0.2em] opacity-80"
                >
                  PAG-UKIT NG BAYBAYIN...
                </motion.p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-[#1A1A1A]">
                <motion.div
                  animate={{ y: [0, -20, 0], scale: [1, 1.05, 1], rotate: [-2, 2, -2] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="mb-8 relative flex items-center justify-center w-32 h-32"
                >
                  {/* Shadow */}
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                    <g fill="#1A1A1A" stroke="#1A1A1A" strokeWidth="6" strokeLinejoin="round">
                      <use href="#standard-star" transform="translate(1.5, 1.5)" />
                      <use href="#standard-star" transform="translate(3, 3)" />
                      <use href="#standard-star" transform="translate(4.5, 4.5)" />
                      <use href="#standard-star" transform="translate(6, 6)" />
                      <use href="#standard-star" transform="translate(7.5, 7.5)" />
                    </g>
                  </svg>
                  {/* Main Star */}
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-[#1A1A1A]">
                    <use 
                      href="#standard-star" 
                      stroke="#1A1A1A" 
                      strokeWidth="6" 
                      strokeLinejoin="round" 
                      className="fill-[#FCD116]"
                    />
                  </svg>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="font-black text-2xl uppercase tracking-widest text-center"
                >
                  RETURNING TO TAGALOG SUPREME TRANSLATOR...
                </motion.p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main App Container */}
      <main
        className={`min-h-[100dvh] font-sans p-6 pb-[calc(4.5rem+env(safe-area-inset-bottom))] flex flex-col items-center justify-start overflow-x-hidden relative ${appMode === 'translator' ? 'text-[#1A1A1A] selection:bg-[#93C5FD]' : 'text-[#2C2825] selection:bg-[#D4C3A3]'}`}
      >
        {/* Global SVG Defs */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <polygon id="standard-star" points="50,8 62,34 90,37 69,56 75,84 50,70 25,84 31,56 10,37 38,34" />
            <g id="tribal-mark">
              <circle cx="50" cy="50" r="14" />
              <circle cx="50" cy="26" r="3" />
              <circle cx="67" cy="33" r="3" />
              <circle cx="74" cy="50" r="3" />
              <circle cx="67" cy="67" r="3" />
              <circle cx="50" cy="74" r="3" />
              <circle cx="33" cy="67" r="3" />
              <circle cx="26" cy="50" r="3" />
              <circle cx="33" cy="33" r="3" />
              <path d="M 50 2 L 56 16 L 44 16 Z M 84 16 L 78.2 30.2 L 69.8 21.8 Z M 98 50 L 84 56 L 84 44 Z M 84 84 L 69.8 78.2 L 78.2 69.8 Z M 50 98 L 44 84 L 56 84 Z M 16 84 L 21.8 69.8 L 30.2 78.2 Z M 2 50 L 16 44 L 16 56 Z M 16 16 L 30.2 21.8 L 21.8 30.2 Z" />
            </g>
            <g id="tribal-history" strokeLinecap="round">
              {/* Outer Crossed Lines (Rotated Tic-Tac-Toe) */}
              <path d="M 65 10 L 10 65" fill="none" />
              <path d="M 35 10 L 90 65" fill="none" />
              <path d="M 10 35 L 65 90" fill="none" />
              <path d="M 90 35 L 35 90" fill="none" />
              
              {/* Inner Diamond */}
              <polygon points="50,37 63,50 50,63 37,50" fill="none" strokeLinejoin="round" />
              
              {/* Dots */}
              <circle cx="50" cy="50" r="5.5" fill="currentColor" stroke="none" />
              <circle cx="50" cy="12" r="5.5" fill="currentColor" stroke="none" />
              <circle cx="88" cy="50" r="5.5" fill="currentColor" stroke="none" />
              <circle cx="50" cy="88" r="5.5" fill="currentColor" stroke="none" />
              <circle cx="12" cy="50" r="5.5" fill="currentColor" stroke="none" />
            </g>
            <g id="tribal-arrow" strokeLinecap="round">
              <path d="M 13 50 L 55 50" fill="none" />
              <path d="M 28 35 L 13 50 L 28 65" fill="none" />
              <path d="M 38 35 L 23 50 L 38 65" fill="none" />
              <path d="M 48 35 L 33 50 L 48 65" fill="none" />
              <polygon points="63,42 71,50 63,58 55,50" fill="none" />
              <circle cx="83" cy="50" r="5.5" fill="currentColor" stroke="none" />
              <circle cx="63" cy="30" r="5.5" fill="currentColor" stroke="none" />
              <circle cx="63" cy="70" r="5.5" fill="currentColor" stroke="none" />
            </g>
          </defs>
        </svg>
        {/* =========================================================================
            LAYERED BARONG EMBROIDERY BACKGROUND (Scale-Adaptive Premium Craft)
            ========================================================================= */}
        {appMode === 'translator' ? (
          <motion.div
            className="fixed inset-0 -z-20 pointer-events-none bg-[#EBE2D3]"
            animate={isGeneratingArt ? {
              filter: "invert(1) hue-rotate(180deg)",
              backgroundPositionY: ["0px", "50px", "0px", "-50px", "0px"]
            } : {
              filter: "invert(0) hue-rotate(0deg)",
              backgroundPositionY: "0px"
            }}
            transition={isGeneratingArt ? {
              backgroundPositionY: { repeat: Infinity, duration: 3.5, ease: "linear" },
              filter: { duration: 0.4 }
            } : { duration: 0.4 }}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg stroke='%23B8A892' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M 50 15 L 50 85 M 15 50 L 85 50' stroke-dasharray='1 4' stroke-width='2'/%3E%3Cpolygon points='50,5 95,50 50,95 5,50'/%3E%3Cpolygon points='50,15 85,50 50,85 15,50' stroke-dasharray='4 3'/%3E%3Cpolygon points='50,25 75,50 50,75 25,50'/%3E%3Cpath d='M 50 35 L 55 45 L 65 50 L 55 55 L 50 65 L 45 55 L 35 50 L 45 45 Z' fill='%23B8A892' fill-opacity='0.15'/%3E%3Cpolygon points='0,25 25,0 0,-25 -25,0'/%3E%3Cpolygon points='100,25 125,0 100,-25 75,0'/%3E%3Cpolygon points='0,125 25,100 0,75 -25,100'/%3E%3Cpolygon points='100,125 125,100 100,75 75,100'/%3E%3Cpolygon points='0,15 15,0 0,-15 -15,0' stroke-dasharray='2 3'/%3E%3Cpolygon points='100,15 115,0 100,-15 85,0' stroke-dasharray='2 3'/%3E%3Cpolygon points='0,115 15,100 0,85 -15,100' stroke-dasharray='2 3'/%3E%3Cpolygon points='100,115 115,100 100,85 85,100' stroke-dasharray='2 3'/%3E%3Cpath d='M 25 0 L 37.5 12.5 L 50 0 L 62.5 12.5 L 75 0'/%3E%3Cpath d='M 25 100 L 37.5 87.5 L 50 100 L 62.5 87.5 L 75 100'/%3E%3Cpath d='M 0 25 L 12.5 37.5 L 0 50 L 12.5 62.5 L 0 75'/%3E%3Cpath d='M 100 25 L 87.5 37.5 L 100 50 L 87.5 62.5 L 100 75'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '55px 55px',
              backgroundRepeat: 'repeat',
              transform: 'translateZ(0)',
              willChange: 'transform'
            }}
          />
        ) : (
          /* Precolonial Baybayin Mode Background (Isolated State) */
          <motion.div
            className="fixed inset-0 -z-10 pointer-events-none bg-[#F6F5F2]"
            animate={isGeneratingArt ? {
              filter: "invert(1) hue-rotate(180deg)",
              backgroundPositionY: ["0px", "100px", "0px", "-100px", "0px"]
            } : {
              filter: "invert(0) hue-rotate(0deg)",
              backgroundPositionY: "0px"
            }}
            transition={isGeneratingArt ? {
              backgroundPositionY: { repeat: Infinity, duration: 3.5, ease: "linear" },
              filter: { duration: 0.4 }
            } : { duration: 0.4 }}
            style={{
              backgroundImage: `url("data:image/svg+xml,${BAYBAYIN_BG_SVG}")`,
              backgroundSize: '400px 400px',
              backgroundRepeat: 'repeat',
              transform: 'translateZ(0)'
            }}
          />
        )}

        {/* Layer 3: Hardware-Accelerated Film Grain Noise Overlay (Unified Texture) */}
        <div
          className="fixed inset-0 -z-10 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            transform: 'translateZ(0)'
          }}
        />

        {/* Top Controls */}
        <div className="w-full max-w-4xl flex justify-between items-center z-40 mb-2 relative">
          {/* Mode Switch Star */}
          <motion.button
            ref={baybayinBtnRef as any}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleModeSwitch(appMode === 'translator' ? 'baybayin' : 'translator')}
            className="relative flex items-center justify-center w-14 h-14 group focus:outline-none focus-visible:outline-none [-webkit-tap-highlight-color:transparent]"
            title={appMode === 'translator' ? 'Reveal the past...' : 'Return to translator'}
          >
            {/* Shadow */}
            {appMode === 'translator' && (
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                <g fill="#1A1A1A" stroke="#1A1A1A" strokeWidth="6" strokeLinejoin="round">
                  <use href="#standard-star" transform="translate(1.5, 1.5)" />
                  <use href="#standard-star" transform="translate(3, 3)" />
                  <use href="#standard-star" transform="translate(4.5, 4.5)" />
                  <use href="#standard-star" transform="translate(6, 6)" />
                  <use href="#standard-star" transform="translate(7.5, 7.5)" />
                </g>
              </svg>
            )}
            {/* Main Star */}
            <div className={`absolute inset-0 w-full h-full flex items-center justify-center transition-transform duration-150 ${appMode === 'translator' ? 'text-[#1A1A1A]' : 'text-[#2C2825]'}`}>
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                <use 
                  href={appMode === 'translator' ? "#standard-star" : "#tribal-arrow"} 
                  stroke={appMode === 'translator' ? '#1A1A1A' : '#2C2825'} 
                  strokeWidth={appMode === 'translator' ? "6" : "5.5"} 
                  strokeLinejoin="round" 
                  className={`transition-colors duration-150 ${appMode === 'translator' ? 'fill-[#FCD116] group-hover:fill-[#EAB308]' : 'fill-[#F6F5F2] group-hover:fill-white'}`}
                />
              </svg>
            </div>
          </motion.button>

          {/* History Star */}
          <motion.button
            ref={historyBtnRef as any}
            whileTap={{ scale: 0.95 }}
            onClick={() => appMode === 'translator' ? setShowHistory(true) : setShowBaybayinHistory(true)}
            className="relative flex items-center justify-center w-14 h-14 group focus:outline-none focus-visible:outline-none [-webkit-tap-highlight-color:transparent]"
            title={appMode === 'translator' ? 'History' : 'Baybayin History'}
          >
            {/* Shadow */}
            {appMode === 'translator' && (
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                <g fill="#1A1A1A" stroke="#1A1A1A" strokeWidth="6" strokeLinejoin="round">
                  <use href="#standard-star" transform="translate(1.5, 1.5)" />
                  <use href="#standard-star" transform="translate(3, 3)" />
                  <use href="#standard-star" transform="translate(4.5, 4.5)" />
                  <use href="#standard-star" transform="translate(6, 6)" />
                  <use href="#standard-star" transform="translate(7.5, 7.5)" />
                </g>
              </svg>
            )}
            {/* Main Star */}
            <div className={`absolute inset-0 w-full h-full flex items-center justify-center transition-transform duration-150 ${appMode === 'translator' ? 'text-[#1A1A1A]' : 'text-[#2C2825]'}`}>
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                <use 
                  href={appMode === 'translator' ? "#standard-star" : "#tribal-history"} 
                  stroke={appMode === 'translator' ? '#1A1A1A' : '#2C2825'} 
                  strokeWidth={appMode === 'translator' ? "6" : "5.5"} 
                  strokeLinejoin="round" 
                  className={`transition-colors duration-150 ${appMode === 'translator' ? 'fill-[#FCD116] group-hover:fill-[#EAB308]' : 'fill-[#F6F5F2] group-hover:fill-white'}`}
                />
              </svg>
            </div>
          </motion.button>
        </div>

        {/* History Modal (Translator) */}
        {showHistory && appMode === 'translator' && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white border-[6px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] rounded-[25px] p-6 w-full max-w-md relative max-h-[80vh] flex flex-col">
              <button
                onClick={() => setShowHistory(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-white border-[4px] border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] rounded-full flex items-center justify-center transition-all duration-150 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none hover:bg-gray-50 z-10"
              >
                <X className="w-5 h-5 stroke-[4] text-[#1A1A1A]" />
              </button>
              <h2 className="text-3xl font-black text-[#1A1A1A] mb-6 uppercase tracking-tight pr-12">History</h2>
              <div className="overflow-y-auto flex-1 pr-2 space-y-4">
                {history.length === 0 ? (
                  <p className="text-gray-500 font-bold text-center italic py-8">No translation history yet.</p>
                ) : (
                  history.map((item, index) => (
                    <div key={index} className="bg-gray-50 border-[4px] border-[#1A1A1A] rounded-xl p-4 flex flex-col gap-1 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => {
                      setDirection(item.direction || 'en-tl');
                      setEnglishWord(item.english);
                      setTranslation(item.tagalog);
                      setShowHistory(false);
                      setExample(null);
                      setFunFact(null);
                      setAudioUrl(null);
                      setExampleAudioUrl(null);
                    }}>
                      <span className="text-sm font-black text-gray-500 uppercase">{item.direction === 'tl-en' ? 'Tagalog' : 'English'}: {item.english}</span>
                      <span className="text-xl font-box text-[#1A1A1A]">{item.tagalog}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* History Modal (Baybayin) */}
        {showBaybayinHistory && appMode === 'baybayin' && (
          <div className="fixed inset-0 bg-[#F6F5F2]/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-[#F6F5F2] border-[6px] border-[#2C2825] shadow-[12px_12px_0px_0px_#2C2825] rounded-[255px_25px_225px_25px/25px_225px_25px_255px] p-6 w-full max-w-md relative max-h-[80vh] flex flex-col">
              <button
                onClick={() => setShowBaybayinHistory(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-[#F6F5F2] border-[4px] border-[#2C2825] shadow-[4px_4px_0px_0px_#2C2825] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] flex items-center justify-center transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none hover:bg-[#EAE6DF] z-10"
              >
                <X className="w-6 h-6 stroke-[3] text-[#2C2825]" />
              </button>
              <h2 className="text-2xl font-tribal-title text-[#2C2825] mb-6 uppercase tracking-wider pr-12">Script History</h2>
              <div className="overflow-y-auto flex-1 pr-2 space-y-4">
                {baybayinHistory.length === 0 ? (
                  <p className="text-[#2C2825]/60 font-tribal-text text-xl text-center italic py-8 uppercase tracking-widest">No scripts carved yet.</p>
                ) : (
                  baybayinHistory.map((item, index) => (
                    <div key={index} className="bg-[#F6F5F2] border-[4px] border-[#2C2825] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] p-4 flex flex-col gap-2 cursor-pointer hover:bg-[#EAE6DF] transition-colors" onClick={() => {
                      setBaybayinInput(item.input);
                      setBaybayinOutput(item.output);
                      setShowBaybayinHistory(false);
                    }}>
                      <span className="text-lg font-tribal-text text-[#2C2825]/60 uppercase tracking-widest">{item.input}</span>
                      <span className="text-4xl text-[#2C2825] text-left" style={{ fontFamily: "'Noto Sans Tagalog', sans-serif" }}>{item.output}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Translator Mode Layout */}
        {appMode === 'translator' && (
          <div className="w-full max-w-md z-10 flex flex-col items-center pt-4 pb-12 animate-in fade-in duration-500">
            {/* Header: 3-Tier KTS-Style Architecture */}
            <div className="w-full flex flex-col items-center justify-center relative mb-12 mt-4 select-none z-20">
              
              {/* TIER 1: SVG Curved "TAGALOG" Text (Martires Font) */}
              <div className="relative w-[320px] md:w-[380px] h-[100px] -mb-6 z-20">
                <svg viewBox="0 0 400 120" className="w-full h-full overflow-visible">
                  {/* The invisible path that dictates the curve - extended safely to avoid SVG textPath glyph clipping */}
                  <path id="tagalog-curve" fill="transparent" d="M 0,110 Q 200,10 400,110" />
                  
                  {/* Fiesta Banderitas (Hanging from T to G) */}
                  <g style={{ filter: "drop-shadow(2px 3px 0px rgba(0,0,0,0.25))" }}>
                    {/* The String */}
                    <path d="M 30,70 Q 200,165 370,70" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
                    
                    {/* The Flags & Parol Centerpiece */}
                    {[
                      { cx: 81, cy: 94, rot: 21.4, fill: "#0032A0", dur: 2.2, del: 0.1, swing: [-1, 2, -2, 1, -1], type: 'flag' },
                      { cx: 115, cy: 106, rot: 15.6, fill: "#BF0D3E", dur: 2.5, del: 0.4, swing: [-2, 1, -1, 2, -2], type: 'flag' },
                      { cx: 157.5, cy: 114.5, rot: 8.0, fill: "#00A550", dur: 2.1, del: 0.2, swing: [-1, 2, -1, 1, -1], type: 'flag' },
                      { cx: 200, cy: 117.5, rot: 0, fill: "", dur: 3.5, del: 0.0, swing: [-1.5, 2, -1, 1.5, -1.5], type: 'parol' },
                      { cx: 242.5, cy: 114.5, rot: -8.0, fill: "#FED141", dur: 2.3, del: 0.0, swing: [-1, 1, 0, 2, -1], type: 'flag' },
                      { cx: 285, cy: 106, rot: -15.6, fill: "#FFFFFF", dur: 2.6, del: 0.3, swing: [-2, 1, -1, 2, -2], type: 'flag' },
                      { cx: 319, cy: 94, rot: -21.4, fill: "#0032A0", dur: 2.4, del: 0.6, swing: [-1, 2, -2, 1, -1], type: 'flag' }
                    ].map((item, i) => (
                      <g key={i} transform={`translate(${item.cx}, ${item.cy}) rotate(${item.rot})`}>
                        <motion.g
                          transformOrigin="0px -1.5px"
                          animate={{ rotate: item.swing }}
                          transition={{ repeat: Infinity, duration: item.dur, ease: "easeInOut", delay: item.del }}
                        >
                          {item.type === 'flag' ? (
                            <polygon points="-11,0 11,0 0,33" fill={item.fill} stroke="#1A1A1A" strokeWidth="2.5" strokeLinejoin="round" />
                          ) : (
                            <g className="parol-star">
                              {/* Outer Yellow Star */}
                              <polygon points="0,0 6,17 24,17 9,28 15,45 0,35 -15,45 -9,28 -24,17 -6,17" fill="#FED141" stroke="#1A1A1A" strokeWidth="2.5" strokeLinejoin="round" />
                              
                              {/* 5 Tip Tassels */}
                              {[
                                { x: 0, y: 0, r: 0 },
                                { x: 24, y: 17, r: 72 },
                                { x: 15, y: 45, r: 144 },
                                { x: -15, y: 45, r: 216 },
                                { x: -24, y: 17, r: 288 }
                              ].map((tip, idx) => (
                                <g key={idx} transform={`translate(${tip.x}, ${tip.y}) rotate(${tip.r})`}>
                                  <path d="M 0,0 L -3,-5 L -1,-6 L 0,-5 L 1,-6 L 3,-5 Z" fill="#FED141" stroke="#1A1A1A" strokeWidth="1.5" strokeLinejoin="round" />
                                </g>
                              ))}

                              {/* White Inner Circle */}
                              <circle cx="0" cy="25" r="11" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2" />
                              
                              {/* Green Inner Star */}
                              <polygon points="0,17 2,22.5 7.5,22.5 3,26 4.5,31.5 0,28.5 -4.5,31.5 -3,26 -7.5,22.5 -2,22.5" fill="#00A550" stroke="#1A1A1A" strokeWidth="1.5" strokeLinejoin="round" />
                            </g>
                          )}
                        </motion.g>
                      </g>
                    ))}
                  </g>

                  <g style={{ filter: "drop-shadow(4px 4px 3px rgba(0,0,0,0.3))" }}>
                    {/* Outline Layer (Drawn first, underneath) - fixed SVG coordinate sizing to prevent double-scaling clipping */}
                    <text className="uppercase" stroke="#FFFFFF" strokeWidth="16" strokeLinejoin="round" strokeLinecap="round" fill="none" style={{ fontFamily: "'Dela Gothic One', sans-serif", fontSize: '56px' }}>
                      <textPath href="#tagalog-curve" startOffset="50%" textAnchor="middle">
                        TAGALOG
                      </textPath>
                    </text>
                    
                    {/* Fill Layer (Drawn second, on top) */}
                    <text className="uppercase fill-[#0032A0]" style={{ fontFamily: "'Dela Gothic One', sans-serif", fontSize: '56px' }}>
                      <textPath href="#tagalog-curve" startOffset="50%" textAnchor="middle">
                        TAGALOG
                      </textPath>
                    </text>
                  </g>
                </svg>
              </div>

              {/* TIER 2: Central Focal Image (Tcharacters.webp) */}
              <motion.img
                src="/Tcharacters.webp"
                alt="Tagalog Characters"
                className="w-[280px] md:w-[340px] relative z-10"
                style={{ filter: "drop-shadow(4px 4px 3px rgba(0,0,0,0.3))" }}
                animate={{ y: [-3, 3, -3], rotate: [-1, 1, -1] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              />

              {/* TIER 3: Subtitle (DynaPuff Font - Akakios Style) */}
              <h2
                className="text-[1.4rem] md:text-[1.7rem] uppercase mt-2 z-20"
                style={{
                  fontFamily: "'DynaPuff', sans-serif",
                  filter: 'drop-shadow(2px 2px 1.5px rgba(0,0,0,0.15))',
                  WebkitTextStroke: '2px #1A1A1A',
                  paintOrder: 'stroke fill',
                  fontWeight: 700,
                  letterSpacing: '0.05em'
                }}
              >
                <span className="text-[#BF0D3E]">—</span> <span className="text-white">Translator</span> <span className="text-white">Supreme</span> <span className="text-[#FED141]">—</span>
              </h2>
            </div>

            {/* ── MODE TOGGLE — Jeepney Route Plate ── */}
            <div className="w-full z-10 relative mb-6">
              {/* Plate frame — black anodised jeepney trim */}
              <div
                className="flex bg-[#1A1A1A] border-[4px] border-[#1A1A1A] rounded-[12px] p-1 shadow-[5px_5px_0px_0px_#000] overflow-hidden"
                style={{ transform: 'rotate(-0.5deg)' }}
              >
                <button
                  onClick={() => handleInputModeChange('word')}
                  className={`flex-1 px-4 py-2.5 text-sm font-black uppercase rounded-[8px] tracking-widest transition-all duration-150 ${
                    inputMode === 'word'
                      ? 'bg-[#FCD116] text-[#1A1A1A] shadow-[inset_0_-3px_0px_rgba(0,0,0,0.3)]'
                      : 'text-[#FCD116]/60 hover:text-[#FCD116]'
                  }`}
                  style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: '0.15em' }}
                >
                  ★ WORD
                </button>
                <button
                  onClick={() => handleInputModeChange('conversation')}
                  className={`flex-1 px-4 py-2.5 text-sm font-black uppercase rounded-[8px] tracking-widest transition-all duration-150 ${
                    inputMode === 'conversation'
                      ? 'bg-[#FCD116] text-[#1A1A1A] shadow-[inset_0_-3px_0px_rgba(0,0,0,0.3)]'
                      : 'text-[#FCD116]/60 hover:text-[#FCD116]'
                  }`}
                  style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: '0.15em' }}
                >
                  ★ CONVERSATION
                </button>
              </div>
            </div>

            {/* ── INPUT BOX — Cobalt Blue RECTO/CUBAO style ── */}
            <div className="w-full z-10 relative mb-6" style={{ transform: 'rotate(0.6deg)' }}>

              {/* Direction swap row */}
              <div className="flex items-center justify-end mb-2 px-1">
                <button
                  onClick={handleSwap}
                  className="jeep-btn flex items-center justify-center gap-2 bg-[#FFE5B4] px-3 py-2 text-sm shadow-[3px_3px_0px_0px_#1A1A1A] hover:bg-[#FFDAB9]"
                  title="Swap Translation Direction"
                >
                  {direction === 'en-tl' ? (
                    <><UKFlag className="-rotate-3" /> <span className="font-quiapo text-[1.15rem] tracking-wide mt-1">EN</span> <ArrowLeftRight className="w-4 h-4 stroke-[3]" /> <PHFlag className="rotate-3" /> <span className="font-quiapo text-[1.15rem] tracking-wide mt-1">TL</span></>
                  ) : (
                    <><PHFlag className="-rotate-3" /> <span className="font-quiapo text-[1.15rem] tracking-wide mt-1">TL</span> <ArrowLeftRight className="w-4 h-4 stroke-[3]" /> <UKFlag className="rotate-3" /> <span className="font-quiapo text-[1.15rem] tracking-wide mt-1">EN</span></>
                  )}
                </button>
              </div>

              {/* Placard card — MAKATI style: amber/gold bg, dark navy text */}
              <div ref={inputCardRef} className="jeep-card shadow-[7px_7px_0px_0px_#1A1A1A] border-[5px] border-[#1A1A1A]">

                {/* Header strip — MAKATI amber with navy text */}
                <div className="jeep-strip bg-[#D4961A] text-[#1A2464] jeep-rivet">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={direction}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      className="ml-5 font-cubao text-[1.25rem]"
                    >
                      {direction === 'en-tl' ? 'ENGLISH WORD' : 'TAGALOG WORD'}
                    </motion.span>
                  </AnimatePresence>
                  <span className="ml-auto mr-5 font-cubao text-[#1A2464]/80 text-[0.8rem]">INPUT</span>
                </div>

                {/* Body — pure white bg */}
                <div className="bg-[#FFFFFF] p-5 flex items-center relative min-h-[100px]">
                  <textarea
                    id="english-input"
                    value={englishWord}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (inputMode === 'conversation' && val.length > 500) return;
                      setEnglishWord(val);
                      setErrorMsg(null);
                      if (val.trim() === '') {
                        setTranslation('');
                        setExample(null);
                        setFunFact(null);
                        setAudioUrl(null);
                        setExampleAudioUrl(null);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleTranslate();
                      }
                    }}
                    className={`flex-1 bg-transparent outline-none placeholder:text-[#0032A0]/30 w-full text-[#1A1A1A] resize-none transition-all duration-300 font-box ${inputMode === 'conversation' ? 'min-h-[120px] text-2xl leading-relaxed' : 'min-h-[3rem] text-2xl overflow-hidden'}`}
                    placeholder={inputMode === 'conversation' ? 'Type a full sentence or paragraph here...' : `e.g. ${currentPlaceholder}`}
                  />
                  {inputMode === 'conversation' && <span className="absolute bottom-2 right-20 text-xs font-black text-[#0032A0]/40">{englishWord.length}/500</span>}
                  {/* Mic — red circle jeepney button */}
                  <button
                    onClick={handleMicClick}
                    className={`jeep-btn w-14 h-14 ml-3 rounded-full flex flex-shrink-0 items-center justify-center shadow-[4px_4px_0px_0px_#1A1A1A] ${isRecording ? 'bg-[#BF0D3E] border-[#BF0D3E]' : 'bg-[#BF0D3E] border-[#1A1A1A] hover:bg-[#A00C34]'}`}
                    title="Speak to translate"
                  >
                    <Mic className="w-7 h-7 stroke-[3] text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* ── TRANSLATE! BUTTON — RECTO style: navy + white + red accent ── */}
            <div className="relative self-center z-10 w-full mb-10 mt-6">
              
              <motion.div className="absolute -top-5 -right-3 z-30 pointer-events-none drop-shadow-[2px_2px_0px_#1A1A1A]" animate={{ y: [0, -8, 0], rotate: [0, 5, 0], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2.5 }}>
                <Sparkle />
              </motion.div>

              <motion.button
                whileHover={isLoading ? {} : { scale: 1.02, y: -2 }}
                whileTap={isLoading ? {} : { scale: 0.97, x: 5, y: 5 }}
                animate={{
                  backgroundColor: isLoading
                    ? ['#1A2464', '#D4961A', '#2BA8A8', '#1A1A1A', '#1A2464']
                    : '#1A2464'
                }}
                transition={{ backgroundColor: isLoading ? { repeat: Infinity, duration: 0.6, ease: 'linear' } : { duration: 0.15 } }}
                onClick={handleTranslate}
                disabled={isLoading || !englishWord.trim()}
                className="w-full text-white py-5 border-[5px] border-[#1A1A1A] shadow-[7px_7px_0px_0px_#1A1A1A] rounded-[16px] disabled:opacity-70 disabled:cursor-not-allowed min-h-[72px] flex items-center justify-center relative overflow-hidden"
              >
                {/* Red RECTO accent bar at top */}
                <div className="absolute inset-x-0 top-0 h-[6px] bg-[#BF0D3E] pointer-events-none" />
                {/* Inner gloss stripe */}
                <div className="absolute inset-x-0 top-[6px] h-[35%] bg-white/8 pointer-events-none" />
                {isLoading ? (
                  <Loader2 className="w-10 h-10 animate-spin stroke-[3]" />
                ) : (
                  <span className="font-cubao text-[2.25rem] tracking-[0.06em]" style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.5)' }}>TRANSLATE!</span>
                )}
              </motion.button>

              {errorMsg && (
                <div className="mt-4 p-4 bg-red-100 border-[4px] border-[#1A1A1A] rounded-xl text-[#1A1A1A] font-black flex items-start gap-3 shadow-[4px_4px_0px_0px_#1A1A1A]">
                  <X className="w-6 h-6 shrink-0 mt-0.5 text-red-500" />
                  <span className="flex-1 uppercase">{errorMsg}</span>
                </div>
              )}
            </div>

            {/* ── OUTPUT BOX — Green BACLARAN LRT placard ── */}
            {(translation || isLoading) && (
              <div ref={resultSectionRef} className="w-full z-10 relative mb-10 animate-in fade-in slide-in-from-bottom-6 duration-300" style={{ transform: 'rotate(-0.8deg)' }}>

                <div className="relative">
                    <motion.div
                      className="absolute -left-[80px] top-1/2 -translate-y-1/2 drop-shadow-md z-0"
                      initial={{ scale: 0, rotate: 0 }}
                      animate={{ scale: 1, rotate: [0, -4, 0] }}
                      transition={{ 
                        scale: { delay: 0.2, duration: 0.3 },
                        rotate: { repeat: Infinity, duration: 4, ease: "easeInOut" }
                      }}
                      style={{ transformOrigin: "100% 20%" }}
                    >
                      <EagleWing />
                    </motion.div>
                    <motion.div
                      className="absolute -right-[80px] top-1/2 -translate-y-1/2 drop-shadow-md z-0"
                      initial={{ scale: 0, rotate: 0 }}
                      animate={{ scale: 1, rotate: [0, 4, 0] }}
                      transition={{ 
                        scale: { delay: 0.2, duration: 0.3 },
                        rotate: { repeat: Infinity, duration: 4, ease: "easeInOut" }
                      }}
                      style={{ transformOrigin: "0% 20%" }}
                    >
                      <EagleWing flipped />
                    </motion.div>

                  <motion.div
                    key={translation ? `result-${translation.substring(0, 10)}` : 'empty'}
                    initial={translation && !isLoading ? { scale: 0.85, rotate: -2, opacity: 0 } : { opacity: 1 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={translation && !isLoading ? {
                      scale: { type: 'spring', bounce: 0.65, duration: 0.6 },
                      opacity: { duration: 0.2 }
                    } : { duration: 0.2 }}
                    className="jeep-card shadow-[7px_7px_0px_0px_#1A1A1A] border-[5px] border-[#1A1A1A]"
                  >
                    {/* Header strip — QUIAPO teal with black text for better contrast */}
                    <div className="jeep-strip bg-[#2BA8A8] text-[#1A1A1A] jeep-rivet">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={direction}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          className="ml-5 font-cubao text-[1.25rem]"
                        >
                          {direction === 'en-tl' ? 'TAGALOG TRANSLATION' : 'ENGLISH TRANSLATION'}
                        </motion.span>
                      </AnimatePresence>
                      <span className="ml-auto mr-5 font-cubao text-[#1A1A1A]/70 text-[0.8rem]">OUTPUT</span>
                    </div>

                    {/* Body — pure white bg */}
                    <div className="bg-[#FFFFFF] p-8 flex flex-col items-center justify-center min-h-[180px] relative">
                      {translation && !isLoading && <PhParticles triggerKey={translation} />}
                      {isLoading ? (
                        <div className="flex flex-col items-center justify-center w-full animate-pulse gap-3">
                          <div className="h-10 bg-[#2BA8A8]/20 rounded-xl w-3/4"></div>
                          <div className="h-10 bg-[#2BA8A8]/15 rounded-xl w-1/2"></div>
                        </div>
                      ) : (
                        <>
                          <div className={`w-full ${inputMode === 'conversation' ? 'max-h-[250px] overflow-y-auto pr-4 mb-6' : 'mb-8'}`}>
                            <span className={`${inputMode === 'conversation' ? 'text-2xl font-box leading-relaxed text-left block' : 'text-3xl md:text-4xl font-box uppercase text-center'} text-[#1A1A1A] break-words w-full`}>
                              {translation}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 flex-wrap justify-center">
                            {inputMode === 'word' && (
                              <button
                                onClick={() => handleSpeak(audioUrl)}
                                disabled={!audioUrl}
                                className="jeep-btn flex items-center gap-3 bg-[#2BA8A8] text-[#1A1A1A] px-6 py-3 shadow-[4px_4px_0px_0px_#1A1A1A] hover:bg-[#219898] disabled:opacity-50 disabled:cursor-wait min-h-[52px] font-cubao text-[1.2rem]"
                              >
                                <Volume2 className="w-6 h-6 stroke-[3]" />
                                SPEAK
                              </button>
                            )}
                            <button
                              onClick={handleCopy}
                              className="jeep-btn flex items-center justify-center w-14 h-14 bg-white text-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] hover:bg-gray-50"
                              title="Copy to clipboard"
                            >
                              {isCopied ? <Check className="w-6 h-6 stroke-[4] text-green-500" /> : <Copy className="w-6 h-6 stroke-[4]" />}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {/* ── FUN FACT CARD — Golden MANILA PHILIPPINES placard ── */}
            {inputMode === 'word' && (funFact || isLoadingFunFact) && !isLoading && (
              <div className="w-full z-10 relative mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ transform: 'rotate(1deg)' }}>
                {/* EDSA style: black card, gold border, red accent */}
                <div className="jeep-card shadow-[7px_7px_0px_0px_#1A1A1A] border-[5px] border-[#1A1A1A]">

                  {/* Header strip — EDSA black with gold text, red accent bar at top */}
                  <div className="jeep-strip bg-[#FCD116] text-[#1A1A1A] jeep-rivet relative overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-[4px] bg-[#BF0D3E]" />
                    <Lightbulb className="w-4 h-4 ml-5 text-[#1A1A1A]" />
                    <span className="font-cubao text-[1.25rem]">DID YOU KNOW?</span>
                    <span className="ml-auto mr-5 font-cubao text-[#1A1A1A]/70 text-[0.8rem]">FUN FACT</span>
                  </div>

                  {/* Body — pure white bg */}
                  <div className="bg-[#FFFFFF] p-6">
                    {isLoadingFunFact ? (
                      <div className="animate-pulse space-y-2.5">
                        <div className="h-3.5 bg-[#D4961A]/20 rounded-full w-full"></div>
                        <div className="h-3.5 bg-[#D4961A]/15 rounded-full w-5/6"></div>
                        <div className="h-3.5 bg-[#D4961A]/10 rounded-full w-3/4"></div>
                      </div>
                    ) : (
                      <p className="text-2xl font-quiapo text-[#1A1A1A] leading-snug tracking-wide">
                        {funFact}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── EXAMPLE SECTION ── */}
            {inputMode === 'word' && translation && !isLoading && (
              <div className="w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-300">

                {!example && (
                  exampleCooldown ? (
                    /* Cooldown — PASIG PALENGKE: black + gold */
                    <div className="jeep-card shadow-[7px_7px_0px_0px_#1A1A1A] border-[5px] border-[#1A1A1A] mb-8">
                      <div className="jeep-strip bg-[#FCD116] text-[#1A1A1A] jeep-rivet">
                        <span className="ml-5 font-cubao text-[1.2rem]">⏳ ON COOLDOWN</span>
                      </div>
                      <div className="bg-[#F5F5F5] p-6 flex flex-col items-center gap-2 text-center">
                        <span className="text-5xl font-black text-[#1A1A1A]">{exampleCooldown}s</span>
                        <p className="text-lg font-black text-[#1A1A1A] uppercase tracking-tight leading-tight">
                          Sentence examples on cooldown!
                        </p>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                          You can keep translating words in the meantime ✌️
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Example button — Black NOVALICHES BAYAN night sign */
                    <button
                      onClick={handleShowExample}
                      disabled={isLoadingExample}
                      className="w-full mb-8 relative overflow-hidden rounded-[14px] border-[5px] border-[#1A1A1A] shadow-[7px_7px_0px_0px_#1A1A1A] bg-[#1A1A1A] hover:bg-[#2a2a2a] min-h-[68px] flex items-center justify-center gap-3 transition-all duration-150 active:translate-x-[7px] active:translate-y-[7px] active:shadow-none disabled:opacity-70"
                      style={{ transform: 'rotate(-0.5deg)' }}
                    >
                      {/* Gloss stripe */}
                      <div className="absolute inset-x-0 top-0 h-[35%] bg-white/5 pointer-events-none" />
                      {/* Left yellow accent bar */}
                      <div className="absolute left-0 inset-y-0 w-2 bg-[#FCD116]" />
                      {/* Right yellow accent bar */}
                      <div className="absolute right-0 inset-y-0 w-2 bg-[#FCD116]" />
                      {isLoadingExample ? (
                        <Loader2 className="w-8 h-8 animate-spin stroke-[3] text-[#FCD116]" />
                      ) : null}
                      <span
                        className="font-cubao text-white text-[2rem] tracking-[0.06em]"
                      >
                        EXAMPLE SENTENCE
                      </span>
                    </button>
                  )
                )}

                {example && (
                  /* Example output — RECTO-style: navy + white text */
                  <div ref={exampleSectionRef} className="w-full z-10 relative mb-8 animate-in zoom-in-95 duration-300" style={{ transform: 'rotate(0.7deg)' }}>
                    <div className="jeep-card shadow-[7px_7px_0px_0px_#1A1A1A] border-[5px] border-[#1A1A1A]">

                      {/* Header strip — Black with yellow accent */}
                      <div className="jeep-strip bg-[#1A1A1A] text-white jeep-rivet relative overflow-hidden">
                        <div className="absolute inset-x-0 top-0 h-[6px] bg-[#FCD116]" />
                        <span className="ml-5 font-cubao text-[1.25rem]">CONTEXT</span>
                        <span className="ml-auto mr-5 font-cubao text-[#FCD116] text-[0.8rem]">EXAMPLE</span>
                      </div>

                      {/* Body — pure white bg */}
                      <div className="bg-[#FFFFFF] p-8 flex flex-col items-center justify-center relative min-h-[160px]">
                        <p className="text-2xl font-box mb-5 break-words text-[#1A1A1A] text-center w-full leading-tight uppercase">
                          {direction === 'en-tl' ? example.tagalogSentence : example.englishTranslation}
                        </p>
                        <p
                          className="text-2xl font-quiapo mb-8 text-[#1A1A1A] text-center w-full px-5 py-3 border-[3px] border-[#1A1A1A] rounded-xl shadow-[3px_3px_0px_0px_#1A1A1A] bg-white tracking-wide"
                          style={{ transform: 'rotate(-1deg)' }}
                        >
                          "{direction === 'en-tl' ? example.englishTranslation : example.tagalogSentence}"
                        </p>
                        <div className="flex items-center gap-4 flex-wrap justify-center">
                          <button
                            onClick={() => handleSpeak(exampleAudioUrl)}
                            disabled={!exampleAudioUrl}
                            className="jeep-btn flex items-center gap-3 bg-[#1A1A1A] text-[#FCD116] px-6 py-3 shadow-[4px_4px_0px_0px_#1A1A1A] hover:bg-[#2a2a2a] disabled:opacity-50 disabled:cursor-wait min-h-[52px] font-cubao text-[1.2rem]"
                          >
                            <Volume2 className="w-6 h-6 stroke-[3]" />
                            SPEAK
                          </button>
                          <button
                            onClick={handleCopyExample}
                            className="jeep-btn flex items-center justify-center w-14 h-14 bg-white text-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] hover:bg-gray-50"
                            title="Copy to clipboard"
                          >
                            {isExampleCopied ? <Check className="w-6 h-6 stroke-[4] text-green-500" /> : <Copy className="w-6 h-6 stroke-[4]" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* Baybayin Mode Layout */}
        {appMode === 'baybayin' && (
          <div
            className={`w-full max-w-md z-10 flex flex-col items-center pt-8 pb-12 animate-in fade-in duration-500 relative ${isGeneratingArt ? 'text-[#F6F5F2]' : 'text-[#1A1A1A]'}`}
          >

            {/* Background Petroglyphs */}
            <div className="absolute top-0 left-[-60px]"><TribalPetroglyph1 /></div>
            <div className="absolute top-[40%] right-[-70px]"><TribalPetroglyph2 /></div>

            {/* Header */}
            <div className="text-center relative z-10 w-full mb-12 flex flex-col items-center">
              <div className="flex items-center gap-4 mb-2 opacity-90">
                <div className="w-6 h-1.5 bg-[#2C2825] rounded-sm"></div>
                <span className="font-tribal-text text-xl md:text-2xl tracking-[0.3em] uppercase text-[#2C2825] font-black">
                  Sinaunang
                </span>
                <div className="w-6 h-1.5 bg-[#2C2825] rounded-sm"></div>
              </div>

              <h1 className="text-[4rem] md:text-[5rem] font-tribal-title text-[#F6F5F2] text-center leading-[1] tracking-wider uppercase mb-1"
                style={{
                  WebkitTextStroke: '2px #2C2825',
                  filter: 'drop-shadow(6px 6px 0px #2C2825)'
                }}>
                Baybayin
              </h1>

              <div className="flex items-center gap-4 mt-4 opacity-90">
                <div className="w-10 h-1 bg-[#2C2825] rounded-sm"></div>
                <span className="font-tribal-text text-lg md:text-xl tracking-[0.2em] uppercase text-[#2C2825] font-bold">
                  Script Generator
                </span>
                <div className="w-10 h-1 bg-[#2C2825] rounded-sm"></div>
              </div>

              {/* Mode Toggle */}
              <div className="flex mt-8 bg-transparent border-[4px] border-[#2C2825] p-1 rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
                <button
                  onClick={() => { setBaybayinMode('encode'); setBaybayinInput(''); setBaybayinOutput(''); setDecodedCache({}); setIsArtMode(false); setIsGeneratingArt(false); }}
                  className={`px-4 py-2 font-tribal-text font-bold uppercase tracking-widest transition-colors rounded-xl ${baybayinMode === 'encode' ? 'bg-[#2C2825] text-[#F6F5F2]' : 'text-[#2C2825] hover:bg-[#2C2825]/10'}`}
                >
                  CARVE (To Baybayin)
                </button>
                <button
                  onClick={() => { setBaybayinMode('decode'); setBaybayinInput(''); setBaybayinOutput(''); setDecodedCache({}); setIsArtMode(false); setIsGeneratingArt(false); }}
                  className={`px-4 py-2 font-tribal-text font-bold uppercase tracking-widest transition-colors rounded-xl ${baybayinMode === 'decode' ? 'bg-[#2C2825] text-[#F6F5F2]' : 'text-[#2C2825] hover:bg-[#2C2825]/10'}`}
                >
                  DECODE (From Baybayin)
                </button>
              </div>
            </div>

            {/* Input Box */}
            <div className="w-full space-y-3 z-10 relative mb-10">
              <label htmlFor="baybayin-input" className="text-2xl font-tribal-text text-[#2C2825] uppercase tracking-[0.1em] px-2 block font-bold">
                {baybayinMode === 'decode' ? 'Paste Baybayin Characters' : 'Enter Word or Name'}
              </label>
              <div className="bg-transparent border-[8px] border-[#2C2825] p-6 relative">
                <input
                  id="baybayin-input"
                  type="text"
                  value={baybayinInput}
                  onChange={(e) => {
                    setBaybayinInput(e.target.value);
                    setBaybayinOutput('');
                    setDecodedCache({});
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && (baybayinMode === 'decode' ? handleDecodeBaybayin() : handleGenerateBaybayin())}
                  className="flex-1 bg-transparent text-3xl font-tribal-text font-bold outline-none placeholder:text-[#2C2825]/40 w-full text-[#2C2825]"
                  placeholder={baybayinMode === 'decode' ? 'e.g. \u170E\u1700\u170C\u1700' : 'e.g. malaya'}
                />
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#F6F5F2] border-r-4 border-b-4 border-[#2C2825] transform rotate-45"></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#F6F5F2] border-l-4 border-t-4 border-[#2C2825] transform rotate-45"></div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={() => baybayinMode === 'decode' ? handleDecodeBaybayin() : handleGenerateBaybayin()}
              disabled={!baybayinInput.trim() || isDecoding}
              className="w-full bg-[#2C2825] hover:bg-[#1A1815] text-[#F6F5F2] text-3xl font-tribal-text font-bold py-6 border-4 border-transparent active:border-[#2C2825] active:bg-transparent active:text-[#2C2825] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed mb-12 uppercase tracking-widest flex items-center justify-center"
            >
              {isDecoding ? <Loader2 className="w-8 h-8 mr-3 animate-spin stroke-[4]" /> : null}
              {baybayinMode === 'decode' ? 'DECODE SCRIPT!' : 'Generate Characters!'}
            </button>

            {/* Output Box */}
            {baybayinOutput && (
              <div className="w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-300">
                <motion.div
                  ref={baybayinRef}
                  animate={isGeneratingArt ? { x: [-2, 2, -2, 2, 0], transition: { repeat: Infinity, duration: 0.2 } } : {}}
                  className={`relative flex flex-col items-center justify-center transition-all duration-500 w-full min-h-[200px] sm:min-h-[250px] ${ 
                    isArtMode 
                      ? 'drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] p-[24px]' 
                      : 'bg-[#F6F5F2] border-[8px] border-[#2C2825] p-[2.5rem]'
                  }`}
                >
                  {/* ISOLATED MASK LAYER: Only cuts the background, leaving image and text perfectly solid */}
                  {isArtMode && (
                    <div 
                      className="absolute inset-0 z-0 bg-[#F6F5F2]"
                      style={{
                        WebkitMaskImage: 'linear-gradient(black, black), radial-gradient(circle at 10px 10px, transparent 5px, black 5.5px)',
                        maskImage: 'linear-gradient(black, black), radial-gradient(circle at 10px 10px, transparent 5px, black 5.5px)',
                        WebkitMaskSize: 'calc(100% - 20px) calc(100% - 20px), 20px 20px',
                        maskSize: 'calc(100% - 20px) calc(100% - 20px), 20px 20px',
                        WebkitMaskPosition: 'center, -10px -10px',
                        maskPosition: 'center, -10px -10px',
                        WebkitMaskRepeat: 'no-repeat, round',
                        maskRepeat: 'no-repeat, round',
                        WebkitMaskComposite: 'source-over',
                        maskComposite: 'add',
                      }}
                    />
                  )}
                  
                  {/* The Tiny Floating Trigger Button (Hidden during Art Mode or Loading) */}
                  {!isArtMode && !isGeneratingArt && baybayinMode === 'encode' && (
                    <motion.button 
                      onClick={handleMorphToArt}
                      className="absolute -right-3 -top-3 z-50 bg-[#F6F5F2] border-[3px] border-[#1A1A1A] w-10 h-10 rounded-sm flex items-center justify-center hover:bg-[#1A1A1A] hover:text-[#F6F5F2] transition-colors shadow-[2px_2px_0px_0px_#1A1A1A] text-[#1A1A1A]"
                      title="Imprint Art Background"
                      animate={{ rotate: [0, -15, 15, -15, 15, 0], scale: [1, 1.1, 1.1, 1] }}
                      transition={{ duration: 0.6, delay: 1, repeat: 2, repeatDelay: 3 }}
                    >
                      <motion.span 
                        initial={{ opacity: 0, y: 0 }} 
                        animate={{ opacity: [0, 1, 1, 0], y: [0, -35, -35, -35] }} 
                        transition={{ duration: 3.5, delay: 0.5, ease: "easeOut" }} 
                        className="absolute left-1/2 -translate-x-1/2 text-xs font-black text-[#BF0D3E] whitespace-nowrap pointer-events-none drop-shadow-md"
                      >
                        TRY ME!
                      </motion.span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                         <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z"/>
                      </svg>
                    </motion.button>
                  )}
                  
                  {/* Loading State Overlay */}
                  {isGeneratingArt && (
                    <div className="absolute inset-0 z-40 bg-[#F6F5F2]/80 backdrop-blur-sm flex items-center justify-center font-black uppercase text-[#1A1A1A] animate-pulse">
                      Visualizing...
                    </div>
                  )}

                  {/* Art Mode Inner Wrapper (Z-10: Sits safely ON TOP of the mask) */}
                  {isArtMode && (
                    <div className="absolute inset-[24px] border-[2px] border-[#1A1A1A] overflow-hidden z-10 bg-white shadow-inner">
                      <img src={`/art/${artBgIndex}.webp`} alt="Art Background" className="absolute inset-0 w-full h-full object-cover opacity-90" crossOrigin="anonymous" />
                      <div className="absolute inset-0 bg-black/40"></div>
                    </div>
                  )}

                  {/* Original Tape Corners (Hide in Art Mode) */}
                  {!isArtMode && (
                    <>
                      <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#F6F5F2] border-l-8 border-b-8 border-[#2C2825] transform -rotate-12 z-20"></div>
                      <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#F6F5F2] border-r-8 border-t-8 border-[#2C2825] transform -rotate-12 z-20"></div>
                    </>
                  )}

                  {baybayinMode === 'decode' && !isArtMode && (
                    <div className="absolute top-4 border-[4px] border-[#2C2825] shadow-[4px_4px_0px_#2C2825] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] flex p-1 mb-6 z-20">
                      {['TL', 'EN'].map((lang) => (
                        <button
                          key={lang}
                          onClick={() => handleDecodeBaybayin(lang as 'TL' | 'EN')}
                          className={`px-4 py-1.5 rounded-xl font-tribal-text font-bold text-lg tracking-widest transition-all ${decodeTarget === lang
                            ? 'bg-[#2C2825] text-[#F6F5F2]'
                            : 'text-[#2C2825] hover:bg-[#2C2825]/10'
                            }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* The Baybayin Characters (Adaptive Color) */}
                  <div className={`relative z-20 flex flex-wrap justify-center items-center gap-2 w-full ${isArtMode
                      ? 'text-[#F6F5F2] drop-shadow-[0_4px_12px_rgba(0,0,0,1)]'
                      : 'text-[#2C2825]'
                    }`}>
                    {/* DO NOT TOUCH: The actual Baybayin text MUST remain Noto Sans Tagalog */}
                    {baybayinMode === 'encode' ? (
                      <span className="text-7xl mb-10 text-center break-words w-full block" style={{ fontFamily: "'Noto Sans Tagalog', sans-serif" }}>
                        {baybayinOutput}
                      </span>
                    ) : (
                      <span className="text-4xl mt-12 mb-10 text-center break-words w-full block font-tribal-text tracking-widest uppercase font-bold">
                        {baybayinOutput}
                      </span>
                    )}
                  </div>

                </motion.div>

                <div className="flex flex-col gap-3 mt-6">
                  <button
                    onClick={handleCopyBaybayin}
                    className="flex items-center gap-3 bg-transparent hover:bg-[#2C2825] hover:text-[#F6F5F2] text-[#2C2825] px-6 py-4 border-4 border-[#2C2825] text-xl font-tribal-text font-bold uppercase transition-colors duration-150 tracking-wider w-full justify-center"
                  >
                    {isBaybayinCopied ? <Check className="w-6 h-6 stroke-[3]" /> : <Copy className="w-6 h-6 stroke-[3]" />}
                    {isBaybayinCopied ? 'COPIED!' : 'COPY CHARACTERS'}
                  </button>
                  {baybayinMode === 'encode' && (
                    <button
                      onClick={handleDownloadImage}
                      className="flex items-center gap-3 bg-transparent hover:bg-[#2C2825] hover:text-[#F6F5F2] text-[#2C2825] px-6 py-4 border-4 border-[#2C2825] text-xl font-tribal-text font-bold uppercase transition-colors duration-150 tracking-wider w-full justify-center"
                    >
                      <Download className="w-6 h-6 stroke-[3]" />
                      SAVE AS IMAGE
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Floating Action Button - Fixed bottom center (Standalone Cartoon Lens) */}
        <div className="absolute bottom-0 left-0 w-full flex justify-center z-40 pointer-events-none">
          <button
            ref={supremeLensBtnRef}
            onClick={() => {
              playOpenLensSound();
              setIsLensOpen(true);
            }}
            className="pointer-events-auto cursor-pointer transition-transform duration-150 outline-none focus:outline-none focus-visible:outline-none [-webkit-tap-highlight-color:transparent] bg-transparent border-none p-0"
            title="Supreme Lens"
          >
            <TribalSunCamera />
          </button>
        </div>

        {/* Mount Supreme Lens Overlay */}
        <AnimatePresence>
          {isLensOpen && (
            <SupremeLens
              onClose={() => { setIsLensOpen(false); setLensHasCapture(false); }}
              onCapturedChange={setLensHasCapture}
            />
          )}
        </AnimatePresence>


        {/* ONBOARDING TOUR */}
        <AnimatePresence>
          {tourStep > 0 && spotlightRect.width > 0 && (
            <motion.div key="main-tour" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`fixed inset-0 z-[100000] pointer-events-auto overflow-hidden ${tourStep === 3 ? 'bg-transparent' : 'bg-black/70'}`}>
              
              {/* Hole Punch (Only for Rectangle Input Card) */}
              {tourStep === 3 && (
                <div className="absolute pointer-events-none"
                  style={{ top: spotlightRect.top, left: spotlightRect.left, width: spotlightRect.width, height: spotlightRect.height, borderRadius: spotlightRect.borderRadius, boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)' }}
                />
              )}

              {/* Exact Shape SVG Clones for Stars and Sun Camera */}
              {(tourStep === 1 || tourStep === 2) && (
                <div 
                  className="absolute pointer-events-none drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                  style={{ top: spotlightRect.top, left: spotlightRect.left, width: spotlightRect.width, height: spotlightRect.height }}
                >
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                    <g fill="#1A1A1A" stroke="#1A1A1A" strokeWidth="6" strokeLinejoin="round">
                      <use href="#standard-star" transform="translate(1.5, 1.5)" />
                      <use href="#standard-star" transform="translate(3, 3)" />
                      <use href="#standard-star" transform="translate(4.5, 4.5)" />
                      <use href="#standard-star" transform="translate(6, 6)" />
                      <use href="#standard-star" transform="translate(7.5, 7.5)" />
                    </g>
                  </svg>
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center text-[#1A1A1A]">
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                      <use href="#standard-star" stroke="#1A1A1A" strokeWidth="6" strokeLinejoin="round" className="fill-[#FCD116]" />
                    </svg>
                  </div>
                </div>
              )}

              {tourStep === 4 && (
                <div 
                  className="absolute pointer-events-none drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                  style={{ top: spotlightRect.top, left: spotlightRect.left, width: spotlightRect.width, height: spotlightRect.height }}
                >
                  <TribalSunCamera />
                </div>
              )}
              {/* Tooltip */}
              <motion.div 
                key={`tooltip-${tourStep}`}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="absolute bg-[#F6F5F2] border-[4px] border-[#1A1A1A] p-4 rounded-[15px_15px_15px_15px] shadow-[6px_6px_0px_#1A1A1A] w-[280px] flex flex-col pointer-events-auto"
                style={{
                  top: tourStep === 4 ? Math.max(20, spotlightRect.top - 160) : spotlightRect.top + spotlightRect.height + 20,
                  left: Math.min(window.innerWidth - 300, Math.max(20, tourStep === 2 ? spotlightRect.left - 240 : spotlightRect.left))
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-[#3B82F6] rounded-full border-[2px] border-[#1A1A1A] flex items-center justify-center text-[#1A1A1A] font-black text-xs shrink-0 shadow-[2px_2px_0px_#1A1A1A]">
                    {tourStep}
                  </div>
                  <h4 className="font-title text-xl text-[#1A1A1A] uppercase tracking-wide">
                    {tourStep === 1 && "BAYBAYIN MODE"}
                    {tourStep === 2 && "TRANSLATION HISTORY"}
                    {tourStep === 3 && "TRANSLATE ENGINE"}
                    {tourStep === 4 && "SUPREME LENS"}
                  </h4>
                </div>
                <p className="font-box text-[15px] text-gray-700 mb-4 leading-tight font-bold">
                  {tourStep === 1 && "Tap this star at any time to switch to the ancient Baybayin transcriber interface."}
                  {tourStep === 2 && "Tap this star to view all your previous translations saved automatically."}
                  {tourStep === 3 && "Type your English or Tagalog words here to get instant translations."}
                  {tourStep === 4 && "Open the live camera lens for real-time translation and Baybayin decoding!"}
                </p>
                <div className="flex justify-between items-center w-full">
                  <button 
                    onClick={() => { localStorage.setItem('main_app_intro_seen', 'true'); setTourStep(0); }}
                    className="text-xs font-black text-gray-500 hover:text-gray-800 underline uppercase"
                  >
                    SKIP
                  </button>
                  <button 
                    onClick={() => {
                      if (tourStep < 4) {
                        setTourStep((prev) => (prev + 1) as any);
                      } else {
                        localStorage.setItem('main_app_intro_seen', 'true');
                        setTourStep(0);
                      }
                    }}
                    className="px-4 py-2 bg-[#3B82F6] text-[#1A1A1A] font-black text-sm uppercase rounded-[10px] border-[3px] border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all hover:bg-[#60A5FA]"
                  >
                    {tourStep < 4 ? "NEXT" : "GOT IT!"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}