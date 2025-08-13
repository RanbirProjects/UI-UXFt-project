import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post('/auth/change-password', data),
};

export const buyerAPI = {
  getProfile: () => api.get('/buyers/profile'),
  completeOnboarding: (data: any) => api.post('/buyers/onboarding', data),
  updateProfile: (data: any) => api.put('/buyers/profile', data),
  getSellers: (params?: any) => api.get('/buyers/sellers', { params }),
  expressInterest: (data: { sellerId: string; message?: string }) =>
    api.post('/buyers/express-interest', data),
  getMatches: () => api.get('/buyers/matches'),
};

export const sellerAPI = {
  getProfile: () => api.get('/sellers/profile'),
  completeOnboarding: (data: any) => api.post('/sellers/onboarding', data),
  updateProfile: (data: any) => api.put('/sellers/profile', data),
  getBuyers: (params?: any) => api.get('/sellers/buyers', { params }),
  initiateContact: (data: { buyerId: string; message?: string }) =>
    api.post('/sellers/initiate-contact', data),
  getMatches: () => api.get('/sellers/matches'),
  updateStatus: (status: string) => api.put('/sellers/status', { status }),
};

export const matchesAPI = {
  getMatches: (params?: any) => api.get('/matches', { params }),
  createMatch: (data: any) => api.post('/matches', data),
  updateMatchStatus: (id: string, status: string) =>
    api.put(`/matches/${id}/status`, { status }),
  addNote: (id: string, content: string) =>
    api.post(`/matches/${id}/notes`, { content }),
  getMatch: (id: string) => api.get(`/matches/${id}`),
};

export const dealsAPI = {
  getDeals: (params?: any) => api.get('/deals', { params }),
  updateDealStage: (id: string, stage: string) =>
    api.put(`/deals/${id}/stage`, { stage }),
  addDocument: (id: string, data: any) =>
    api.post(`/deals/${id}/documents`, data),
  updateDocumentStatus: (id: string, docId: string, status: string) =>
    api.put(`/deals/${id}/documents/${docId}/status`, { status }),
  addMilestone: (id: string, data: any) =>
    api.post(`/deals/${id}/milestones`, data),
  updateMilestone: (id: string, milestoneId: string, data: any) =>
    api.put(`/deals/${id}/milestones/${milestoneId}`, data),
  getDeal: (id: string) => api.get(`/deals/${id}`),
};

export const aiAPI = {
  analyzeDocument: (data: { documentUrl: string; documentType: string }) =>
    api.post('/ai/analyze-document', data),
  generateSummary: (data: { businessData: any }) =>
    api.post('/ai/generate-summary', data),
  getMatchRecommendations: (data: { userType: string; preferences: any }) =>
    api.post('/ai/match-recommendations', data),
  getNegotiationInsights: (data: { dealData: any; userRole: string }) =>
    api.post('/ai/negotiation-assistant', data),
  getDueDiligenceChecklist: (data: { businessType: string; industry: string }) =>
    api.post('/ai/due-diligence-checklist', data),
};

export default api;
