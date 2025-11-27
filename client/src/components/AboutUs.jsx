import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Gift, Users, Sparkles, Target, Zap } from 'lucide-react';
import { KekkonLogo, KekkonIcon } from './shared/Logo';

export default function AboutUs() {
  const values = [
    {
      icon: Gift,
      title: '100% Gratis Selamanya',
      desc: 'Kami percaya setiap pasangan berhak mendapatkan undangan pernikahan yang indah tanpa harus mengeluarkan biaya.'
    },
    {
      icon: Heart,
      title: 'Dibuat dengan Cinta',
      desc: 'Setiap fitur dirancang dengan penuh perhatian untuk membantu momen spesial Anda menjadi lebih bermakna.'
    },
    {
      icon: Users,
      title: 'Untuk Semua Orang',
      desc: 'Antarmuka yang mudah digunakan, sehingga siapa pun bisa membuat undangan digital yang cantik.'
    },
  ];

  const features = [
    'Template undangan modern dan elegan',
    'Kelola RSVP dan daftar tamu dengan mudah',
    'QR Code untuk setiap undangan',
    'Musik latar yang romantis',
    'Galeri foto prewedding',
    'Fitur gift/hadiah digital',
    'Ucapan dan doa dari tamu',
    'Bagikan via WhatsApp dengan sekali klik',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <KekkonLogo />
          <Link 
            to="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Hero */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mb-8"
            >
              <KekkonIcon size={80} id="about-hero" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Tentang <span className="text-amber-600">Kekkon</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Platform undangan pernikahan digital gratis untuk membantu 
              calon mempelai di seluruh Indonesia.
            </p>
          </div>

          {/* Story */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Misi Kami</h2>
            </div>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                <strong className="text-gray-800">Kekkon</strong> (結婚 - yang berarti "pernikahan" dalam bahasa Jepang) 
                lahir dari satu keyakinan sederhana: <em>setiap pasangan berhak mendapatkan undangan pernikahan 
                yang indah dan modern, tanpa harus mengeluarkan biaya mahal.</em>
              </p>
              <p>
                Kami memahami bahwa merencanakan pernikahan sudah cukup menguras waktu, tenaga, dan biaya. 
                Oleh karena itu, kami ingin meringankan beban calon mempelai dengan menyediakan platform 
                undangan digital yang <strong className="text-amber-600">100% gratis selamanya</strong>.
              </p>
              <p>
                Dengan Kekkon, Anda bisa membuat undangan pernikahan digital yang cantik dalam hitungan menit, 
                mengelola daftar tamu dengan mudah, dan membagikan undangan ke semua tamu dengan sekali klik.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Features */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-8 md:p-12 text-white mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Fitur Lengkap</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* How We Stay Free */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Bagaimana Kekkon Tetap Gratis?</h2>
            </div>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Anda mungkin bertanya-tanya: <em>"Bagaimana bisa layanan sebagus ini gratis?"</em>
              </p>
              <p>
                Jawabannya sederhana: <strong className="text-gray-800">iklan</strong>. Kekkon didukung 
                oleh iklan yang ditampilkan di platform kami melalui Google AdSense. Pendapatan dari 
                iklan inilah yang membantu kami menutup biaya server, pengembangan, dan pemeliharaan 
                platform.
              </p>
              <p>
                Dengan model ini, kami bisa terus menyediakan layanan <strong className="text-amber-600">
                100% gratis tanpa batasan</strong> - tanpa fitur premium berbayar, tanpa watermark, 
                dan tanpa biaya tersembunyi. Setiap pasangan, dari latar belakang apapun, bisa 
                mendapatkan undangan digital yang sama indahnya.
              </p>
              <div className="mt-6 p-4 bg-amber-50 rounded-xl">
                <p className="text-amber-800 text-sm">
                  <strong>Terima kasih</strong> telah menggunakan Kekkon! Dengan terus menggunakan 
                  layanan kami, Anda telah membantu mendukung misi kami untuk membuat undangan 
                  pernikahan digital yang indah dapat diakses oleh semua orang. 💛
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Siap Membuat Undangan?
            </h3>
            <p className="text-gray-600 mb-6">
              Bergabung dengan ribuan pasangan yang telah menggunakan Kekkon
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-amber-200 transition-all"
            >
              Mulai Gratis Sekarang
              <Heart className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <KekkonLogo />
            <div className="flex gap-6 text-sm">
              <Link to="/about" className="text-gray-600 hover:text-amber-600">Tentang</Link>
              <Link to="/privacy" className="text-gray-600 hover:text-amber-600">Privasi</Link>
            </div>
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Kekkon. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
