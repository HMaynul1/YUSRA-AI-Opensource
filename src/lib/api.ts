import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
}

export const chatAPI = {
  createSession: (title: string, mode: string, language: string, model?: string) =>
    api.post('/chat/sessions', { title, mode, language, model }),
  getSessions: () => api.get('/chat/sessions'),
  getMessages: (sessionId: string) =>
    api.get(`/chat/sessions/${sessionId}/messages`),
  sendMessage: (sessionId: string, content: string, model: string, provider: string) =>
    api.post(`/chat/sessions/${sessionId}/messages`, { content, model, provider }),
  deleteSession: (sessionId: string) =>
    api.delete(`/chat/sessions/${sessionId}`),
  likeMessage: (messageId: string) =>
    api.post(`/chat/messages/${messageId}/like`),
}

export const aiAPI = {
  getProviders: () => api.get('/ai/providers'),
  getModels: () => api.get('/ai/models'),
  transcribe: (file: File, language?: string) => {
    const formData = new FormData()
    formData.append('audio', file)
    if (language) formData.append('language', language)
    return api.post('/ai/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getConfig: () => api.get('/admin/config'),
  updateConfig: (key: string, value: string) =>
    api.post('/admin/config', { key, value }),
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (userId: string, role: string) =>
    api.post(`/admin/users/${userId}/role`, { role }),
}

export default api
