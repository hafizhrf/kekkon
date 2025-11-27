import { motion } from 'framer-motion';
import { useMemo } from 'react';

export function FloralCorner({ className = '', color = '#D4A373', flip = false }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 200 200" 
      fill="none"
      style={{ transform: flip ? 'scaleX(-1)' : 'none' }}
    >
      <path
        d="M10 190 Q 10 100, 60 60 Q 100 30, 150 20 Q 120 50, 100 80 Q 80 110, 70 150 Q 60 180, 10 190"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M20 180 Q 30 120, 70 80 Q 100 50, 140 35"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
      <circle cx="150" cy="20" r="8" fill={color} opacity="0.3" />
      <circle cx="140" cy="35" r="5" fill={color} opacity="0.4" />
      <circle cx="60" cy="60" r="6" fill={color} opacity="0.3" />
      <circle cx="70" cy="80" r="4" fill={color} opacity="0.4" />
      <path
        d="M155 15 Q 165 10, 175 15 Q 180 25, 175 35 Q 165 30, 155 35 Q 150 25, 155 15"
        fill={color}
        opacity="0.2"
      />
      <path
        d="M130 40 Q 138 35, 148 38 Q 152 46, 148 55 Q 140 52, 132 55 Q 128 47, 130 40"
        fill={color}
        opacity="0.15"
      />
    </svg>
  );
}

