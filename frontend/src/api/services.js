import api from './axios';

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const complaintAPI = {
  getAll: (params) => api.get('/complaints', { params }),
  getOne: (id) => api.get(`/complaints/${id}`),
  create: (data) => api.post('/complaints', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/complaints/${id}`, data),
  delete: (id) => api.delete(`/complaints/${id}`),
  stats: () => api.get('/complaints/stats'),
};

export const noticeAPI = {
  getAll: (params) => api.get('/notices', { params }),
  create: (data) => api.post('/notices', data),
  update: (id, data) => api.put(`/notices/${id}`, data),
  delete: (id) => api.delete(`/notices/${id}`),
};

export const staffAPI = {
  getAll: (params) => api.get('/staff', { params }),
  create: (data) => api.post('/staff', data),
  update: (id, data) => api.put(`/staff/${id}`, data),
  delete: (id) => api.delete(`/staff/${id}`),
  attendance: (id, data) => api.put(`/staff/${id}/attendance`, data),
};

export const lostFoundAPI = {
  getAll: () => api.get('/lost-found'),
  create: (data) => api.post('/lost-found', data),
  update: (id, data) => api.put(`/lost-found/${id}`, data),
};

export const dashboardAPI = {
  admin: () => api.get('/dashboard/admin'),
  resident: () => api.get('/dashboard/resident'),
  activities: () => api.get('/dashboard/activities'),
};

export const sosAPI = {
  trigger: (data) => api.post('/sos', data),
  resolve: (id) => api.put(`/sos/${id}/resolve`),
};
