import { motion } from 'framer-motion';

// Import actual SVG assets
import StackedLeavesSvg from '../../../assets/svg/elegant-themed/stacked-leaves-2.svg';
import CornerBorderSvg from '../../../assets/svg/elegant-themed/corner-border.svg';
import BlueCornerFlowerSvg from '../../../assets/svg/flower-themed/blue-corner-flower.svg';
import BlackFlowerSvg from '../../../assets/svg/flower-themed/black-flower.svg';

// Elegant theme stacked leaves decoration using actual SVG
export function ElegantLeaves({ position = 'left', color = '#D4A373', className = '' }) {
  const isLeft = position === 'left';
  
  return (
    <motion.div 
      className={`absolute pointer-events-none ${className}`}
      style={{ 
        [isLeft ? 'left' : 'right']: 0,
        transform: isLeft ? 'none' : 'scaleX(-1)',
      }}
      animate={{ rotate: [isLeft ? -2 : 2, isLeft ? 2 : -2, isLeft ? -2 : 2] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <img 
        src={StackedLeavesSvg} 
        alt="" 
        className="w-24 md:w-32 h-auto opacity-30"
        style={{ filter: `sepia(1) saturate(0.5) hue-rotate(350deg)` }}
      />
    </motion.div>
  );
}

// Elegant corner using actual SVG
export function ElegantCorner({ position = 'top-left', color = '#D4A373' }) {
  const positionStyles = {
    'top-left': { top: 0, left: 0, transform: 'none' },
    'top-right': { top: 0, right: 0, transform: 'scaleX(-1)' },
    'bottom-left': { bottom: 0, left: 0, transform: 'scaleY(-1)' },
    'bottom-right': { bottom: 0, right: 0, transform: 'scale(-1)' },
  };

  return (
    <div 
      className="absolute w-16 md:w-24 pointer-events-none opacity-30"
      style={positionStyles[position]}
    >
      <img src={CornerBorderSvg} alt="" className="w-full h-auto" />
    </div>
  );
}

// Floral corner decoration using actual SVG
export function FloralCornerDecoration({ position = 'top-left', color = '#D4A373' }) {
  const positionStyles = {
    'top-left': { top: 0, left: 0, transform: 'none' },
    'top-right': { top: 0, right: 0, transform: 'scaleX(-1)' },
    'bottom-left': { bottom: 0, left: 0, transform: 'scaleY(-1)' },
    'bottom-right': { bottom: 0, right: 0, transform: 'scale(-1)' },
  };

  return (
    <motion.div 
      className="absolute w-24 md:w-32 pointer-events-none"
      style={positionStyles[position]}
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <img 
        src={BlueCornerFlowerSvg} 
        alt="" 
        className="w-full h-auto opacity-40"
      />
    </motion.div>
  );
}

// Black flower decoration for rustic/vintage themes
export function VintageFlowerDecoration({ position = 'top-left', className = '' }) {
  const positionStyles = {
    'top-left': { top: '5%', left: '2%' },
    'top-right': { top: '5%', right: '2%', transform: 'scaleX(-1)' },
    'bottom-left': { bottom: '5%', left: '2%', transform: 'scaleY(-1)' },
    'bottom-right': { bottom: '5%', right: '2%', transform: 'scale(-1)' },
  };

  return (
    <motion.div 
      className={`absolute w-20 md:w-28 pointer-events-none ${className}`}
      style={positionStyles[position]}
      animate={{ rotate: [-3, 3, -3] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    >
      <img src={BlackFlowerSvg} alt="" className="w-full h-auto opacity-20" />
    </motion.div>
  );
}

// Minimalist simple line divider
export function MinimalistDivider({ color = '#D4A373' }) {
  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <div className="w-20 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color, opacity: 0.5 }} />
      <div className="w-20 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
    </div>
  );
}

// Colorful/Playful floating shapes
export function PlayfulShapes({ color = '#D4A373' }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-24 h-24 rounded-full"
        style={{ backgroundColor: color, opacity: 0.08, top: '10%', left: '5%' }}
        animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-20 h-20"
        style={{ 
          backgroundColor: color, 
          opacity: 0.06, 
          top: '50%', 
          right: '8%',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
        }}
        animate={{ rotate: [0, 180, 360] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute w-16 h-16 rounded-lg"
        style={{ backgroundColor: color, opacity: 0.05, bottom: '15%', left: '12%' }}
        animate={{ scale: [1, 1.3, 1], rotate: [0, 45, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-12 h-12 rounded-full"
        style={{ backgroundColor: color, opacity: 0.07, top: '70%', left: '80%' }}
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
    </div>
  );
}

// Classic theme frame border
export function ClassicBorder({ color = '#D4A373', children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      {/* Ornate corner decorations */}
      <div className="absolute -top-4 -left-4 w-10 h-10">
        <svg viewBox="0 0 40 40" fill="none">
          <path d="M0 40 L0 10 Q0 0, 10 0 L40 0" stroke={color} strokeWidth="2" opacity="0.4" />
          <path d="M0 30 Q5 25, 15 20 Q10 15, 10 5" stroke={color} strokeWidth="1.5" opacity="0.3" />
          <circle cx="5" cy="5" r="3" fill={color} opacity="0.25" />
        </svg>
      </div>
      <div className="absolute -top-4 -right-4 w-10 h-10" style={{ transform: 'scaleX(-1)' }}>
        <svg viewBox="0 0 40 40" fill="none">
          <path d="M0 40 L0 10 Q0 0, 10 0 L40 0" stroke={color} strokeWidth="2" opacity="0.4" />
          <path d="M0 30 Q5 25, 15 20 Q10 15, 10 5" stroke={color} strokeWidth="1.5" opacity="0.3" />
          <circle cx="5" cy="5" r="3" fill={color} opacity="0.25" />
        </svg>
      </div>
      <div className="absolute -bottom-4 -left-4 w-10 h-10" style={{ transform: 'scaleY(-1)' }}>
        <svg viewBox="0 0 40 40" fill="none">
          <path d="M0 40 L0 10 Q0 0, 10 0 L40 0" stroke={color} strokeWidth="2" opacity="0.4" />
          <path d="M0 30 Q5 25, 15 20 Q10 15, 10 5" stroke={color} strokeWidth="1.5" opacity="0.3" />
          <circle cx="5" cy="5" r="3" fill={color} opacity="0.25" />
        </svg>
      </div>
      <div className="absolute -bottom-4 -right-4 w-10 h-10" style={{ transform: 'scale(-1)' }}>
        <svg viewBox="0 0 40 40" fill="none">
          <path d="M0 40 L0 10 Q0 0, 10 0 L40 0" stroke={color} strokeWidth="2" opacity="0.4" />
          <path d="M0 30 Q5 25, 15 20 Q10 15, 10 5" stroke={color} strokeWidth="1.5" opacity="0.3" />
          <circle cx="5" cy="5" r="3" fill={color} opacity="0.25" />
        </svg>
      </div>
      {/* Border lines */}
      <div className="absolute top-0 left-8 right-8 h-0.5" style={{ backgroundColor: color, opacity: 0.15 }} />
      <div className="absolute bottom-0 left-8 right-8 h-0.5" style={{ backgroundColor: color, opacity: 0.15 }} />
      <div className="absolute left-0 top-8 bottom-8 w-0.5" style={{ backgroundColor: color, opacity: 0.15 }} />
      <div className="absolute right-0 top-8 bottom-8 w-0.5" style={{ backgroundColor: color, opacity: 0.15 }} />
      {children}
    </div>
  );
}

// Theme configuration with distinct layouts for each template
export function getThemeDecorations(templateId) {
  const themes = {
    // Modern Geometric - Clean, minimal decorations, sharp angles
    'geometric-modern': {
      type: 'modern',
      hasLeaves: false,
      hasCorners: false,
      hasFloral: false,
      hasShapes: true,
      // Photo frame styles
      photoFrame: 'rounded-2xl shadow-xl border-0',
      photoSize: 'w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52',
      photoLayout: 'horizontal', // side by side
      // Section container styles
      sectionBg: 'bg-white',
      sectionPadding: 'py-16 md:py-24',
      cardStyle: 'rounded-2xl shadow-lg border-0',
      // Typography
      titleStyle: 'font-playfair text-3xl md:text-5xl font-bold',
      // Divider style
      dividerType: 'geometric',
      // RSVP form style
      rsvpStyle: 'minimal',
      // Gift section style
      giftStyle: 'grid',
    },
    
    // Minimalist Elegant - Very clean, lots of whitespace
    'minimalist-elegant': {
      type: 'minimalist',
      hasLeaves: false,
      hasCorners: false,
      hasFloral: false,
      hasShapes: false,
      photoFrame: 'rounded-full border border-gray-200',
      photoSize: 'w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44',
      photoLayout: 'horizontal',
      sectionBg: 'bg-white',
      sectionPadding: 'py-20 md:py-32',
      cardStyle: 'rounded-xl border border-gray-100 shadow-sm',
      titleStyle: 'font-playfair text-2xl md:text-4xl font-light tracking-wide',
      dividerType: 'line',
      rsvpStyle: 'clean',
      giftStyle: 'list',
    },
    
    // Colorful Playful - Vibrant, fun, animated shapes
    'colorful-playful': {
      type: 'playful',
      hasLeaves: false,
      hasCorners: false,
      hasFloral: false,
      hasShapes: true,
      photoFrame: 'rounded-3xl shadow-2xl border-4 border-white',
      photoSize: 'w-36 h-36 sm:w-44 sm:h-44 md:w-56 md:h-56',
      photoLayout: 'stacked', // overlapping
      sectionBg: 'bg-gradient-to-br from-white to-gray-50',
      sectionPadding: 'py-16 md:py-28',
      cardStyle: 'rounded-3xl shadow-xl border-0',
      titleStyle: 'font-playfair text-3xl md:text-5xl font-bold',
      dividerType: 'dots',
      rsvpStyle: 'fun',
      giftStyle: 'cards',
    },
    
    // Floral Romantic - Elegant with flower decorations
    'floral-romantic': {
      type: 'elegant',
      hasLeaves: true,
      hasCorners: true,
      hasFloral: true,
      hasShapes: false,
      photoFrame: 'rounded-full border-4 shadow-lg',
      photoSize: 'w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52',
      photoLayout: 'horizontal',
      sectionBg: 'bg-white',
      sectionPadding: 'py-20 md:py-32',
      cardStyle: 'rounded-2xl shadow-lg border border-gray-100',
      titleStyle: 'font-great-vibes text-4xl md:text-6xl',
      dividerType: 'floral',
      rsvpStyle: 'elegant',
      giftStyle: 'elegant',
    },
    
    // Rustic Vintage - Warm tones, vintage feel, textured
    'rustic-vintage': {
      type: 'vintage',
      hasLeaves: false,
      hasCorners: false,
      hasFloral: true,
      hasShapes: false,
      photoFrame: 'rounded-lg border-2 shadow-md',
      photoSize: 'w-32 h-40 sm:w-40 sm:h-48 md:w-48 md:h-60', // portrait orientation
      photoLayout: 'horizontal',
      sectionBg: 'bg-amber-50/50',
      sectionPadding: 'py-16 md:py-24',
      cardStyle: 'rounded-lg border-2 shadow-md',
      titleStyle: 'font-playfair text-3xl md:text-4xl italic',
      dividerType: 'ornate',
      rsvpStyle: 'vintage',
      giftStyle: 'vintage',
    },
    
    // Islamic Traditional - Geometric patterns, traditional feel
    'islamic-traditional': {
      type: 'traditional',
      hasLeaves: false,
      hasCorners: true,
      hasFloral: false,
      hasShapes: false,
      photoFrame: 'rounded-xl border-2 shadow-lg',
      photoSize: 'w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48',
      photoLayout: 'horizontal',
      sectionBg: 'bg-white',
      sectionPadding: 'py-16 md:py-28',
      cardStyle: 'rounded-xl border-2 shadow-md',
      titleStyle: 'font-playfair text-3xl md:text-5xl font-semibold',
      dividerType: 'islamic',
      rsvpStyle: 'traditional',
      giftStyle: 'traditional',
    },
  };

  return themes[templateId] || themes['geometric-modern'];
}

// Theme-specific dividers
export function ThemedDivider({ templateId, color = '#D4A373' }) {
  const theme = getThemeDecorations(templateId);
  
  switch (theme.dividerType) {
    case 'geometric':
      return (
        <div className="flex items-center justify-center gap-3 py-6">
          <div className="w-12 h-0.5" style={{ backgroundColor: color, opacity: 0.3 }} />
          <div className="w-3 h-3 rotate-45" style={{ backgroundColor: color, opacity: 0.3 }} />
          <div className="w-12 h-0.5" style={{ backgroundColor: color, opacity: 0.3 }} />
        </div>
      );
    case 'line':
      return (
        <div className="flex items-center justify-center py-8">
          <div className="w-32 h-px" style={{ backgroundColor: color, opacity: 0.2 }} />
        </div>
      );
    case 'dots':
      return (
        <div className="flex items-center justify-center gap-2 py-6">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color, opacity: 0.3 + i * 0.1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      );
    case 'floral':
      return (
        <div className="flex items-center justify-center gap-4 py-8">
          <div className="w-16 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
          <svg viewBox="0 0 30 30" className="w-6 h-6" fill={color} opacity="0.4">
            <path d="M15 0 Q20 10, 15 15 Q10 10, 15 0 M0 15 Q10 10, 15 15 Q10 20, 0 15 M15 30 Q10 20, 15 15 Q20 20, 15 30 M30 15 Q20 20, 15 15 Q20 10, 30 15" />
          </svg>
          <div className="w-16 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
        </div>
      );
    case 'ornate':
      return (
        <div className="flex items-center justify-center gap-3 py-8">
          <div className="w-8 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
          <svg viewBox="0 0 40 20" className="w-10 h-5" stroke={color} fill="none" strokeWidth="1.5" opacity="0.4">
            <path d="M0 10 Q10 0, 20 10 Q30 20, 40 10" />
            <path d="M0 10 Q10 20, 20 10 Q30 0, 40 10" />
          </svg>
          <div className="w-8 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
        </div>
      );
    case 'islamic':
      return (
        <div className="flex items-center justify-center gap-2 py-8">
          <svg viewBox="0 0 60 20" className="w-16 h-5" stroke={color} fill="none" strokeWidth="1" opacity="0.4">
            <path d="M0 10 L10 0 L20 10 L30 0 L40 10 L50 0 L60 10" />
            <path d="M0 10 L10 20 L20 10 L30 20 L40 10 L50 20 L60 10" />
          </svg>
        </div>
      );
    default:
      return <MinimalistDivider color={color} />;
  }
}
