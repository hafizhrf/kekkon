import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { KekkonIcon } from '../shared/Logo';
import ThemeToggle from '../shared/ThemeToggle';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Email atau password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-0 md:px-4 relative overflow-hidden transition-colors duration-300">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Background decorations - hidden on mobile */}
      <div className="hidden md:block absolute top-20 left-10 w-72 h-72 bg-amber-200/30 dark:bg-amber-500/10 rounded-full blur-3xl" />
      <div className="hidden md:block absolute bottom-20 right-10 w-96 h-96 bg-orange-200/30 dark:bg-orange-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full md:bg-white md:dark:bg-slate-800 md:rounded-3xl md:shadow-xl md:shadow-amber-100/50 md:dark:shadow-amber-500/5 p-6 md:p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <KekkonIcon size={64} id="login" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Selamat Datang</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Masuk ke akun <span className="text-amber-600 dark:text-amber-400 font-semibold">Kekkon</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-slate-700 dark:text-white border-0 rounded-xl focus:ring-2 focus:ring-amber-400 transition-all"
                placeholder="email@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-slate-700 dark:text-white border-0 rounded-xl focus:ring-2 focus:ring-amber-400 transition-all"
                placeholder="********"
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-200 dark:hover:shadow-amber-500/20 transition-all disabled:opacity-50 group"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                Masuk
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Belum punya akun?{' '}
            <Link to="/register" className="text-amber-600 dark:text-amber-400 font-semibold hover:text-amber-700 dark:hover:text-amber-300">
              Daftar Gratis
            </Link>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-700 text-center">
          <Link to="/" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            ← Kembali ke Beranda
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
