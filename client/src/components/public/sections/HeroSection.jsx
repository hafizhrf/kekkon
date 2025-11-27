import { motion } from 'framer-motion';
import { format, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { id } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { FloralCorner, FloralDivider, AnimatedParticles, GoldAccent } from '../decorations/Ornaments';

export default function HeroSection({ invitation }) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!invitation.enable_countdown || !invitation.wedding_date) return;

    const weddingDate = new Date(invitation.wedding_date);
    
    const updateCountdown = () => {
      const now = new Date();
      if (weddingDate <= now) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = differenceInDays(weddingDate, now);
      const hours = differenceInHours(weddingDate, now) % 24;
      const minutes = differenceInMinutes(weddingDate, now) % 60;
      const seconds = differenceInSeconds(weddingDate, now) % 60;

      setCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [invitation.wedding_date, invitation.enable_countdown]);

  const primaryColor = invitation.primary_color || '#D4A373';
  const secondaryColor = invitation.secondary_color || '#FEFAE0';

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16"
      style={{ backgroundColor: secondaryColor }}
    >
      {/* Animated Background Particles */}
      <AnimatedParticles color={primaryColor} count={25} />

      {/* Decorative Corners */}
      <div className="absolute top-0 left-0 w-32 md:w-48 opacity-60">
        <FloralCorner color={primaryColor} />
      </div>
      <div className="absolute top-0 right-0 w-32 md:w-48 opacity-60">
        <FloralCorner color={primaryColor} flip />
      </div>
      <div className="absolute bottom-0 left-0 w-32 md:w-48 opacity-60 rotate-180">
        <FloralCorner color={primaryColor} flip />
      </div>
      <div className="absolute bottom-0 right-0 w-32 md:w-48 opacity-60 rotate-180">
        <FloralCorner color={primaryColor} />
      </div>

      {/* Rotating Circle Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-32 -left-32 w-64 h-64 md:w-96 md:h-96 rounded-full border opacity-10"
          style={{ borderColor: primaryColor, borderWidth: '2px' }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-48 -right-48 w-80 h-80 md:w-[500px] md:h-[500px] rounded-full border opacity-10"
          style={{ borderColor: primaryColor, borderWidth: '2px' }}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 -right-20 w-40 h-40 rounded-full border-dashed opacity-5"
          style={{ borderColor: primaryColor, borderWidth: '3px' }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 py-20 max-w-3xl mx-auto">
        {/* Opening Text - Different for Muslim and Non-Muslim */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          {invitation.is_muslim ? (
            <p className="text-lg md:text-xl font-great-vibes opacity-70" style={{ color: primaryColor }}>
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
            </p>
          ) : (
            <p className="text-sm md:text-base text-gray-600 italic max-w-md mx-auto">
              "Dua hati yang dipersatukan dalam cinta, untuk menjalani kisah indah bersama selamanya"
            </p>
          )}
        </motion.div>

        {/* The Wedding Of */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <GoldAccent className="w-48 mx-auto mb-4 opacity-60" />
          <p className="text-gray-600 tracking-[0.3em] uppercase text-xs md:text-sm font-medium">
            The Wedding of
          </p>
        </motion.div>

        {/* Names */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-semibold leading-tight"
            style={{ 
              fontFamily: `var(--font-${invitation.font_family || 'playfair'})`,
              color: primaryColor 
            }}
          >
            {invitation.bride_name}
          </h1>
          
          <div className="my-4 md:my-6 flex items-center justify-center gap-4">
            <motion.div 
              className="h-px w-16 md:w-24"
              style={{ backgroundColor: primaryColor }}
              initial={{ width: 0 }}
              animate={{ width: '6rem' }}
              transition={{ delay: 0.6, duration: 0.5 }}
            />
            <motion.span 
              className="text-4xl md:text-5xl font-dancing"
              style={{ color: primaryColor }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              &
            </motion.span>
            <motion.div 
              className="h-px w-16 md:w-24"
              style={{ backgroundColor: primaryColor }}
              initial={{ width: 0 }}
              animate={{ width: '6rem' }}
              transition={{ delay: 0.6, duration: 0.5 }}
            />
          </div>
          
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-semibold leading-tight"
            style={{ 
              fontFamily: `var(--font-${invitation.font_family || 'playfair'})`,
              color: primaryColor 
            }}
          >
            {invitation.groom_name}
          </h1>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <FloralDivider color={primaryColor} />
        </motion.div>

        {/* Date */}
        {invitation.wedding_date && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-10"
          >
            <div 
              className="inline-block px-8 py-4 rounded-full"
              style={{ backgroundColor: `${primaryColor}15` }}
            >
              <p className="text-lg md:text-xl text-gray-700 font-medium">
                {format(new Date(invitation.wedding_date), 'EEEE, d MMMM yyyy', { locale: id })}
              </p>
            </div>
          </motion.div>
        )}

        {/* Countdown */}
        {invitation.enable_countdown && invitation.wedding_date && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <p className="text-sm text-gray-500 uppercase tracking-widest mb-6">Menuju Hari Bahagia</p>
            <div className="flex justify-center gap-3 md:gap-6">
              {[
                { value: countdown.days, label: 'Hari' },
                { value: countdown.hours, label: 'Jam' },
                { value: countdown.minutes, label: 'Menit' },
                { value: countdown.seconds, label: 'Detik' },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="relative"
                >
                  <div
                    className="w-16 md:w-24 py-4 md:py-6 rounded-2xl text-center relative overflow-hidden"
                    style={{ 
                      backgroundColor: 'white',
                      boxShadow: `0 10px 40px ${primaryColor}20`
                    }}
                  >
                    <div 
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <p
                      className="text-2xl md:text-4xl font-bold"
                      style={{ color: primaryColor }}
                    >
                      {String(item.value).padStart(2, '0')}
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-500 mt-1 uppercase tracking-wider">
                      {item.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16"
        >
          <a
            href="#mempelai"
            className="inline-flex flex-col items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
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
