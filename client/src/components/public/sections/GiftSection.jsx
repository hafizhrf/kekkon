import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Copy, Check, MapPin, CreditCard, Wallet } from 'lucide-react';
import { FloralDivider, GoldAccent, FloralCorner } from '../decorations/Ornaments';

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

  const bankAccounts = invitation.gift_bank_accounts || [];
  const ewallets = invitation.gift_ewallets || [];
  const giftAddress = invitation.gift_address;

  const hasContent = bankAccounts.length > 0 || ewallets.length > 0 || giftAddress;

  if (!hasContent || !invitation.enable_gift) return null;

  return (
    <section
      id="gift"
      className="py-20 md:py-32 relative overflow-hidden bg-white"
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

        {/* Divider */}
        <div className="mt-16">
          <FloralDivider color={primaryColor} />
        </div>
      </div>
    </section>
  );
}
