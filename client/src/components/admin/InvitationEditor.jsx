import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { invitationAPI, templateAPI, uploadAPI } from '../../utils/api';
import { ArrowLeft, ArrowRight, Upload, X, Check, Eye, Heart, Sparkles, Image, Music, Settings, Send, Palette, Type, Calendar, MapPin, Clock, User, Users, Gift, CreditCard, Wallet, Plus, Trash2, Moon, Church, AlertTriangle, Copy, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import RichTextEditor from '../shared/RichTextEditor';
import CustomSelect from '../shared/CustomSelect';
import { motion } from 'framer-motion';

const STEPS = [
  { id: 1, title: 'Template', desc: 'Pilih desain', icon: Palette },
  { id: 2, title: 'Mempelai', desc: 'Data pasangan', icon: Users },
  { id: 3, title: 'Acara', desc: 'Waktu & tempat', icon: Calendar },
  { id: 4, title: 'Konten', desc: 'Foto & musik', icon: Image },
  { id: 5, title: 'Hadiah', desc: 'Info transfer', icon: Gift },
  { id: 6, title: 'Pengaturan', desc: 'Fitur undangan', icon: Settings },
  { id: 7, title: 'Publish', desc: 'Bagikan', icon: Send },
];

const BANK_OPTIONS = [
  { id: 'bca', name: 'BCA' },
  { id: 'bni', name: 'BNI' },
  { id: 'bri', name: 'BRI' },
  { id: 'mandiri', name: 'Mandiri' },
  { id: 'bsi', name: 'BSI' },
  { id: 'cimb', name: 'CIMB Niaga' },
  { id: 'permata', name: 'Permata' },
  { id: 'danamon', name: 'Danamon' },
  { id: 'jago', name: 'Bank Jago' },
  { id: 'seabank', name: 'SeaBank' },
];

const EWALLET_OPTIONS = [
  { id: 'gopay', name: 'GoPay' },
  { id: 'ovo', name: 'OVO' },
  { id: 'dana', name: 'DANA' },
  { id: 'shopeepay', name: 'ShopeePay' },
  { id: 'linkaja', name: 'LinkAja' },
  { id: 'isaku', name: 'iSaku' },
];

const COLOR_PALETTES = [
  { name: 'Earthy Tone', primary: '#D4A373', secondary: '#FEFAE0', accent: '#CCD5AE' },
  { name: 'Blush & Gold', primary: '#E5989B', secondary: '#FDE2E4', accent: '#FFB4A2' },
  { name: 'Emerald Dream', primary: '#52B788', secondary: '#D8F3DC', accent: '#74C69D' },
  { name: 'Ocean Breeze', primary: '#A2D2FF', secondary: '#BDE0FE', accent: '#CDB4DB' },
  { name: 'Monochrome', primary: '#1f2937', secondary: '#f9fafb', accent: '#6b7280' },
  { name: 'Royal Purple', primary: '#7B68EE', secondary: '#E6E6FA', accent: '#9370DB' },
];

// Minimalist SVG icons for wishlist
const WishlistIcons = {
  coffee_maker: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  bedcover: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M3 21V7a2 2 0 012-2h14a2 2 0 012 2v14M3 11h18M7 11v10M17 11v10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  mug_set: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M17 8h1a4 4 0 110 8h-1M3 8h14v11a3 3 0 01-3 3H6a3 3 0 01-3-3V8zM7 3v2M11 3v2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  kitchen_set: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <circle cx="12" cy="12" r="9"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M7 7l1.5 1.5M15.5 15.5L17 17M7 17l1.5-1.5M15.5 8.5L17 7" strokeLinecap="round"/>
    </svg>
  ),
  blender: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M8 2h8l-1 9H9L8 2zM6 11h12l-2 11H8L6 11zM10 15h4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  rice_cooker: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <ellipse cx="12" cy="8" rx="8" ry="3"/><path d="M4 8v8c0 1.66 3.58 3 8 3s8-1.34 8-3V8M12 4V2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  vacuum: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <circle cx="12" cy="6" r="4"/><path d="M12 10v6M8 22h8M10 16l-2 6M14 16l2 6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  iron: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M3 17h18l-3-9H8L3 17zM6 17v3M18 17v3M9 11h6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  towel_set: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M4 4h16v4a2 2 0 01-2 2H6a2 2 0 01-2-2V4zM6 10v10a2 2 0 002 2h8a2 2 0 002-2V10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  dinnerware: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>
    </svg>
  ),
  air_fryer: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="12" cy="14" r="4"/><path d="M8 8h2M14 8h2" strokeLinecap="round"/>
    </svg>
  ),
  mixer: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <circle cx="12" cy="8" r="5"/><path d="M9 13v6a3 3 0 006 0v-6M12 3v2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

const WISHLIST_OPTIONS = [
  { id: 'coffee_maker', name: 'Coffee Maker', Icon: WishlistIcons.coffee_maker },
  { id: 'bedcover', name: 'Bedcover Set', Icon: WishlistIcons.bedcover },
  { id: 'mug_set', name: 'Mug Set', Icon: WishlistIcons.mug_set },
  { id: 'kitchen_set', name: 'Kitchen Set', Icon: WishlistIcons.kitchen_set },
  { id: 'blender', name: 'Blender', Icon: WishlistIcons.blender },
  { id: 'rice_cooker', name: 'Rice Cooker', Icon: WishlistIcons.rice_cooker },
  { id: 'vacuum', name: 'Vacuum Cleaner', Icon: WishlistIcons.vacuum },
  { id: 'iron', name: 'Setrika', Icon: WishlistIcons.iron },
  { id: 'towel_set', name: 'Towel Set', Icon: WishlistIcons.towel_set },
  { id: 'dinnerware', name: 'Dinnerware Set', Icon: WishlistIcons.dinnerware },
  { id: 'air_fryer', name: 'Air Fryer', Icon: WishlistIcons.air_fryer },
  { id: 'mixer', name: 'Mixer', Icon: WishlistIcons.mixer },
];

const FONTS = [
  { id: 'playfair', name: 'Playfair Display', style: 'Elegant Serif' },
  { id: 'cormorant', name: 'Cormorant', style: 'Classic Serif' },
  { id: 'lora', name: 'Lora', style: 'Modern Serif' },
  { id: 'montserrat', name: 'Montserrat', style: 'Clean Sans' },
  { id: 'poppins', name: 'Poppins', style: 'Friendly Sans' },
];

