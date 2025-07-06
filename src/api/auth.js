import api from './index'

export const login = (username, password) => api.post('/api/auth/login', { username, password })
export const refreshToken = () => api.post('/api/auth/refresh-token') // No body needed - cookie sent automatically
export const logout = () => api.post('/api/auth/logout') // Server will clear the cookie
