import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Users, Share2, Palette, Music, Check, ArrowRight, Star, LayoutDashboard, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { KekkonLogo, KekkonIcon } from './shared/Logo';
import ThemeToggle from './shared/ThemeToggle';

export default function LandingPage() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const features = [
    { icon: Palette, title: 'Template Cantik', desc: 'Pilih dari berbagai template modern dan elegan' },
    { icon: Users, title: 'Kelola Tamu', desc: 'RSVP otomatis dan manajemen daftar tamu' },
    { icon: Share2, title: 'Mudah Dibagikan', desc: 'Link personal untuk setiap tamu undangan' },
    { icon: Music, title: 'Musik Background', desc: 'Tambahkan lagu romantis untuk undangan Anda' },
  ];

  const benefits = [
    'Gratis selamanya',
    'Unlimited tamu undangan',
    'QR Code otomatis',
    'RSVP & ucapan real-time',
    'Download QR untuk cetak',
    'Berbagai pilihan template',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-x-hidden transition-colors duration-300">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <KekkonLogo />
          
          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <Link 
                to="/dashboard" 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-200 dark:hover:shadow-amber-500/20 transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-5 py-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Masuk
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-200 dark:hover:shadow-amber-500/20 transition-all"
                >
                  Daftar Gratis
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-3">
                {user ? (
                  <Link 
                    to="/dashboard" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full px-5 py-3 text-center text-gray-600 dark:text-gray-300 font-medium rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      Masuk
                    </Link>
                    <Link 
                      to="/register" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full px-5 py-3 text-center bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl"
                    >
                      Daftar Gratis
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-amber-200/30 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 -right-20 w-72 sm:w-96 h-72 sm:h-96 bg-orange-200/30 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-500/20 dark:to-orange-500/20 rounded-full text-sm font-medium text-amber-700 dark:text-amber-400 mb-8">
              <Sparkles className="w-4 h-4" />
              100% Gratis - Tanpa Batas
              <Sparkles className="w-4 h-4" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold text-gray-800 dark:text-white mb-6 leading-tight"
          >
            Buat Undangan
            <span className="block bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Pernikahan Digital
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Undang tamu dengan cara modern. Buat undangan pernikahan digital
            dalam hitungan menit dengan template cantik dan fitur lengkap.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              to={user ? "/dashboard" : "/register"}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg font-semibold rounded-2xl hover:shadow-xl hover:shadow-amber-200 dark:hover:shadow-amber-500/20 transition-all group"
            >
              {user ? (
                <>
                  <LayoutDashboard className="w-5 h-5" />
                  Ke Dashboard
                </>
              ) : (
                <>
                  Mulai Sekarang
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Link>
            <a 
              href="#features" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 text-lg font-semibold rounded-2xl border-2 border-gray-200 dark:border-slate-600 hover:border-amber-300 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-slate-700 transition-all"
            >
              Lihat Fitur
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white dark:border-slate-800 flex items-center justify-center text-white text-xs font-medium">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span>1000+ pasangan sudah menggunakan</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-slate-800" id="features">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium mb-4">
                Fitur Lengkap
              </span>
              <h2 className="text-3xl md:text-5xl font-playfair font-bold text-gray-800 dark:text-white mb-4">
                Semua yang Anda Butuhkan
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
                Fitur lengkap untuk membuat undangan pernikahan digital yang sempurna
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-700 dark:to-slate-700 rounded-3xl p-8 text-center hover:shadow-lg dark:hover:shadow-amber-500/10 transition-shadow group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium mb-4">
                Kenapa Memilih Kami?
              </span>
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800 dark:text-white mb-6">
                Undangan Digital yang <span className="text-amber-600 dark:text-amber-400">Praktis & Hemat</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                Tidak perlu cetak undangan fisik. Kirim undangan ke semua tamu dengan sekali klik. 
                Hemat biaya, ramah lingkungan, dan lebih modern.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-200 font-medium">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden"
            >
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl shadow-amber-200/50 dark:shadow-amber-500/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" fill="white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 dark:text-white">Testimoni</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Dari pengguna kami</p>
                  </div>
                </div>
                <blockquote className="text-gray-600 dark:text-gray-300 text-lg italic mb-4">
                  "Undangan digitalnya bagus banget, tamu-tamu pada kagum. 
                  Fitur RSVP sangat membantu untuk planning acara. Recommended!"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-medium">
                    A
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">Andini & Reza</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Menikah Oktober 2024</p>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-200 dark:bg-amber-500/30 rounded-full opacity-50 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-orange-200 dark:bg-orange-500/30 rounded-full opacity-50 blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-amber-500 to-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border-2 border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-60 h-60 border-2 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-20 h-20 border-2 border-white rounded-full" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-6">
              {user ? 'Buat Undangan Baru' : 'Siap Membuat Undangan?'}
            </h2>
            <p className="text-white/90 text-xl mb-10 max-w-2xl mx-auto">
              {user 
                ? 'Kembali ke dashboard untuk membuat atau mengelola undangan pernikahan digital Anda.'
                : 'Daftar gratis sekarang dan buat undangan pernikahan digital Anda dalam hitungan menit.'
              }
            </p>
            <Link 
              to={user ? "/dashboard" : "/register"}
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-amber-600 text-lg font-bold rounded-2xl hover:shadow-2xl transition-all group"
            >
              {user ? (
                <>
                  <LayoutDashboard className="w-5 h-5" />
                  Ke Dashboard
                </>
              ) : (
                <>
                  Daftar Gratis Sekarang
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 py-12 border-t border-gray-100 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col items-center gap-6">
            <KekkonLogo linkTo={null} />
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                Tentang Kami
              </Link>
              <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                Kebijakan Privasi
              </Link>
              <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                Syarat & Ketentuan
              </Link>
            </div>
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                Made with ❤️ in Indonesia
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs">
                &copy; {new Date().getFullYear()} Kekkon. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
