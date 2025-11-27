import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

// Elegant Loading Screen
export function LoadingScreen({ primaryColor = '#D4A373', secondaryColor = '#FEFAE0' }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: secondaryColor }}
    >
      <motion.div
        className="absolute w-64 h-64 rounded-full border-2 opacity-20"
        style={{ borderColor: primaryColor }}
        animate={{ scale: [1, 1.2, 1], rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-48 h-48 rounded-full border opacity-15"
        style={{ borderColor: primaryColor }}
        animate={{ scale: [1.2, 1, 1.2], rotate: -360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="text-center relative z-10">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div 
            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <Heart className="w-10 h-10" style={{ color: primaryColor }} fill={primaryColor} />
          </div>
        </motion.div>
        
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: primaryColor }}
              animate={{ y: [0, -10, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
        
        <motion.p
          className="mt-4 text-sm tracking-widest uppercase"
          style={{ color: primaryColor }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Memuat Undangan
        </motion.p>
      </div>
    </div>
  );
}

// Opening Style 1: Curtain Reveal
export function CurtainReveal({ isOpen, onComplete, primaryColor = '#D4A373' }) {
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    if (isOpen && !animationDone) {
      const timer = setTimeout(() => {
        setAnimationDone(true);
        onComplete?.();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, animationDone, onComplete]);

  if (!isOpen || animationDone) return null;

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none">
      {/* Left Curtain */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 overflow-hidden"
        initial={{ x: 0 }}
        animate={{ x: '-100%' }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="w-full h-full relative" style={{ backgroundColor: primaryColor }}>
          <div className="absolute inset-0 opacity-10">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="absolute h-full w-px bg-white" style={{ left: `${i * 10}%` }} />
            ))}
          </div>
          <div className="absolute right-0 top-0 w-16 h-full" style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.2), transparent)' }} />
        </div>
      </motion.div>

      {/* Right Curtain */}
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 overflow-hidden"
        initial={{ x: 0 }}
        animate={{ x: '100%' }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="w-full h-full relative" style={{ backgroundColor: primaryColor }}>
          <div className="absolute inset-0 opacity-10">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="absolute h-full w-px bg-white" style={{ left: `${i * 10}%` }} />
            ))}
          </div>
          <div className="absolute left-0 top-0 w-16 h-full" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.2), transparent)' }} />
        </div>
      </motion.div>
    </div>
  );
}

// Opening Style 2: Splash/Ripple
export function SplashReveal({ isOpen, onComplete, primaryColor = '#D4A373', secondaryColor = '#FEFAE0' }) {
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    if (isOpen && !animationDone) {
      const timer = setTimeout(() => {
        setAnimationDone(true);
        onComplete?.();
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [isOpen, animationDone, onComplete]);

  if (!isOpen || animationDone) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
      style={{ backgroundColor: secondaryColor }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 1.3 }}
    >
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2"
          style={{ borderColor: primaryColor }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ width: 1500, height: 1500, opacity: 0 }}
          transition={{ duration: 1.5, delay: i * 0.2, ease: "easeOut" }}
        />
      ))}
      
      <motion.div
        className="relative z-10 w-24 h-24 rounded-full flex items-center justify-center"
        style={{ backgroundColor: primaryColor }}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.1, 1, 20], opacity: [1, 1, 1, 0] }}
        transition={{ duration: 1.5, times: [0, 0.3, 0.6, 1] }}
      >
        <Heart className="w-12 h-12 text-white" fill="white" />
      </motion.div>
    </motion.div>
  );
}

