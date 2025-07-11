import api from './index'

export const login = (username, password) => api.post('/auth/login', { username, password })
export const refreshToken = () => api.post('/auth/refresh-token') // No body needed - cookie sent automatically
export const logout = () => api.post('/auth/logout') // Server will clear the cookie
