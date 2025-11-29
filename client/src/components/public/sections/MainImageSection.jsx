import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Import SVG assets
import StackedLeavesSvg from '../../../assets/svg/elegant-themed/stacked-leaves.svg';
import StackedLeaves2Svg from '../../../assets/svg/elegant-themed/stacked-leaves-2.svg';
import BlueCornerFlowerSvg from '../../../assets/svg/flower-themed/blue-corner-flower.svg';
import BlackFlowerSvg from '../../../assets/svg/flower-themed/black-flower.svg';
import CornerBorderSvg from '../../../assets/svg/elegant-themed/corner-border.svg';

export default function MainImageSection({ invitation, imageUrl, position = 1 }) {
  if (!imageUrl) return null;

  const sectionRef = useRef(null);
  const primaryColor = invitation.primary_color || '#D4A373';
  const secondaryColor = invitation.secondary_color || '#FEFAE0';
  const templateId = invitation.template_id || 'geometric-modern';

  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.05]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.1, 0.2]);

  // Template-specific decorations
  const getDecorations = () => {
    switch (templateId) {
      case 'floral-romantic':
        return (
          <>
            {/* Top left flower */}
            <motion.div
              className="absolute top-0 left-0 w-24 md:w-36 pointer-events-none z-10"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img src={BlueCornerFlowerSvg} alt="" className="w-full h-auto opacity-60" />
            </motion.div>
            {/* Bottom right flower */}
            <motion.div
              className="absolute bottom-0 right-0 w-24 md:w-36 pointer-events-none z-10"
              style={{ transform: 'scale(-1)' }}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img src={BlueCornerFlowerSvg} alt="" className="w-full h-auto opacity-60" />
            </motion.div>
          </>
        );
      
      case 'rustic-vintage':
        return (
          <>
            <motion.div
              className="absolute top-4 left-4 w-20 md:w-28 pointer-events-none z-10"
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img src={BlackFlowerSvg} alt="" className="w-full h-auto opacity-25" />
            </motion.div>
            <motion.div
              className="absolute bottom-4 right-4 w-20 md:w-28 pointer-events-none z-10"
              style={{ transform: 'scaleX(-1)' }}
              animate={{ rotate: [2, -2, 2] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img src={BlackFlowerSvg} alt="" className="w-full h-auto opacity-25" />
            </motion.div>
          </>
        );

      case 'minimalist-elegant':
        return (
          <>
            <motion.div
              className="absolute top-0 left-0 w-16 md:w-24 pointer-events-none z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.4 }}
              transition={{ duration: 0.6 }}
            >
              <img src={CornerBorderSvg} alt="" className="w-full h-auto" />
            </motion.div>
            <motion.div
              className="absolute top-0 right-0 w-16 md:w-24 pointer-events-none z-10"
              style={{ transform: 'scaleX(-1)' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.4 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <img src={CornerBorderSvg} alt="" className="w-full h-auto" />
            </motion.div>
            <motion.div
              className="absolute bottom-0 left-0 w-16 md:w-24 pointer-events-none z-10"
              style={{ transform: 'scaleY(-1)' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.4 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img src={CornerBorderSvg} alt="" className="w-full h-auto" />
            </motion.div>
            <motion.div
              className="absolute bottom-0 right-0 w-16 md:w-24 pointer-events-none z-10"
              style={{ transform: 'scale(-1)' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.4 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <img src={CornerBorderSvg} alt="" className="w-full h-auto" />
            </motion.div>
          </>
        );

      case 'islamic-traditional':
        return (
          <>
            <motion.div
              className="absolute top-0 left-0 w-20 md:w-32 pointer-events-none z-10"
              animate={{ rotate: [-1, 1, -1] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img src={StackedLeaves2Svg} alt="" className="w-full h-auto opacity-30" />
            </motion.div>
            <motion.div
              className="absolute top-0 right-0 w-20 md:w-32 pointer-events-none z-10"
              style={{ transform: 'scaleX(-1)' }}
              animate={{ rotate: [1, -1, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img src={StackedLeaves2Svg} alt="" className="w-full h-auto opacity-30" />
            </motion.div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ 
        // Use aspect ratio for consistent display across devices
        // 21:9 = 2.33:1 ratio, using padding-bottom trick for aspect ratio
        aspectRatio: '21/9'
      }}
    >
      {/* Parallax Image */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ y: imageY, scale: imageScale }}
      >
        <img
          src={imageUrl}
          alt="Wedding moment"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* Subtle gradient overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ 
          opacity: overlayOpacity,
          background: `linear-gradient(to bottom, ${primaryColor}40 0%, transparent 30%, transparent 70%, ${secondaryColor}60 100%)`
        }}
      />

      {/* Decorations based on template */}
      {getDecorations()}

      {/* Bottom fade for smooth transition */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${position === 1 ? 'white' : secondaryColor}, transparent)`
        }}
      />
    </section>
  );
}
