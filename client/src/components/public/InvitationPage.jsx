import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { publicAPI } from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, ChevronDown, Heart, Home, Users, Calendar, Image, Gift, MessageSquare } from 'lucide-react';
import HeroSection from './sections/HeroSection';
import CoupleSection from './sections/CoupleSection';
import MainImageSection from './sections/MainImageSection';
import EventSection from './sections/EventSection';
import GallerySection from './sections/GallerySection';
import GiftSection from './sections/GiftSection';
import RSVPSection from './sections/RSVPSection';
import Footer from './sections/Footer';
import { AdPlaceholder } from '../shared/AdUnit';
import ScrollTimeline, { useScrollProgress } from './ScrollTimeline';
import { KekkonIcon } from '../shared/Logo';
import PhotoLightbox from './PhotoLightbox';
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
import IntroSection from './IntroSection';

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
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const audioRef = useRef(null);
  const scrollProgress = useScrollProgress();

  useEffect(() => {
    loadInvitation();
  }, [slug]);

  // Update document title
  useEffect(() => {
    if (invitation) {
      document.title = `Undangan Pernikahan ${invitation.bride_name} & ${invitation.groom_name}`;
    }
  }, [invitation]);

  // Track active section for navbar highlighting
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const viewportMiddle = scrollTop + window.innerHeight / 3;
      const sectionIds = ['home', 'mempelai', 'acara', 'gallery', 'gift', 'rsvp'];
      
      const sections = sectionIds
        .map(id => document.getElementById(id))
        .filter(Boolean);

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= viewportMiddle) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          <IntroSection 
            invitation={invitation} 
            guestName={guestName} 
            onOpen={handleOpen} 
          />
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
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100">
              <motion.div
                className="h-full"
                style={{ 
                  width: `${scrollProgress}%`,
                  backgroundColor: invitation.primary_color,
                }}
                transition={{ duration: 0.1 }}
              />
            </div>
            
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
                
                {navItems.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className={`flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-full transition-all text-xs sm:text-sm ${
                        isActive 
                          ? 'text-white shadow-md' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      style={isActive ? { backgroundColor: invitation.primary_color } : {}}
                    >
                      <section.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="hidden sm:inline">{section.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.nav>

          <main className={`font-${invitation.font_family || 'poppins'}`}>
            <HeroSection invitation={invitation} />
            <CoupleSection 
              invitation={invitation} 
              onPhotoClick={(photo, name) => setLightboxPhoto({ photo, name })}
            />
            
            {/* Main Image 1 - After Couple Section */}
            {invitation.main_image_1 && (
              <MainImageSection invitation={invitation} imageUrl={invitation.main_image_1} position={1} />
            )}
            
            {/* Ad after couple section */}
            <div className="py-4 bg-white">
              <AdPlaceholder height="90px" className="max-w-4xl mx-auto px-4" />
            </div>
            
            <EventSection invitation={invitation} />
            
            {/* Main Image 2 - After Event Section */}
            {invitation.main_image_2 && (
              <MainImageSection invitation={invitation} imageUrl={invitation.main_image_2} position={2} />
            )}
            
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
          
          {/* Photo Lightbox */}
          {lightboxPhoto && (
            <PhotoLightbox
              photo={lightboxPhoto.photo}
              name={lightboxPhoto.name}
              onClose={() => setLightboxPhoto(null)}
            />
          )}
        </>
      )}
    </div>
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
