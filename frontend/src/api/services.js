import api from './axios';

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const dashboardAPI = {
  admin: () => api.get('/dashboard/admin'),
  resident: () => api.get('/dashboard/resident'),
  activities: () => api.get('/dashboard/activities'),
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

export const paymentAPI = {
  getAll: (params) => api.get('/payments', { params }),
  create: (data) => api.post('/payments', data),
  markPaid: (id, data) => api.put(`/payments/${id}/pay`, data),
  stats: () => api.get('/payments/stats'),
};

export const visitorAPI = {
  getAll: (params) => api.get('/visitors', { params }),
  create: (data) => api.post('/visitors', data),
  update: (id, data) => api.put(`/visitors/${id}`, data),
  approve: (id) => api.put(`/visitors/${id}/approve`),
};

export const eventAPI = {
  getAll: () => api.get('/events'),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  rsvp: (id) => api.put(`/events/${id}/rsvp`),
};

export const staffAPI = {
  getAll: (params) => api.get('/staff', { params }),
  create: (data) => api.post('/staff', data),
  update: (id, data) => api.put(`/staff/${id}`, data),
  delete: (id) => api.delete(`/staff/${id}`),
  attendance: (id, data) => api.put(`/staff/${id}/attendance`, data),
};

export const flatAPI = {
  getAll: (params) => api.get('/flats', { params }),
  create: (data) => api.post('/flats', data),
  update: (id, data) => api.put(`/flats/${id}`, data),
  stats: () => api.get('/flats/stats'),
};

export const userAPI = {
  getResidents: (params) => api.get('/users', { params }),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const sosAPI = {
  trigger: (data) => api.post('/sos', data),
  getAll: () => api.get('/sos'),
  resolve: (id) => api.put(`/sos/${id}/resolve`),
};

export const lostFoundAPI = {
  getAll: () => api.get('/lost-found'),
  create: (data) => api.post('/lost-found', data),
  update: (id, data) => api.put(`/lost-found/${id}`, data),
};
