import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Eye, Database, Lock, Bell, Trash2 } from 'lucide-react';
import { KekkonLogo } from './shared/Logo';

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: Database,
      title: 'Data yang Kami Kumpulkan',
      content: `Kami mengumpulkan informasi yang Anda berikan secara langsung saat menggunakan layanan Kekkon:
      
• Informasi akun: email dan nama saat mendaftar
• Informasi undangan: nama mempelai, tanggal pernikahan, foto, dan detail acara
• Data tamu: nama tamu undangan dan konfirmasi kehadiran (RSVP)
• Ucapan dan doa dari tamu undangan`
    },
    {
      icon: Eye,
      title: 'Penggunaan Data',
      content: `Data yang kami kumpulkan digunakan untuk:

• Menyediakan dan menjalankan layanan undangan digital
• Menampilkan undangan kepada tamu yang diundang
• Mengelola RSVP dan ucapan dari tamu
• Meningkatkan kualitas layanan kami
• Menampilkan iklan yang relevan untuk mendukung layanan gratis`
    },
    {
      icon: Bell,
      title: 'Iklan',
      content: `Kekkon adalah layanan gratis yang didukung oleh iklan. Kami menggunakan Google AdSense untuk menampilkan iklan di platform kami. 

Google AdSense mungkin menggunakan cookie untuk menampilkan iklan berdasarkan kunjungan pengguna ke situs kami dan situs lain di internet. Anda dapat menonaktifkan penggunaan cookie untuk iklan yang dipersonalisasi melalui pengaturan iklan Google.

Pendapatan dari iklan membantu kami menjaga Kekkon tetap gratis selamanya untuk semua pengguna.`
    },
    {
      icon: Lock,
      title: 'Keamanan Data',
      content: `Kami berkomitmen untuk melindungi data Anda:

• Password dienkripsi menggunakan algoritma bcrypt
• Komunikasi dienkripsi menggunakan HTTPS
• Akses database dibatasi dan diamankan
• Kami tidak menjual data pribadi Anda kepada pihak ketiga`
    },
    {
      icon: Shield,
      title: 'Hak Anda',
      content: `Sebagai pengguna, Anda memiliki hak untuk:

• Mengakses data pribadi yang kami simpan tentang Anda
• Memperbarui atau mengoreksi data Anda kapan saja
• Menghapus akun dan semua data terkait
• Meminta salinan data Anda`
    },
    {
      icon: Trash2,
      title: 'Penghapusan Data',
      content: `Anda dapat menghapus undangan dan data terkait kapan saja melalui dashboard. Saat Anda menghapus undangan:

• Semua data undangan akan dihapus permanen
• Foto yang diupload akan dihapus dari server
• Data tamu dan RSVP juga akan dihapus

Jika Anda ingin menghapus seluruh akun, silakan hubungi kami.`
    },
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
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Kebijakan Privasi
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kami menghargai privasi Anda. Dokumen ini menjelaskan bagaimana Kekkon 
              mengumpulkan, menggunakan, dan melindungi data pribadi Anda.
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800 mb-3">
                      {section.title}
                    </h2>
                    <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                      {section.content}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-12 text-center p-8 bg-white rounded-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Ada Pertanyaan?</h3>
            <p className="text-gray-600 mb-4">
              Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, 
              silakan hubungi kami.
            </p>
            <a 
              href="mailto:privacy@kekkon.id"
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              privacy@kekkon.id
            </a>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <KekkonLogo linkTo="/" className="justify-center mb-4" />
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Kekkon. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
