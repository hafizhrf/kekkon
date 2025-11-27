import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { MapPin, Clock, Calendar, ExternalLink, Heart, Check } from 'lucide-react';
import { FloralDivider, GoldAccent, FloralCorner } from '../decorations/Ornaments';

export default function EventSection({ invitation }) {
  const primaryColor = invitation.primary_color || '#D4A373';
  const secondaryColor = invitation.secondary_color || '#FEFAE0';

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

  const events = [
    {
      title: 'Akad Nikah',
      icon: Check,
      time: invitation.akad_time,
      venue: invitation.akad_venue,
      address: invitation.akad_address,
      lat: invitation.akad_lat,
      lng: invitation.akad_lng,
      gradient: 'from-emerald-400 to-teal-500',
    },
    {
      title: 'Resepsi',
      icon: Heart,
      time: invitation.reception_time,
      venue: invitation.reception_venue,
      address: invitation.reception_address,
      lat: invitation.reception_lat,
      lng: invitation.reception_lng,
      gradient: 'from-rose-400 to-pink-500',
    },
  ].filter(e => e.venue || e.time);

  return (
    <section
      id="acara"
      className="py-20 md:py-32 relative overflow-hidden"
      style={{ backgroundColor: secondaryColor }}
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
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ 
            background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`
          }}
        />
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-0 left-0 w-24 md:w-32 opacity-30">
        <FloralCorner color={primaryColor} />
      </div>
      <div className="absolute top-0 right-0 w-24 md:w-32 opacity-30">
        <FloralCorner color={primaryColor} flip />
      </div>

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <Calendar className="w-8 h-8" style={{ color: primaryColor }} />
          </motion.div>

          <h2
            className="text-3xl md:text-5xl font-semibold mb-4"
            style={{ 
              fontFamily: `var(--font-${invitation.font_family || 'playfair'})`,
              color: primaryColor 
            }}
          >
            Waktu & Tempat
          </h2>
          
          <GoldAccent className="w-48 mx-auto my-6 opacity-50" />

          {invitation.wedding_date && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-lg"
              style={{ boxShadow: `0 10px 40px ${primaryColor}15` }}
            >
              <Calendar className="w-5 h-5" style={{ color: primaryColor }} />
              <span className="font-medium text-gray-700">
                {format(new Date(invitation.wedding_date), 'EEEE, d MMMM yyyy', { locale: id })}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Event Cards */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {events.map((event, index) => {
            const Icon = event.icon;
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
                  className="bg-white rounded-3xl overflow-hidden shadow-xl"
                  style={{ boxShadow: `0 20px 60px ${primaryColor}15` }}
                >
                  {/* Card Header */}
                  <div 
                    className={`relative p-6 text-white text-center bg-gradient-to-br ${event.gradient}`}
                  >
                    {/* Decorative Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/20 -translate-y-1/2 translate-x-1/2" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/20 translate-y-1/2 -translate-x-1/2" />
                    </div>
                    
                    <div className="relative z-10">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-semibold">{event.title}</h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 md:p-8 text-center">
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
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white transition-all hover:shadow-lg hover:-translate-y-0.5"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <MapPin className="w-4 h-4" />
                      Buka Maps
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    {/* Map Preview */}
                    {event.lat && event.lng && (
                      <div className="mt-6 rounded-2xl overflow-hidden h-40 border-4 border-gray-100">
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

                {/* Decorative dots */}
                <div 
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1"
                >
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: primaryColor, opacity: 0.3 - i * 0.1 }}
                    />
                  ))}
                </div>
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
          <FloralDivider color={primaryColor} />
          <p className="mt-8 text-gray-500 text-sm">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
            <br className="hidden md:block" /> berkenan hadir untuk memberikan doa restu kepada kedua mempelai.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
