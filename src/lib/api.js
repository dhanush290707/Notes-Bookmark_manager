import axios from 'axios';

// Use relative URL for API routes (works in both dev and production)
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Notes API
export const notesApi = {
    getAll: (params) => api.get('/notes', { params }),
    getById: (id) => api.get(`/notes/${id}`),
    create: (data) => api.post('/notes', data),
    update: (id, data) => api.put(`/notes/${id}`, data),
    delete: (id) => api.delete(`/notes/${id}`),
};

// Bookmarks API
export const bookmarksApi = {
    getAll: (params) => api.get('/bookmarks', { params }),
    getById: (id) => api.get(`/bookmarks/${id}`),
    create: (data) => api.post('/bookmarks', data),
    update: (id, data) => api.put(`/bookmarks/${id}`, data),
    delete: (id) => api.delete(`/bookmarks/${id}`),
};

export default api;
