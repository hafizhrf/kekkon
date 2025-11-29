import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Copy, Check, MapPin, CreditCard, Wallet, Heart } from 'lucide-react';
import { FloralDivider, GoldAccent, FloralCorner } from '../decorations/Ornaments';
import { ThemedDivider, getThemeDecorations } from '../decorations/ThemedDecorations';

// Minimalist SVG icons for wishlist items
const WishlistIcons = {
  coffee_maker: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  bedcover: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M3 21V7a2 2 0 012-2h14a2 2 0 012 2v14M3 11h18M7 11v10M17 11v10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  mug_set: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M17 8h1a4 4 0 110 8h-1M3 8h14v11a3 3 0 01-3 3H6a3 3 0 01-3-3V8zM7 3v2M11 3v2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  kitchen_set: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <circle cx="12" cy="12" r="9"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M7 7l1.5 1.5M15.5 15.5L17 17M7 17l1.5-1.5M15.5 8.5L17 7" strokeLinecap="round"/>
    </svg>
  ),
  blender: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M8 2h8l-1 9H9L8 2zM6 11h12l-2 11H8L6 11zM10 15h4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  rice_cooker: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <ellipse cx="12" cy="8" rx="8" ry="3"/><path d="M4 8v8c0 1.66 3.58 3 8 3s8-1.34 8-3V8M12 4V2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  vacuum: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <circle cx="12" cy="6" r="4"/><path d="M12 10v6M8 22h8M10 16l-2 6M14 16l2 6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  iron: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M3 17h18l-3-9H8L3 17zM6 17v3M18 17v3M9 11h6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  towel_set: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M4 4h16v4a2 2 0 01-2 2H6a2 2 0 01-2-2V4zM6 10v10a2 2 0 002 2h8a2 2 0 002-2V10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  dinnerware: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>
    </svg>
  ),
  air_fryer: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="12" cy="14" r="4"/><path d="M8 8h2M14 8h2" strokeLinecap="round"/>
    </svg>
  ),
  mixer: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <circle cx="12" cy="8" r="5"/><path d="M9 13v6a3 3 0 006 0v-6M12 3v2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

const WISHLIST_ITEMS = {
  coffee_maker: { name: 'Coffee Maker', Icon: WishlistIcons.coffee_maker },
  bedcover: { name: 'Bedcover Set', Icon: WishlistIcons.bedcover },
  mug_set: { name: 'Mug Set', Icon: WishlistIcons.mug_set },
  kitchen_set: { name: 'Kitchen Set', Icon: WishlistIcons.kitchen_set },
  blender: { name: 'Blender', Icon: WishlistIcons.blender },
  rice_cooker: { name: 'Rice Cooker', Icon: WishlistIcons.rice_cooker },
  vacuum: { name: 'Vacuum Cleaner', Icon: WishlistIcons.vacuum },
  iron: { name: 'Setrika', Icon: WishlistIcons.iron },
  towel_set: { name: 'Towel Set', Icon: WishlistIcons.towel_set },
  dinnerware: { name: 'Dinnerware Set', Icon: WishlistIcons.dinnerware },
  air_fryer: { name: 'Air Fryer', Icon: WishlistIcons.air_fryer },
  mixer: { name: 'Mixer', Icon: WishlistIcons.mixer },
};

