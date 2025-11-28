import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import { Shield, Mail, Lock, ArrowRight, AlertCircle, LogOut, User } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasUserSession, setHasUserSession] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check if already logged in as admin
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      navigate('/superadmin/dashboard');
      return;
    }

    // Check if there's an active user session
    const userToken = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (userToken && user) {
      setHasUserSession(true);
      try {
        const userData = JSON.parse(user);
        setUserName(userData.name || userData.email || 'User');
      } catch {
        setUserName('User');
      }
    }
  }, [navigate]);

  const handleLogoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setHasUserSession(false);
    setUserName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await adminAPI.login({ email, password });
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('admin', JSON.stringify(res.data.admin));
      navigate('/superadmin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login gagal. Periksa email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Kekkon Admin</h1>
          <p className="text-slate-400">Superadmin Dashboard Access</p>
        </div>

        {hasUserSession ? (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
            <div className="flex items-start gap-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-6">
              <User className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-400 font-medium">Sesi User Aktif</p>
                <p className="text-slate-400 text-sm mt-1">
                  Anda sedang login sebagai <span className="text-white font-medium">{userName}</span>
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700 mb-6">
              <p className="text-slate-300 text-sm">
                Untuk mengakses Superadmin Dashboard, Anda harus logout dari akun user terlebih dahulu.
              </p>
            </div>

            <button
              onClick={handleLogoutUser}
              className="w-full py-3.5 bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-rose-600 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Logout dari Akun User
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="admin@kekkon.id"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-5 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Login <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        )}

        <p className="text-center text-slate-500 text-sm mt-6">
          Akses terbatas untuk superadmin
        </p>
      </div>
    </div>
  );
}
