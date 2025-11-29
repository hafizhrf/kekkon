import { motion } from 'framer-motion';
import { ChevronDown, Heart } from 'lucide-react';
import { AnimatedParticles } from './decorations/Ornaments';

// Import SVG assets
import StackedLeavesSvg from '../../assets/svg/elegant-themed/stacked-leaves.svg';
import StackedLeaves2Svg from '../../assets/svg/elegant-themed/stacked-leaves-2.svg';
import BlueCornerFlowerSvg from '../../assets/svg/flower-themed/blue-corner-flower.svg';
import BlackFlowerSvg from '../../assets/svg/flower-themed/black-flower.svg';
import CornerBorderSvg from '../../assets/svg/elegant-themed/corner-border.svg';

export default function IntroSection({ invitation, guestName, onOpen }) {
  const primaryColor = invitation.primary_color || '#D4A373';
  const secondaryColor = invitation.secondary_color || '#FEFAE0';
  const templateId = invitation.template_id || 'geometric-modern';

  const renderTemplateIntro = () => {
    switch (templateId) {
      case 'minimalist-elegant':
        return <MinimalistIntro invitation={invitation} guestName={guestName} onOpen={onOpen} />;
      case 'colorful-playful':
        return <PlayfulIntro invitation={invitation} guestName={guestName} onOpen={onOpen} />;
      case 'floral-romantic':
        return <FloralIntro invitation={invitation} guestName={guestName} onOpen={onOpen} />;
      case 'rustic-vintage':
        return <VintageIntro invitation={invitation} guestName={guestName} onOpen={onOpen} />;
      case 'islamic-traditional':
        return <IslamicIntro invitation={invitation} guestName={guestName} onOpen={onOpen} />;
      default:
        return <ModernIntro invitation={invitation} guestName={guestName} onOpen={onOpen} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-hidden"
      style={{ backgroundColor: secondaryColor }}
    >
      {renderTemplateIntro()}
    </motion.div>
  );
}

// Geometric Modern - Bold geometric shapes with animated grid
function ModernIntro({ invitation, guestName, onOpen }) {
  const primaryColor = invitation.primary_color || '#D4A373';
  const secondaryColor = invitation.secondary_color || '#FEFAE0';

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: secondaryColor }}>
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%">
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={primaryColor} strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Large Geometric Shapes */}
      <motion.div
        initial={{ opacity: 0, rotate: -45, scale: 0 }}
        animate={{ opacity: 0.08, rotate: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
        className="absolute -top-20 -left-20 w-80 h-80"
        style={{ backgroundColor: primaryColor }}
      />
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 0.06, x: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute top-1/4 -right-10 w-40 h-40"
        style={{
          backgroundColor: primaryColor,
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 0.1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="absolute -bottom-16 right-1/4 w-64 h-64 rounded-full"
        style={{ border: `3px solid ${primaryColor}` }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="absolute bottom-20 left-10 w-24 h-24"
        style={{
          backgroundColor: primaryColor,
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        }}
      />

      {/* Animated Lines */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="absolute top-1/3 left-0 right-0 h-px origin-left"
        style={{ backgroundColor: primaryColor, opacity: 0.1 }}
      />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="absolute bottom-1/3 left-0 right-0 h-px origin-right"
        style={{ backgroundColor: primaryColor, opacity: 0.1 }}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="relative z-10 text-center px-6"
      >
        {/* Geometric frame around content */}
        <div className="relative inline-block">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute -inset-8 md:-inset-12"
          >
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2" style={{ borderColor: primaryColor }} />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2" style={{ borderColor: primaryColor }} />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2" style={{ borderColor: primaryColor }} />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2" style={{ borderColor: primaryColor }} />
          </motion.div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="h-0.5 mx-auto mb-6"
            style={{ backgroundColor: primaryColor }}
          />
          
          <p className="text-gray-500 mb-3 font-medium tracking-[0.25em] uppercase text-xs">The Wedding of</p>
          
          <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-2" style={{ color: primaryColor }}>
            {invitation.bride_name}
          </h1>
          <motion.div 
            className="flex items-center justify-center gap-4 my-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="w-12 h-px" style={{ backgroundColor: primaryColor }} />
            <span className="text-2xl" style={{ color: primaryColor }}>&</span>
            <div className="w-12 h-px" style={{ backgroundColor: primaryColor }} />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-playfair font-bold" style={{ color: primaryColor }}>
            {invitation.groom_name}
          </h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="h-0.5 mx-auto mt-6"
            style={{ backgroundColor: primaryColor }}
          />
        </div>
        
        <motion.div 
          className="mt-10 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <p className="text-gray-400 text-xs tracking-widest uppercase mb-2">Kepada Yth.</p>
          <p className="text-xl font-semibold text-gray-700">{guestName}</p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpen}
          className="inline-flex items-center gap-3 px-10 py-4 text-white font-medium shadow-xl"
          style={{ backgroundColor: primaryColor }}
        >
          <span className="tracking-wider">Buka Undangan</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </motion.button>
      </motion.div>
    </div>
  );
}

// Minimalist Elegant - Ultra clean with dramatic whitespace and thin lines
// Uses monochrome palette with serif typography
function MinimalistIntro({ invitation, guestName, onOpen }) {
  // Monochrome colors for minimalist elegant
  const textColor = '#1f2937'; // dark gray
  const accentColor = '#d1d5db'; // light gray
  const borderColor = '#e5e7eb'; // subtle gray

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-white overflow-hidden">
      {/* Thin accent lines */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
        className="absolute left-8 md:left-16 top-0 bottom-0 w-px origin-top"
        style={{ backgroundColor: borderColor }}
      />
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
        className="absolute right-8 md:right-16 top-0 bottom-0 w-px origin-bottom"
        style={{ backgroundColor: borderColor }}
      />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
        className="absolute top-8 md:top-16 left-0 right-0 h-px origin-left"
        style={{ backgroundColor: borderColor }}
      />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
        className="absolute bottom-8 md:bottom-16 left-0 right-0 h-px origin-right"
        style={{ backgroundColor: borderColor }}
      />

      {/* Subtle corner dots */}
      {[
        { top: '2rem', left: '2rem' },
        { top: '2rem', right: '2rem' },
        { bottom: '2rem', left: '2rem' },
        { bottom: '2rem', right: '2rem' },
      ].map((pos, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{ ...pos, backgroundColor: '#374151', opacity: 0.3 }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-center px-8 max-w-lg"
      >
        {/* Top decorative element */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
        >
          <div className="flex items-center justify-center gap-4">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 40 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="h-px"
              style={{ backgroundColor: accentColor }}
            />
            <div className="w-2 h-2 rotate-45 border" style={{ borderColor: accentColor }} />
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 40 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="h-px"
              style={{ backgroundColor: accentColor }}
            />
          </div>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-gray-400 tracking-[0.4em] uppercase text-[10px] mb-8 font-serif"
        >
          The Wedding of
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <h1 className="text-4xl md:text-6xl font-playfair font-light tracking-wider mb-4" style={{ color: textColor }}>
            {invitation.bride_name}
          </h1>
          
          <div className="flex items-center justify-center gap-6 my-6">
            <div className="w-16 h-px" style={{ backgroundColor: accentColor }} />
            <span className="text-xl font-light font-serif" style={{ color: textColor }}>&</span>
            <div className="w-16 h-px" style={{ backgroundColor: accentColor }} />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-playfair font-light tracking-wider" style={{ color: textColor }}>
            {invitation.groom_name}
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 mb-12"
        >
          <div className="inline-block px-8 py-6 border" style={{ borderColor: borderColor }}>
            <p className="text-gray-400 text-[10px] tracking-[0.3em] uppercase mb-2">Kepada Yth.</p>
            <p className="text-lg text-gray-600 font-light tracking-wide">{guestName}</p>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          whileHover={{ backgroundColor: textColor, color: '#fff' }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpen}
          className="inline-flex items-center gap-4 px-12 py-4 border text-xs tracking-[0.2em] uppercase transition-all duration-300"
          style={{ borderColor: textColor, color: textColor }}
        >
          <span>Buka Undangan</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </motion.button>
      </motion.div>
    </div>
  );
}

// Colorful Playful - Vibrant with blinking particles
function PlayfulIntro({ invitation, guestName, onOpen }) {
  const primaryColor = invitation.primary_color || '#D4A373';
  const secondaryColor = invitation.secondary_color || '#FEFAE0';

  // Fixed positions for blinking particles
  const particlePositions = [
    { left: '8%', top: '12%', size: 24 },
    { left: '92%', top: '8%', size: 32 },
    { left: '5%', top: '75%', size: 28 },
    { left: '88%', top: '68%', size: 20 },
    { left: '20%', top: '88%', size: 36 },
    { left: '78%', top: '85%', size: 24 },
    { left: '45%', top: '5%', size: 20 },
    { left: '12%', top: '45%', size: 32 },
    { left: '85%', top: '38%', size: 28 },
    { left: '65%', top: '92%', size: 24 },
    { left: '30%', top: '22%', size: 20 },
    { left: '72%', top: '55%', size: 36 },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" 
      style={{ background: `linear-gradient(135deg, ${secondaryColor} 0%, #fff 50%, ${secondaryColor} 100%)` }}>
      
      {/* Blinking particles */}
      {particlePositions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: pos.size,
            height: pos.size,
            backgroundColor: primaryColor,
            left: pos.left,
            top: pos.top,
          }}
          animate={{
            opacity: [0.08, 0.2, 0.08],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 2 + (i % 3),
            repeat: Infinity,
            delay: i * 0.25,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.4 }}
        className="relative z-10 text-center px-6"
      >
        <motion.p 
          className="text-sm font-medium mb-4 tracking-widest uppercase"
          style={{ color: primaryColor }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          You're Invited to
        </motion.p>
        
        <h1 
          className="text-4xl md:text-6xl font-playfair font-bold mb-2"
          style={{ color: primaryColor }}
        >
          {invitation.bride_name}
        </h1>
        <p className="text-3xl font-dancing my-2" style={{ color: primaryColor }}>&</p>
        <h1 
          className="text-4xl md:text-6xl font-playfair font-bold mb-4"
          style={{ color: primaryColor }}
        >
          {invitation.groom_name}
        </h1>
        <p className="text-lg mb-6" style={{ color: `${primaryColor}80` }}>Wedding Celebration</p>
        
        <div 
          className="my-8 p-6 rounded-3xl inline-block"
          style={{ backgroundColor: `${primaryColor}10` }}
        >
          <p className="text-sm mb-1" style={{ color: `${primaryColor}80` }}>Dear</p>
          <p className="text-2xl font-semibold" style={{ color: primaryColor }}>
            {guestName}
          </p>
        </div>

        <div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpen}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-full text-white font-bold text-lg shadow-2xl"
            style={{ backgroundColor: primaryColor }}
          >
            Buka Undangan
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// Floral Romantic - Elegant with flower decorations
function FloralIntro({ invitation, guestName, onOpen }) {
  const primaryColor = invitation.primary_color || '#D4A373';
  const secondaryColor = invitation.secondary_color || '#FEFAE0';

  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ backgroundColor: secondaryColor }}>
      <AnimatedParticles color={primaryColor} count={15} />
      
      {/* Corner flower decorations */}
      <motion.div
        className="absolute top-0 left-0 w-32 md:w-48 pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img src={BlueCornerFlowerSvg} alt="" className="w-full h-auto" />
      </motion.div>
      <motion.div
        className="absolute top-0 right-0 w-32 md:w-48 pointer-events-none"
        style={{ transform: 'scaleX(-1)' }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <img src={BlueCornerFlowerSvg} alt="" className="w-full h-auto" />
      </motion.div>
      <motion.div
        className="absolute bottom-0 left-0 w-32 md:w-48 pointer-events-none"
        style={{ transform: 'scaleY(-1)' }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <img src={BlueCornerFlowerSvg} alt="" className="w-full h-auto" />
      </motion.div>
      <motion.div
        className="absolute bottom-0 right-0 w-32 md:w-48 pointer-events-none"
        style={{ transform: 'scale(-1)' }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <img src={BlueCornerFlowerSvg} alt="" className="w-full h-auto" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative z-10 text-center px-6 max-w-lg"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mb-6"
        >
          <Heart className="w-10 h-10 mx-auto" style={{ color: primaryColor }} fill={primaryColor} />
        </motion.div>

        <p className="text-gray-500 font-great-vibes text-2xl mb-4">The Wedding of</p>
        
        <h1 className="text-5xl md:text-7xl font-great-vibes mb-2" style={{ color: primaryColor }}>
          {invitation.bride_name}
        </h1>
        <p className="text-4xl font-great-vibes my-2" style={{ color: primaryColor }}>&</p>
        <h1 className="text-5xl md:text-7xl font-great-vibes mb-8" style={{ color: primaryColor }}>
          {invitation.groom_name}
        </h1>

        <div className="my-8 py-4 border-t border-b" style={{ borderColor: `${primaryColor}30` }}>
          <p className="text-gray-500 text-sm mb-1">Kepada Yth.</p>
          <p className="text-xl font-semibold text-gray-700">{guestName}</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpen}
          className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-white font-medium shadow-lg"
          style={{ backgroundColor: primaryColor }}
        >
          <Heart className="w-4 h-4" fill="white" />
          Buka Undangan
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </motion.button>
      </motion.div>
    </div>
  );
}

// Rustic Vintage - Warm with vintage feel
function VintageIntro({ invitation, guestName, onOpen }) {
  const primaryColor = invitation.primary_color || '#D4A373';
  const secondaryColor = invitation.secondary_color || '#FEFAE0';

  return (
    <div className="min-h-screen flex items-center justify-center relative" 
      style={{ backgroundColor: '#FDF8F3' }}>
      
      {/* Vintage paper texture overlay */}
      <div className="absolute inset-0 opacity-30" 
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
        }} 
      />

      {/* Vintage flower decorations */}
      <motion.div
        className="absolute top-8 left-8 w-24 md:w-32 pointer-events-none"
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <img src={BlackFlowerSvg} alt="" className="w-full h-auto opacity-25" />
      </motion.div>
      <motion.div
        className="absolute top-8 right-8 w-24 md:w-32 pointer-events-none"
        style={{ transform: 'scaleX(-1)' }}
        animate={{ rotate: [3, -3, 3] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <img src={BlackFlowerSvg} alt="" className="w-full h-auto opacity-25" />
      </motion.div>
      <motion.div
        className="absolute bottom-8 left-8 w-20 md:w-28 pointer-events-none"
        style={{ transform: 'scaleY(-1)' }}
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 10, repeat: Infinity }}
      >
        <img src={BlackFlowerSvg} alt="" className="w-full h-auto opacity-20" />
      </motion.div>
      <motion.div
        className="absolute bottom-8 right-8 w-20 md:w-28 pointer-events-none"
        style={{ transform: 'scale(-1)' }}
        animate={{ rotate: [2, -2, 2] }}
        transition={{ duration: 10, repeat: Infinity }}
      >
        <img src={BlackFlowerSvg} alt="" className="w-full h-auto opacity-20" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 text-center px-6 max-w-lg"
      >
        <div className="p-8 md:p-12 border-2 rounded-lg" style={{ borderColor: primaryColor, backgroundColor: 'rgba(255,255,255,0.8)' }}>
          <svg viewBox="0 0 60 20" className="w-20 h-6 mx-auto mb-6" stroke={primaryColor} fill="none" strokeWidth="1.5" opacity="0.5">
            <path d="M0 10 Q10 0, 20 10 Q30 20, 40 10 Q50 0, 60 10" />
            <path d="M0 10 Q10 20, 20 10 Q30 0, 40 10 Q50 20, 60 10" />
          </svg>
          
          <p className="text-amber-700 italic text-sm mb-4 tracking-wider">You are cordially invited to</p>
          <p className="text-xs text-amber-600 tracking-[0.3em] uppercase mb-4">The Wedding Celebration of</p>
          
          <h1 className="text-3xl md:text-5xl font-playfair italic mb-2" style={{ color: '#5D4037' }}>
            {invitation.bride_name}
          </h1>
          <p className="text-2xl font-dancing my-2" style={{ color: primaryColor }}>&</p>
          <h1 className="text-3xl md:text-5xl font-playfair italic mb-8" style={{ color: '#5D4037' }}>
            {invitation.groom_name}
          </h1>

          <div className="w-24 h-px mx-auto mb-6" style={{ backgroundColor: primaryColor, opacity: 0.4 }} />

          <p className="text-amber-600 text-sm mb-1">Kepada Yth.</p>
          <p className="text-xl font-semibold text-amber-800 mb-8">{guestName}</p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpen}
            className="inline-flex items-center gap-2 px-8 py-3 border-2 rounded-lg font-medium transition-colors"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            Buka Undangan
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// Islamic Traditional - With bismillah and islamic patterns
function IslamicIntro({ invitation, guestName, onOpen }) {
  const primaryColor = invitation.primary_color || '#D4A373';
  const secondaryColor = invitation.secondary_color || '#FEFAE0';

  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ backgroundColor: '#F5F9F5' }}>
      {/* Islamic geometric pattern background */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <pattern id="islamic-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke={primaryColor} strokeWidth="0.5" />
            <circle cx="30" cy="30" r="15" fill="none" stroke={primaryColor} strokeWidth="0.5" />
            <path d="M15 15 L45 15 L45 45 L15 45 Z" fill="none" stroke={primaryColor} strokeWidth="0.3" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
        </svg>
      </div>

      {/* Corner leaf decorations */}
      <motion.div
        className="absolute top-0 left-0 w-28 md:w-40 pointer-events-none"
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <img src={StackedLeaves2Svg} alt="" className="w-full h-auto opacity-30" />
      </motion.div>
      <motion.div
        className="absolute top-0 right-0 w-28 md:w-40 pointer-events-none"
        style={{ transform: 'scaleX(-1)' }}
        animate={{ rotate: [2, -2, 2] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <img src={StackedLeaves2Svg} alt="" className="w-full h-auto opacity-30" />
      </motion.div>
      <motion.div
        className="absolute bottom-0 left-0 w-24 md:w-36 pointer-events-none"
        style={{ transform: 'scaleY(-1)' }}
        animate={{ rotate: [-1, 1, -1] }}
        transition={{ duration: 10, repeat: Infinity }}
      >
        <img src={StackedLeavesSvg} alt="" className="w-full h-auto opacity-25" />
      </motion.div>
      <motion.div
        className="absolute bottom-0 right-0 w-24 md:w-36 pointer-events-none"
        style={{ transform: 'scale(-1)' }}
        animate={{ rotate: [1, -1, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      >
        <img src={StackedLeavesSvg} alt="" className="w-full h-auto opacity-25" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 text-center px-6 max-w-lg"
      >
        <motion.p 
          className="text-2xl md:text-3xl mb-6 font-arabic"
          style={{ color: '#2E7D32' }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
        </motion.p>

        <p className="text-emerald-700 text-sm tracking-wider mb-6">Assalamu'alaikum Warahmatullahi Wabarakatuh</p>
        
        <p className="text-gray-600 text-sm tracking-[0.2em] uppercase mb-4">The Wedding of</p>
        
        <h1 className="text-4xl md:text-6xl font-playfair font-semibold mb-2" style={{ color: '#2E7D32' }}>
          {invitation.bride_name}
        </h1>
        <p className="text-3xl font-dancing my-2" style={{ color: '#4CAF50' }}>&</p>
        <h1 className="text-4xl md:text-6xl font-playfair font-semibold mb-8" style={{ color: '#2E7D32' }}>
          {invitation.groom_name}
        </h1>

        <div className="flex items-center justify-center gap-2 mb-8">
          <svg viewBox="0 0 60 20" className="w-16 h-5" stroke="#4CAF50" fill="none" strokeWidth="1" opacity="0.5">
            <path d="M0 10 L10 0 L20 10 L30 0 L40 10 L50 0 L60 10" />
            <path d="M0 10 L10 20 L20 10 L30 20 L40 10 L50 20 L60 10" />
          </svg>
        </div>

        <div className="mb-8 py-4 px-6 rounded-xl bg-emerald-50/50 inline-block">
          <p className="text-emerald-600 text-sm mb-1">Kepada Yth. Bapak/Ibu/Saudara/i</p>
          <p className="text-xl font-semibold text-emerald-800">{guestName}</p>
        </div>

        <div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpen}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-white font-medium shadow-lg"
            style={{ backgroundColor: '#2E7D32' }}
          >
            Buka Undangan
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
