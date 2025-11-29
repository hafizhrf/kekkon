import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Users, Calendar, Image, Gift, MessageSquare } from 'lucide-react';

const SECTIONS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'mempelai', label: 'Mempelai', icon: Users },
  { id: 'acara', label: 'Acara', icon: Calendar },
  { id: 'gallery', label: 'Gallery', icon: Image },
  { id: 'gift', label: 'Hadiah', icon: Gift },
  { id: 'rsvp', label: 'RSVP', icon: MessageSquare },
];

// Now uses primaryColor from palette for all templates
const getTemplateStyle = (templateId, primaryColor) => {
  // Base styles that apply to all templates - colors come from primaryColor palette
  const baseStyle = {
    container: 'bg-white/90 backdrop-blur-md shadow-lg',
    mobileContainer: 'bg-white/95 backdrop-blur-md shadow-lg',
    dot: 'border-2',
    activeDot: '', // Will use primaryColor directly
    line: 'bg-gray-200',
    activeLine: '', // Will use primaryColor directly
    mobileProgress: '', // Will use primaryColor directly
  };

  // Template-specific container styles only (not colors)
  const containerStyles = {
    'geometric-modern': {
      container: 'bg-white/90 backdrop-blur-md shadow-lg',
      mobileContainer: 'bg-white/95 backdrop-blur-md shadow-lg',
      dot: 'border-2',
    },
    'minimalist-elegant': {
      container: 'bg-white/80 backdrop-blur-sm shadow-md',
      mobileContainer: 'bg-white/90 backdrop-blur-sm shadow-md',
      dot: 'border',
    },
    'floral-romantic': {
      container: 'bg-white/90 backdrop-blur-md shadow-lg border border-gray-200',
      mobileContainer: 'bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-200',
      dot: 'border-2',
    },
    'islamic-traditional': {
      container: 'bg-white/90 backdrop-blur-md shadow-lg border border-gray-200',
      mobileContainer: 'bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-200',
      dot: 'border-2',
    },
    'rustic-vintage': {
      container: 'bg-white/90 backdrop-blur-md shadow-lg border border-gray-200',
      mobileContainer: 'bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-200',
      dot: 'border-2',
    },
    'colorful-playful': {
      container: 'bg-white/90 backdrop-blur-md shadow-lg',
      mobileContainer: 'bg-white/95 backdrop-blur-md shadow-lg',
      dot: 'border-2',
    },
  };

  const templateContainer = containerStyles[templateId] || {};

  return {
    ...baseStyle,
    ...templateContainer,
    // Colors now use primaryColor from palette
    activeDot: '',
    line: 'bg-gray-200',
    activeLine: '',
    mobileProgress: '',
  };
};

export default function ScrollTimeline({ templateId, primaryColor, hasGallery = true, hasGift = true, hasRsvp = true }) {
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);

  const visibleSections = SECTIONS.filter(section => {
    if (section.id === 'gallery' && !hasGallery) return false;
    if (section.id === 'gift' && !hasGift) return false;
    if (section.id === 'rsvp' && !hasRsvp) return false;
    return true;
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);

      const sections = visibleSections.map(s => document.getElementById(s.id)).filter(Boolean);
      const viewportMiddle = scrollTop + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.offsetTop <= viewportMiddle) {
          setActiveSection(visibleSections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleSections]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const top = element.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const style = getTemplateStyle(templateId, primaryColor);
  const activeIndex = visibleSections.findIndex(s => s.id === activeSection);

  return (
    <>
      {/* Desktop Timeline - Right Side */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2 }}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:block"
      >
        <div className={`${style.container} rounded-full py-4 px-2`}>
          <div className="absolute left-1/2 -translate-x-1/2 top-6 bottom-6 w-0.5 rounded-full overflow-hidden">
            <div className={`absolute inset-0 ${style.line}`} />
            <motion.div
              className={`absolute top-0 left-0 right-0 ${style.activeLine}`}
              style={{ 
                height: `${(activeIndex / (visibleSections.length - 1)) * 100}%`,
                backgroundColor: !style.activeLine.includes('gradient') ? primaryColor : undefined,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="relative flex flex-col items-center gap-4">
            {visibleSections.map((section, index) => {
              const Icon = section.icon;
              const isActive = section.id === activeSection;
              const isPast = index <= activeIndex;

              return (
                <motion.button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="relative group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {section.label}
                    </div>
                  </div>

                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${style.dot} ${
                      isActive 
                        ? `${style.activeDot} text-white shadow-lg scale-110` 
                        : isPast 
                          ? 'bg-white text-gray-600' 
                          : 'bg-gray-50 text-gray-400'
                    }`}
                    style={isActive && !style.activeDot.includes('gradient') ? { backgroundColor: primaryColor } : {}}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {isActive && (
                    <motion.div
                      className={`absolute inset-0 rounded-full ${style.activeDot} opacity-30`}
                      style={!style.activeDot.includes('gradient') ? { backgroundColor: primaryColor } : {}}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <div className="w-1 h-16 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className={style.activeLine}
              style={{ 
                height: `${scrollProgress}%`,
                backgroundColor: !style.activeLine.includes('gradient') ? primaryColor : undefined,
              }}
            />
          </div>
        </div>
      </motion.div>
    </>
  );
}

// Export scroll progress hook for navbar integration
export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollProgress;
}

// Export active section hook for navbar
export function useActiveSection(sectionIds = []) {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const viewportMiddle = scrollTop + window.innerHeight / 3;

      const sections = sectionIds
        .map(id => document.getElementById(id))
        .filter(Boolean);

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.offsetTop <= viewportMiddle) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);

  return activeSection;
}
