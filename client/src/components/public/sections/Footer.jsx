import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, Copy, MessageCircle, Download, X, User, QrCode, Check } from 'lucide-react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { FloralDivider, FloralCorner, GoldAccent } from '../decorations/Ornaments';

export default function Footer({ invitation }) {
  const [showShare, setShowShare] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);
  
  const primaryColor = invitation.primary_color || '#D4A373';
  const secondaryColor = invitation.secondary_color || '#FEFAE0';

  const getInvitationUrl = (name = '') => {
    const baseUrl = `${window.location.origin}/${invitation.slug}`;
    if (name.trim()) {
      return `${baseUrl}?to=${encodeURIComponent(name.trim())}`;
    }
    return baseUrl;
  };

  const handleCopyLink = () => {
    const url = getInvitationUrl(guestName);
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link berhasil disalin!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const url = getInvitationUrl(guestName);
    const greeting = guestName.trim() 
      ? `Kepada Yth. ${guestName.trim()}\n\n` 
      : '';
    const text = encodeURIComponent(
      `${greeting}Anda diundang ke pernikahan:\n\n💒 ${invitation.bride_name} & ${invitation.groom_name}\n\nBuka undangan:\n${url}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) {
      toast.error('Gagal mengunduh QR Code');
      return;
    }

    // Create a new canvas with additional info
    const newCanvas = document.createElement('canvas');
    const ctx = newCanvas.getContext('2d');
    const padding = 40;
    const textHeight = guestName.trim() ? 100 : 60;
    
    newCanvas.width = canvas.width + padding * 2;
    newCanvas.height = canvas.height + padding * 2 + textHeight;
    
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
    
    // Draw QR code
    ctx.drawImage(canvas, padding, padding);
    
    // Add text below QR
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'center';
    
    // Couple names
    ctx.font = 'bold 16px Arial';
    ctx.fillText(
      `${invitation.bride_name} & ${invitation.groom_name}`,
      newCanvas.width / 2,
      canvas.height + padding + 30
    );
    
    // Guest name if provided
    if (guestName.trim()) {
      ctx.font = '14px Arial';
      ctx.fillStyle = '#666666';
      ctx.fillText(
        `Kepada: ${guestName.trim()}`,
        newCanvas.width / 2,
        canvas.height + padding + 55
      );
    }
    
    // Website info
    ctx.font = '12px Arial';
    ctx.fillStyle = '#999999';
    ctx.fillText(
      'Scan untuk membuka undangan',
      newCanvas.width / 2,
      canvas.height + padding + (guestName.trim() ? 80 : 55)
    );
    
    // Download
    const link = document.createElement('a');
    const fileName = guestName.trim() 
      ? `qr-undangan-${guestName.trim().replace(/\s+/g, '-').toLowerCase()}.png`
      : `qr-undangan-${invitation.bride_name}-${invitation.groom_name}.png`;
    link.download = fileName;
    link.href = newCanvas.toDataURL('image/png');
    link.click();
    
    toast.success('QR Code berhasil diunduh!');
  };

  return (
    <footer
      className="py-16 md:py-24 text-center relative overflow-hidden"
      style={{ backgroundColor: secondaryColor }}
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute bottom-0 left-0 w-full h-64"
          style={{
            background: `linear-gradient(to top, ${primaryColor}10, transparent)`,
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ 
            background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`
          }}
        />
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-0 left-0 w-20 md:w-28 opacity-20">
        <FloralCorner color={primaryColor} />
      </div>
      <div className="absolute top-0 right-0 w-20 md:w-28 opacity-20">
        <FloralCorner color={primaryColor} flip />
      </div>

      <div className="max-w-2xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Thank You Message */}
          <div className="mb-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <Heart className="w-10 h-10" style={{ color: primaryColor }} fill={primaryColor} />
            </motion.div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
              Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.
            </p>

            <p
              className="text-3xl md:text-4xl font-semibold mb-4"
              style={{ 
                fontFamily: `var(--font-${invitation.font_family || 'playfair'})`,
                color: primaryColor 
              }}
            >
              Terima Kasih
            </p>

            <GoldAccent className="w-48 mx-auto my-6 opacity-50" />

            {/* Couple Names */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <Heart className="w-4 h-4" style={{ color: primaryColor }} fill={primaryColor} />
              <span
                className="text-xl font-medium"
                style={{ 
                  fontFamily: `var(--font-${invitation.font_family || 'playfair'})`,
                  color: primaryColor 
                }}
              >
                {invitation.bride_name} & {invitation.groom_name}
              </span>
              <Heart className="w-4 h-4" style={{ color: primaryColor }} fill={primaryColor} />
            </div>
          </div>

          {/* Share Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowShare(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium shadow-lg transition-all hover:shadow-xl"
            style={{ 
              backgroundColor: primaryColor,
              color: 'white'
            }}
          >
            <Share2 className="w-4 h-4" />
            Bagikan Undangan
          </motion.button>

          {/* Divider */}
          <div className="mt-16 mb-8">
            <FloralDivider color={primaryColor} />
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-sm text-gray-400 flex items-center justify-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-400 mx-1" fill="currentColor" /> by <span className="font-semibold text-amber-600">Kekkon</span>
            </p>
            <p className="text-xs text-gray-300 mt-2">
              &copy; {new Date().getFullYear()} Kekkon. All rights reserved
            </p>
          </div>
        </motion.div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShare && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowShare(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${primaryColor}20` }}
                  >
                    <Share2 className="w-5 h-5" style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Bagikan Undangan</h3>
                    <p className="text-xs text-gray-500">Kirim ke tamu undangan</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowShare(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Guest Name Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" style={{ color: primaryColor }} />
                  Nama Tamu (Opsional)
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 transition-all"
                  style={{ '--tw-ring-color': primaryColor }}
                />
                <p className="text-xs text-gray-400 mt-2">
                  Nama akan ditampilkan di undangan sebagai tamu yang diundang
                </p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-6" ref={qrRef}>
                <div 
                  className="p-5 rounded-2xl"
                  style={{ backgroundColor: `${primaryColor}10` }}
                >
                  <QRCodeCanvas
                    value={getInvitationUrl(guestName)}
                    size={180}
                    fgColor={primaryColor}
                    bgColor="transparent"
                    level="M"
                  />
                </div>
              </div>

              {/* Link Preview */}
              <div className="bg-gray-50 rounded-xl p-3 mb-6">
                <p className="text-xs text-gray-500 mb-1">Link Undangan:</p>
                <p className="text-sm text-gray-700 font-mono break-all">
                  {getInvitationUrl(guestName)}
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gray-100 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-green-600">Link Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">Salin Link</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadQR}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Download className="w-5 h-5" />
                  Download QR Code
                </button>

                <button
                  onClick={handleWhatsAppShare}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Bagikan via WhatsApp
                </button>
              </div>

              {/* Info */}
              <div className="mt-6 p-4 bg-amber-50 rounded-xl">
                <p className="text-xs text-amber-700">
                  <strong>Tips:</strong> Isi nama tamu untuk membuat undangan personal. 
                  QR Code yang diunduh akan menyertakan nama pasangan dan tamu.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
