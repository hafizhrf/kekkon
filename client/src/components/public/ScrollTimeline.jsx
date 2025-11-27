import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Users, Calendar, Image, Gift, MessageSquare, Heart } from 'lucide-react';

const SECTIONS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'mempelai', label: 'Mempelai', icon: Users },
  { id: 'acara', label: 'Acara', icon: Calendar },
  { id: 'gallery', label: 'Gallery', icon: Image },
  { id: 'gift', label: 'Hadiah', icon: Gift },
  { id: 'rsvp', label: 'RSVP', icon: MessageSquare },
];

// Template-based styles
const getTemplateStyle = (templateId, primaryColor) => {
  const styles = {
    'geometric-modern': {
      container: 'bg-white/90 backdrop-blur-md shadow-lg',
      dot: 'border-2',
      activeDot: `bg-gradient-to-br from-amber-400 to-orange-500`,
      line: 'bg-gray-200',
      activeLine: `bg-gradient-to-b from-amber-400 to-orange-500`,
    },
    'minimalist-elegant': {
      container: 'bg-white/80 backdrop-blur-sm shadow-md',
      dot: 'border',
      activeDot: 'bg-gray-800',
      line: 'bg-gray-100',
      activeLine: 'bg-gray-800',
    },
    'floral-romantic': {
      container: 'bg-rose-50/90 backdrop-blur-md shadow-lg border border-rose-200',
      dot: 'border-2 border-rose-200',
      activeDot: 'bg-gradient-to-br from-rose-400 to-pink-500',
      line: 'bg-rose-100',
      activeLine: 'bg-gradient-to-b from-rose-400 to-pink-500',
    },
    'islamic-traditional': {
      container: 'bg-emerald-50/90 backdrop-blur-md shadow-lg border border-emerald-200',
      dot: 'border-2 border-emerald-200',
      activeDot: 'bg-gradient-to-br from-emerald-500 to-teal-500',
      line: 'bg-emerald-100',
      activeLine: 'bg-gradient-to-b from-emerald-500 to-teal-500',
    },
    'rustic-vintage': {
      container: 'bg-amber-50/90 backdrop-blur-md shadow-lg border border-amber-200',
      dot: 'border-2 border-amber-300',
      activeDot: 'bg-gradient-to-br from-amber-600 to-yellow-600',
      line: 'bg-amber-200',
      activeLine: 'bg-gradient-to-b from-amber-600 to-yellow-600',
    },
  };

  return styles[templateId] || {
    container: 'bg-white/90 backdrop-blur-md shadow-lg',
    dot: 'border-2',
    activeDot: `bg-[${primaryColor}]`,
    line: 'bg-gray-200',
    activeLine: `bg-[${primaryColor}]`,
  };
};

export default function ScrollTimeline({ templateId, primaryColor, hasGallery = true, hasGift = true }) {
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Filter sections based on available content
  const visibleSections = SECTIONS.filter(section => {
    if (section.id === 'gallery' && !hasGallery) return false;
    if (section.id === 'gift' && !hasGift) return false;
    return true;
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);

      // Determine active section
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
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2 }}
      className={`fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:block`}
    >
      <div className={`${style.container} rounded-full py-4 px-2`}>
        {/* Progress line background */}
        <div className="absolute left-1/2 -translate-x-1/2 top-6 bottom-6 w-0.5 rounded-full overflow-hidden">
          <div className={`absolute inset-0 ${style.line}`} />
          <motion.div
            className={`absolute top-0 left-0 right-0 ${style.activeLine}`}
            style={{ height: `${(activeIndex / (visibleSections.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Section dots */}
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
                {/* Tooltip */}
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {section.label}
                  </div>
                </div>

                {/* Dot */}
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

                {/* Active pulse */}
                {isActive && (
                  <motion.div
                    className={`absolute inset-0 rounded-full ${style.activeDot} opacity-30`}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Scroll progress indicator */}
      <div className="mt-4 flex justify-center">
        <div className="w-1 h-16 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className={style.activeLine}
            style={{ height: `${scrollProgress}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
