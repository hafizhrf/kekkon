import { motion } from 'framer-motion';
import { Instagram, Heart } from 'lucide-react';
import { FloralDivider, LeafBranch, FrameBorder, GoldAccent } from '../decorations/Ornaments';

export default function CoupleSection({ invitation }) {
  const primaryColor = invitation.primary_color || '#D4A373';
  const secondaryColor = invitation.secondary_color || '#FEFAE0';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="mempelai" className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div 
        className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-5"
        style={{ backgroundColor: primaryColor, transform: 'translate(-50%, -50%)' }}
      />
      <div 
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-5"
        style={{ backgroundColor: primaryColor, transform: 'translate(50%, 50%)' }}
      />
      
      {/* Corner Decorations */}
      <div className="absolute top-10 left-10 opacity-20">
        <LeafBranch color={primaryColor} className="w-24" />
      </div>
      <div className="absolute top-10 right-10 opacity-20 scale-x-[-1]">
        <LeafBranch color={primaryColor} className="w-24" />
      </div>

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.p 
            className="text-2xl md:text-3xl font-great-vibes mb-4"
            style={{ color: primaryColor }}
          >
            Bismillahirrahmanirrahim
          </motion.p>
          
          <GoldAccent className="w-56 mx-auto my-6 opacity-50" />
          
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i
            untuk menghadiri acara pernikahan kami:
          </p>
        </motion.div>

        {/* Couple Cards - Always Horizontal */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-row justify-center items-start gap-4 sm:gap-8 md:gap-16"
        >
          {/* Bride */}
          <motion.div variants={itemVariants} className="text-center flex-1 max-w-[180px] sm:max-w-[220px] md:max-w-xs">
            <div className="relative">
              {/* Photo Frame */}
              <div className="relative inline-block mb-4 sm:mb-6 md:mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: `2px dashed ${primaryColor}`,
                    opacity: 0.3,
                    padding: '6px',
                    margin: '-6px',
                  }}
                />
                <div
                  className="w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden relative"
                  style={{ 
                    border: `3px solid ${primaryColor}`,
                    boxShadow: `0 10px 30px ${primaryColor}30`
                  }}
                >
                  {invitation.bride_photo ? (
                    <img
                      src={invitation.bride_photo}
                      alt={invitation.bride_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: `${primaryColor}20` }}
                    >
                      <span className="text-3xl sm:text-4xl md:text-6xl" style={{ color: primaryColor }}>♀</span>
                    </div>
                  )}
                </div>
                {/* Decorative Heart */}
                <div 
                  className="absolute -bottom-1 sm:-bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Heart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" fill="white" />
                </div>
              </div>

              {/* Name */}
              <h3
                className="text-base sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-1 sm:mb-2 truncate px-1"
                style={{ 
                  fontFamily: `var(--font-${invitation.font_family || 'playfair'})`,
                  color: primaryColor 
                }}
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
                  style={{ 
                    backgroundColor: `${primaryColor}15`,
                    color: primaryColor 
                  }}
                >
                  <Instagram className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span className="hidden sm:inline">{invitation.bride_instagram}</span>
                  <span className="sm:hidden">IG</span>
                </a>
              )}
            </div>
          </motion.div>

          {/* Center Heart/Ampersand */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center justify-center self-center py-8 sm:py-12 md:py-16"
          >
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${primaryColor}15` }}
            >
              <span 
                className="text-2xl sm:text-3xl md:text-4xl font-serif"
                style={{ color: primaryColor }}
              >
                &
              </span>
            </div>
          </motion.div>

          {/* Groom */}
          <motion.div variants={itemVariants} className="text-center flex-1 max-w-[180px] sm:max-w-[220px] md:max-w-xs">
            <div className="relative">
              {/* Photo Frame */}
              <div className="relative inline-block mb-4 sm:mb-6 md:mb-8">
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: `2px dashed ${primaryColor}`,
                    opacity: 0.3,
                    padding: '6px',
                    margin: '-6px',
                  }}
                />
                <div
                  className="w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden relative"
                  style={{ 
                    border: `3px solid ${primaryColor}`,
                    boxShadow: `0 10px 30px ${primaryColor}30`
                  }}
                >
                  {invitation.groom_photo ? (
                    <img
                      src={invitation.groom_photo}
                      alt={invitation.groom_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: `${primaryColor}20` }}
                    >
                      <span className="text-3xl sm:text-4xl md:text-6xl" style={{ color: primaryColor }}>♂</span>
                    </div>
                  )}
                </div>
                {/* Decorative Heart */}
                <div 
                  className="absolute -bottom-1 sm:-bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Heart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" fill="white" />
                </div>
              </div>

              {/* Name */}
              <h3
                className="text-base sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-1 sm:mb-2 truncate px-1"
                style={{ 
                  fontFamily: `var(--font-${invitation.font_family || 'playfair'})`,
                  color: primaryColor 
                }}
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
                  style={{ 
                    backgroundColor: `${primaryColor}15`,
                    color: primaryColor 
                  }}
                >
                  <Instagram className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span className="hidden sm:inline">{invitation.groom_instagram}</span>
                  <span className="sm:hidden">IG</span>
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Love Story / Quote */}
        {invitation.story_text && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 text-center"
          >
            <FloralDivider color={primaryColor} />
            
            <div className="mt-10 max-w-2xl mx-auto">
              <div 
                className="relative p-8 md:p-12 rounded-3xl"
                style={{ backgroundColor: `${primaryColor}08` }}
              >
                {/* Quote marks */}
                <span 
                  className="absolute top-4 left-6 text-6xl opacity-20 font-serif"
                  style={{ color: primaryColor }}
                >
                  "
                </span>
                <span 
                  className="absolute bottom-4 right-6 text-6xl opacity-20 font-serif"
                  style={{ color: primaryColor }}
                >
                  "
                </span>
                
                <div 
                  className="text-gray-600 italic text-lg md:text-xl leading-relaxed relative z-10 [&>p]:mb-4 [&>p:last-child]:mb-0 [&>strong]:font-semibold [&>em]:italic"
                  style={{ fontFamily: `var(--font-${invitation.font_family || 'playfair'})` }}
                  dangerouslySetInnerHTML={{ __html: invitation.story_text }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Quran Verse */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 text-sm italic max-w-xl mx-auto">
            "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, 
            supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang."
          </p>
          <p className="text-gray-400 text-xs mt-3 uppercase tracking-widest">— QS. Ar-Rum: 21</p>
        </motion.div>
      </div>
    </section>
  );
}
