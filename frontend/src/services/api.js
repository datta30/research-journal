import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Author APIs
export const authorAPI = {
  submitPaper: (formData) => {
    return api.post('/author/papers/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getMyPapers: () => api.get('/author/papers'),
  getPaperById: (id) => api.get(`/author/papers/${id}`),
  getPaper: (id) => api.get(`/author/papers/${id}`),
  downloadPaper: (id) => api.get(`/author/papers/${id}/download`, { responseType: 'blob' }),
  submitRevision: (id, formData) => {
    return api.post(`/author/papers/${id}/revise`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getPaperRevisions: (id) => api.get(`/author/papers/${id}/revisions`),
  getPlagiarismCheck: (id) => api.get(`/author/papers/${id}/plagiarism`),
};

// Editor APIs
export const editorAPI = {
  getUnassignedPapers: () => api.get('/editor/papers/unassigned'),
  getMyPapers: () => api.get('/editor/papers'),
  assignPaperToMe: (id) => api.put(`/editor/papers/${id}/assign`),
  assignReviewer: (paperId, reviewerId) =>
    api.post(`/editor/papers/${paperId}/assign-reviewer`, { reviewerId }),
  getAvailableReviewers: () => api.get('/editor/reviewers'),
  getPaperReviews: (id) => api.get(`/editor/papers/${id}/reviews`),
  makeFinalDecision: (id, decision, comments) =>
    api.put(`/editor/papers/${id}/decision`, { decision, comments }),
  downloadPaper: (paperId) => api.get(`/editor/papers/${paperId}/download`, { responseType: 'blob' }),
};

// Reviewer APIs
export const reviewerAPI = {
  getMyReviews: () => api.get('/reviewer/reviews'),
  getPendingReviews: () => api.get('/reviewer/reviews/pending'),
  getReview: (id) => api.get(`/reviewer/reviews/${id}`),
  submitReview: (id, reviewData) => api.put(`/reviewer/reviews/${id}/submit`, reviewData),
  updateReviewStatus: (id, status) =>
    api.put(`/reviewer/reviews/${id}/status`, null, { params: { status } }),
  downloadPaper: (reviewId) => api.get(`/reviewer/reviews/${reviewId}/download`, { responseType: 'blob' }),
};

// Public APIs
export const publicAPI = {
  getPublishedPapers: () => api.get('/papers/published'),
  getPaper: (id) => api.get(`/papers/${id}`),
  downloadPaper: (paperId) => api.get(`/papers/${paperId}/download`, { responseType: 'blob' }),
};

export default api;
