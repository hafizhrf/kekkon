import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { guestAPI, invitationAPI } from '../../utils/api';
import { 
  ArrowLeft, Plus, Trash2, Upload, Download, Check, X, Users, 
  MessageSquare, Search, Copy, ExternalLink, Phone, Mail, 
  ChevronDown, MoreVertical, Filter, UserPlus, FileSpreadsheet,
  CheckCircle2, XCircle, Clock, UserCheck
} from 'lucide-react';
import ThemeToggle from '../shared/ThemeToggle';

export default function GuestManager() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guests, setGuests] = useState([]);
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGuest, setNewGuest] = useState({ name: '', phone: '' });
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [expandedMessage, setExpandedMessage] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [guestsRes, invRes] = await Promise.all([
        guestAPI.getAll(id),
        invitationAPI.getOne(id),
      ]);
      setGuests(guestsRes.data.guests);
      setInvitation(invRes.data.invitation);
    } catch (err) {
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGuest = async (e) => {
    e.preventDefault();
    try {
      const res = await guestAPI.add(id, newGuest);
      setGuests([{ ...res.data.guest, rsvp_status: 'pending' }, ...guests]);
      setNewGuest({ name: '', phone: '' });
      setShowAddForm(false);
      toast.success('Tamu berhasil ditambahkan');
    } catch (err) {
      toast.error('Gagal menambah tamu');
    }
  };

  const handleDeleteGuest = async (guestId) => {
    try {
      await guestAPI.delete(guestId);
      setGuests(guests.filter(g => g.id !== guestId));
      setShowDeleteConfirm(null);
      toast.success('Tamu berhasil dihapus');
    } catch (err) {
      toast.error('Gagal menghapus tamu');
    }
  };

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter(line => line.trim());
      const guestList = lines.slice(1).map(line => {
        const [name, phone] = line.split(',').map(s => s.trim());
        return { name, phone };
      }).filter(g => g.name);

      if (guestList.length === 0) {
        toast.error('Tidak ada data valid dalam file');
        return;
      }

      try {
        await guestAPI.bulkAdd(id, guestList);
        loadData();
        toast.success(`${guestList.length} tamu berhasil ditambahkan`);
      } catch (err) {
        toast.error('Gagal import tamu');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportCSV = () => {
    const headers = ['Nama', 'Telepon', 'Status RSVP', 'Jumlah Hadir', 'Ucapan'];
    const rows = guests.map(g => [
      g.name,
      g.phone || '',
      g.rsvp_status === 'attending' ? 'Hadir' : g.rsvp_status === 'not_attending' ? 'Tidak Hadir' : 'Pending',
      g.attendance_count || '',
      `"${(g.message || '').replace(/"/g, '""')}"`,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daftar-tamu-${invitation?.slug || 'wedding'}.csv`;
    a.click();
    toast.success('File CSV berhasil diunduh');
  };

  const getShareLink = (guestName) => {
    return `${window.location.origin}/${invitation?.slug}?to=${encodeURIComponent(guestName)}`;
  };

  const copyLink = (guestName) => {
    navigator.clipboard.writeText(getShareLink(guestName));
    toast.success('Link berhasil disalin!');
  };

  const filteredGuests = guests.filter(g => {
    const matchesFilter = filter === 'all' || g.rsvp_status === filter;
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (g.phone && g.phone.includes(searchQuery));
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: guests.length,
    attending: guests.filter(g => g.rsvp_status === 'attending').length,
    notAttending: guests.filter(g => g.rsvp_status === 'not_attending').length,
    pending: guests.filter(g => g.rsvp_status === 'pending').length,
    totalAttendance: guests.reduce((sum, g) => sum + (g.rsvp_status === 'attending' ? (g.attendance_count || 1) : 0), 0),
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'attending':
        return { 
          label: 'Hadir', 
          icon: CheckCircle2, 
          bg: 'bg-emerald-50 dark:bg-emerald-500/10', 
          text: 'text-emerald-700 dark:text-emerald-400',
          border: 'border-emerald-200 dark:border-emerald-500/30',
          dot: 'bg-emerald-500'
        };
      case 'not_attending':
        return { 
          label: 'Tidak Hadir', 
          icon: XCircle, 
          bg: 'bg-rose-50 dark:bg-rose-500/10', 
          text: 'text-rose-700 dark:text-rose-400',
          border: 'border-rose-200 dark:border-rose-500/30',
          dot: 'bg-rose-500'
        };
      default:
        return { 
          label: 'Pending', 
          icon: Clock, 
          bg: 'bg-amber-50 dark:bg-amber-500/10', 
          text: 'text-amber-700 dark:text-amber-400',
          border: 'border-amber-200 dark:border-amber-500/30',
          dot: 'bg-amber-500'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-200 dark:border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Memuat data tamu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-700 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/dashboard')} 
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Kelola Tamu</h1>
                {invitation && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {invitation.bride_name} & {invitation.groom_name}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {invitation?.status === 'published' && (
                <a 
                  href={`/${invitation.slug}`} 
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors text-sm font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  Lihat Undangan
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Tamu', value: stats.total, icon: Users, color: 'slate', gradient: 'from-slate-500 to-slate-600' },
            { label: 'Hadir', value: stats.attending, icon: CheckCircle2, color: 'emerald', gradient: 'from-emerald-500 to-teal-500' },
            { label: 'Tidak Hadir', value: stats.notAttending, icon: XCircle, color: 'rose', gradient: 'from-rose-500 to-pink-500' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'amber', gradient: 'from-amber-500 to-orange-500' },
            { label: 'Total Orang', value: stats.totalAttendance, icon: UserCheck, color: 'violet', gradient: 'from-violet-500 to-purple-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden"
        >
          {/* Toolbar */}
          <div className="p-5 border-b border-gray-100 dark:border-slate-700">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama atau nomor telepon..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-700 dark:text-white border-0 rounded-xl focus:ring-2 focus:ring-amber-400 transition-all"
                />
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-3 bg-gray-50 dark:bg-slate-700 dark:text-white border-0 rounded-xl focus:ring-2 focus:ring-amber-400 text-sm font-medium cursor-pointer"
                  >
                    <option value="all">Semua Status</option>
                    <option value="attending">Hadir</option>
                    <option value="not_attending">Tidak Hadir</option>
                    <option value="pending">Pending</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-amber-200 dark:hover:shadow-amber-500/20 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden md:inline">Tambah Tamu</span>
                </button>
                <label className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span className="hidden md:inline">Import</span>
                  <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
                </label>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden md:inline">Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Add Guest Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <form onSubmit={handleAddGuest} className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 border-b border-amber-100 dark:border-slate-700">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Nama Tamu *</label>
                      <input
                        type="text"
                        value={newGuest.name}
                        onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-700 dark:text-white border-0 rounded-xl focus:ring-2 focus:ring-amber-400"
                        placeholder="Masukkan nama tamu"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">No. Telepon (opsional)</label>
                      <input
                        type="text"
                        value={newGuest.phone}
                        onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-700 dark:text-white border-0 rounded-xl focus:ring-2 focus:ring-amber-400"
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <button 
                        type="submit" 
                        className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                      >
                        Simpan
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="px-4 py-3 bg-white dark:bg-slate-600 text-gray-600 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-500 transition-colors"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Guest List */}
          {filteredGuests.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-gray-300 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {searchQuery || filter !== 'all' ? 'Tidak ada tamu yang cocok' : 'Belum ada tamu'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {searchQuery || filter !== 'all' ? 'Coba ubah filter atau kata kunci pencarian' : 'Mulai tambahkan tamu undangan Anda'}
              </p>
              {!searchQuery && filter === 'all' && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  <UserPlus className="w-5 h-5" />
                  Tambah Tamu Pertama
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-slate-700">
              {filteredGuests.map((guest, index) => {
                const statusConfig = getStatusConfig(guest.rsvp_status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <motion.div
                    key={guest.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="p-5 hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-lg">
                          {guest.name.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-gray-800 dark:text-white truncate">{guest.name}</h3>
                            {guest.phone && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                                <Phone className="w-3.5 h-3.5" />
                                {guest.phone}
                              </p>
                            )}
                          </div>

                          {/* Status Badge */}
                          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></span>
                            {statusConfig.label}
                            {guest.rsvp_status === 'attending' && guest.attendance_count > 0 && (
                              <span className="ml-1">({guest.attendance_count} orang)</span>
                            )}
                          </div>
                        </div>

                        {/* Message */}
                        {guest.message && (
                          <div className="mt-3">
                            <div 
                              className={`text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-700 rounded-xl p-3 cursor-pointer ${expandedMessage === guest.id ? '' : 'line-clamp-2'}`}
                              onClick={() => setExpandedMessage(expandedMessage === guest.id ? null : guest.id)}
                            >
                              <MessageSquare className="w-4 h-4 inline mr-2 text-gray-400 dark:text-gray-500" />
                              {guest.message}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-3">
                          {invitation?.status === 'published' && (
                            <button
                              onClick={() => copyLink(guest.name)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              Salin Link
                            </button>
                          )}
                          <button
                            onClick={() => setShowDeleteConfirm(guest.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Delete Confirmation */}
                    <AnimatePresence>
                      {showDeleteConfirm === guest.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 p-4 bg-rose-50 dark:bg-rose-500/10 rounded-xl border border-rose-100 dark:border-rose-500/30"
                        >
                          <p className="text-sm text-rose-800 dark:text-rose-300 mb-3">
                            Yakin ingin menghapus <strong>{guest.name}</strong>?
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDeleteGuest(guest.id)}
                              className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors"
                            >
                              Ya, Hapus
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="px-4 py-2 bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                            >
                              Batal
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          {filteredGuests.length > 0 && (
            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 border-t border-gray-100 dark:border-slate-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Menampilkan {filteredGuests.length} dari {guests.length} tamu
              </p>
            </div>
          )}
        </motion.div>

        {/* CSV Template Info */}
        <div className="mt-6 p-5 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileSpreadsheet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Format Import CSV</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Untuk import tamu dalam jumlah banyak, gunakan format CSV berikut:
              </p>
              <code className="block p-3 bg-gray-50 dark:bg-slate-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 font-mono">
                nama,telepon<br/>
                John Doe,08123456789<br/>
                Jane Smith,08987654321
              </code>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
