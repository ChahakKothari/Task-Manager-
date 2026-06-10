import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

const API_ROOT = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

export const getMediaUrl = (value) => {
  if (!value) {
    return '';
  }

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  return `${API_ROOT}${value.startsWith('/') ? value : `/${value}`}`;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('task-manager-token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const authApi = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  me: () => api.get('/auth/me'),
};

export const tasksApi = {
  list: () => api.get('/tasks'),
  getOne: (taskId) => api.get(`/tasks/${taskId}`),
  create: (payload) => api.post('/tasks', payload),
  update: (taskId, payload) => api.put(`/tasks/${taskId}`, payload),
  toggleStatus: (taskId) => api.patch(`/tasks/${taskId}/status`),
  remove: (taskId) => api.delete(`/tasks/${taskId}`),
};

export const usersApi = {
  list: () => api.get('/users'),
  uploadAvatar: (formData) => api.patch('/users/me/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export const invitesApi = {
  create: (payload) => api.post('/invites', payload),
};

export default api;
