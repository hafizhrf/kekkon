import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { publicAPI } from '../../../utils/api';
import { Send, Check, MessageSquare, User, Users, Heart, X, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { FloralDivider, GoldAccent, FloralCorner } from '../decorations/Ornaments';

export default function RSVPSection({ invitation, guestName, slug }) {
  const [name, setName] = useState(guestName || '');
  const [status, setStatus] = useState('attending');
  const [attendanceCount, setAttendanceCount] = useState(1);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  const primaryColor = invitation.primary_color || '#D4A373';
  const secondaryColor = invitation.secondary_color || '#FEFAE0';
  const templateId = invitation.template_id || 'geometric-modern';
  
  // Get border radius based on template
  const getCardRadius = () => {
    switch (templateId) {
      case 'geometric-modern':
        return 'rounded-none'; // Sharp corners for geometric modern
      case 'minimalist-elegant':
        return 'rounded-xl';
      case 'colorful-playful':
        return 'rounded-3xl';
      case 'floral-romantic':
        return 'rounded-2xl';
      case 'rustic-vintage':
        return 'rounded-lg';
      case 'islamic-traditional':
        return 'rounded-xl';
      default:
        return 'rounded-3xl';
    }
  };
  
  const cardRadius = getCardRadius();

  useEffect(() => {
    loadMessages();
  }, [slug]);

  const loadMessages = async () => {
    try {
      const res = await publicAPI.getMessages(slug);
      setMessages(res.data.messages);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Mohon isi nama Anda');
      return;
    }

    setSubmitting(true);
    try {
      await publicAPI.submitRSVP(slug, {
        name: name.trim(),
        rsvp_status: status,
        attendance_count: status === 'attending' ? attendanceCount : 0,
        message: invitation.enable_messages ? message : '',
      });
      setSubmitted(true);
      if (message.trim()) {
        loadMessages();
      }
      toast.success(
        status === 'attending' 
          ? 'Terima kasih! Kami tunggu kehadiran Anda' 
          : 'Terima kasih atas konfirmasinya',
        { duration: 4000 }
      );
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Gagal mengirim konfirmasi';
      toast.error(errorMsg, { duration: 4000 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="rsvp"
      className="py-20 md:py-32 relative overflow-hidden"
      style={{ backgroundColor: secondaryColor }}
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-5"
          style={{ 
            background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`
          }}
        />
      </div>

      {/* Corner Decorations */}
      <div className="absolute bottom-0 left-0 w-24 md:w-32 opacity-30 rotate-180">
        <FloralCorner color={primaryColor} flip />
      </div>
      <div className="absolute bottom-0 right-0 w-24 md:w-32 opacity-30 rotate-180">
        <FloralCorner color={primaryColor} />
      </div>

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <Send className="w-8 h-8" style={{ color: primaryColor }} />
          </motion.div>

          <h2
            className="text-3xl md:text-5xl font-semibold mb-4"
            style={{ 
              fontFamily: `var(--font-${invitation.font_family || 'playfair'})`,
              color: primaryColor 
            }}
          >
            RSVP
          </h2>
          
          <GoldAccent className="w-48 mx-auto my-6 opacity-50" />
          
          <p className="text-gray-600">Konfirmasi kehadiran Anda</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* RSVP Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {submitted ? (
              <div 
                className={`bg-white ${cardRadius} p-8 md:p-10 text-center shadow-xl`}
                style={{ boxShadow: `0 20px 60px ${primaryColor}15` }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <Check className="w-12 h-12" style={{ color: primaryColor }} />
                </motion.div>
                <h3
                  className="text-2xl font-semibold mb-3"
                  style={{ 
                    fontFamily: `var(--font-${invitation.font_family || 'playfair'})`,
                    color: primaryColor 
                  }}
                >
                  Terima Kasih!
                </h3>
                <p className="text-gray-600">
                  Konfirmasi kehadiran Anda telah kami terima.
                </p>
              </div>
            ) : (
              <form 
                onSubmit={handleSubmit} 
                className={`bg-white ${cardRadius} p-6 md:p-8 shadow-xl space-y-6`}
                style={{ boxShadow: `0 20px 60px ${primaryColor}15` }}
              >
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" style={{ color: primaryColor }} />
                    Nama
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 transition-all"
                    style={{ '--tw-ring-color': primaryColor }}
                    placeholder="Nama Anda"
                    required
                  />
                </div>

                {/* Attendance Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Konfirmasi Kehadiran
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setStatus('attending')}
                      className={`p-5 rounded-2xl text-center transition-all duration-300
                        ${status === 'attending' ? 'shadow-lg scale-[1.02]' : 'bg-gray-50 hover:bg-gray-100'}`}
                      style={status === 'attending' ? {
                        backgroundColor: `${primaryColor}15`,
                        border: `2px solid ${primaryColor}`,
                      } : { border: '2px solid transparent' }}
                    >
                      <div 
                        className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: status === 'attending' ? primaryColor : '#e5e7eb' }}
                      >
                        <Check className={`w-6 h-6 ${status === 'attending' ? 'text-white' : 'text-gray-400'}`} />
                      </div>
                      <span className={`text-sm font-medium ${status === 'attending' ? '' : 'text-gray-600'}`}
                        style={status === 'attending' ? { color: primaryColor } : {}}>
                        Hadir
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('not_attending')}
                      className={`p-5 rounded-2xl text-center transition-all duration-300
                        ${status === 'not_attending' ? 'shadow-lg scale-[1.02]' : 'bg-gray-50 hover:bg-gray-100'}`}
                      style={status === 'not_attending' ? {
                        backgroundColor: `${primaryColor}15`,
                        border: `2px solid ${primaryColor}`,
                      } : { border: '2px solid transparent' }}
                    >
                      <div 
                        className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: status === 'not_attending' ? primaryColor : '#e5e7eb' }}
                      >
                        <span className={`text-xl ${status === 'not_attending' ? 'text-white' : 'text-gray-400'}`}>✗</span>
                      </div>
                      <span className={`text-sm font-medium ${status === 'not_attending' ? '' : 'text-gray-600'}`}
                        style={status === 'not_attending' ? { color: primaryColor } : {}}>
                        Tidak Hadir
                      </span>
                    </button>
                  </div>
                </div>

                {/* Guest Count */}
                {status === 'attending' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Users className="w-4 h-4 inline mr-2" style={{ color: primaryColor }} />
                      Jumlah Tamu
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setAttendanceCount(n)}
                          className={`w-12 h-12 rounded-xl font-medium transition-all
                            ${attendanceCount === n ? 'text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          style={attendanceCount === n ? { backgroundColor: primaryColor } : {}}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Message */}
                {invitation.enable_messages && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Heart className="w-4 h-4 inline mr-2" style={{ color: primaryColor }} />
                      Ucapan & Doa
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 transition-all resize-none"
                      style={{ '--tw-ring-color': primaryColor }}
                      rows="4"
                      placeholder="Tulis ucapan dan doa untuk kedua mempelai..."
                    />
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-50"
                  style={{ backgroundColor: primaryColor }}
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Kirim Konfirmasi
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Messages Wall */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div 
              className={`bg-white ${cardRadius} p-6 md:p-8 shadow-xl h-full max-h-[600px] overflow-hidden flex flex-col`}
              style={{ boxShadow: `0 20px 60px ${primaryColor}15` }}
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <MessageSquare className="w-5 h-5" style={{ color: primaryColor }} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Ucapan & Doa</h3>
                  <p className="text-xs text-gray-500">{messages.length} ucapan</p>
                </div>
              </div>

              {loadingMessages ? (
                <div className="flex-1 flex items-center justify-center">
                  <div 
                    className="w-10 h-10 border-3 rounded-full animate-spin"
                    style={{ borderColor: `${primaryColor}30`, borderTopColor: primaryColor }}
                  />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                  <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
                  <p>Belum ada ucapan</p>
                  <p className="text-sm">Jadilah yang pertama!</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 ${templateId === 'geometric-modern' ? 'rounded-none' : 'rounded-2xl'}`}
                      style={{ backgroundColor: `${primaryColor}08` }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {msg.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-800">{msg.name}</p>
                          <p className="text-xs text-gray-400">
                            {format(new Date(msg.created_at), 'd MMM yyyy', { locale: id })}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm pl-12">{msg.message}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${primaryColor}40;
          border-radius: 10px;
        }
      `}</style>
    </section>
  );
}
