import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { adminAPI } from '../../utils/api';
import { 
  Shield, Users, FileText, Eye, UserCheck, LogOut, 
  Trash2, Search, ChevronDown, BarChart3, Calendar,
  ExternalLink, AlertTriangle
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, type: '', id: null, name: '' });

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/superadmin');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, usersRes, invitationsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
        adminAPI.getInvitations(),
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data.users);
      setInvitations(invitationsRes.data.invitations);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        navigate('/superadmin');
      } else {
        toast.error('Gagal memuat data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    navigate('/superadmin');
  };

  const handleDelete = async () => {
    try {
      if (deleteModal.type === 'user') {
        await adminAPI.deleteUser(deleteModal.id);
        setUsers(users.filter(u => u.id !== deleteModal.id));
        toast.success('User berhasil dihapus');
      } else if (deleteModal.type === 'invitation') {
        await adminAPI.deleteInvitation(deleteModal.id);
        setInvitations(invitations.filter(i => i.id !== deleteModal.id));
        toast.success('Undangan berhasil dihapus');
      }
    } catch (err) {
      toast.error('Gagal menghapus');
    } finally {
      setDeleteModal({ show: false, type: '', id: null, name: '' });
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredInvitations = invitations.filter(i => 
    i.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (i.bride_name && i.bride_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (i.groom_name && i.groom_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (i.user_email && i.user_email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-400">Memuat data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-white">Kekkon Admin</h1>
                <p className="text-xs text-slate-400">Superadmin Dashboard</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-2 bg-slate-800/50 p-1 rounded-xl w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'invitations', label: 'Invitations', icon: FileText },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'Total Users', value: stats.stats.totalUsers, icon: Users, color: 'from-blue-500 to-cyan-500' },
                { label: 'Total Invitations', value: stats.stats.totalInvitations, icon: FileText, color: 'from-purple-500 to-pink-500' },
                { label: 'Published', value: stats.stats.publishedInvitations, icon: Eye, color: 'from-green-500 to-emerald-500' },
                { label: 'Page Views', value: stats.stats.totalPageViews, icon: BarChart3, color: 'from-amber-500 to-orange-500' },
                { label: 'Total Guests', value: stats.stats.totalGuests, icon: UserCheck, color: 'from-rose-500 to-red-500' },
              ].map(stat => (
                <div key={stat.label} className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-500" />
                  Recent Users
                </h3>
                <div className="space-y-3">
                  {stats.recentUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                      <div>
                        <p className="text-white font-medium">{user.name || 'No name'}</p>
                        <p className="text-sm text-slate-400">{user.email}</p>
                      </div>
                      <p className="text-xs text-slate-500">
                        {new Date(user.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" />
                  Recent Invitations
                </h3>
                <div className="space-y-3">
                  {stats.recentInvitations.map(inv => (
                    <div key={inv.id} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                      <div>
                        <p className="text-white font-medium">
                          {inv.bride_name && inv.groom_name 
                            ? `${inv.bride_name} & ${inv.groom_name}`
                            : inv.slug}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            inv.status === 'published' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-slate-600/50 text-slate-400'
                          }`}>
                            {inv.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">
                        {new Date(inv.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari user..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <p className="text-slate-400 text-sm">{filteredUsers.length} users</p>
            </div>

            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">User</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Email</th>
                      <th className="text-center py-4 px-6 text-sm font-medium text-slate-400">Invitations</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Joined</th>
                      <th className="text-right py-4 px-6 text-sm font-medium text-slate-400">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                        <td className="py-4 px-6">
                          <p className="text-white font-medium">{user.name || '-'}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-slate-300">{user.email}</p>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-700/50 text-white font-medium">
                            {user.invitation_count}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-slate-400 text-sm">
                            {new Date(user.created_at).toLocaleDateString('id-ID', { 
                              day: 'numeric', month: 'short', year: 'numeric' 
                            })}
                          </p>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setDeleteModal({ show: true, type: 'user', id: user.id, name: user.email })}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Invitations Tab */}
        {activeTab === 'invitations' && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari undangan..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <p className="text-slate-400 text-sm">{filteredInvitations.length} undangan</p>
            </div>

            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Couple</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Owner</th>
                      <th className="text-center py-4 px-6 text-sm font-medium text-slate-400">Status</th>
                      <th className="text-center py-4 px-6 text-sm font-medium text-slate-400">Views</th>
                      <th className="text-center py-4 px-6 text-sm font-medium text-slate-400">Guests</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Date</th>
                      <th className="text-right py-4 px-6 text-sm font-medium text-slate-400">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvitations.map(inv => (
                      <tr key={inv.id} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                        <td className="py-4 px-6">
                          <p className="text-white font-medium">
                            {inv.bride_name && inv.groom_name 
                              ? `${inv.bride_name} & ${inv.groom_name}`
                              : '-'}
                          </p>
                          <p className="text-xs text-slate-500">{inv.slug}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-slate-300 text-sm">{inv.user_email}</p>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`text-xs px-2.5 py-1 rounded-full ${
                            inv.status === 'published' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-slate-600/50 text-slate-400'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="text-slate-300">{inv.view_count}</span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="text-slate-300">{inv.guest_count}</span>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-slate-400 text-sm">
                            {inv.wedding_date 
                              ? new Date(inv.wedding_date).toLocaleDateString('id-ID', { 
                                  day: 'numeric', month: 'short', year: 'numeric' 
                                })
                              : '-'}
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-1">
                            {inv.status === 'published' && (
                              <a
                                href={`/${inv.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            <button
                              onClick={() => setDeleteModal({ 
                                show: true, 
                                type: 'invitation', 
                                id: inv.id, 
                                name: inv.bride_name && inv.groom_name 
                                  ? `${inv.bride_name} & ${inv.groom_name}` 
                                  : inv.slug 
                              })}
                              className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Konfirmasi Hapus</h3>
                <p className="text-sm text-slate-400">Aksi ini tidak dapat dibatalkan</p>
              </div>
            </div>
            <p className="text-slate-300 mb-6">
              Apakah Anda yakin ingin menghapus <span className="text-white font-medium">{deleteModal.name}</span>?
              {deleteModal.type === 'user' && ' Semua undangan user ini juga akan dihapus.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, type: '', id: null, name: '' })}
                className="flex-1 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
