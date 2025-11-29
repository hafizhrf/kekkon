import { motion } from 'framer-motion';
import { format, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { id } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { FloralDivider, AnimatedParticles, GoldAccent } from '../decorations/Ornaments';

// Import SVG assets
import StackedLeavesSvg from '../../../assets/svg/elegant-themed/stacked-leaves.svg';
import StackedLeaves2Svg from '../../../assets/svg/elegant-themed/stacked-leaves-2.svg';
import BlueCornerFlowerSvg from '../../../assets/svg/flower-themed/blue-corner-flower.svg';
import BlackFlowerSvg from '../../../assets/svg/flower-themed/black-flower.svg';
import CornerBorderSvg from '../../../assets/svg/elegant-themed/corner-border.svg';

// Shared countdown hook
function useCountdown(weddingDate, enabled) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!enabled || !weddingDate) return;

    const date = new Date(weddingDate);
    
    const updateCountdown = () => {
      const now = new Date();
      if (date <= now) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setCountdown({
        days: differenceInDays(date, now),
        hours: differenceInHours(date, now) % 24,
        minutes: differenceInMinutes(date, now) % 60,
        seconds: differenceInSeconds(date, now) % 60,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [weddingDate, enabled]);

  return countdown;
}

export default function HeroSection({ invitation }) {
  const templateId = invitation.template_id || 'geometric-modern';

  // Render different hero sections based on template
  switch (templateId) {
    case 'minimalist-elegant':
      return <MinimalistHero invitation={invitation} />;
    case 'colorful-playful':
      return <PlayfulHero invitation={invitation} />;
    case 'floral-romantic':
      return <FloralHero invitation={invitation} />;
    case 'rustic-vintage':
      return <VintageHero invitation={invitation} />;
    case 'islamic-traditional':
      return <IslamicHero invitation={invitation} />;
    default:
      return <ModernHero invitation={invitation} />;
  }
}

// ============================================
// GEOMETRIC MODERN - Split layout with photo on side
// ============================================
function ModernHero({ invitation }) {
  const countdown = useCountdown(invitation.wedding_date, invitation.enable_countdown);
  const primaryColor = invitation.primary_color || '#D4A373';
  const secondaryColor = invitation.secondary_color || '#FEFAE0';

  return (
    <section
      id="home"
      className="min-h-screen relative overflow-hidden pt-16"
      style={{ backgroundColor: secondaryColor }}
    >
      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%">
          <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={primaryColor} strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      {/* Geometric shapes */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute -top-20 -left-20 w-80 h-80"
        style={{ backgroundColor: primaryColor }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 0.5 }}
        className="absolute -bottom-32 right-1/4 w-64 h-64 rounded-full border-2"
        style={{ borderColor: primaryColor }}
      />

      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto px-4 py-20 w-full">
          <div className={`flex flex-col ${invitation.home_image ? 'lg:flex-row lg:items-center lg:gap-16' : ''}`}>
            
            {/* Photo side - only if home_image exists */}
            {invitation.home_image && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="lg:w-2/5 mb-10 lg:mb-0"
              >
                <div className="relative max-w-sm mx-auto lg:max-w-none">
                  {/* Frame decoration */}
                  <div className="absolute -inset-4 border-2" style={{ borderColor: primaryColor, opacity: 0.2 }} />
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 -translate-x-2 -translate-y-2" style={{ borderColor: primaryColor }} />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 translate-x-2 translate-y-2" style={{ borderColor: primaryColor }} />
                  
                  <img 
                    src={invitation.home_image} 
                    alt={`${invitation.bride_name} & ${invitation.groom_name}`}
                    className="w-full h-auto object-cover shadow-2xl"
                    style={{ maxHeight: '500px' }}
                  />
                </div>
              </motion.div>
            )}

            {/* Content side */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`text-center ${invitation.home_image ? 'lg:w-3/5 lg:text-left' : ''}`}
            >
              {/* Opening text */}
              {invitation.is_muslim ? (
                <p className="text-xl md:text-2xl font-great-vibes opacity-60 mb-4" style={{ color: primaryColor }}>
                  بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
                </p>
              ) : (
                <p className="text-sm text-gray-500 italic mb-6 max-w-md mx-auto lg:mx-0">
                  "Dua hati yang dipersatukan dalam cinta"
                </p>
              )}

              <p className="text-gray-500 tracking-[0.3em] uppercase text-xs mb-4">The Wedding of</p>

              <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-2" style={{ color: primaryColor }}>
                {invitation.bride_name}
              </h1>
              <div className={`flex items-center gap-4 my-4 ${invitation.home_image ? 'lg:justify-start' : ''} justify-center`}>
                <div className="w-16 h-px" style={{ backgroundColor: primaryColor }} />
                <span className="text-3xl font-dancing" style={{ color: primaryColor }}>&</span>
                <div className="w-16 h-px" style={{ backgroundColor: primaryColor }} />
              </div>
              <h1 className="text-5xl md:text-7xl font-playfair font-bold" style={{ color: primaryColor }}>
                {invitation.groom_name}
              </h1>

              {/* Date */}
              {invitation.wedding_date && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-10"
                >
                  <p className="text-lg text-gray-600">
                    {format(new Date(invitation.wedding_date), 'EEEE, d MMMM yyyy', { locale: id })}
                  </p>
                </motion.div>
              )}

              {/* Countdown */}
              {invitation.enable_countdown && invitation.wedding_date && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-8"
                >
                  <p className="text-sm uppercase tracking-widest mb-4 text-gray-500">Menuju Hari Bahagia</p>
                  <div className={`flex gap-4 ${invitation.home_image ? 'lg:justify-start' : ''} justify-center`}>
                    {[
                      { value: countdown.days, label: 'Hari' },
                      { value: countdown.hours, label: 'Jam' },
                      { value: countdown.minutes, label: 'Menit' },
                      { value: countdown.seconds, label: 'Detik' },
                    ].map((item) => (
                      <div key={item.label} className="w-16 md:w-20 py-4 bg-white shadow-lg text-center">
                        <p className="text-2xl md:text-3xl font-bold" style={{ color: primaryColor }}>
                          {String(item.value).padStart(2, '0')}
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-16"
          >
            <a href="#mempelai" className="inline-flex flex-col items-center text-gray-400">
              <span className="text-xs uppercase tracking-widest mb-3">Scroll</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-6 h-10 rounded-full border-2 flex justify-center pt-2"
                style={{ borderColor: primaryColor }}
              >
                <motion.div
                  animate={{ opacity: [1, 0], y: [0, 12] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                />
              </motion.div>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// MINIMALIST ELEGANT - Full width photo background with overlay
// Monochrome palette with serif typography
// Mobile: uses separate mobile image if available, Desktop: cover center
// ============================================
function MinimalistHero({ invitation }) {
  const countdown = useCountdown(invitation.wedding_date, invitation.enable_countdown);
  // Use monochrome colors for minimalist elegant
  const hasImage = !!invitation.home_image;
  const hasMobileImage = !!invitation.home_image_mobile;
  const textColor = hasImage || hasMobileImage ? 'white' : '#1f2937'; // white or dark gray
  const accentColor = hasImage || hasMobileImage ? 'rgba(255,255,255,0.4)' : '#d1d5db'; // subtle gray

  return (
    <section id="home" className="min-h-screen relative overflow-hidden pt-16">
      {/* Background - either photo or white */}
      {(hasImage || hasMobileImage) ? (
        <>
          {/* Desktop image - hidden on mobile if mobile image exists */}
          {hasImage && (
            <div 
              className={`absolute inset-0 bg-cover bg-center ${hasMobileImage ? 'hidden md:block' : ''}`}
              style={{ backgroundImage: `url(${invitation.home_image})` }}
            />
          )}
          {/* Mobile image - only shown on mobile */}
          {hasMobileImage && (
            <div 
              className="absolute inset-0 bg-cover bg-center md:hidden"
              style={{ backgroundImage: `url(${invitation.home_image_mobile})` }}
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        </>
      ) : (
        <div className="absolute inset-0 bg-white" />
      )}

      {/* Thin border frame */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute inset-8 md:inset-16 border pointer-events-none"
        style={{ borderColor: (hasImage || hasMobileImage) ? 'rgba(255,255,255,0.3)' : '#e5e7eb' }}
      />

      {/* Corner accents */}
      {['top-8 left-8', 'top-8 right-8', 'bottom-8 left-8', 'bottom-8 right-8'].map((pos, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7 + i * 0.1 }}
          className={`absolute ${pos} w-2 h-2 md:w-3 md:h-3`}
          style={{ backgroundColor: (hasImage || hasMobileImage) ? 'white' : '#374151', opacity: (hasImage || hasMobileImage) ? 0.6 : 0.4 }}
        />
      ))}

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center max-w-2xl"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ delay: 0.6 }}
            className="h-px mx-auto mb-8"
            style={{ backgroundColor: accentColor }}
          />

          <p 
            className="tracking-[0.4em] uppercase text-[10px] mb-8 font-serif"
            style={{ color: hasImage ? 'rgba(255,255,255,0.7)' : '#6b7280' }}
          >
            The Wedding of
          </p>

          <h1 
            className="text-5xl md:text-7xl font-playfair font-light tracking-wider mb-4"
            style={{ color: textColor }}
          >
            {invitation.bride_name}
          </h1>
          
          <div className="flex items-center justify-center gap-6 my-6">
            <div className="w-16 h-px" style={{ backgroundColor: accentColor }} />
            <span 
              className="text-2xl font-light font-serif"
              style={{ color: textColor }}
            >
              &
            </span>
            <div className="w-16 h-px" style={{ backgroundColor: accentColor }} />
          </div>
          
          <h1 
            className="text-5xl md:text-7xl font-playfair font-light tracking-wider"
            style={{ color: textColor }}
          >
            {invitation.groom_name}
          </h1>

          {/* Date */}
          {invitation.wedding_date && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-12 text-lg tracking-wide font-serif"
              style={{ color: hasImage ? 'rgba(255,255,255,0.8)' : '#6b7280' }}
            >
              {format(new Date(invitation.wedding_date), 'EEEE, d MMMM yyyy', { locale: id })}
            </motion.p>
          )}

          {/* Countdown */}
          {invitation.enable_countdown && invitation.wedding_date && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-10"
            >
              <div className="flex justify-center gap-6">
                {[
                  { value: countdown.days, label: 'Hari' },
                  { value: countdown.hours, label: 'Jam' },
                  { value: countdown.minutes, label: 'Menit' },
                  { value: countdown.seconds, label: 'Detik' },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <p 
                      className="text-3xl md:text-4xl font-light font-playfair"
                      style={{ color: textColor }}
                    >
                      {String(item.value).padStart(2, '0')}
                    </p>
                    <p 
                      className="text-[10px] uppercase tracking-wider mt-1"
                      style={{ color: hasImage ? 'rgba(255,255,255,0.6)' : '#9ca3af' }}
                    >
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ delay: 1.1 }}
            className="h-px mx-auto mt-12"
            style={{ backgroundColor: accentColor }}
          />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#mempelai" className="flex flex-col items-center">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border flex justify-center pt-1.5"
            style={{ borderColor: hasImage ? 'rgba(255,255,255,0.5)' : '#d1d5db' }}
          >
            <motion.div
              animate={{ opacity: [1, 0], y: [0, 8] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: hasImage ? 'white' : '#6b7280' }}
            />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
}

// ============================================
// COLORFUL PLAYFUL - Asymmetric layout with floating elements
// ============================================
function PlayfulHero({ invitation }) {
  const countdown = useCountdown(invitation.wedding_date, invitation.enable_countdown);
  const primaryColor = invitation.primary_color || '#D4A373';
  const secondaryColor = invitation.secondary_color || '#FEFAE0';

  return (
    <section
      id="home"
      className="min-h-screen relative overflow-hidden pt-16"
      style={{ background: `linear-gradient(135deg, ${secondaryColor} 0%, white 50%, ${secondaryColor} 100%)` }}
    >
      {/* Floating blinking shapes */}
      {[...Array(12)].map((_, i) => {
        const size = 20 + (i % 4) * 20;
        const positions = [
          { left: '5%', top: '15%' },
          { left: '85%', top: '10%' },
          { left: '10%', top: '70%' },
          { left: '90%', top: '60%' },
          { left: '25%', top: '85%' },
          { left: '75%', top: '80%' },
          { left: '50%', top: '5%' },
          { left: '15%', top: '40%' },
          { left: '80%', top: '35%' },
          { left: '60%', top: '90%' },
          { left: '35%', top: '25%' },
          { left: '70%', top: '50%' },
        ];
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              backgroundColor: primaryColor,
              ...positions[i],
            }}
            animate={{
              opacity: [0.05, 0.15, 0.05],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + (i % 3),
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        );
      })}

      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto px-4 py-20 w-full">
          <div className={`flex flex-col ${invitation.home_image ? 'lg:flex-row-reverse lg:items-center lg:gap-12' : 'items-center'}`}>
            
            {/* Photo - asymmetric position */}
            {invitation.home_image && (
              <motion.div
                initial={{ opacity: 0, rotate: 5, scale: 0.9 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="lg:w-2/5 mb-10 lg:mb-0"
              >
                <div className="relative max-w-xs mx-auto">
                  {/* Playful frame */}
                  <motion.div
                    className="absolute -inset-4 rounded-3xl"
                    style={{ backgroundColor: primaryColor, opacity: 0.2 }}
                    animate={{ rotate: [0, 2, 0, -2, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute -top-3 -left-3 w-8 h-8 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full"
                    style={{ backgroundColor: primaryColor, opacity: 0.6 }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                  
                  <img 
                    src={invitation.home_image} 
                    alt={`${invitation.bride_name} & ${invitation.groom_name}`}
                    className="relative w-full h-auto object-cover rounded-3xl shadow-2xl"
                    style={{ maxHeight: '450px' }}
                  />
                </div>
              </motion.div>
            )}

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`text-center ${invitation.home_image ? 'lg:w-3/5 lg:text-left' : ''}`}
            >
              <motion.p 
                className="text-sm font-medium mb-4 tracking-widest uppercase"
                style={{ color: primaryColor }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                We're Getting Married!
              </motion.p>

              <h1 
                className="text-5xl md:text-7xl font-playfair font-bold mb-2"
                style={{ color: primaryColor }}
              >
                {invitation.bride_name}
              </h1>
              <p className="text-4xl font-dancing my-2" style={{ color: primaryColor }}>&</p>
              <h1 
                className="text-5xl md:text-7xl font-playfair font-bold"
                style={{ color: primaryColor }}
              >
                {invitation.groom_name}
              </h1>

              {/* Date badge */}
              {invitation.wedding_date && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8"
                >
                  <span 
                    className="inline-block px-6 py-3 rounded-full text-white font-medium shadow-lg"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {format(new Date(invitation.wedding_date), 'd MMMM yyyy', { locale: id })}
                  </span>
                </motion.div>
              )}

              {/* Countdown - playful boxes */}
              {invitation.enable_countdown && invitation.wedding_date && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-10"
                >
                  <p className="text-sm mb-4" style={{ color: `${primaryColor}99` }}>Menuju Hari Bahagia</p>
                  <div className={`flex gap-3 ${invitation.home_image ? 'lg:justify-start' : ''} justify-center`}>
                    {[
                      { value: countdown.days, label: 'Hari' },
                      { value: countdown.hours, label: 'Jam' },
                      { value: countdown.minutes, label: 'Menit' },
                      { value: countdown.seconds, label: 'Detik' },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        className="w-16 md:w-20 py-4 rounded-2xl shadow-xl text-center"
                        style={{ background: `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}10)` }}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                      >
                        <p className="text-2xl md:text-3xl font-bold" style={{ color: primaryColor }}>
                          {String(item.value).padStart(2, '0')}
                        </p>
                        <p className="text-[10px] uppercase" style={{ color: `${primaryColor}80` }}>{item.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-16"
          >
            <a href="#mempelai">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="inline-block"
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <motion.div
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                  />
                </div>
              </motion.div>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// FLORAL ROMANTIC - Centered elegant with flower decorations
// ============================================
function FloralHero({ invitation }) {
  const countdown = useCountdown(invitation.wedding_date, invitation.enable_countdown);
  const primaryColor = invitation.primary_color || '#D4A373';
  const secondaryColor = invitation.secondary_color || '#FEFAE0';

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16"
      style={{ backgroundColor: secondaryColor }}
    >
      <AnimatedParticles color={primaryColor} count={20} />

      {/* Corner flowers */}
      {[
        { pos: 'top-0 left-0', transform: 'none' },
        { pos: 'top-0 right-0', transform: 'scaleX(-1)' },
        { pos: 'bottom-0 left-0', transform: 'scaleY(-1)' },
        { pos: 'bottom-0 right-0', transform: 'scale(-1)' },
      ].map((item, i) => (
        <motion.div
          key={i}
          className={`absolute ${item.pos} w-28 md:w-40 pointer-events-none z-20`}
          style={{ transform: item.transform }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.7, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
        >
          <img src={BlueCornerFlowerSvg} alt="" className="w-full h-auto" />
        </motion.div>
      ))}

      <div className="relative z-10 text-center px-4 py-20 max-w-4xl mx-auto">
        {/* Photo - centered oval */}
        {invitation.home_image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-10"
          >
            <div className="relative w-48 h-60 md:w-56 md:h-72 mx-auto">
              <div 
                className="absolute -inset-3 rounded-[50%] border-2"
                style={{ borderColor: `${primaryColor}40` }}
              />
              <div 
                className="absolute -inset-6 rounded-[50%] border"
                style={{ borderColor: `${primaryColor}20` }}
              />
              <img 
                src={invitation.home_image} 
                alt={`${invitation.bride_name} & ${invitation.groom_name}`}
                className="w-full h-full object-cover rounded-[50%] shadow-xl"
              />
            </div>
          </motion.div>
        )}

        {/* Opening */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          {invitation.is_muslim ? (
            <p className="text-xl font-great-vibes opacity-60" style={{ color: primaryColor }}>
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
            </p>
          ) : (
            <p className="text-sm text-gray-500 italic">
              "Cinta sejati adalah ketika dua jiwa menjadi satu"
            </p>
          )}
        </motion.div>

        <GoldAccent className="w-48 mx-auto mb-4 opacity-50" />
        <p className="text-gray-500 tracking-[0.2em] uppercase text-xs mb-6">The Wedding of</p>

        {/* Names with script font */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-5xl md:text-7xl font-great-vibes mb-2" style={{ color: primaryColor }}>
            {invitation.bride_name}
          </h1>
          <motion.span 
            className="text-4xl font-dancing block my-2"
            style={{ color: primaryColor }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            &
          </motion.span>
          <h1 className="text-5xl md:text-7xl font-great-vibes" style={{ color: primaryColor }}>
            {invitation.groom_name}
          </h1>
        </motion.div>

        <FloralDivider color={primaryColor} />

        {/* Date */}
        {invitation.wedding_date && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8"
          >
            <p className="text-lg text-gray-600">
              {format(new Date(invitation.wedding_date), 'EEEE, d MMMM yyyy', { locale: id })}
            </p>
          </motion.div>
        )}

        {/* Countdown - elegant rounded */}
        {invitation.enable_countdown && invitation.wedding_date && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-10"
          >
            <p className="text-sm text-gray-500 mb-4">Menuju Hari Bahagia</p>
            <div className="flex justify-center gap-4">
              {[
                { value: countdown.days, label: 'Hari' },
                { value: countdown.hours, label: 'Jam' },
                { value: countdown.minutes, label: 'Menit' },
                { value: countdown.seconds, label: 'Detik' },
              ].map((item) => (
                <div 
                  key={item.label} 
                  className="w-16 md:w-20 py-4 bg-white/80 backdrop-blur-sm rounded-2xl border-2 shadow-lg"
                  style={{ borderColor: primaryColor }}
                >
                  <p className="text-2xl md:text-3xl font-bold" style={{ color: primaryColor }}>
                    {String(item.value).padStart(2, '0')}
                  </p>
                  <p className="text-[10px] uppercase text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16"
        >
          <a href="#mempelai" className="inline-flex flex-col items-center text-gray-400">
            <span className="text-xs uppercase tracking-widest mb-3">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 flex justify-center pt-2"
              style={{ borderColor: primaryColor }}
            >
              <motion.div
                animate={{ opacity: [1, 0], y: [0, 12] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: primaryColor }}
              />
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// RUSTIC VINTAGE - Paper texture with polaroid photo
// ============================================
function VintageHero({ invitation }) {
  const countdown = useCountdown(invitation.wedding_date, invitation.enable_countdown);
  const primaryColor = invitation.primary_color || '#D4A373';

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16"
      style={{ backgroundColor: '#FDF8F3' }}
    >
      {/* Paper texture overlay */}
      <div className="absolute inset-0 opacity-20" 
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
        }} 
      />

      {/* Vintage flower decorations */}
      {[
        { pos: 'top-8 left-8', delay: 0.3 },
        { pos: 'top-8 right-8 -scale-x-100', delay: 0.4 },
        { pos: 'bottom-8 left-8 -scale-y-100', delay: 0.5 },
        { pos: 'bottom-8 right-8 -scale-x-100 -scale-y-100', delay: 0.6 },
      ].map((item, i) => (
        <motion.div
          key={i}
          className={`absolute ${item.pos} w-20 md:w-28 pointer-events-none`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: item.delay }}
        >
          <img src={BlackFlowerSvg} alt="" className="w-full h-auto" />
        </motion.div>
      ))}

      <div className="relative z-10 px-4 py-20 w-full max-w-4xl mx-auto">
        <div className={`flex flex-col ${invitation.home_image ? 'md:flex-row md:items-center md:gap-12' : 'items-center'}`}>
          
          {/* Polaroid photo */}
          {invitation.home_image && (
            <motion.div
              initial={{ opacity: 0, rotate: -5 }}
              animate={{ opacity: 1, rotate: -3 }}
              transition={{ delay: 0.3 }}
              className="md:w-2/5 mb-10 md:mb-0"
            >
              <div 
                className="relative max-w-xs mx-auto p-3 pb-12 bg-white shadow-xl"
                style={{ transform: 'rotate(-3deg)' }}
              >
                <img 
                  src={invitation.home_image} 
                  alt={`${invitation.bride_name} & ${invitation.groom_name}`}
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: '350px' }}
                />
                <p className="absolute bottom-3 left-0 right-0 text-center font-dancing text-lg text-amber-800">
                  Our Love Story
                </p>
              </div>
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`${invitation.home_image ? 'md:w-3/5' : ''} text-center ${invitation.home_image ? 'md:text-left' : ''}`}
          >
            {/* Ornate header */}
            <svg viewBox="0 0 60 20" className="w-20 h-6 mx-auto md:mx-0 mb-6" stroke={primaryColor} fill="none" strokeWidth="1.5" opacity="0.5">
              <path d="M0 10 Q10 0, 20 10 Q30 20, 40 10 Q50 0, 60 10" />
              <path d="M0 10 Q10 20, 20 10 Q30 0, 40 10 Q50 20, 60 10" />
            </svg>

            <p className="text-amber-700 italic text-sm mb-2 tracking-wider">You are cordially invited to</p>
            <p className="text-xs text-amber-600 tracking-[0.3em] uppercase mb-6">The Wedding Celebration of</p>

            <h1 className="text-4xl md:text-6xl font-playfair italic mb-2" style={{ color: '#5D4037' }}>
              {invitation.bride_name}
            </h1>
            <p className="text-2xl font-dancing my-2" style={{ color: primaryColor }}>&</p>
            <h1 className="text-4xl md:text-6xl font-playfair italic" style={{ color: '#5D4037' }}>
              {invitation.groom_name}
            </h1>

            {/* Date */}
            {invitation.wedding_date && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-8"
              >
                <p className="text-amber-800 font-medium">
                  {format(new Date(invitation.wedding_date), 'EEEE, d MMMM yyyy', { locale: id })}
                </p>
              </motion.div>
            )}

            {/* Countdown - vintage style */}
            {invitation.enable_countdown && invitation.wedding_date && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-8"
              >
                <p className="text-sm text-amber-600 mb-4">Menuju Hari Bahagia</p>
                <div className={`flex gap-3 ${invitation.home_image ? 'md:justify-start' : ''} justify-center`}>
                  {[
                    { value: countdown.days, label: 'Hari' },
                    { value: countdown.hours, label: 'Jam' },
                    { value: countdown.minutes, label: 'Menit' },
                    { value: countdown.seconds, label: 'Detik' },
                  ].map((item) => (
                    <div 
                      key={item.label} 
                      className="w-14 md:w-18 py-3 bg-amber-50/80 border-2 border-amber-200 rounded-lg text-center"
                    >
                      <p className="text-xl md:text-2xl font-bold text-amber-800">
                        {String(item.value).padStart(2, '0')}
                      </p>
                      <p className="text-[9px] uppercase text-amber-600">{item.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-16"
        >
          <a href="#mempelai" className="inline-flex flex-col items-center text-amber-600">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// ISLAMIC TRADITIONAL - Geometric patterns with centered layout
// ============================================
function IslamicHero({ invitation }) {
  const countdown = useCountdown(invitation.wedding_date, invitation.enable_countdown);
  const primaryColor = invitation.primary_color || '#D4A373';
  const secondaryColor = invitation.secondary_color || '#FEFAE0';

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16"
      style={{ backgroundColor: '#F5F9F5' }}
    >
      {/* Islamic geometric pattern */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg width="100%" height="100%">
          <pattern id="islamic-hero" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M40 0 L80 40 L40 80 L0 40 Z" fill="none" stroke="#2E7D32" strokeWidth="1" />
            <circle cx="40" cy="40" r="20" fill="none" stroke="#2E7D32" strokeWidth="0.5" />
            <path d="M20 20 L60 20 L60 60 L20 60 Z" fill="none" stroke="#2E7D32" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#islamic-hero)" />
        </svg>
      </div>

      {/* Corner leaves */}
      {[
        { pos: 'top-0 left-0', transform: 'none', delay: 0.3 },
        { pos: 'top-0 right-0', transform: 'scaleX(-1)', delay: 0.4 },
        { pos: 'bottom-0 left-0', transform: 'scaleY(-1)', delay: 0.5 },
        { pos: 'bottom-0 right-0', transform: 'scale(-1)', delay: 0.6 },
      ].map((item, i) => (
        <motion.div
          key={i}
          className={`absolute ${item.pos} w-24 md:w-36 pointer-events-none`}
          style={{ transform: item.transform }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          transition={{ delay: item.delay }}
        >
          <img src={StackedLeaves2Svg} alt="" className="w-full h-auto" />
        </motion.div>
      ))}

      <div className="relative z-10 text-center px-4 py-20 max-w-3xl mx-auto">
        {/* Bismillah */}
        <motion.p 
          className="text-2xl md:text-3xl mb-8 font-arabic"
          style={{ color: '#2E7D32' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
        </motion.p>

        <p className="text-emerald-700 text-sm tracking-wider mb-8">
          Assalamu'alaikum Warahmatullahi Wabarakatuh
        </p>

        {/* Photo - hexagonal frame */}
        {invitation.home_image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-10"
          >
            <div className="relative w-40 h-40 md:w-52 md:h-52 mx-auto">
              <div 
                className="absolute inset-0 border-2 rotate-45"
                style={{ borderColor: '#2E7D32', opacity: 0.3 }}
              />
              <div className="absolute inset-2 overflow-hidden rounded-lg">
                <img 
                  src={invitation.home_image} 
                  alt={`${invitation.bride_name} & ${invitation.groom_name}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        )}

        <p className="text-gray-600 text-sm tracking-[0.2em] uppercase mb-6">The Wedding of</p>

        {/* Names */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-playfair font-semibold mb-2" style={{ color: '#2E7D32' }}>
            {invitation.bride_name}
          </h1>
          <p className="text-3xl font-dancing my-2" style={{ color: '#4CAF50' }}>&</p>
          <h1 className="text-4xl md:text-6xl font-playfair font-semibold" style={{ color: '#2E7D32' }}>
            {invitation.groom_name}
          </h1>
        </motion.div>

        {/* Islamic divider */}
        <div className="flex items-center justify-center gap-2 my-8">
          <svg viewBox="0 0 60 20" className="w-16 h-5" stroke="#4CAF50" fill="none" strokeWidth="1" opacity="0.5">
            <path d="M0 10 L10 0 L20 10 L30 0 L40 10 L50 0 L60 10" />
            <path d="M0 10 L10 20 L20 10 L30 20 L40 10 L50 20 L60 10" />
          </svg>
        </div>

        {/* Date */}
        {invitation.wedding_date && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-lg text-emerald-700"
          >
            {format(new Date(invitation.wedding_date), 'EEEE, d MMMM yyyy', { locale: id })}
          </motion.p>
        )}

        {/* Countdown */}
        {invitation.enable_countdown && invitation.wedding_date && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-10"
          >
            <p className="text-sm text-emerald-600 mb-4">Menuju Hari Bahagia</p>
            <div className="flex justify-center gap-4">
              {[
                { value: countdown.days, label: 'Hari' },
                { value: countdown.hours, label: 'Jam' },
                { value: countdown.minutes, label: 'Menit' },
                { value: countdown.seconds, label: 'Detik' },
              ].map((item) => (
                <div 
                  key={item.label} 
                  className="w-16 md:w-20 py-4 bg-emerald-50/80 border-2 border-emerald-200 rounded-xl text-center"
                >
                  <p className="text-2xl md:text-3xl font-bold text-emerald-700">
                    {String(item.value).padStart(2, '0')}
                  </p>
                  <p className="text-[10px] uppercase text-emerald-500">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16"
        >
          <a href="#mempelai" className="inline-flex flex-col items-center text-emerald-500">
            <span className="text-xs uppercase tracking-widest mb-3">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-emerald-400 flex justify-center pt-2"
            >
              <motion.div
                animate={{ opacity: [1, 0], y: [0, 12] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-emerald-500"
              />
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