export function FloralDivider({ color = '#D4A373' }) {
  return (
    <svg viewBox="0 0 400 60" className="w-full max-w-md mx-auto h-12" fill="none">
      <path
        d="M0 30 Q 50 30, 80 25 Q 100 22, 120 30 Q 140 38, 160 30 Q 180 22, 200 30 Q 220 38, 240 30 Q 260 22, 280 30 Q 300 38, 320 25 Q 350 30, 400 30"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
      <circle cx="200" cy="30" r="15" stroke={color} strokeWidth="1" fill="none" opacity="0.3" />
      <circle cx="200" cy="30" r="8" fill={color} opacity="0.2" />
      <circle cx="200" cy="30" r="3" fill={color} opacity="0.5" />
      <circle cx="120" cy="30" r="4" fill={color} opacity="0.3" />
      <circle cx="280" cy="30" r="4" fill={color} opacity="0.3" />
      <path d="M185 30 L 175 25 M 185 30 L 175 35" stroke={color} strokeWidth="1" opacity="0.3" />
      <path d="M215 30 L 225 25 M 215 30 L 225 35" stroke={color} strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

export function LeafBranch({ color = '#D4A373', className = '' }) {
  return (
    <svg viewBox="0 0 100 40" className={className} fill="none">
      <path
        d="M0 20 Q 25 20, 50 20 Q 75 20, 100 20"
        stroke={color}
        strokeWidth="1"
        opacity="0.5"
      />
      <path d="M20 20 Q 15 10, 25 8 Q 30 15, 20 20" fill={color} opacity="0.3" />
      <path d="M20 20 Q 15 30, 25 32 Q 30 25, 20 20" fill={color} opacity="0.3" />
      <path d="M40 20 Q 35 12, 45 10 Q 50 17, 40 20" fill={color} opacity="0.25" />
      <path d="M40 20 Q 35 28, 45 30 Q 50 23, 40 20" fill={color} opacity="0.25" />
      <path d="M60 20 Q 55 10, 65 8 Q 70 15, 60 20" fill={color} opacity="0.3" />
      <path d="M60 20 Q 55 30, 65 32 Q 70 25, 60 20" fill={color} opacity="0.3" />
      <path d="M80 20 Q 75 12, 85 10 Q 90 17, 80 20" fill={color} opacity="0.25" />
      <path d="M80 20 Q 75 28, 85 30 Q 90 23, 80 20" fill={color} opacity="0.25" />
    </svg>
  );
}

export function HeartFrame({ color = '#D4A373' }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <path
        d="M50 90 C 20 60, 10 40, 25 25 C 35 15, 50 20, 50 35 C 50 20, 65 15, 75 25 C 90 40, 80 60, 50 90"
        stroke={color}
        strokeWidth="2"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );
}

export function GeometricFrame({ color = '#D4A373', className = '' }) {
  return (
    <svg viewBox="0 0 400 100" className={`w-full ${className}`} fill="none">
      <rect x="10" y="10" width="380" height="80" rx="5" stroke={color} strokeWidth="1" opacity="0.2" />
      <rect x="20" y="20" width="360" height="60" rx="3" stroke={color} strokeWidth="0.5" opacity="0.15" />
      <circle cx="10" cy="10" r="5" fill={color} opacity="0.3" />
      <circle cx="390" cy="10" r="5" fill={color} opacity="0.3" />
      <circle cx="10" cy="90" r="5" fill={color} opacity="0.3" />
      <circle cx="390" cy="90" r="5" fill={color} opacity="0.3" />
      <path d="M5 50 L 15 50" stroke={color} strokeWidth="2" opacity="0.3" />
      <path d="M385 50 L 395 50" stroke={color} strokeWidth="2" opacity="0.3" />
    </svg>
  );
}

export function AnimatedParticles({ color = '#D4A373', count = 20 }) {
  const particles = useMemo(() => {
    return [...Array(count)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 4 + Math.random() * 6,
      opacity: 0.08 + Math.random() * 0.12,
      duration: 4 + Math.random() * 3,
      delay: Math.random() * 3,
      yOffset: 20 + Math.random() * 20,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            backgroundColor: color,
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
          }}
          initial={{ opacity: p.opacity, y: 0 }}
          animate={{
            y: [0, -p.yOffset, 0],
            opacity: [p.opacity, p.opacity + 0.1, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

export function GoldAccent({ className = '' }) {
  return (
    <svg viewBox="0 0 200 20" className={className} fill="none">
      <path
        d="M0 10 L 70 10 M 130 10 L 200 10"
        stroke="url(#goldGradient)"
        strokeWidth="1"
      />
      <circle cx="100" cy="10" r="8" stroke="url(#goldGradient)" strokeWidth="1" fill="none" />
      <circle cx="100" cy="10" r="4" fill="url(#goldGradient)" />
      <circle cx="75" cy="10" r="2" fill="url(#goldGradient)" />
      <circle cx="125" cy="10" r="2" fill="url(#goldGradient)" />
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D4A373" />
          <stop offset="50%" stopColor="#E5C9A8" />
          <stop offset="100%" stopColor="#D4A373" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function IslamicPattern({ color = '#D4A373', className = '' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      <pattern id="islamicPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <path
          d="M10 0 L20 10 L10 20 L0 10 Z"
          stroke={color}
          strokeWidth="0.5"
          fill="none"
          opacity="0.2"
        />
        <circle cx="10" cy="10" r="2" fill={color} opacity="0.1" />
      </pattern>
      <rect width="100" height="100" fill="url(#islamicPattern)" />
    </svg>
  );
}

export function FrameBorder({ color = '#D4A373', children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute -top-4 -left-4 w-12 h-12">
        <svg viewBox="0 0 50 50" fill="none">
          <path d="M5 45 L5 5 L45 5" stroke={color} strokeWidth="2" opacity="0.4" />
          <circle cx="5" cy="5" r="3" fill={color} opacity="0.5" />
        </svg>
      </div>
      <div className="absolute -top-4 -right-4 w-12 h-12">
        <svg viewBox="0 0 50 50" fill="none">
          <path d="M45 45 L45 5 L5 5" stroke={color} strokeWidth="2" opacity="0.4" />
          <circle cx="45" cy="5" r="3" fill={color} opacity="0.5" />
        </svg>
      </div>
      <div className="absolute -bottom-4 -left-4 w-12 h-12">
        <svg viewBox="0 0 50 50" fill="none">
          <path d="M5 5 L5 45 L45 45" stroke={color} strokeWidth="2" opacity="0.4" />
          <circle cx="5" cy="45" r="3" fill={color} opacity="0.5" />
        </svg>
      </div>
      <div className="absolute -bottom-4 -right-4 w-12 h-12">
        <svg viewBox="0 0 50 50" fill="none">
          <path d="M45 5 L45 45 L5 45" stroke={color} strokeWidth="2" opacity="0.4" />
          <circle cx="45" cy="45" r="3" fill={color} opacity="0.5" />
        </svg>
      </div>
      {children}
    </div>
  );
}
