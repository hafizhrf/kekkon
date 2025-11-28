import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { invitationAPI } from '../../utils/api';
import { 
  Plus, Eye, Users, Edit, Trash2, ExternalLink, LogOut, Heart, 
  Calendar, Share2, Copy, X, Sparkles, Download, MessageCircle, User, Check
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { KekkonLogo } from '../shared/Logo';
import ThemeToggle from '../shared/ThemeToggle';

export default function Dashboard() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [shareModal, setShareModal] = useState(null);
  const [guestName, setGuestName] = useState('');
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      const res = await invitationAPI.getAll();
      setInvitations(res.data.invitations);
    } catch (err) {
      toast.error('Gagal memuat data undangan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (inv) => {
    setDeleting(true);
    try {
      await invitationAPI.delete(inv.id);
      setInvitations(invitations.filter(i => i.id !== inv.id));
      setDeleteConfirm(null);
      toast.success('Undangan berhasil dihapus');
    } catch (err) {
      toast.error('Gagal menghapus undangan');
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Berhasil keluar');
  };

  const getInvitationUrl = (slug, name = '') => {
    const baseUrl = `${window.location.origin}/${slug}`;
    if (name.trim()) {
      return `${baseUrl}?to=${encodeURIComponent(name.trim())}`;
    }
    return baseUrl;
  };

  const handleOpenShareModal = (inv) => {
    setGuestName('');
    setCopied(false);
    setShareModal(inv);
  };

  const handleCopyLink = () => {
    if (!shareModal) return;
    const url = getInvitationUrl(shareModal.slug, guestName);
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link berhasil disalin!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    if (!shareModal) return;
    const url = getInvitationUrl(shareModal.slug, guestName);
    const greeting = guestName.trim() 
      ? `Kepada Yth. ${guestName.trim()}\n\n` 
      : '';
    const text = encodeURIComponent(
      `${greeting}Anda diundang ke pernikahan:\n\n💒 ${shareModal.bride_name} & ${shareModal.groom_name}\n\nBuka undangan:\n${url}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleDownloadQR = () => {
    if (!shareModal) return;
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) {
      toast.error('Gagal mengunduh QR Code');
      return;
    }

    const newCanvas = document.createElement('canvas');
    const ctx = newCanvas.getContext('2d');
    
    // Dimensions
    const padding = 48;
    const qrSize = canvas.width;
    const qrPadding = 16;
    const headerHeight = 60;
    const contentHeight = guestName.trim() ? 115 : 95;
    const footerHeight = 50;
    
    newCanvas.width = qrSize + padding * 2 + qrPadding * 2;
    newCanvas.height = headerHeight + qrSize + qrPadding * 2 + contentHeight + footerHeight + padding;
    
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
    
    // Header with gradient line
    const gradient = ctx.createLinearGradient(padding, 0, newCanvas.width - padding, 0);
    gradient.addColorStop(0, '#f59e0b');
    gradient.addColorStop(1, '#d97706');
    ctx.fillStyle = gradient;
    ctx.fillRect(padding, padding, newCanvas.width - padding * 2, 4);
    
    // Kekkon branding
    ctx.fillStyle = '#d97706';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Kekkon', newCanvas.width / 2, padding + 35);
    
    ctx.fillStyle = '#9ca3af';
    ctx.font = '11px Arial';
    ctx.fillText('Undangan Pernikahan Digital', newCanvas.width / 2, padding + 52);
    
    // QR Code with border
    const qrY = headerHeight + padding;
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(padding, qrY, qrSize + qrPadding * 2, qrSize + qrPadding * 2);
    ctx.drawImage(canvas, padding + qrPadding, qrY + qrPadding);
    
    // Couple names (vertical)
    const textStartY = qrY + qrSize + qrPadding * 2 + 28;
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(shareModal.bride_name, newCanvas.width / 2, textStartY);
    
    ctx.fillStyle = '#d97706';
    ctx.font = '14px Arial';
    ctx.fillText('&', newCanvas.width / 2, textStartY + 22);
    
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(shareModal.groom_name, newCanvas.width / 2, textStartY + 44);
    
    // Guest name if provided
    if (guestName.trim()) {
      ctx.font = '13px Arial';
      ctx.fillStyle = '#6b7280';
      ctx.fillText(
        `Kepada Yth: ${guestName.trim()}`,
        newCanvas.width / 2,
        textStartY + 70
      );
    }
    
    // Scan instruction
    ctx.font = '11px Arial';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText(
      'Scan QR code untuk membuka undangan',
      newCanvas.width / 2,
      textStartY + (guestName.trim() ? 92 : 70)
    );
    
    // Footer text
    const footerY = newCanvas.height - 30;
    ctx.fillStyle = '#d1d5db';
    ctx.font = '10px Arial';
    ctx.fillText('kekkon.id', newCanvas.width / 2, footerY);
    
    // Download
    const link = document.createElement('a');
    const fileName = guestName.trim() 
      ? `kekkon-${guestName.trim().replace(/\s+/g, '-').toLowerCase()}.png`
      : `kekkon-${shareModal.bride_name}-${shareModal.groom_name}.png`.toLowerCase().replace(/\s+/g, '-');
    link.download = fileName;
    link.href = newCanvas.toDataURL('image/png');
    link.click();
    
    toast.success('QR Code berhasil diunduh!');
  };

  const totalViews = invitations.reduce((sum, inv) => sum + (inv.view_count || 0), 0);
  const totalGuests = invitations.reduce((sum, inv) => sum + (inv.attending_count || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      {/* Navbar */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-700 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <KekkonLogo />
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-700 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-medium">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                <span className="text-gray-700 dark:text-gray-200 font-medium">{user?.name || user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-5 mb-6 sm:mb-8">
          {[
            { label: 'Undangan', labelFull: 'Total Undangan', value: invitations.length, icon: Heart, gradient: 'from-rose-500 to-pink-500' },
            { label: 'Views', labelFull: 'Total Views', value: totalViews, icon: Eye, gradient: 'from-blue-500 to-cyan-500' },
            { label: 'Hadir', labelFull: 'Tamu Hadir', value: totalGuests, icon: Users, gradient: 'from-violet-500 to-purple-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-sm border border-gray-100 dark:border-slate-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <div className="order-2 sm:order-1">
                  <p className="text-[10px] sm:text-sm text-gray-500 dark:text-gray-400 mb-0.5 sm:mb-1">
                    <span className="sm:hidden">{stat.label}</span>
                    <span className="hidden sm:inline">{stat.labelFull}</span>
                  </p>
                  <p className="text-xl sm:text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                </div>
                <div className={`order-1 sm:order-2 w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-4 sm:mb-6">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">Undangan Saya</h2>
            <p className="text-xs sm:text-base text-gray-500 dark:text-gray-400 hidden sm:block">Kelola semua undangan pernikahan Anda</p>
          </div>
          <Link 
            to="/create" 
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:shadow-lg hover:shadow-amber-200 dark:hover:shadow-amber-500/20 transition-all"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Buat Undangan</span>
            <span className="sm:hidden">Buat</span>
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-amber-200 dark:border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Memuat undangan...</p>
            </div>
          </div>
        ) : invitations.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 text-center py-16 px-6"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-500/20 dark:to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-12 h-12 text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Belum Ada Undangan</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Mulai buat undangan pernikahan digital pertama Anda dengan template cantik dan fitur lengkap
            </p>
            <Link 
              to="/create" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-200 dark:hover:shadow-amber-500/20 transition-all"
            >
              <Plus className="w-5 h-5" />
              Buat Undangan Pertama
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-3 sm:gap-4">
            {invitations.map((inv, index) => (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-slate-700 p-3 sm:p-5 hover:shadow-md transition-shadow"
              >
                {/* Mobile Layout */}
                <div className="sm:hidden">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 text-white" fill="white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-sm text-gray-800 dark:text-white leading-tight">
                          {inv.bride_name} & {inv.groom_name}
                        </h3>
                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full flex-shrink-0 ${
                          inv.status === 'published' 
                            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' 
                            : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                        }`}>
                          {inv.status === 'published' ? 'Live' : 'Draft'}
                        </span>
                      </div>
                      {inv.wedding_date && (
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(inv.wedding_date), 'd MMM yyyy', { locale: id })}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {inv.view_count || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {inv.attending_count || 0}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {inv.status === 'published' && (
                        <>
                          <button
                            onClick={() => handleOpenShareModal(inv)}
                            className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <a
                            href={`/${inv.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-lg"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </>
                      )}
                      <Link to={`/edit/${inv.id}`} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <Link to={`/guests/${inv.id}`} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
                        <Users className="w-4 h-4" />
                      </Link>
                      <button onClick={() => setDeleteConfirm(inv)} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-7 h-7 text-white" fill="white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white truncate">
                          {inv.bride_name} & {inv.groom_name}
                        </h3>
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          inv.status === 'published' 
                            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' 
                            : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                        }`}>
                          {inv.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        {inv.wedding_date && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(inv.wedding_date), 'd MMMM yyyy', { locale: id })}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Eye className="w-4 h-4" /> {inv.view_count || 0} views
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" /> {inv.attending_count || 0} hadir
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 lg:gap-3">
                    {inv.status === 'published' && (
                      <>
                        <button
                          onClick={() => handleOpenShareModal(inv)}
                          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
                        >
                          <Share2 className="w-4 h-4" />
                          <span className="hidden md:inline">Bagikan</span>
                        </button>
                        <a
                          href={`/${inv.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="hidden md:inline">Lihat</span>
                        </a>
                      </>
                    )}
                    <Link
                      to={`/edit/${inv.id}`}
                      className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <Link
                      to={`/guests/${inv.id}`}
                      className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 rounded-xl transition-colors"
                      title="Kelola Tamu"
                    >
                      <Users className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => setDeleteConfirm(inv)}
                      className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-xl"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-rose-100 dark:bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Hapus Undangan?</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Undangan <strong className="dark:text-gray-200">{deleteConfirm.bride_name} & {deleteConfirm.groom_name}</strong> akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    disabled={deleting}
                    className="flex-1 px-4 py-3 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700 transition-colors disabled:opacity-50"
                  >
                    {deleting ? 'Menghapus...' : 'Ya, Hapus'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {shareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShareModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white">Bagikan Undangan</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{shareModal.bride_name} & {shareModal.groom_name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShareModal(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Guest Name Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-2 text-amber-500" />
                  Nama Tamu (Opsional)
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 dark:text-white border-0 rounded-xl focus:ring-2 focus:ring-amber-500 transition-all"
                />
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  Nama akan ditampilkan di undangan sebagai tamu yang diundang
                </p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-6" ref={qrRef}>
                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10">
                  <QRCodeCanvas
                    value={getInvitationUrl(shareModal.slug, guestName)}
                    size={180}
                    fgColor="#d97706"
                    bgColor="transparent"
                    level="M"
                  />
                </div>
              </div>

              {/* Link Preview */}
              <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-3 mb-6">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Link Undangan:</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-mono break-all">
                  {getInvitationUrl(shareModal.slug, guestName)}
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gray-100 dark:bg-slate-700 rounded-xl text-sm font-semibold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-green-600 dark:text-green-400">Link Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">Salin Link</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadQR}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 transition-all hover:shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  Download QR Code
                </button>

                <button
                  onClick={handleWhatsAppShare}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Bagikan via WhatsApp
                </button>
              </div>

              {/* Info */}
              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-500/10 rounded-xl">
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  <strong>Tips:</strong> Isi nama tamu untuk membuat undangan personal. 
                  QR Code yang diunduh akan menyertakan nama pasangan dan tamu.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
