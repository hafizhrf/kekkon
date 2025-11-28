import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Clock, Trash2, Shield, AlertTriangle } from 'lucide-react';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali</span>
          </Link>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <span className="font-semibold text-gray-800 dark:text-white">Syarat & Ketentuan</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-amber-100/50 dark:shadow-amber-500/5 overflow-hidden">
          {/* Hero */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-12 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Syarat dan Ketentuan</h1>
            <p className="text-amber-100">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>

          <div className="p-8 space-y-10">
            {/* Intro */}
            <section>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Selamat datang di Kekkon. Dengan menggunakan layanan kami, Anda menyetujui syarat dan ketentuan berikut. 
                Harap baca dengan seksama sebelum menggunakan platform kami.
              </p>
            </section>

            {/* Expiration Policy - Highlighted */}
            <section className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Kebijakan Masa Berlaku Undangan</h2>
                  <div className="space-y-3 text-gray-600 dark:text-gray-300">
                    <p>
                      <strong className="text-amber-700">Undangan akan aktif selama 3 (tiga) bulan</strong> sejak tanggal pembuatan. 
                      Setelah masa berlaku berakhir:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-2">
                      <li>Undangan tidak dapat diakses oleh publik</li>
                      <li>Semua data undangan akan dihapus secara permanen</li>
                      <li>Foto dan media yang diupload akan dihapus dari server</li>
                      <li>Data tamu dan RSVP akan dihapus</li>
                    </ul>
                    <p className="text-sm text-amber-700 font-medium mt-4">
                      Kebijakan ini diterapkan untuk menjaga performa server dan efisiensi penyimpanan.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Deletion */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Penghapusan Data</h2>
              </div>
              <div className="text-gray-600 dark:text-gray-300 space-y-3 ml-13">
                <p>Kami berhak menghapus data dalam kondisi berikut:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Undangan telah melewati masa berlaku 3 bulan</li>
                  <li>Pengguna melanggar syarat dan ketentuan</li>
                  <li>Konten mengandung unsur ilegal atau melanggar hukum</li>
                  <li>Atas permintaan pengguna</li>
                </ul>
              </div>
            </section>

            {/* User Responsibility */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Tanggung Jawab Pengguna</h2>
              </div>
              <div className="text-gray-600 dark:text-gray-300 space-y-3 ml-13">
                <p>Sebagai pengguna, Anda bertanggung jawab untuk:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Menyediakan informasi yang akurat dan benar</li>
                  <li>Menjaga kerahasiaan akun Anda</li>
                  <li>Tidak mengupload konten yang melanggar hak cipta</li>
                  <li>Tidak menggunakan platform untuk tujuan ilegal</li>
                  <li>Membuat backup data penting sebelum masa berlaku berakhir</li>
                </ul>
              </div>
            </section>

            {/* Disclaimer */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Batasan Tanggung Jawab</h2>
              </div>
              <div className="text-gray-600 dark:text-gray-300 space-y-3 ml-13">
                <p>Kekkon tidak bertanggung jawab atas:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Kehilangan data setelah masa berlaku undangan berakhir</li>
                  <li>Gangguan layanan yang disebabkan oleh faktor eksternal</li>
                  <li>Kerugian yang timbul akibat penyalahgunaan akun</li>
                  <li>Konten yang diupload oleh pengguna</li>
                </ul>
              </div>
            </section>

            {/* Changes */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Perubahan Ketentuan</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diumumkan 
                melalui platform dan berlaku sejak tanggal publikasi. Penggunaan berkelanjutan setelah 
                perubahan berarti Anda menyetujui ketentuan yang diperbarui.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-gray-50 dark:bg-slate-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Hubungi Kami</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi kami melalui 
                email di <a href="mailto:support@kekkon.id" className="text-amber-600 dark:text-amber-400 hover:underline">support@kekkon.id</a>
              </p>
            </section>

            {/* Agreement */}
            <section className="text-center pt-6 border-t border-gray-100 dark:border-slate-700">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Dengan menggunakan Kekkon, Anda menyatakan telah membaca, memahami, dan menyetujui 
                seluruh syarat dan ketentuan di atas.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-400 dark:text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Kekkon. All rights reserved.</p>
      </footer>
    </div>
  );
}
