import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors by clearing token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Journal API
export const journalAPI = {
  create: (data) => api.post('/journal/', data),
  getAll: (params) => api.get('/journal/', { params }),
  getLatest: () => api.get('/journal/latest'),
  getById: (id) => api.get(`/journal/${id}`),
  update: (id, data) => api.put(`/journal/${id}`, data),
  delete: (id) => api.delete(`/journal/${id}`),
};

// Goals API
export const goalsAPI = {
  create: (data) => api.post('/goals/', data),
  getAll: (params) => api.get('/goals/', { params }),
  getById: (id) => api.get(`/goals/${id}`),
  update: (id, data) => api.put(`/goals/${id}`, data),
  delete: (id) => api.delete(`/goals/${id}`),
};

// Projects API
export const projectsAPI = {
  create: (data) => api.post('/goals/projects/', data),
  getAll: (params) => api.get('/goals/projects/', { params }),
  getById: (id) => api.get(`/goals/projects/${id}`),
  update: (id, data) => api.put(`/goals/projects/${id}`, data),
  delete: (id) => api.delete(`/goals/projects/${id}`),
};

// Daily Levers API
export const dailyLeversAPI = {
  create: (data) => api.post('/goals/daily-levers/', data),
  getAll: (params) => api.get('/goals/daily-levers/', { params }),
  getById: (id) => api.get(`/goals/daily-levers/${id}`),
  update: (id, data) => api.put(`/goals/daily-levers/${id}`, data),
  complete: (id) => api.post(`/goals/daily-levers/${id}/complete`),
  delete: (id) => api.delete(`/goals/daily-levers/${id}`),
};

// Reminders API
export const remindersAPI = {
  create: (data) => api.post('/reminders/', data),
  getAll: (params) => api.get('/reminders/', { params }),
  generateQuestions: (count) => api.get('/reminders/generate', { params: { count } }),
  getById: (id) => api.get(`/reminders/${id}`),
  update: (id, data) => api.put(`/reminders/${id}`, data),
  delete: (id) => api.delete(`/reminders/${id}`),
};

// Reflections API
export const reflectionsAPI = {
  create: (data) => api.post('/reminders/reflections/', data),
  getAll: (params) => api.get('/reminders/reflections/', { params }),
  getLatest: () => api.get('/reminders/reflections/latest'),
  getById: (id) => api.get(`/reminders/reflections/${id}`),
  update: (id, data) => api.put(`/reminders/reflections/${id}`, data),
  delete: (id) => api.delete(`/reminders/reflections/${id}`),
};

// AI Insights API
export const insightsAPI = {
  getAlignmentInsights: (data) => api.post('/reminders/insights/alignment', data),
  getLeverSuggestions: (data) => api.post('/reminders/insights/levers', data),
  getReflectionInsights: (data) => api.post('/reminders/insights/reflection', data),
};

export default api;
