import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { MapPin, Clock, Calendar, ExternalLink, Heart, Check } from 'lucide-react';
import { FloralDivider, GoldAccent, FloralCorner } from '../decorations/Ornaments';
import { 
  ElegantCorner, 
  FloralCornerDecoration,
  VintageFlowerDecoration,
  PlayfulShapes,
  ThemedDivider,
  getThemeDecorations 
} from '../decorations/ThemedDecorations';

export default function EventSection({ invitation }) {
  const primaryColor = invitation.primary_color || '#D4A373';
  const secondaryColor = invitation.secondary_color || '#FEFAE0';
  const templateId = invitation.template_id || 'geometric-modern';
  const theme = getThemeDecorations(templateId);

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes} WIB`;
  };

  const openMaps = (lat, lng, venue) => {
    if (lat && lng) {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    } else if (venue) {
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(venue)}`, '_blank');
    }
  };

  const isMuslim = invitation.is_muslim !== undefined ? Boolean(invitation.is_muslim) : true;

  const events = [
    {
      title: isMuslim ? 'Akad Nikah' : 'Pemberkatan',
      icon: Check,
      time: invitation.akad_time,
      venue: invitation.akad_venue,
      address: invitation.akad_address,
      lat: invitation.akad_lat,
      lng: invitation.akad_lng,
    },
    {
      title: 'Resepsi',
      icon: Heart,
      time: invitation.reception_time,
      venue: invitation.reception_venue,
      address: invitation.reception_address,
      lat: invitation.reception_lat,
      lng: invitation.reception_lng,
    },
  ].filter(e => e.venue || e.time);

  // Theme-specific decorations
  const renderDecorations = () => {
    switch (theme.type) {
      case 'elegant':
        return (
          <>
            <FloralCornerDecoration position="top-left" color={primaryColor} />
            <FloralCornerDecoration position="top-right" color={primaryColor} />
          </>
        );
      case 'vintage':
        return (
          <>
            <VintageFlowerDecoration position="top-left" />
            <VintageFlowerDecoration position="top-right" />
          </>
        );
      case 'playful':
        return <PlayfulShapes color={primaryColor} />;
      case 'traditional':
        return (
          <>
            <ElegantCorner position="top-left" color={primaryColor} />
            <ElegantCorner position="top-right" color={primaryColor} />
          </>
        );
      case 'minimalist':
        return null;
      default:
        return (
          <>
            <div className="absolute top-0 left-0 w-24 md:w-32 opacity-30">
              <FloralCorner color={primaryColor} />
            </div>
            <div className="absolute top-0 right-0 w-24 md:w-32 opacity-30">
              <FloralCorner color={primaryColor} flip />
            </div>
          </>
        );
    }
  };

  // Theme-specific card styles
  const getCardStyle = (index) => {
    const baseStyle = {
      modern: {
        card: 'bg-white rounded-2xl overflow-hidden shadow-xl',
        header: 'p-6 text-white text-center',
        headerBg: index === 0 
          ? 'bg-gradient-to-br from-emerald-400 to-teal-500'
          : 'bg-gradient-to-br from-rose-400 to-pink-500',
        iconBg: 'bg-white/20',
        body: 'p-6 md:p-8 text-center',
        button: 'rounded-full',
      },
      minimalist: {
        card: 'bg-white rounded-xl overflow-hidden border border-gray-100',
        header: 'p-4 text-center border-b border-gray-100',
        headerBg: '',
        iconBg: `bg-${index === 0 ? 'emerald' : 'rose'}-50`,
        body: 'p-6 text-center',
        button: 'rounded-lg',
      },
      playful: {
        card: 'bg-white rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform',
        header: 'p-8 text-white text-center',
        headerBg: index === 0 
          ? 'bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500'
          : 'bg-gradient-to-br from-rose-400 via-pink-400 to-fuchsia-500',
        iconBg: 'bg-white/30',
        body: 'p-8 text-center',
        button: 'rounded-2xl',
      },
      elegant: {
        card: 'bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100',
        header: 'p-6 text-center',
        headerBg: 'bg-gradient-to-br from-amber-50 to-orange-50',
        iconBg: '',
        body: 'p-6 md:p-8 text-center',
        button: 'rounded-full',
      },
      vintage: {
        card: 'bg-amber-50/50 rounded-lg overflow-hidden border-2 shadow-md',
        header: 'p-5 text-center border-b-2',
        headerBg: 'bg-white',
        iconBg: '',
        body: 'p-6 text-center',
        button: 'rounded-lg',
      },
      traditional: {
        card: 'bg-white rounded-xl overflow-hidden shadow-lg border-2',
        header: 'p-6 text-center',
        headerBg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
        iconBg: '',
        body: 'p-6 md:p-8 text-center',
        button: 'rounded-xl',
      },
    };

    return baseStyle[theme.type] || baseStyle.modern;
  };

  return (
    <section
      id="acara"
      className={`relative overflow-hidden ${theme.sectionPadding}`}
      style={{ backgroundColor: theme.type === 'vintage' ? '#fef7ed' : secondaryColor }}
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-20 right-10 w-32 h-32 rounded-full opacity-10"
          style={{ backgroundColor: primaryColor }}
        />
        <div 
          className="absolute bottom-32 left-10 w-48 h-48 rounded-full opacity-5"
          style={{ backgroundColor: primaryColor }}
        />
        {theme.type !== 'minimalist' && (
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
            style={{ background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)` }}
          />
        )}
      </div>

      {/* Theme Decorations */}
      {renderDecorations()}

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {theme.type !== 'minimalist' && (
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <Calendar className="w-8 h-8" style={{ color: primaryColor }} />
            </motion.div>
          )}

          <h2
            className={theme.titleStyle}
            style={{ 
              fontFamily: `var(--font-${invitation.font_family || 'playfair'})`,
              color: primaryColor 
            }}
          >
            Waktu & Tempat
          </h2>
          
          {theme.type === 'minimalist' ? (
            <div className="w-32 h-px mx-auto my-6" style={{ backgroundColor: primaryColor, opacity: 0.2 }} />
          ) : (
            <GoldAccent className="w-48 mx-auto my-6 opacity-50" />
          )}

          {invitation.wedding_date && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`inline-flex items-center gap-3 px-6 py-3 bg-white ${theme.type === 'playful' ? 'rounded-2xl shadow-xl' : 'rounded-full shadow-lg'}`}
              style={{ boxShadow: `0 10px 40px ${primaryColor}15` }}
            >
              <Calendar className="w-5 h-5" style={{ color: primaryColor }} />
              <span className="font-medium text-gray-700">
                {format(new Date(invitation.wedding_date), 'EEEE, d MMMM yyyy', { locale: id })}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Event Cards - Different layouts per theme */}
        <div className={`grid gap-8 ${theme.type === 'minimalist' ? 'md:grid-cols-1 max-w-lg mx-auto space-y-6' : 'md:grid-cols-2 md:gap-12'}`}>
          {events.map((event, index) => {
            const Icon = event.icon;
            const cardStyle = getCardStyle(index);
            
            return (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div 
                  className={cardStyle.card}
                  style={{ 
                    boxShadow: theme.type !== 'minimalist' ? `0 20px 60px ${primaryColor}15` : undefined,
                    borderColor: primaryColor + '30',
                  }}
                >
                  {/* Card Header */}
                  <div className={`relative ${cardStyle.header} ${cardStyle.headerBg}`}>
                    {/* Decorative Pattern for non-minimalist */}
                    {theme.type !== 'minimalist' && theme.type !== 'elegant' && theme.type !== 'vintage' && (
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/20 -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/20 translate-y-1/2 -translate-x-1/2" />
                      </div>
                    )}
                    
                    <div className="relative z-10">
                      {theme.type === 'minimalist' ? (
                        <div 
                          className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: index === 0 ? '#d1fae5' : '#fce7f3' }}
                        >
                          <Icon className="w-5 h-5" style={{ color: index === 0 ? '#059669' : '#db2777' }} />
                        </div>
                      ) : theme.type === 'elegant' || theme.type === 'vintage' ? (
                        <div 
                          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${primaryColor}20` }}
                        >
                          <Icon className="w-8 h-8" style={{ color: primaryColor }} />
                        </div>
                      ) : (
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${cardStyle.iconBg} flex items-center justify-center`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      )}
                      <h3 
                        className={`text-2xl font-semibold ${theme.type === 'minimalist' || theme.type === 'elegant' || theme.type === 'vintage' ? '' : 'text-white'}`}
                        style={{ color: theme.type === 'minimalist' || theme.type === 'elegant' || theme.type === 'vintage' ? primaryColor : undefined }}
                      >
                        {event.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className={cardStyle.body}>
                    {event.time && (
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Clock className="w-5 h-5" style={{ color: primaryColor }} />
                        <span className="text-xl font-semibold text-gray-800">
                          {formatTime(event.time)}
                        </span>
                      </div>
                    )}

                    {event.venue && (
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        {event.venue}
                      </h4>
                    )}

                    {event.address && (
                      <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                        {event.address}
                      </p>
                    )}

                    <button
                      onClick={() => openMaps(event.lat, event.lng, event.venue)}
                      className={`inline-flex items-center gap-2 px-6 py-3 ${cardStyle.button} text-sm font-medium text-white transition-all hover:shadow-lg hover:-translate-y-0.5`}
                      style={{ backgroundColor: primaryColor }}
                    >
                      <MapPin className="w-4 h-4" />
                      Buka Maps
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    {/* Map Preview */}
                    {event.lat && event.lng && (
                      <div className={`mt-6 overflow-hidden h-40 border-4 border-gray-100 ${theme.type === 'playful' ? 'rounded-2xl' : 'rounded-xl'}`}>
                        <iframe
                          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${event.lng}!3d${event.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2sid!4v1600000000000!5m2!1sen!2sid`}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen=""
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Decorative dots for non-minimalist */}
                {theme.type !== 'minimalist' && (
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div 
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: primaryColor, opacity: 0.3 - i * 0.1 }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Save the Date Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <ThemedDivider templateId={templateId} color={primaryColor} />
          <p className="mt-8 text-gray-500 text-sm">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
            <br className="hidden md:block" /> berkenan hadir untuk memberikan doa restu kepada kedua mempelai.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