// Bank Logos as SVG components
const BankLogos = {
  bca: () => (
    <svg viewBox="0 0 120 40" className="h-8 w-auto">
      <rect width="120" height="40" rx="4" fill="#003D79"/>
      <text x="60" y="26" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial">BCA</text>
    </svg>
  ),
  bni: () => (
    <svg viewBox="0 0 120 40" className="h-8 w-auto">
      <rect width="120" height="40" rx="4" fill="#F15A22"/>
      <text x="60" y="26" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial">BNI</text>
    </svg>
  ),
  bri: () => (
    <svg viewBox="0 0 120 40" className="h-8 w-auto">
      <rect width="120" height="40" rx="4" fill="#00529C"/>
      <text x="60" y="26" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial">BRI</text>
    </svg>
  ),
  mandiri: () => (
    <svg viewBox="0 0 120 40" className="h-8 w-auto">
      <rect width="120" height="40" rx="4" fill="#003066"/>
      <text x="60" y="26" textAnchor="middle" fill="#F7A51C" fontSize="14" fontWeight="bold" fontFamily="Arial">MANDIRI</text>
    </svg>
  ),
  bsi: () => (
    <svg viewBox="0 0 120 40" className="h-8 w-auto">
      <rect width="120" height="40" rx="4" fill="#00A650"/>
      <text x="60" y="26" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial">BSI</text>
    </svg>
  ),
  cimb: () => (
    <svg viewBox="0 0 120 40" className="h-8 w-auto">
      <rect width="120" height="40" rx="4" fill="#EC1C24"/>
      <text x="60" y="26" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">CIMB</text>
    </svg>
  ),
  permata: () => (
    <svg viewBox="0 0 120 40" className="h-8 w-auto">
      <rect width="120" height="40" rx="4" fill="#00A0E2"/>
      <text x="60" y="26" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial">PERMATA</text>
    </svg>
  ),
  danamon: () => (
    <svg viewBox="0 0 120 40" className="h-8 w-auto">
      <rect width="120" height="40" rx="4" fill="#FFD100"/>
      <text x="60" y="26" textAnchor="middle" fill="#003366" fontSize="12" fontWeight="bold" fontFamily="Arial">DANAMON</text>
    </svg>
  ),
  jago: () => (
    <svg viewBox="0 0 120 40" className="h-8 w-auto">
      <rect width="120" height="40" rx="4" fill="#FFCC00"/>
      <text x="60" y="26" textAnchor="middle" fill="#1A1A1A" fontSize="16" fontWeight="bold" fontFamily="Arial">JAGO</text>
    </svg>
  ),
  seabank: () => (
    <svg viewBox="0 0 120 40" className="h-8 w-auto">
      <rect width="120" height="40" rx="4" fill="#FF6B35"/>
      <text x="60" y="26" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial">SeaBank</text>
    </svg>
  ),
};

// E-Wallet Logos
const EWalletLogos = {
  gopay: () => (
    <svg viewBox="0 0 120 40" className="h-8 w-auto">
      <rect width="120" height="40" rx="4" fill="#00AED6"/>
      <text x="60" y="26" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">GoPay</text>
    </svg>
  ),
  ovo: () => (
    <svg viewBox="0 0 120 40" className="h-8 w-auto">
      <rect width="120" height="40" rx="4" fill="#4C3494"/>
      <text x="60" y="26" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial">OVO</text>
    </svg>
  ),
  dana: () => (
    <svg viewBox="0 0 120 40" className="h-8 w-auto">
      <rect width="120" height="40" rx="4" fill="#118EEA"/>
      <text x="60" y="26" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial">DANA</text>
    </svg>
  ),
  shopeepay: () => (
    <svg viewBox="0 0 120 40" className="h-8 w-auto">
      <rect width="120" height="40" rx="4" fill="#EE4D2D"/>
      <text x="60" y="26" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Arial">ShopeePay</text>
    </svg>
  ),
  linkaja: () => (
    <svg viewBox="0 0 120 40" className="h-8 w-auto">
      <rect width="120" height="40" rx="4" fill="#E31E25"/>
      <text x="60" y="26" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial">LinkAja</text>
    </svg>
  ),
  isaku: () => (
    <svg viewBox="0 0 120 40" className="h-8 w-auto">
      <rect width="120" height="40" rx="4" fill="#FF6B00"/>
      <text x="60" y="26" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">iSaku</text>
    </svg>
  ),
};

function CopyButton({ text, primaryColor }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 rounded-lg transition-all hover:scale-105"
      style={{ backgroundColor: copied ? '#10B981' : `${primaryColor}20` }}
    >
      {copied ? (
        <Check className="w-4 h-4 text-white" />
      ) : (
        <Copy className="w-4 h-4" style={{ color: primaryColor }} />
      )}
    </button>
  );
}

