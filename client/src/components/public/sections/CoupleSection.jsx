import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Instagram, Heart } from 'lucide-react';
import { FloralDivider, LeafBranch, GoldAccent } from '../decorations/Ornaments';
import { 
  ElegantLeaves, 
  ElegantCorner, 
  FloralCornerDecoration,
  VintageFlowerDecoration,
  PlayfulShapes,
  ThemedDivider,
  getThemeDecorations 
} from '../decorations/ThemedDecorations';

export default function CoupleSection({ invitation, onPhotoClick }) {
  const sectionRef = useRef(null);
  const brideRef = useRef(null);
  const groomRef = useRef(null);
  
  // Scroll-based zoom effect for the entire section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Create zoom effect when scrolling through the section
  const brideScale = useTransform(scrollYProgress, [0.1, 0.3, 0.5, 0.7], [0.8, 1.1, 1.1, 1]);
  const groomScale = useTransform(scrollYProgress, [0.15, 0.35, 0.55, 0.75], [0.8, 1.1, 1.1, 1]);
  const brideOpacity = useTransform(scrollYProgress, [0.1, 0.25, 0.5, 0.65], [0.5, 1, 1, 0.9]);
  const groomOpacity = useTransform(scrollYProgress, [0.15, 0.3, 0.55, 0.7], [0.5, 1, 1, 0.9]);
  const primaryColor = invitation.primary_color || '#D4A373';
  const secondaryColor = invitation.secondary_color || '#FEFAE0';
  const isMuslim = invitation.is_muslim !== undefined ? Boolean(invitation.is_muslim) : true;
  const templateId = invitation.template_id || 'geometric-modern';
  const theme = getThemeDecorations(templateId);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  // Render decorations based on theme
  const renderDecorations = () => {
    switch (theme.type) {
      case 'elegant':
        return (
          <>
            <ElegantLeaves position="left" color={primaryColor} className="top-0 opacity-30" />
            <ElegantLeaves position="right" color={primaryColor} className="top-0 opacity-30" />
            <ElegantCorner position="top-left" color={primaryColor} />
            <ElegantCorner position="top-right" color={primaryColor} />
            <FloralCornerDecoration position="bottom-left" color={primaryColor} />
            <FloralCornerDecoration position="bottom-right" color={primaryColor} />
          </>
        );
      case 'vintage':
        return (
          <>
            <VintageFlowerDecoration position="top-left" />
            <VintageFlowerDecoration position="top-right" />
            <VintageFlowerDecoration position="bottom-left" />
            <VintageFlowerDecoration position="bottom-right" />
          </>
        );
      case 'playful':
        return <PlayfulShapes color={primaryColor} />;
      case 'traditional':
        return (
          <>
            <ElegantCorner position="top-left" color={primaryColor} />
            <ElegantCorner position="top-right" color={primaryColor} />
            <ElegantCorner position="bottom-left" color={primaryColor} />
            <ElegantCorner position="bottom-right" color={primaryColor} />
          </>
        );
      case 'minimalist':
        return null; // No decorations for minimalist
      default:
        return (
          <>
            <div className="absolute top-10 left-10 opacity-15">
              <LeafBranch color={primaryColor} className="w-20" />
            </div>
            <div className="absolute top-10 right-10 opacity-15 scale-x-[-1]">
              <LeafBranch color={primaryColor} className="w-20" />
            </div>
          </>
        );
    }
  };

  // Render photo based on theme with scroll zoom effect
  const renderPhoto = (photo, name, gender, isGroom = false) => {
    const frameClass = theme.photoFrame;
    const sizeClass = theme.photoSize;
    const scale = isGroom ? groomScale : brideScale;
    const opacity = isGroom ? groomOpacity : brideOpacity;
    
    const handleClick = () => {
      if (photo && onPhotoClick) {
        onPhotoClick(photo, name);
      }
    };
    
    return (
      <motion.div 
        className={`relative inline-block mb-4 sm:mb-6 md:mb-8 ${photo ? 'cursor-pointer' : ''}`}
        style={{ scale, opacity }}
        ref={isGroom ? groomRef : brideRef}
        onClick={handleClick}
      >
        {/* Animated border for elegant/traditional themes */}
        {(theme.type === 'elegant' || theme.type === 'traditional') && (
          <motion.div
            animate={{ rotate: isGroom ? -360 : 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full"
            style={{
              border: `2px dashed ${primaryColor}`,
              opacity: 0.3,
              padding: '6px',
              margin: '-6px',
            }}
          />
        )}
        
        {/* Photo container */}
        <div
          className={`${sizeClass} overflow-hidden relative ${frameClass} group`}
          style={{ 
            borderColor: primaryColor,
            boxShadow: theme.type === 'playful' 
              ? `0 20px 50px ${primaryColor}40`
              : theme.type === 'minimalist'
              ? 'none'
              : `0 10px 30px ${primaryColor}20`
          }}
        >
          {photo ? (
            <>
              <img src={photo} alt={name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-2 py-1 rounded">
                  Klik untuk preview
                </span>
              </div>
            </>
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: `${primaryColor}15` }}
            >
              <span className="text-3xl sm:text-4xl md:text-6xl" style={{ color: primaryColor }}>
                {gender === 'female' ? '♀' : '♂'}
              </span>
            </div>
          )}
        </div>
        
        {/* Decorative badge - different per theme */}
        {theme.type !== 'minimalist' && (
          <div 
            className="absolute -bottom-1 sm:-bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center"
            style={{ 
              backgroundColor: theme.type === 'playful' ? primaryColor : `${primaryColor}`,
              borderRadius: theme.type === 'vintage' ? '4px' : '50%',
            }}
          >
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" fill="white" />
          </div>
        )}
      </motion.div>
    );
  };

  // Different layout for stacked (playful) theme
  const renderCoupleLayout = () => {
    if (theme.photoLayout === 'stacked') {
      return (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center gap-8"
        >
          {/* Stacked/Overlapping layout */}
          <div className="relative flex justify-center items-end">
            <motion.div variants={itemVariants} className="relative z-10 -mr-8">
              {renderPhoto(invitation.bride_photo, invitation.bride_name, 'female')}
            </motion.div>
            <motion.div variants={itemVariants} className="relative z-20">
              {renderPhoto(invitation.groom_photo, invitation.groom_name, 'male', true)}
            </motion.div>
          </div>
          
          {/* Names below */}
          <div className="text-center">
            <motion.h3
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2"
              style={{ fontFamily: `var(--font-${invitation.font_family || 'playfair'})`, color: primaryColor }}
            >
              {invitation.bride_name}
            </motion.h3>
            <span className="text-2xl mx-4" style={{ color: primaryColor }}>&</span>
            <motion.h3
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl font-semibold"
              style={{ fontFamily: `var(--font-${invitation.font_family || 'playfair'})`, color: primaryColor }}
            >
              {invitation.groom_name}
            </motion.h3>
          </div>
          
          {/* Parents info */}
          <div className="grid grid-cols-2 gap-8 text-center max-w-2xl">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Putri dari</p>
              <p className="text-sm text-gray-600">{invitation.bride_parents}</p>
              {invitation.bride_instagram && (
                <a
                  href={`https://instagram.com/${invitation.bride_instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-xs"
                  style={{ color: primaryColor }}
                >
                  <Instagram className="w-3 h-3" />
                  {invitation.bride_instagram}
                </a>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Putra dari</p>
              <p className="text-sm text-gray-600">{invitation.groom_parents}</p>
              {invitation.groom_instagram && (
                <a
                  href={`https://instagram.com/${invitation.groom_instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-xs"
                  style={{ color: primaryColor }}
                >
                  <Instagram className="w-3 h-3" />
                  {invitation.groom_instagram}
                </a>
              )}
            </div>
          </div>
        </motion.div>
      );
    }

    // Default horizontal layout
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-row justify-center items-start gap-4 sm:gap-8 md:gap-16"
      >
        {/* Bride */}
        <motion.div variants={itemVariants} className="text-center flex-1 max-w-[180px] sm:max-w-[220px] md:max-w-xs">
          {renderPhoto(invitation.bride_photo, invitation.bride_name, 'female')}
          <h3
            className={`text-base sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-1 sm:mb-2 truncate px-1 ${theme.titleStyle}`}
            style={{ fontFamily: `var(--font-${invitation.font_family || 'playfair'})`, color: primaryColor }}
          >
            {invitation.bride_name}
          </h3>
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 uppercase tracking-wider mb-1 sm:mb-2">Putri dari</p>
          {invitation.bride_parents && (
            <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 px-1 line-clamp-2">
              {invitation.bride_parents}
            </p>
          )}
          {invitation.bride_instagram && (
            <a
              href={`https://instagram.com/${invitation.bride_instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs transition-all hover:shadow-md"
              style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
            >
              <Instagram className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span className="hidden sm:inline">{invitation.bride_instagram}</span>
              <span className="sm:hidden">IG</span>
            </a>
          )}
        </motion.div>

        {/* Center ampersand */}
        <motion.div variants={itemVariants} className="flex items-center justify-center self-center py-8 sm:py-12 md:py-16">
          <div 
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center"
            style={{ 
              backgroundColor: theme.type === 'minimalist' ? 'transparent' : `${primaryColor}15`,
              borderRadius: theme.type === 'vintage' ? '4px' : '50%',
            }}
          >
            <span className="text-2xl sm:text-3xl md:text-4xl font-serif" style={{ color: primaryColor }}>&</span>
          </div>
        </motion.div>

        {/* Groom */}
        <motion.div variants={itemVariants} className="text-center flex-1 max-w-[180px] sm:max-w-[220px] md:max-w-xs">
          {renderPhoto(invitation.groom_photo, invitation.groom_name, 'male', true)}
          <h3
            className={`text-base sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-1 sm:mb-2 truncate px-1 ${theme.titleStyle}`}
            style={{ fontFamily: `var(--font-${invitation.font_family || 'playfair'})`, color: primaryColor }}
          >
            {invitation.groom_name}
          </h3>
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 uppercase tracking-wider mb-1 sm:mb-2">Putra dari</p>
          {invitation.groom_parents && (
            <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 px-1 line-clamp-2">
              {invitation.groom_parents}
            </p>
          )}
          {invitation.groom_instagram && (
            <a
              href={`https://instagram.com/${invitation.groom_instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs transition-all hover:shadow-md"
              style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
            >
              <Instagram className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span className="hidden sm:inline">{invitation.groom_instagram}</span>
              <span className="sm:hidden">IG</span>
            </a>
          )}
        </motion.div>
      </motion.div>
    );
  };

  return (
    <section 
      ref={sectionRef}
      id="mempelai" 
      className={`relative overflow-hidden ${theme.sectionBg} ${theme.sectionPadding} paper-texture`}
    >
      {/* Background decorations */}
      <div 
        className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-5"
        style={{ backgroundColor: primaryColor, transform: 'translate(-50%, -50%)' }}
      />
      <div 
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-5"
        style={{ backgroundColor: primaryColor, transform: 'translate(50%, 50%)' }}
      />
      
      {/* Theme-specific decorations */}
      {renderDecorations()}

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {isMuslim ? (
            <motion.p 
              className={theme.type === 'elegant' ? 'text-3xl md:text-4xl font-great-vibes mb-4' : 'text-2xl md:text-3xl font-great-vibes mb-4'}
              style={{ color: primaryColor }}
            >
              Bismillahirrahmanirrahim
            </motion.p>
          ) : (
            <motion.p 
              className="text-xl md:text-2xl font-great-vibes mb-4"
              style={{ color: primaryColor }}
            >
              Together with our families
            </motion.p>
          )}
          
          {theme.type === 'minimalist' ? (
            <div className="w-32 h-px mx-auto my-6" style={{ backgroundColor: primaryColor, opacity: 0.2 }} />
          ) : (
            <GoldAccent className="w-56 mx-auto my-6 opacity-50" />
          )}
          
          <p className={`text-gray-600 max-w-2xl mx-auto leading-relaxed ${theme.type === 'minimalist' ? 'text-sm' : ''}`}>
            {isMuslim 
              ? 'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:'
              : 'Dengan penuh kebahagiaan, kami mengundang Bapak/Ibu/Saudara/i untuk berbagi sukacita dalam perayaan pernikahan kami:'
            }
          </p>
        </motion.div>

        {/* Couple Cards - Layout based on theme */}
        {renderCoupleLayout()}

        {/* Love Story / Quote */}
        {invitation.story_text && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 text-center"
          >
            <ThemedDivider templateId={templateId} color={primaryColor} />
            
            <div className="mt-10 max-w-2xl mx-auto">
              <div 
                className={`relative p-8 md:p-12 ${theme.cardStyle}`}
                style={{ backgroundColor: `${primaryColor}08` }}
              >
                {theme.type !== 'minimalist' && (
                  <>
                    <span className="absolute top-4 left-6 text-6xl opacity-20 font-serif" style={{ color: primaryColor }}>"</span>
                    <span className="absolute bottom-4 right-6 text-6xl opacity-20 font-serif" style={{ color: primaryColor }}>"</span>
                  </>
                )}
                <div 
                  className="text-gray-600 italic text-lg md:text-xl leading-relaxed relative z-10 [&>p]:mb-4 [&>p:last-child]:mb-0"
                  style={{ fontFamily: `var(--font-${invitation.font_family || 'playfair'})` }}
                  dangerouslySetInnerHTML={{ __html: invitation.story_text }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Quote Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          {isMuslim ? (
            <>
              <p className="text-gray-500 text-sm italic max-w-xl mx-auto">
                "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, 
                supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang."
              </p>
              <p className="text-gray-400 text-xs mt-3 uppercase tracking-widest">— QS. Ar-Rum: 21</p>
            </>
          ) : (
            <>
              <p className="text-gray-500 text-sm italic max-w-xl mx-auto">
                "Cinta sejati tidak datang dengan mencari pasangan yang sempurna, 
                tetapi dengan belajar melihat orang yang tidak sempurna dengan cara yang sempurna."
              </p>
              <p className="text-gray-400 text-xs mt-3 uppercase tracking-widest">— Sam Keen</p>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