// Opening Style 3: Envelope Reveal
export function EnvelopeReveal({ isOpen, onComplete, primaryColor = '#D4A373', secondaryColor = '#FEFAE0' }) {
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    if (isOpen && !animationDone) {
      const timer = setTimeout(() => {
        setAnimationDone(true);
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, animationDone, onComplete]);

  if (!isOpen || animationDone) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
      style={{ backgroundColor: secondaryColor }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 1.5 }}
    >
      <div className="relative w-72 h-48">
        <motion.div
          className="absolute inset-0 rounded-lg shadow-2xl"
          style={{ backgroundColor: primaryColor }}
          initial={{ y: 0 }}
          animate={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        />
        
        <motion.div
          className="absolute top-0 left-0 right-0 h-24 origin-top"
          style={{ 
            backgroundColor: primaryColor,
            clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
            filter: 'brightness(0.85)'
          }}
          initial={{ rotateX: 0 }}
          animate={{ rotateX: -180 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeInOut" }}
        />
        
        <motion.div
          className="absolute inset-3 rounded bg-white shadow-inner flex items-center justify-center"
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: -80, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="text-center">
            <Sparkles className="w-6 h-6 mx-auto mb-1" style={{ color: primaryColor }} />
            <p className="text-sm font-medium" style={{ color: primaryColor }}>You're Invited!</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Opening Style 4: Gate Reveal
export function GateReveal({ isOpen, onComplete, primaryColor = '#D4A373', secondaryColor = '#FEFAE0' }) {
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    if (isOpen && !animationDone) {
      const timer = setTimeout(() => {
        setAnimationDone(true);
        onComplete?.();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, animationDone, onComplete]);

  if (!isOpen || animationDone) return null;

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none" style={{ perspective: '1000px' }}>
      {/* Left Door */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2"
        style={{ backgroundColor: secondaryColor, transformOrigin: 'left', transformStyle: 'preserve-3d' }}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: -90 }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="w-full h-full relative">
          <div className="absolute inset-4 rounded-lg border-4" style={{ borderColor: primaryColor }}>
            <div className="absolute inset-4 rounded border-2" style={{ borderColor: `${primaryColor}50` }} />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-12 rounded-full" style={{ backgroundColor: primaryColor }} />
          </div>
        </div>
      </motion.div>

      {/* Right Door */}
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2"
        style={{ backgroundColor: secondaryColor, transformOrigin: 'right', transformStyle: 'preserve-3d' }}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 90 }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="w-full h-full relative">
          <div className="absolute inset-4 rounded-lg border-4" style={{ borderColor: primaryColor }}>
            <div className="absolute inset-4 rounded border-2" style={{ borderColor: `${primaryColor}50` }} />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-12 rounded-full" style={{ backgroundColor: primaryColor }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Opening Style 5: Scroll Reveal
export function ScrollReveal({ isOpen, onComplete, primaryColor = '#D4A373', secondaryColor = '#FEFAE0' }) {
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    if (isOpen && !animationDone) {
      const timer = setTimeout(() => {
        setAnimationDone(true);
        onComplete?.();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, animationDone, onComplete]);

  if (!isOpen || animationDone) return null;

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none overflow-hidden">
      {/* Top scroll */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1/2"
        style={{ backgroundColor: secondaryColor }}
        initial={{ y: 0 }}
        animate={{ y: '-100%' }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-6 rounded-b-full" style={{ backgroundColor: primaryColor }} />
      </motion.div>

      {/* Bottom scroll */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/2"
        style={{ backgroundColor: secondaryColor }}
        initial={{ y: 0 }}
        animate={{ y: '100%' }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="absolute top-0 left-0 right-0 h-6 rounded-t-full" style={{ backgroundColor: primaryColor }} />
      </motion.div>
    </div>
  );
}

// Opening Style 6: Flower Bloom
export function FlowerReveal({ isOpen, onComplete, primaryColor = '#D4A373', secondaryColor = '#FEFAE0' }) {
  const [animationDone, setAnimationDone] = useState(false);
  const petalCount = 8;

  useEffect(() => {
    if (isOpen && !animationDone) {
      const timer = setTimeout(() => {
        setAnimationDone(true);
        onComplete?.();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, animationDone, onComplete]);

  if (!isOpen || animationDone) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
      style={{ backgroundColor: secondaryColor }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: 1.2 }}
    >
      {[...Array(petalCount)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-28 h-56 origin-bottom"
          style={{
            backgroundColor: primaryColor,
            borderRadius: '50% 50% 0 0',
            rotate: `${(360 / petalCount) * i}deg`,
            opacity: 0.85 - (i % 2) * 0.15,
          }}
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0, opacity: 0 }}
          transition={{ duration: 0.8, delay: i * 0.04, ease: "easeInOut" }}
        />
      ))}
      
      <motion.div
        className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center"
        style={{ backgroundColor: secondaryColor }}
        initial={{ scale: 1 }}
        animate={{ scale: 5, opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Heart className="w-8 h-8" style={{ color: primaryColor }} fill={primaryColor} />
      </motion.div>
    </motion.div>
  );
}

// Simple Fade Reveal (default fallback)
export function FadeReveal({ isOpen, onComplete, secondaryColor = '#FEFAE0' }) {
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    if (isOpen && !animationDone) {
      const timer = setTimeout(() => {
        setAnimationDone(true);
        onComplete?.();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isOpen, animationDone, onComplete]);

  if (!isOpen || animationDone) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[60] pointer-events-none"
      style={{ backgroundColor: secondaryColor }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    />
  );
}