export default function InvitationEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(null);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const [formData, setFormData] = useState({
    template_id: 'geometric-modern',
    primary_color: '#D4A373',
    secondary_color: '#FEFAE0',
    font_family: 'playfair',
    custom_colors: null,
    is_muslim: true,
    bride_name: '',
    bride_parents: '',
    bride_photo: '',
    bride_instagram: '',
    groom_name: '',
    groom_parents: '',
    groom_photo: '',
    groom_instagram: '',
    main_image_1: '',
    main_image_2: '',
    home_image: '',
    home_image_mobile: '',
    wedding_date: '',
    akad_time: '',
    akad_venue: '',
    akad_address: '',
    akad_lat: '',
    akad_lng: '',
    reception_time: '',
    reception_venue: '',
    reception_address: '',
    reception_lat: '',
    reception_lng: '',
    music_url: '',
    story_text: '',
    gallery_images: [],
    gift_bank_accounts: [],
    gift_ewallets: [],
    gift_address: '',
    gift_wishlist: [],
    custom_wishlist: '',
    enable_rsvp: true,
    enable_messages: true,
    enable_countdown: true,
    enable_gift: true,
  });

  useEffect(() => {
    loadTemplates();
    if (id) loadInvitation();
  }, [id]);

  const loadTemplates = async () => {
    try {
      const res = await templateAPI.getAll();
      setTemplates(res.data.templates);
    } catch (err) {
      console.error('Failed to load templates:', err);
    }
  };

  const loadInvitation = async () => {
    setLoading(true);
    try {
      const res = await invitationAPI.getOne(id);
      const inv = res.data.invitation;
      const wishlistData = inv.gift_wishlist || [];
      const predefinedWishlist = wishlistData.filter(w => !w.startsWith('custom:'));
      const customWishlistItems = wishlistData.filter(w => w.startsWith('custom:')).map(w => w.replace('custom:', ''));
      
      setFormData(prev => ({
        ...prev,
        template_id: inv.template_id || 'geometric-modern',
        primary_color: inv.primary_color || '#D4A373',
        secondary_color: inv.secondary_color || '#FEFAE0',
        font_family: inv.font_family || 'playfair',
        custom_colors: inv.custom_colors || null,
        is_muslim: inv.is_muslim !== undefined ? Boolean(inv.is_muslim) : true,
        bride_name: inv.bride_name || '',
        bride_parents: inv.bride_parents || '',
        bride_photo: inv.bride_photo || '',
        bride_instagram: inv.bride_instagram || '',
        groom_name: inv.groom_name || '',
        groom_parents: inv.groom_parents || '',
        groom_photo: inv.groom_photo || '',
        groom_instagram: inv.groom_instagram || '',
        main_image_1: inv.main_image_1 || '',
        main_image_2: inv.main_image_2 || '',
        home_image: inv.home_image || '',
        home_image_mobile: inv.home_image_mobile || '',
        wedding_date: inv.wedding_date ? inv.wedding_date.split('T')[0] : '',
        akad_time: inv.akad_time || '',
        akad_venue: inv.akad_venue || '',
        akad_address: inv.akad_address || '',
        akad_lat: inv.akad_lat || '',
        akad_lng: inv.akad_lng || '',
        reception_time: inv.reception_time || '',
        reception_venue: inv.reception_venue || '',
        reception_address: inv.reception_address || '',
        reception_lat: inv.reception_lat || '',
        reception_lng: inv.reception_lng || '',
        music_url: inv.music_url || '',
        story_text: inv.story_text || '',
        gallery_images: inv.gallery_images || [],
        gift_bank_accounts: inv.gift_bank_accounts || [],
        gift_ewallets: inv.gift_ewallets || [],
        gift_address: inv.gift_address || '',
        gift_wishlist: predefinedWishlist,
        custom_wishlist: customWishlistItems.join(', '),
        enable_rsvp: inv.enable_rsvp !== undefined ? inv.enable_rsvp : true,
        enable_messages: inv.enable_messages !== undefined ? inv.enable_messages : true,
        enable_countdown: inv.enable_countdown !== undefined ? inv.enable_countdown : true,
        enable_gift: inv.enable_gift !== undefined ? inv.enable_gift : true,
      }));
      if (inv.status === 'published') {
        setPublishedSlug(inv.slug);
      }
    } catch (err) {
      console.error('Failed to load invitation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (file, field) => {
    if (!file) {
      handleChange(field, '');
      return;
    }
    setUploadingImage(field);
    try {
      const res = await uploadAPI.image(file);
      handleChange(field, res.data.url);
      toast.success('Foto berhasil diupload');
    } catch (err) {
      toast.error('Gagal upload gambar');
    } finally {
      setUploadingImage(null);
    }
  };

  const handleMusicUpload = async (file) => {
    try {
      const res = await uploadAPI.music(file);
      handleChange('music_url', res.data.url);
      toast.success('Musik berhasil diupload');
    } catch (err) {
      toast.error('Gagal upload musik');
    }
  };

  const handleGalleryUpload = async (files) => {
    setUploadingGallery(true);
    try {
      const uploads = await Promise.all(files.map(file => uploadAPI.image(file)));
      const newItems = uploads.map(res => ({ url: res.data.url, caption: '' }));
      handleChange('gallery_images', [...formData.gallery_images, ...newItems]);
      toast.success(`${newItems.length} foto ditambahkan`);
    } catch (err) {
      toast.error('Gagal upload gambar');
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (index) => {
    const newImages = formData.gallery_images.filter((_, i) => i !== index);
    handleChange('gallery_images', newImages);
  };

  const updateGalleryCaption = (index, caption) => {
    const newImages = [...formData.gallery_images];
    // Handle backward compatibility - convert string to object if needed
    if (typeof newImages[index] === 'string') {
      newImages[index] = { url: newImages[index], caption };
    } else {
      newImages[index] = { ...newImages[index], caption };
    }
    handleChange('gallery_images', newImages);
  };

  // Helper to get image URL (backward compatible)
  const getGalleryImageUrl = (item) => typeof item === 'string' ? item : item.url;
  const getGalleryImageCaption = (item) => typeof item === 'string' ? '' : (item.caption || '');

  const handleSave = async () => {
    setSaving(true);
    try {
      // Combine wishlist data
      const customItems = formData.custom_wishlist
        ? formData.custom_wishlist.split(',').map(s => s.trim()).filter(Boolean).map(s => `custom:${s}`)
        : [];
      const combinedWishlist = [...formData.gift_wishlist, ...customItems];
      
      const dataToSave = {
        ...formData,
        gift_wishlist: combinedWishlist,
      };
      delete dataToSave.custom_wishlist;
      
      if (id) {
        await invitationAPI.update(id, dataToSave);
        toast.success('Perubahan tersimpan');
      } else {
        const res = await invitationAPI.create(dataToSave);
        navigate(`/edit/${res.data.invitation.id}`, { replace: true });
        toast.success('Draft undangan dibuat');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await handleSave();
      const res = await invitationAPI.publish(id);
      setPublishedSlug(res.data.slug);
      toast.success('Undangan berhasil dipublish!');
    } catch (err) {
      toast.error('Gagal publish undangan');
    } finally {
      setPublishing(false);
    }
  };

  const ImageUploader = ({ currentImage, onUpload, onRemove, label, isUploading, maxSizeMB = 2 }) => {
    const [sizeError, setSizeError] = useState(null);
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
      setSizeError(null);
      if (rejectedFiles && rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors.some(e => e.code === 'file-too-large')) {
          setSizeError(`Ukuran file terlalu besar. Maksimal ${maxSizeMB}MB`);
          return;
        }
      }
      if (acceptedFiles[0]) {
        onUpload(acceptedFiles[0]);
      }
    }, [onUpload, maxSizeMB]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
      maxSize: maxSizeBytes,
      multiple: false,
    });

    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div
          {...getRootProps()}
          className={`relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer
            ${currentImage ? 'bg-gray-100' : 'border-2 border-dashed'}
            ${sizeError ? 'border-red-400 bg-red-50' : isDragActive ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50/30'}`}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="h-48 flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-amber-100" />
                  <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-amber-500" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-amber-700">Mengupload foto...</p>
                  <p className="text-xs text-amber-500 mt-1">Mohon tunggu sebentar</p>
                </div>
              </div>
            </div>
          ) : currentImage ? (
            <div className="relative group">
              <img src={currentImage} alt="" className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <span className="text-white text-sm">Klik untuk ganti</span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onRemove(); }}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center gap-3 p-6">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${sizeError ? 'bg-red-100' : 'bg-gradient-to-br from-amber-100 to-orange-100'}`}>
                <Upload className={`w-6 h-6 ${sizeError ? 'text-red-500' : 'text-amber-600'}`} />
              </div>
              <div className="text-center">
                <p className={`text-sm font-medium ${sizeError ? 'text-red-600' : 'text-gray-700'}`}>
                  {sizeError ? sizeError : isDragActive ? 'Lepaskan file di sini' : 'Drag & drop atau klik'}
                </p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP (Max {maxSizeMB}MB)</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-rose-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-500">Memuat data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-rose-50/50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Kembali</span>
            </button>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400" />
              <h1 className="font-semibold text-gray-800">
                {id ? 'Edit Undangan' : 'Buat Undangan'}
              </h1>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-all"
            >
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </div>

      {/* Expiration Alert */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-amber-800">
              <strong>Penting:</strong> Undangan akan aktif selama 3 bulan sejak dibuat. Setelah itu, undangan dan semua data (foto, musik, tamu) akan dihapus secara otomatis.{' '}
              <Link to="/terms" className="text-amber-600 underline hover:text-amber-700">Baca Syarat & Ketentuan</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
        {/* Mobile Step Indicator */}
        <div className="sm:hidden mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500">Langkah {step} dari {STEPS.length}</span>
            <span className="text-xs font-medium text-amber-600">{STEPS[step-1].title}</span>
          </div>
          <div className="flex gap-1">
            {STEPS.map((s) => (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                className={`flex-1 h-1.5 rounded-full transition-all ${
                  step === s.id ? 'bg-gradient-to-r from-amber-400 to-orange-400' :
                  step > s.id ? 'bg-green-400' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Step Indicator */}
        <div className="hidden sm:flex justify-between items-center mb-8 overflow-x-auto pb-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isCompleted = step > s.id;
            return (
              <div key={s.id} className="flex items-center flex-shrink-0">
                <button
                  onClick={() => setStep(s.id)}
                  className={`flex flex-col items-center gap-2 px-3 md:px-4 py-2 rounded-2xl transition-all
                    ${isActive ? 'bg-gradient-to-br from-amber-400 to-orange-400 text-white shadow-lg shadow-amber-200' : 
                      isCompleted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                >
                  <div className="flex items-center gap-1.5 md:gap-2">
                    {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    <span className="font-medium text-xs md:text-sm whitespace-nowrap">{s.title}</span>
                  </div>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`w-4 md:w-8 h-0.5 mx-0.5 md:mx-1 rounded-full transition-colors ${isCompleted ? 'bg-green-300' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 overflow-hidden"
        >
          {/* Step Header */}
          <div className="px-4 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-amber-50 to-rose-50 border-b border-amber-100/50">
            <div className="flex items-center gap-3">
              {(() => { const Icon = STEPS[step-1].icon; return <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />; })()}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{STEPS[step-1].title}</h2>
                <p className="text-xs sm:text-sm text-gray-500">{STEPS[step-1].desc}</p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-8">
            {/* Step 1: Template */}
            {step === 1 && (
              <div className="space-y-8 sm:space-y-10">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3 sm:mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Pilih Template
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
                    {templates.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleChange('template_id', t.id)}
                        className={`group relative rounded-2xl overflow-hidden transition-all duration-300
                          ${formData.template_id === t.id 
                            ? 'ring-2 ring-amber-400 ring-offset-2 shadow-lg' 
                            : 'hover:shadow-lg hover:-translate-y-1'}`}
                      >
                        <div className="h-40 bg-gradient-to-br from-amber-100 via-rose-50 to-amber-50 relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-white/80 flex items-center justify-center">
                                <Heart className="w-8 h-8 text-amber-400" />
                              </div>
                            </div>
                          </div>
                          {formData.template_id === t.id && (
                            <div className="absolute top-3 right-3 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="p-4 bg-white">
                          <h4 className="font-semibold text-gray-800">{t.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">{t.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-amber-500" />
                    Pilih Warna
                  </h3>
                  <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    {COLOR_PALETTES.map((p) => {
                      const isSelected = formData.primary_color === p.primary && 
                                        formData.secondary_color === p.secondary && 
                                        !formData.custom_colors;
                      return (
                      <button
                        key={p.name}
                        onClick={() => {
                          handleChange('primary_color', p.primary);
                          handleChange('secondary_color', p.secondary);
                          handleChange('custom_colors', null);
                        }}
                        className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300
                          ${isSelected
                            ? 'bg-gray-900 text-white shadow-lg' 
                            : 'bg-gray-50 hover:bg-gray-100'}`}
                      >
                        <div className="flex -space-x-1.5 sm:-space-x-2 flex-shrink-0">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full ring-2 ring-white shadow" style={{ backgroundColor: p.primary }} />
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full ring-2 ring-white shadow" style={{ backgroundColor: p.secondary }} />
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full ring-2 ring-white shadow" style={{ backgroundColor: p.accent }} />
                        </div>
                        <span className="text-xs sm:text-sm font-medium truncate">{p.name}</span>
                      </button>
                    );})}
                    
                    {/* Custom Color Palette */}
                    <button
                      onClick={() => {
                        handleChange('custom_colors', {
                          primary: formData.primary_color,
                          secondary: formData.secondary_color,
                          accent: formData.primary_color
                        });
                      }}
                      className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300
                        ${formData.custom_colors
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300'}`}
                    >
                      <div className="flex -space-x-1.5 sm:-space-x-2 flex-shrink-0">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full ring-2 ring-white shadow bg-gradient-to-br from-purple-400 to-pink-400" />
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full ring-2 ring-white shadow bg-gradient-to-br from-blue-400 to-cyan-400" />
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full ring-2 ring-white shadow bg-gradient-to-br from-green-400 to-teal-400" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium truncate">Custom</span>
                    </button>
                  </div>

                  {/* Custom Color Pickers */}
                  {formData.custom_colors && (
                    <div className="mt-6 p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
                      <h4 className="text-sm font-semibold text-gray-700 mb-4">Pilih Warna Custom</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-2">Warna Primer</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={formData.primary_color}
                              onChange={(e) => {
                                handleChange('primary_color', e.target.value);
                                handleChange('custom_colors', { ...formData.custom_colors, primary: e.target.value });
                              }}
                              className="w-12 h-12 rounded-xl cursor-pointer border-0"
                            />
                            <input
                              type="text"
                              value={formData.primary_color}
                              onChange={(e) => {
                                handleChange('primary_color', e.target.value);
                                handleChange('custom_colors', { ...formData.custom_colors, primary: e.target.value });
                              }}
                              className="flex-1 px-3 py-2 bg-white rounded-lg text-sm font-mono"
                              placeholder="#D4A373"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-2">Warna Sekunder</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={formData.secondary_color}
                              onChange={(e) => {
                                handleChange('secondary_color', e.target.value);
                                handleChange('custom_colors', { ...formData.custom_colors, secondary: e.target.value });
                              }}
                              className="w-12 h-12 rounded-xl cursor-pointer border-0"
                            />
                            <input
                              type="text"
                              value={formData.secondary_color}
                              onChange={(e) => {
                                handleChange('secondary_color', e.target.value);
                                handleChange('custom_colors', { ...formData.custom_colors, secondary: e.target.value });
                              }}
                              className="flex-1 px-3 py-2 bg-white rounded-lg text-sm font-mono"
                              placeholder="#FEFAE0"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-white rounded-xl flex items-center gap-3">
                        <span className="text-xs text-gray-500">Preview:</span>
                        <div className="flex-1 h-8 rounded-lg" style={{ backgroundColor: formData.secondary_color }}>
                          <div className="h-full w-1/2 rounded-lg" style={{ backgroundColor: formData.primary_color }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Type className="w-4 h-4 text-amber-500" />
                    Pilih Font
                  </h3>
                  <div className="grid grid-cols-3 xs:grid-cols-5 gap-2 sm:gap-3">
                    {FONTS.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => handleChange('font_family', f.id)}
                        className={`p-2 sm:p-4 rounded-xl sm:rounded-2xl text-center transition-all duration-300
                          ${formData.font_family === f.id 
                            ? 'bg-gradient-to-br from-amber-400 to-orange-400 text-white shadow-lg' 
                            : 'bg-gray-50 hover:bg-gray-100'}`}
                        style={{ fontFamily: f.name }}
                      >
                        <span className="text-base sm:text-lg font-semibold block">Aa</span>
                        <span className="text-[10px] sm:text-xs mt-1 block opacity-70 truncate">{f.style}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Religion Type Toggle */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3 sm:mb-4 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    Jenis Undangan
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleChange('is_muslim', true)}
                      className={`p-4 sm:p-5 rounded-2xl text-center transition-all duration-300 border-2 ${
                        formData.is_muslim 
                          ? 'border-emerald-500 bg-emerald-50 shadow-lg' 
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${formData.is_muslim ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                        <Moon className={`w-5 h-5 sm:w-6 sm:h-6 ${formData.is_muslim ? 'text-emerald-600' : 'text-gray-400'}`} />
                      </div>
                      <span className={`text-sm sm:text-base font-semibold ${formData.is_muslim ? 'text-emerald-700' : 'text-gray-600'}`}>
                        Muslim
                      </span>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                        Dengan Bismillah & nuansa Islami
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('is_muslim', false)}
                      className={`p-4 sm:p-5 rounded-2xl text-center transition-all duration-300 border-2 ${
                        !formData.is_muslim 
                          ? 'border-amber-500 bg-amber-50 shadow-lg' 
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${!formData.is_muslim ? 'bg-amber-100' : 'bg-gray-100'}`}>
                        <Church className={`w-5 h-5 sm:w-6 sm:h-6 ${!formData.is_muslim ? 'text-amber-600' : 'text-gray-400'}`} />
                      </div>
                      <span className={`text-sm sm:text-base font-semibold ${!formData.is_muslim ? 'text-amber-700' : 'text-gray-600'}`}>
                        Umum
                      </span>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                        Bahasa formal tanpa nuansa agama
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Mempelai */}
            {step === 2 && (
              <div className="grid md:grid-cols-2 gap-6 sm:gap-10">
                {/* Bride */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-3 pb-3 sm:pb-4 border-b border-rose-100">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg">♀</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Mempelai Wanita</h3>
                      <p className="text-xs text-gray-500">Data calon istri</p>
                    </div>
                  </div>

                  <ImageUploader
                    label="Foto Mempelai Wanita"
                    currentImage={formData.bride_photo}
                    onUpload={(file) => handleImageUpload(file, 'bride_photo')}
                    onRemove={() => handleChange('bride_photo', '')}
                    isUploading={uploadingImage === 'bride_photo'}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap *</label>
                    <input
                      type="text"
                      value={formData.bride_name}
                      onChange={(e) => handleChange('bride_name', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-amber-400 transition-all"
                      placeholder="Nama mempelai wanita"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Orang Tua</label>
                    <input
                      type="text"
                      value={formData.bride_parents}
                      onChange={(e) => handleChange('bride_parents', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-amber-400 transition-all"
                      placeholder="Bapak ... & Ibu ..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                    <input
                      type="text"
                      value={formData.bride_instagram}
                      onChange={(e) => handleChange('bride_instagram', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-amber-400 transition-all"
                      placeholder="@username"
                    />
                  </div>
                </div>

                {/* Groom */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-3 pb-3 sm:pb-4 border-b border-blue-100">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg">♂</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Mempelai Pria</h3>
                      <p className="text-xs text-gray-500">Data calon suami</p>
                    </div>
                  </div>

                  <ImageUploader
                    label="Foto Mempelai Pria"
                    currentImage={formData.groom_photo}
                    onUpload={(file) => handleImageUpload(file, 'groom_photo')}
                    onRemove={() => handleChange('groom_photo', '')}
                    isUploading={uploadingImage === 'groom_photo'}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap *</label>
                    <input
                      type="text"
                      value={formData.groom_name}
                      onChange={(e) => handleChange('groom_name', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-amber-400 transition-all"
                      placeholder="Nama mempelai pria"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Orang Tua</label>
                    <input
                      type="text"
                      value={formData.groom_parents}
                      onChange={(e) => handleChange('groom_parents', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-amber-400 transition-all"
                      placeholder="Bapak ... & Ibu ..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                    <input
                      type="text"
                      value={formData.groom_instagram}
                      onChange={(e) => handleChange('groom_instagram', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-amber-400 transition-all"
                      placeholder="@username"
                    />
                  </div>
                </div>

                {/* Main Image 1 - Full width */}
                <div className="md:col-span-2 mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                      <Image className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Foto Utama 1 (Opsional)</h3>
                      <p className="text-xs text-gray-500">Ditampilkan setelah section mempelai</p>
                    </div>
                  </div>
                  
                  {/* Alert for main image ratio */}
                  <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-4">
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-800 font-medium">Rekomendasi Ukuran Gambar</p>
                      <p className="text-xs text-amber-600 mt-1">
                        Gunakan gambar dengan rasio <strong>21:9 (ultrawide)</strong> atau resolusi <strong>2560x1080</strong> untuk tampilan panorama yang optimal di semua perangkat.
                      </p>
                    </div>
                  </div>
                  
                  <ImageUploader
                    label="Upload Foto"
                    currentImage={formData.main_image_1}
                    onUpload={(file) => handleImageUpload(file, 'main_image_1')}
                    onRemove={() => handleChange('main_image_1', '')}
                    isUploading={uploadingImage === 'main_image_1'}
                    maxSizeMB={5}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Acara */}
            {step === 3 && (
              <div className="space-y-10">
                {/* Wedding Date Picker */}
                <div className="max-w-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Tanggal Pernikahan *</label>
                      <p className="text-xs text-gray-500">Pilih tanggal hari bahagia</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Tahun</label>
                        <CustomSelect
                          label="Pilih Tahun"
                          value={formData.wedding_date ? new Date(formData.wedding_date).getFullYear().toString() : ''}
                          onChange={(val) => {
                            const today = new Date();
                            const current = formData.wedding_date ? new Date(formData.wedding_date) : new Date();
                            current.setFullYear(parseInt(val));
                            if (current < today) {
                              current.setMonth(today.getMonth());
                              current.setDate(today.getDate());
                            }
                            handleChange('wedding_date', current.toISOString().split('T')[0]);
                          }}
                          options={[...Array(10)].map((_, i) => {
                            const year = new Date().getFullYear() + i;
                            return { value: year.toString(), label: year.toString() };
                          })}
                          placeholder="--"
                          gridCols={2}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Bulan</label>
                        <CustomSelect
                          label="Pilih Bulan"
                          value={formData.wedding_date ? new Date(formData.wedding_date).getMonth().toString() : ''}
                          onChange={(val) => {
                            const today = new Date();
                            const current = formData.wedding_date ? new Date(formData.wedding_date) : new Date();
                            current.setMonth(parseInt(val));
                            if (current < today) {
                              current.setDate(today.getDate());
                            }
                            handleChange('wedding_date', current.toISOString().split('T')[0]);
                          }}
                          options={(() => {
                            const today = new Date();
                            const selectedYear = formData.wedding_date ? new Date(formData.wedding_date).getFullYear() : today.getFullYear();
                            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
                            return months.map((m, i) => ({ value: i.toString(), label: m }))
                              .filter((_, i) => selectedYear > today.getFullYear() || i >= today.getMonth());
                          })()}
                          placeholder="--"
                          gridCols={3}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Tanggal</label>
                        <CustomSelect
                          label="Pilih Tanggal"
                          value={formData.wedding_date ? new Date(formData.wedding_date).getDate().toString() : ''}
                          onChange={(val) => {
                            const current = formData.wedding_date ? new Date(formData.wedding_date) : new Date();
                            current.setDate(parseInt(val));
                            handleChange('wedding_date', current.toISOString().split('T')[0]);
                          }}
                          options={(() => {
                            const today = new Date();
                            const current = formData.wedding_date ? new Date(formData.wedding_date) : today;
                            const year = current.getFullYear();
                            const month = current.getMonth();
                            const daysInMonth = new Date(year, month + 1, 0).getDate();
                            const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
                            const startDay = isCurrentMonth ? today.getDate() : 1;
                            return [...Array(daysInMonth - startDay + 1)].map((_, i) => {
                              const day = startDay + i;
                              return { value: day.toString(), label: day.toString() };
                            });
                          })()}
                          placeholder="--"
                          gridCols={5}
                        />
                      </div>
                    </div>
                    {formData.wedding_date && (
                      <p className="text-center mt-3 text-sm text-amber-700 font-medium">
                        {new Date(formData.wedding_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  {/* Akad */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 pb-4 border-b border-emerald-100">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Akad Nikah</h3>
                        <p className="text-xs text-gray-500">Detail acara akad</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="w-4 h-4 inline mr-1" />Waktu Acara
                      </label>
                      <div className="flex items-center gap-2">
                        <CustomSelect
                          label="Pilih Jam"
                          value={formData.akad_time ? formData.akad_time.split(':')[0] : ''}
                          onChange={(val) => {
                            const mins = formData.akad_time ? formData.akad_time.split(':')[1] : '00';
                            handleChange('akad_time', `${val}:${mins}`);
                          }}
                          options={[...Array(24)].map((_, i) => ({ value: i.toString().padStart(2, '0'), label: i.toString().padStart(2, '0') }))}
                          placeholder="Jam"
                          gridCols={4}
                          className="flex-1"
                        />
                        <span className="text-2xl font-bold text-gray-400">:</span>
                        <CustomSelect
                          label="Pilih Menit"
                          value={formData.akad_time ? formData.akad_time.split(':')[1] : ''}
                          onChange={(val) => {
                            const hrs = formData.akad_time ? formData.akad_time.split(':')[0] : '00';
                            handleChange('akad_time', `${hrs}:${val}`);
                          }}
                          options={['00', '15', '30', '45'].map((m) => ({ value: m, label: m }))}
                          placeholder="Menit"
                          gridCols={2}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-500 font-medium">WIB</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />Nama Tempat
                      </label>
                      <input
                        type="text"
                        value={formData.akad_venue}
                        onChange={(e) => handleChange('akad_venue', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-amber-400 transition-all"
                        placeholder="Masjid / Gedung / Hotel"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Lengkap</label>
                      <textarea
                        value={formData.akad_address}
                        onChange={(e) => handleChange('akad_address', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-amber-400 transition-all resize-none"
                        rows="2"
                        placeholder="Jl. ..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                        <input
                          type="text"
                          value={formData.akad_lat}
                          onChange={(e) => handleChange('akad_lat', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-amber-400 transition-all"
                          placeholder="-6.xxxx"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                        <input
                          type="text"
                          value={formData.akad_lng}
                          onChange={(e) => handleChange('akad_lng', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-amber-400 transition-all"
                          placeholder="106.xxxx"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Resepsi */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 pb-4 border-b border-rose-100">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Resepsi</h3>
                        <p className="text-xs text-gray-500">Detail acara resepsi</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="w-4 h-4 inline mr-1" />Waktu Acara
                      </label>
                      <div className="flex items-center gap-2">
                        <CustomSelect
                          label="Pilih Jam"
                          value={formData.reception_time ? formData.reception_time.split(':')[0] : ''}
                          onChange={(val) => {
                            const mins = formData.reception_time ? formData.reception_time.split(':')[1] : '00';
                            handleChange('reception_time', `${val}:${mins}`);
                          }}
                          options={[...Array(24)].map((_, i) => ({ value: i.toString().padStart(2, '0'), label: i.toString().padStart(2, '0') }))}
                          placeholder="Jam"
                          gridCols={4}
                          className="flex-1"
                        />
                        <span className="text-2xl font-bold text-gray-400">:</span>
                        <CustomSelect
                          label="Pilih Menit"
                          value={formData.reception_time ? formData.reception_time.split(':')[1] : ''}
                          onChange={(val) => {
                            const hrs = formData.reception_time ? formData.reception_time.split(':')[0] : '00';
                            handleChange('reception_time', `${hrs}:${val}`);
                          }}
                          options={['00', '15', '30', '45'].map((m) => ({ value: m, label: m }))}
                          placeholder="Menit"
                          gridCols={2}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-500 font-medium">WIB</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />Nama Tempat
                      </label>
                      <input
                        type="text"
                        value={formData.reception_venue}
                        onChange={(e) => handleChange('reception_venue', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-amber-400 transition-all"
                        placeholder="Gedung / Hotel / Ballroom"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Lengkap</label>
                      <textarea
                        value={formData.reception_address}
                        onChange={(e) => handleChange('reception_address', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-amber-400 transition-all resize-none"
                        rows="2"
                        placeholder="Jl. ..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                        <input
                          type="text"
                          value={formData.reception_lat}
                          onChange={(e) => handleChange('reception_lat', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-amber-400 transition-all"
                          placeholder="-6.xxxx"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                        <input
                          type="text"
                          value={formData.reception_lng}
                          onChange={(e) => handleChange('reception_lng', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-amber-400 transition-all"
                          placeholder="106.xxxx"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Image 2 - After address section */}
                <div className="mt-10 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center">
                      <Image className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Foto Utama 2 (Opsional)</h3>
                      <p className="text-xs text-gray-500">Ditampilkan setelah section acara/alamat</p>
                    </div>
                  </div>
                  
                  {/* Alert for main image ratio */}
                  <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-4">
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-800 font-medium">Rekomendasi Ukuran Gambar</p>
                      <p className="text-xs text-amber-600 mt-1">
                        Gunakan gambar dengan rasio <strong>21:9 (ultrawide)</strong> atau resolusi <strong>2560x1080</strong> untuk tampilan panorama yang optimal di semua perangkat.
                      </p>
                    </div>
                  </div>
                  
                  <ImageUploader
                    label="Upload Foto"
                    currentImage={formData.main_image_2}
                    onUpload={(file) => handleImageUpload(file, 'main_image_2')}
                    onRemove={() => handleChange('main_image_2', '')}
                    isUploading={uploadingImage === 'main_image_2'}
                    maxSizeMB={5}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Konten */}
            {step === 4 && (
              <div className="space-y-10">
                {/* Home Section Image */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Foto Section Home (Opsional)</h3>
                      <p className="text-xs text-gray-500">Foto pasangan bersama yang tampil di section countdown. Biasanya foto berdua yang romantis.</p>
                    </div>
                  </div>
                  
                  {/* Alert for minimalist-elegant template */}
                  {formData.template_id === 'minimalist-elegant' && (
                    <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl mb-4 max-w-md">
                      <AlertTriangle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-800 font-medium">Rekomendasi Ukuran Gambar</p>
                        <p className="text-xs text-blue-600 mt-1">
                          Template <strong>Minimalist Elegant</strong> menggunakan foto sebagai background fullscreen. 
                          Gunakan gambar dengan rasio <strong>18:9</strong> atau resolusi <strong>Full HD (1920x1080)</strong> untuk hasil terbaik.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Alert for other templates */}
                  {formData.template_id !== 'minimalist-elegant' && (
                    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-4 max-w-md">
                      <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-amber-800 font-medium">Rekomendasi Ukuran Gambar</p>
                        <p className="text-xs text-amber-600 mt-1">
                          Untuk template ini, disarankan menggunakan foto dengan orientasi <strong>portrait (vertikal)</strong> untuk tampilan yang optimal.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="max-w-md">
                    <ImageUploader
                      label="Upload Foto Pasangan (Desktop)"
                      currentImage={formData.home_image}
                      onUpload={(file) => handleImageUpload(file, 'home_image')}
                      onRemove={() => handleChange('home_image', '')}
                      isUploading={uploadingImage === 'home_image'}
                      maxSizeMB={5}
                    />
                  </div>

                  {/* Mobile Home Image - Only for minimalist-elegant */}
                  {formData.template_id === 'minimalist-elegant' && (
                    <div className="max-w-md mt-6">
                      <div className="flex items-start gap-3 p-4 bg-violet-50 border border-violet-200 rounded-xl mb-4">
                        <AlertTriangle className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-violet-800 font-medium">Foto Versi Mobile</p>
                          <p className="text-xs text-violet-600 mt-1">
                            Upload foto terpisah untuk tampilan mobile. Disarankan menggunakan foto dengan orientasi <strong>portrait (vertikal)</strong> untuk hasil optimal di layar HP.
                          </p>
                        </div>
                      </div>
                      <ImageUploader
                        label="Upload Foto Pasangan (Mobile)"
                        currentImage={formData.home_image_mobile}
                        onUpload={(file) => handleImageUpload(file, 'home_image_mobile')}
                        onRemove={() => handleChange('home_image_mobile', '')}
                        isUploading={uploadingImage === 'home_image_mobile'}
                        maxSizeMB={5}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-400" />
                    Love Story / Quote
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    Gunakan toolbar untuk memformat teks, tambahkan bold, italic, atau rata tengah.
                  </p>
                  <RichTextEditor
                    value={formData.story_text}
                    onChange={(html) => handleChange('story_text', html)}
                    placeholder="Ceritakan kisah cinta kalian atau tambahkan quote romantis..."
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Music className="w-4 h-4 text-violet-500" />
                    Musik Background
                  </h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <input
                      type="file"
                      accept="audio/mpeg,audio/mp3,audio/wav"
                      onChange={(e) => e.target.files[0] && handleMusicUpload(e.target.files[0])}
                      className="hidden"
                      id="music-upload"
                    />
                    <label 
                      htmlFor="music-upload" 
                      className="flex items-center gap-2 px-5 py-3 bg-linear-to-r from-violet-500 to-purple-500 text-white rounded-xl cursor-pointer hover:shadow-lg transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      Upload MP3
                    </label>
                    {formData.music_url && (
                      <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-xl">
                        <audio src={formData.music_url} controls className="h-10" />
                        <button
                          onClick={() => handleChange('music_url', '')}
                          className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Max 5MB (MP3, WAV)</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Image className="w-4 h-4 text-emerald-500" />
                    Gallery Foto
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formData.gallery_images.map((img, i) => (
                      <div key={i} className="bg-gray-50 rounded-2xl overflow-hidden">
                        <div className="relative group">
                          <img src={getGalleryImageUrl(img)} alt="" className="w-full h-36 object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={() => removeGalleryImage(i)}
                              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                            {i + 1}
                          </div>
                        </div>
                        <div className="p-3">
                          <input
                            type="text"
                            value={getGalleryImageCaption(img)}
                            onChange={(e) => updateGalleryCaption(i, e.target.value)}
                            placeholder="Tambahkan caption..."
                            maxLength={100}
                            className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                          />
                        </div>
                      </div>
                    ))}
                    {formData.gallery_images.length < 10 && (
                      uploadingGallery ? (
                        <div className="h-48 border-2 border-amber-300 bg-amber-50 rounded-2xl flex flex-col items-center justify-center">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full border-3 border-amber-200" />
                            <div className="absolute inset-0 w-10 h-10 rounded-full border-3 border-amber-500 border-t-transparent animate-spin" />
                          </div>
                          <span className="text-xs text-amber-600 mt-2">Uploading...</span>
                        </div>
                      ) : (
                        <label className="h-48 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 hover:bg-amber-50/50 transition-all">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleGalleryUpload(Array.from(e.target.files))}
                            className="hidden"
                          />
                          <Upload className="w-8 h-8 text-gray-400" />
                          <span className="text-sm text-gray-400 mt-2">Tambah Foto</span>
                        </label>
                      )
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-3">Max 10 foto, masing-masing max 2MB. Caption opsional (max 100 karakter)</p>
                </div>
              </div>
            )}

            {/* Step 5: Hadiah/Gift */}
            {step === 5 && (
              <div className="space-y-10">
                {/* Bank Accounts */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-500" />
                      Rekening Bank
                    </h3>
                    <button
                      type="button"
                      onClick={() => handleChange('gift_bank_accounts', [...formData.gift_bank_accounts, { bank: 'bca', number: '', name: '' }])}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah
                    </button>
                  </div>
                  
                  {formData.gift_bank_accounts.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-2xl">
                      <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Belum ada rekening bank</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.gift_bank_accounts.map((account, index) => (
                        <div key={index} className="bg-gray-50 rounded-2xl p-5">
                          <div className="flex justify-between items-start mb-4">
                            <span className="text-sm font-medium text-gray-600">Rekening #{index + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newAccounts = formData.gift_bank_accounts.filter((_, i) => i !== index);
                                handleChange('gift_bank_accounts', newAccounts);
                              }}
                              className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1.5">Bank</label>
                              <CustomSelect
                                label="Pilih Bank"
                                value={account.bank}
                                onChange={(val) => {
                                  const newAccounts = [...formData.gift_bank_accounts];
                                  newAccounts[index].bank = val;
                                  handleChange('gift_bank_accounts', newAccounts);
                                }}
                                options={BANK_OPTIONS.map(bank => ({ value: bank.id, label: bank.name }))}
                                placeholder="Pilih Bank"
                                gridCols={2}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1.5">Nomor Rekening</label>
                              <input
                                type="text"
                                value={account.number}
                                onChange={(e) => {
                                  const newAccounts = [...formData.gift_bank_accounts];
                                  newAccounts[index].number = e.target.value;
                                  handleChange('gift_bank_accounts', newAccounts);
                                }}
                                className="w-full px-3 py-2.5 bg-white border-0 rounded-xl focus:ring-2 focus:ring-amber-400"
                                placeholder="1234567890"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1.5">Atas Nama</label>
                              <input
                                type="text"
                                value={account.name}
                                onChange={(e) => {
                                  const newAccounts = [...formData.gift_bank_accounts];
                                  newAccounts[index].name = e.target.value;
                                  handleChange('gift_bank_accounts', newAccounts);
                                }}
                                className="w-full px-3 py-2.5 bg-white border-0 rounded-xl focus:ring-2 focus:ring-amber-400"
                                placeholder="Nama pemilik rekening"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* E-Wallets */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-green-500" />
                      E-Wallet
                    </h3>
                    <button
                      type="button"
                      onClick={() => handleChange('gift_ewallets', [...formData.gift_ewallets, { type: 'gopay', number: '', name: '' }])}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah
                    </button>
                  </div>
                  
                  {formData.gift_ewallets.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-2xl">
                      <Wallet className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Belum ada e-wallet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.gift_ewallets.map((wallet, index) => (
                        <div key={index} className="bg-gray-50 rounded-2xl p-5">
                          <div className="flex justify-between items-start mb-4">
                            <span className="text-sm font-medium text-gray-600">E-Wallet #{index + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newWallets = formData.gift_ewallets.filter((_, i) => i !== index);
                                handleChange('gift_ewallets', newWallets);
                              }}
                              className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1.5">Jenis</label>
                              <CustomSelect
                                label="Pilih E-Wallet"
                                value={wallet.type}
                                onChange={(val) => {
                                  const newWallets = [...formData.gift_ewallets];
                                  newWallets[index].type = val;
                                  handleChange('gift_ewallets', newWallets);
                                }}
                                options={EWALLET_OPTIONS.map(ew => ({ value: ew.id, label: ew.name }))}
                                placeholder="Pilih"
                                gridCols={2}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1.5">Nomor</label>
                              <input
                                type="text"
                                value={wallet.number}
                                onChange={(e) => {
                                  const newWallets = [...formData.gift_ewallets];
                                  newWallets[index].number = e.target.value;
                                  handleChange('gift_ewallets', newWallets);
                                }}
                                className="w-full px-3 py-2.5 bg-white border-0 rounded-xl focus:ring-2 focus:ring-amber-400"
                                placeholder="08xx xxxx xxxx"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1.5">Atas Nama</label>
                              <input
                                type="text"
                                value={wallet.name}
                                onChange={(e) => {
                                  const newWallets = [...formData.gift_ewallets];
                                  newWallets[index].name = e.target.value;
                                  handleChange('gift_ewallets', newWallets);
                                }}
                                className="w-full px-3 py-2.5 bg-white border-0 rounded-xl focus:ring-2 focus:ring-amber-400"
                                placeholder="Nama pemilik"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Gift Address */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    Alamat Kirim Hadiah
                  </h3>
                  <textarea
                    value={formData.gift_address}
                    onChange={(e) => handleChange('gift_address', e.target.value)}
                    className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-amber-400 transition-all resize-none"
                    rows="3"
                    placeholder="Alamat lengkap untuk pengiriman hadiah fisik..."
                  />
                </div>

                {/* Wishlist */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Gift className="w-4 h-4 text-purple-500" />
                    Wishlist (Opsional)
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">Pilih barang yang Anda inginkan sebagai hadiah pernikahan</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                    {WISHLIST_OPTIONS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          const current = formData.gift_wishlist || [];
                          const newWishlist = current.includes(item.id)
                            ? current.filter(w => w !== item.id)
                            : [...current, item.id];
                          handleChange('gift_wishlist', newWishlist);
                        }}
                        className={`p-3 rounded-xl text-center transition-all duration-200 border-2 ${
                          (formData.gift_wishlist || []).includes(item.id)
                            ? 'border-purple-500 bg-purple-50 shadow-md'
                            : 'border-gray-200 bg-gray-50 hover:border-purple-300'
                        }`}
                      >
                        <div className={`flex justify-center mb-1 ${
                          (formData.gift_wishlist || []).includes(item.id) ? 'text-purple-600' : 'text-gray-500'
                        }`}>
                          <item.Icon />
                        </div>
                        <span className={`text-xs font-medium ${
                          (formData.gift_wishlist || []).includes(item.id) ? 'text-purple-700' : 'text-gray-600'
                        }`}>
                          {item.name}
                        </span>
                        {(formData.gift_wishlist || []).includes(item.id) && (
                          <Check className="w-4 h-4 text-purple-500 mx-auto mt-1" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">
                      Wishlist Lainnya (pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      value={formData.custom_wishlist}
                      onChange={(e) => handleChange('custom_wishlist', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-purple-400 transition-all"
                      placeholder="contoh: Panci Set, Frame Foto, Vas Bunga"
                    />
                    <p className="text-xs text-gray-400 mt-1">Tambahkan item custom yang tidak ada di daftar</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Pengaturan */}
            {step === 6 && (
              <div className="space-y-4 max-w-2xl">
                {[
                  { key: 'enable_rsvp', title: 'RSVP', desc: 'Izinkan tamu mengkonfirmasi kehadiran', icon: Users, color: 'emerald' },
                  { key: 'enable_messages', title: 'Ucapan & Doa', desc: 'Izinkan tamu mengirim ucapan', icon: Heart, color: 'rose' },
                  { key: 'enable_countdown', title: 'Countdown Timer', desc: 'Tampilkan hitung mundur ke hari H', icon: Clock, color: 'violet' },
                  { key: 'enable_gift', title: 'Kirim Hadiah', desc: 'Tampilkan section kirim hadiah', icon: Gift, color: 'amber' },
                ].map((setting) => {
                  const Icon = setting.icon;
                  return (
                    <div 
                      key={setting.key}
                      className={`flex items-center justify-between p-5 rounded-2xl transition-all
                        ${formData[setting.key] ? `bg-${setting.color}-50` : 'bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                          ${formData[setting.key] ? `bg-${setting.color}-100` : 'bg-gray-200'}`}>
                          <Icon className={`w-5 h-5 ${formData[setting.key] ? `text-${setting.color}-600` : 'text-gray-400'}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{setting.title}</h4>
                          <p className="text-sm text-gray-500">{setting.desc}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData[setting.key]}
                          onChange={(e) => handleChange(setting.key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-300 peer-focus:ring-4 peer-focus:ring-amber-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-sm peer-checked:bg-gradient-to-r peer-checked:from-amber-400 peer-checked:to-orange-400"></div>
                      </label>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Step 7: Publish */}
            {step === 7 && (
              <PublishStep 
                publishedSlug={publishedSlug}
                formData={formData}
                publishing={publishing}
                id={id}
                handlePublish={handlePublish}
                navigate={navigate}
              />
            )}
          </div>

          {/* Footer Navigation */}
          {step < 7 && (
            <div className="px-4 sm:px-8 py-4 sm:py-6 bg-gray-50 border-t border-gray-100 flex justify-between gap-3">
              <button
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3 text-gray-600 hover:text-gray-800 disabled:opacity-30 transition-colors text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Sebelumnya</span>
                <span className="xs:hidden">Back</span>
              </button>
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center justify-center gap-1 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-lg sm:rounded-xl font-medium hover:shadow-lg transition-all text-sm sm:text-base min-w-[100px]"
              >
                <span className="hidden xs:inline">Selanjutnya</span>
                <span className="xs:hidden">Next</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Publish Step Component - simple version without guest name input
// Guest name input is only available in Dashboard share modal
function PublishStep({ publishedSlug, formData, publishing, id, handlePublish, navigate }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/${publishedSlug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (publishedSlug) {
    return (
      <div className="text-center py-8">
        <div className="space-y-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-200">
            <Check className="w-12 h-12 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Undangan Berhasil Dipublish!</h3>
            <p className="text-gray-500">Bagikan link di bawah ini ke tamu undangan</p>
          </div>

          {/* Link Preview */}
          <div className="max-w-md mx-auto p-6 bg-gray-50 rounded-2xl">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Link Undangan</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={`${window.location.origin}/${publishedSlug}`}
                readOnly
                className="flex-1 px-4 py-3 bg-white border-0 rounded-xl text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="px-5 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                {copied ? 'Tersalin!' : 'Salin'}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="max-w-md mx-auto p-4 bg-amber-50 rounded-xl">
            <p className="text-xs text-amber-700">
              <strong>Tips:</strong> Untuk membagikan undangan dengan nama tamu personal, gunakan fitur "Bagikan" di Dashboard.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <a
              href={`/${publishedSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              <Eye className="w-5 h-5" />
              Lihat Undangan
            </a>
            <button 
              onClick={() => navigate('/dashboard')} 
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Ke Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <div className="space-y-8">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
          <Send className="w-10 h-10 text-amber-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Siap Publish?</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Pastikan semua data sudah benar. Setelah dipublish, undangan dapat dibagikan ke tamu.
          </p>
        </div>
        <div className="max-w-md mx-auto p-6 bg-amber-50 rounded-2xl text-left">
          <p className="text-xs text-amber-600 uppercase tracking-wider font-semibold mb-3">Ringkasan</p>
          <div className="space-y-2 text-sm text-gray-700">
            <p><span className="text-gray-400">Mempelai:</span> {formData.bride_name} & {formData.groom_name}</p>
            <p><span className="text-gray-400">Tanggal:</span> {formData.wedding_date || '-'}</p>
            <p><span className="text-gray-400">Template:</span> {formData.template_id}</p>
          </div>
        </div>
        <button
          onClick={handlePublish}
          disabled={publishing || !id}
          className="px-10 py-4 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-2xl font-semibold text-lg hover:shadow-xl hover:shadow-amber-200 disabled:opacity-50 transition-all"
        >
          {publishing ? 'Publishing...' : 'Publish Sekarang'}
        </button>
        {!id && (
          <p className="text-sm text-gray-400">Simpan draft terlebih dahulu sebelum publish</p>
        )}
      </div>
    </div>
  );
}
