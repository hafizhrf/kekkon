import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { publicAPI } from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, ChevronDown, Heart, Home, Users, Calendar, Image, Gift, MessageSquare } from 'lucide-react';
import HeroSection from './sections/HeroSection';
import CoupleSection from './sections/CoupleSection';
import EventSection from './sections/EventSection';
import GallerySection from './sections/GallerySection';
import GiftSection from './sections/GiftSection';
import RSVPSection from './sections/RSVPSection';
import Footer from './sections/Footer';
import { AdPlaceholder } from '../shared/AdUnit';
import ScrollTimeline from './ScrollTimeline';
import { KekkonIcon } from '../shared/Logo';
import { 
  LoadingScreen, 
  CurtainReveal, 
  SplashReveal, 
  EnvelopeReveal, 
  GateReveal, 
  ScrollReveal, 
  FlowerReveal,
  FadeReveal
} from './OpeningAnimations';

export default function InvitationPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [invitation, setInvitation] = useState(null);
  const [guestName, setGuestName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [revealComplete, setRevealComplete] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    loadInvitation();
  }, [slug]);

  // Update meta tags for social sharing
  useEffect(() => {
    if (invitation) {
      const baseUrl = window.location.origin;
      const ogImageUrl = `${baseUrl}/api/public/${slug}/og-image`;
      const pageUrl = `${baseUrl}/i/${slug}`;
      const title = `Undangan Pernikahan ${invitation.bride_name} & ${invitation.groom_name}`;
      const description = invitation.wedding_date 
        ? `Kami mengundang Anda untuk hadir di pernikahan kami pada ${new Date(invitation.wedding_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`
        : 'Kami mengundang Anda untuk hadir di pernikahan kami';

      document.title = title;
      
      // Update or create meta tags
      const updateMeta = (property, content, isName = false) => {
        const attr = isName ? 'name' : 'property';
        let meta = document.querySelector(`meta[${attr}="${property}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute(attr, property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      updateMeta('og:title', title);
      updateMeta('og:description', description);
      updateMeta('og:image', ogImageUrl);
      updateMeta('og:image:width', '1200');
      updateMeta('og:image:height', '630');
      updateMeta('og:url', pageUrl);
      updateMeta('og:type', 'website');
      
      // Twitter cards
      updateMeta('twitter:card', 'summary_large_image', true);
      updateMeta('twitter:title', title, true);
      updateMeta('twitter:description', description, true);
      updateMeta('twitter:image', ogImageUrl, true);
      
      updateMeta('description', description, true);
    }
  }, [invitation, slug]);

  const loadInvitation = async () => {
    try {
      const toParam = searchParams.get('to');
      const res = await publicAPI.getInvitation(slug, toParam);
      setInvitation(res.data.invitation);
      setGuestName(res.data.guestName || 'Tamu Undangan');
    } catch (err) {
      setError(err.response?.data?.error || 'Undangan tidak ditemukan');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setShowReveal(true);
    // Start music
    if (audioRef.current && invitation?.music_url) {
      audioRef.current.play().catch(() => {});
      setIsMuted(false);
    }
    // After a brief moment, trigger reveal animation
    setTimeout(() => {
      setIsOpen(true);
    }, 300);
  };

  const handleRevealComplete = () => {
    setRevealComplete(true);
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-earthy-100">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-playfair text-gray-600 mb-2">Oops!</h1>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  const cssVars = {
    '--primary-color': invitation.primary_color || '#D4A373',
    '--secondary-color': invitation.secondary_color || '#FEFAE0',
  };

  // Check if gift section has content
  const hasGift = (invitation.gift_bank_accounts?.length > 0) || 
                  (invitation.gift_ewallets?.length > 0) || 
                  !!invitation.gift_address;
  
  // Check if gallery has images
  const hasGallery = invitation.gallery_images?.length > 0;

  // Build navigation items based on available content
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'mempelai', label: 'Mempelai', icon: Users },
    { id: 'acara', label: 'Acara', icon: Calendar },
    ...(hasGallery ? [{ id: 'gallery', label: 'Gallery', icon: Image }] : []),
    ...(hasGift ? [{ id: 'gift', label: 'Hadiah', icon: Gift }] : []),
    ...(invitation.enable_rsvp ? [{ id: 'rsvp', label: 'RSVP', icon: MessageSquare }] : []),
  ];

  return (
    <div className="invitation-page" style={cssVars}>
      {invitation.music_url && (
        <audio ref={audioRef} src={invitation.music_url} loop />
      )}

      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: invitation.secondary_color }}
          >
            <div className="absolute inset-0 overflow-hidden">
              <GeometricShapes primaryColor={invitation.primary_color} />
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative z-10 text-center px-6"
            >
              <p className="text-gray-600 mb-2 font-medium">The Wedding of</p>
              <h1
                className={`text-4xl md:text-6xl font-${invitation.font_family || 'playfair'} font-semibold mb-4`}
                style={{ color: invitation.primary_color }}
              >
                {invitation.bride_name} & {invitation.groom_name}
              </h1>
              
              <div className="my-8">
                <p className="text-gray-500 mb-2">Kepada Yth.</p>
                <p className="text-xl font-semibold text-gray-700">{guestName}</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpen}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-medium shadow-lg"
                style={{ backgroundColor: invitation.primary_color }}
              >
                Buka Undangan
                <ChevronDown className="w-5 h-5 animate-bounce" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reveal Animation - shows after cover is clicked */}
      <RevealAnimation 
        templateId={invitation.template_id}
        isOpen={isOpen}
        onComplete={handleRevealComplete}
        primaryColor={invitation.primary_color}
        secondaryColor={invitation.secondary_color}
      />

      {isOpen && (
        <>
          {/* Scroll Timeline Indicator */}
          <ScrollTimeline 
            templateId={invitation.template_id}
            primaryColor={invitation.primary_color}
            hasGallery={hasGallery}
            hasGift={hasGift}
            hasRsvp={invitation.enable_rsvp}
          />

          {invitation.music_url && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 }}
              onClick={toggleMusic}
              className="fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white"
              style={{ backgroundColor: invitation.primary_color }}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </motion.button>
          )}

          <motion.nav 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, type: "spring" }}
            className="fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md shadow-sm"
          >
            <div className="max-w-4xl mx-auto px-2 sm:px-4 py-2">
              <div className="flex justify-center items-center gap-1 sm:gap-2">
                {/* Kekkon Logo */}
                <Link 
                  to="/" 
                  className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full hover:bg-amber-50 transition-colors mr-1 sm:mr-2"
                  title="Kekkon - Undangan Pernikahan Digital"
                >
                  <KekkonIcon size={28} id="nav-logo" />
                </Link>
                
                <div className="w-px h-6 bg-gray-200 mr-1 sm:mr-2" />
                
                {navItems.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all text-xs sm:text-sm"
                    style={{ '--hover-color': invitation.primary_color }}
                  >
                    <section.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">{section.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.nav>

          <main className={`font-${invitation.font_family || 'poppins'}`}>
            <HeroSection invitation={invitation} />
            <CoupleSection invitation={invitation} />
            
            {/* Ad after couple section */}
            <div className="py-4 bg-white">
              <AdPlaceholder height="90px" className="max-w-4xl mx-auto px-4" />
            </div>
            
            <EventSection invitation={invitation} />
            {hasGallery && (
              <GallerySection invitation={invitation} />
            )}
            
            {/* Gift Section */}
            {hasGift && <GiftSection invitation={invitation} />}
            
            {/* Ad before RSVP */}
            <div className="py-4" style={{ backgroundColor: invitation.secondary_color }}>
              <AdPlaceholder height="250px" label="Sponsored" className="max-w-4xl mx-auto px-4" />
            </div>
            
            {invitation.enable_rsvp && (
              <RSVPSection invitation={invitation} guestName={guestName} slug={slug} />
            )}
            <Footer invitation={invitation} />
            
            {/* Bottom Ad Space */}
            <div className="py-6 bg-gray-50 border-t">
              <AdPlaceholder height="90px" className="max-w-4xl mx-auto px-4" />
            </div>
          </main>
        </>
      )}
    </div>
  );
}

function GeometricShapes({ primaryColor }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 0.15, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-20 left-10 w-40 h-40 rounded-full"
        style={{ backgroundColor: primaryColor }}
      />
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 0.1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="absolute bottom-20 right-10 w-60 h-60"
        style={{
          backgroundColor: primaryColor,
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ delay: 0.9 }}
        className="absolute top-40 right-20 w-32 h-32"
        style={{
          backgroundColor: primaryColor,
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        }}
      />
    </>
  );
}

// Reveal Animation Component - maps template to appropriate animation
function RevealAnimation({ templateId, isOpen, onComplete, primaryColor, secondaryColor }) {
  const animationMap = {
    'geometric-modern': CurtainReveal,
    'minimalist-elegant': SplashReveal,
    'colorful-playful': EnvelopeReveal,
    'floral-romantic': FlowerReveal,
    'rustic-vintage': ScrollReveal,
    'islamic-traditional': GateReveal,
  };

  const AnimationComponent = animationMap[templateId] || FadeReveal;

  return (
    <AnimationComponent
      isOpen={isOpen}
      onComplete={onComplete}
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
    />
  );
}
