import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  // Check if it's an admin route
  if (config.url?.startsWith('/admin')) {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  } else {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAdminRoute = error.config?.url?.startsWith('/admin');
      if (isAdminRoute) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (!window.location.pathname.startsWith('/superadmin') && 
            window.location.pathname !== '/login' && 
            window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const invitationAPI = {
  getAll: () => api.get('/invitations'),
  getOne: (id) => api.get(`/invitations/${id}`),
  create: (data) => api.post('/invitations', data),
  update: (id, data) => api.put(`/invitations/${id}`, data),
  delete: (id) => api.delete(`/invitations/${id}`),
  publish: (id) => api.post(`/invitations/${id}/publish`),
  getAnalytics: (id) => api.get(`/invitations/${id}/analytics`),
};

export const guestAPI = {
  getAll: (invitationId) => api.get(`/invitations/${invitationId}/guests`),
  add: (invitationId, data) => api.post(`/invitations/${invitationId}/guests`, data),
  bulkAdd: (invitationId, guests) => api.post(`/invitations/${invitationId}/guests/bulk`, { guests }),
  update: (id, data) => api.put(`/guests/${id}`, data),
  delete: (id) => api.delete(`/guests/${id}`),
};

export const publicAPI = {
  getInvitation: (slug, guestName) => 
    api.get(`/public/${slug}${guestName ? `?to=${encodeURIComponent(guestName)}` : ''}`),
  submitRSVP: (slug, data) => api.post(`/public/${slug}/rsvp`, data),
  getMessages: (slug) => api.get(`/public/${slug}/messages`),
};

export const uploadAPI = {
  image: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  music: (file) => {
    const formData = new FormData();
    formData.append('music', file);
    return api.post('/upload/music', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const templateAPI = {
  getAll: () => api.get('/templates'),
  getOne: (id) => api.get(`/templates/${id}`),
};

export const adminAPI = {
  login: (data) => api.post('/admin/login', data),
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getInvitations: () => api.get('/admin/invitations'),
  deleteInvitation: (id) => api.delete(`/admin/invitations/${id}`),
};

export const getUploadUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return path;
};

export default api;
