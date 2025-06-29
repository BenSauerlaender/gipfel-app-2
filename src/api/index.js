import axios from 'axios'
import { useUserStore } from 'src/stores/user'
import router from 'src/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Important: Include cookies in requests
  headers: {
    'Content-Type': 'application/json'
  }
})

export const getClimbers = () => api.get('/api/climbers')
export const getRoutes = () => api.get('/api/routes')
export const getAscents = () => api.get('/api/ascents')
export const getSummits = () => api.get('/api/summits')
export const getRegions = () => api.get('/api/regions')


// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const userStore = useUserStore()
    
    // Skip auth for login/register endpoints
    if (config.url?.includes('/auth/login')) {
      return config
    }

    // Check if token needs refresh
    if (userStore.shouldRefreshToken) {
      const refreshed = await userStore.refreshAccessToken()
      if (!refreshed) {
        router.push('/login')
        return Promise.reject(new Error('Token refresh failed'))
      }
    }

    // Add access token to headers
    if (userStore.accessToken) {
      config.headers.Authorization = `Bearer ${userStore.accessToken}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const userStore = useUserStore()
    const originalRequest = error.config

    // Skip auth for login/register endpoints
    if (originalRequest.url?.includes('/auth/login')) {
      return Promise.reject(error)
    }

    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Try to refresh token
      const refreshed = await userStore.refreshAccessToken()
      
      if (refreshed) {
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${userStore.accessToken}`
        return api(originalRequest)
      } else {
        // Refresh failed, redirect to login
        userStore.clearAuth()
        router.push('/login')
      }
    }

    return Promise.reject(error)
  }
)

export default api