import axios from 'axios'
import { useUserStore } from 'src/stores/user'
import router from 'src/router'
import { route } from 'quasar/wrappers'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Important: Include cookies in requests
  headers: {
    'Content-Type': 'application/json',
  },
})

export const isOnline = () => api.get('/api/health', { timeout: 5000 })

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
  (error) => Promise.reject(error),
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const userStore = useUserStore()
    const originalRequest = error.config

    // Skip auth for login/register and refresh endpoints
    if (
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/refresh')
    ) {
      return Promise.reject(error)
    }

    // Handle 401 errors
    if (error.response?.status === 401) {
      console.log('401 detected for', originalRequest.url, 'retry:', originalRequest._retry)
      if (originalRequest._retry) {
        userStore.clearAuth()
        router.push('/login')
        return Promise.reject(error)
      }
      originalRequest._retry = true

      // Try to refresh token
      const refreshed = await userStore.refreshAccessToken()
      if (refreshed) {
        originalRequest.headers.Authorization = `Bearer ${userStore.accessToken}`
        return api(originalRequest)
      } else {
        userStore.clearAuth()
        router.push('/login')
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)

export default api