export default function GiftSection({ invitation }) {
  const primaryColor = invitation.primary_color || '#D4A373';
  const secondaryColor = invitation.secondary_color || '#FEFAE0';
  const templateId = invitation.template_id || 'geometric-modern';
  const theme = getThemeDecorations(templateId);

  const bankAccounts = invitation.gift_bank_accounts || [];
  const ewallets = invitation.gift_ewallets || [];
  const giftAddress = invitation.gift_address;

  const hasContent = bankAccounts.length > 0 || ewallets.length > 0 || giftAddress;

  if (!hasContent || !invitation.enable_gift) return null;

  return (
    <section
      id="gift"
      className="py-20 md:py-32 relative overflow-hidden bg-white paper-texture"
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/4 right-0 w-64 h-64 rounded-full opacity-5"
          style={{ backgroundColor: primaryColor }}
        />
        <div 
          className="absolute bottom-1/4 left-0 w-48 h-48 rounded-full opacity-5"
          style={{ backgroundColor: primaryColor }}
        />
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-0 left-0 w-20 md:w-28 opacity-20">
        <FloralCorner color={primaryColor} />
      </div>
      <div className="absolute top-0 right-0 w-20 md:w-28 opacity-20">
        <FloralCorner color={primaryColor} flip />
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
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
            <Gift className="w-8 h-8" style={{ color: primaryColor }} />
          </motion.div>

          <h2
            className="text-3xl md:text-5xl font-semibold mb-4"
            style={{ 
              fontFamily: `var(--font-${invitation.font_family || 'playfair'})`,
              color: primaryColor 
            }}
          >
            Kirim Hadiah
          </h2>
          
          <GoldAccent className="w-48 mx-auto my-6 opacity-50" />
          
          <p className="text-gray-600 max-w-lg mx-auto">
            Doa restu Anda merupakan karunia yang sangat berarti bagi kami. 
            Namun jika Anda ingin memberikan tanda kasih, kami menyediakan informasi berikut:
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Bank Accounts */}
          {bankAccounts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <CreditCard className="w-5 h-5" style={{ color: primaryColor }} />
                </div>
                <h3 className="font-semibold text-gray-800">Transfer Bank</h3>
              </div>

              {bankAccounts.map((account, index) => {
                const BankLogo = BankLogos[account.bank?.toLowerCase()] || BankLogos.bca;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-2xl p-5 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-3">
                          <BankLogo />
                        </div>
                        <p className="text-xl font-mono font-semibold text-gray-800 mb-1">
                          {account.number}
                        </p>
                        <p className="text-sm text-gray-500">a.n. {account.name}</p>
                      </div>
                      <CopyButton text={account.number} primaryColor={primaryColor} />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* E-Wallets */}
          {ewallets.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <Wallet className="w-5 h-5" style={{ color: primaryColor }} />
                </div>
                <h3 className="font-semibold text-gray-800">E-Wallet</h3>
              </div>

              {ewallets.map((wallet, index) => {
                const WalletLogo = EWalletLogos[wallet.type?.toLowerCase()] || EWalletLogos.gopay;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-2xl p-5 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-3">
                          <WalletLogo />
                        </div>
                        <p className="text-xl font-mono font-semibold text-gray-800 mb-1">
                          {wallet.number}
                        </p>
                        <p className="text-sm text-gray-500">a.n. {wallet.name}</p>
                      </div>
                      <CopyButton text={wallet.number} primaryColor={primaryColor} />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Gift Address */}
        {giftAddress && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10"
          >
            <div 
              className="rounded-3xl p-6 md:p-8"
              style={{ backgroundColor: `${primaryColor}08` }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <MapPin className="w-6 h-6" style={{ color: primaryColor }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2">Kirim Hadiah ke Alamat</h3>
                  <p className="text-gray-600 leading-relaxed">{giftAddress}</p>
                </div>
                <CopyButton text={giftAddress} primaryColor={primaryColor} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Wishlist Section */}
        {invitation.gift_wishlist && invitation.gift_wishlist.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                <Heart className="w-5 h-5" style={{ color: primaryColor }} />
              </div>
              <h3 className="font-semibold text-gray-800">Wishlist Kami</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {invitation.gift_wishlist.map((item, index) => {
                const isCustom = item.startsWith('custom:');
                const itemData = isCustom 
                  ? { name: item.replace('custom:', ''), Icon: null }
                  : WISHLIST_ITEMS[item] || { name: item, Icon: null };
                const ItemIcon = itemData.Icon;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-2xl text-center"
                    style={{ backgroundColor: `${primaryColor}10` }}
                  >
                    <div className="flex justify-center mb-2" style={{ color: primaryColor }}>
                      {ItemIcon ? <ItemIcon /> : <Gift className="w-6 h-6" />}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{itemData.name}</span>
                  </motion.div>
                );
              })}
            </div>
            
            <p className="text-center text-sm text-gray-500 mt-4 italic">
              Jika berkenan, Anda dapat memberikan salah satu dari wishlist di atas
            </p>
          </motion.div>
        )}

        {/* Divider */}
        <div className="mt-16">
          <ThemedDivider templateId={templateId} color={primaryColor} />
        </div>
      </div>
    </section>
  );
}
