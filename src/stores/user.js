import { defineStore, acceptHMRUpdate } from 'pinia';
import { login as apiLogin, logout as apiLogout, refreshToken as apiRefreshToken } from 'src/api/auth';

export const useUserStore = defineStore('user', {
  state: () => ({
    loggedIn: false,
    user: null,
    accessToken: null,
  }),

  getters: {
    isTokenExpired(state) {
      if (!state.accessToken) return true
      try {
        const payload = JSON.parse(atob(state.accessToken.split('.')[1]))
        return Date.now() >= payload.exp * 1000
      } catch {
        return true
      }
    },

    shouldRefreshToken(state) {
      if (!state.accessToken) return false
      try {
        const payload = JSON.parse(atob(state.accessToken.split('.')[1]))
        const timeUntilExpiry = (payload.exp * 1000) - Date.now()
        return timeUntilExpiry < parseInt(import.meta.env.VITE_TOKEN_REFRESH_THRESHOLD)
      } catch {
        return false
      }
    }
  },

  actions: {
    async login(username, password) {
        try {
            const response = await apiLogin(username, password);
            this.loggedIn = true;
            this.user = response.data.user;
            this.accessToken = response.data.accessToken;
            // Optionally persist token/user here
        } catch (err) {
            this.clearAuth();
            if(err.response.status === 401) {
                throw new Error(err.response.data.error);
            }
            throw err;
        }
    },

    async refreshAccessToken() {
        try {
          // No need to send refresh token - it's in httpOnly cookie
          const response = await apiRefreshToken()
          this.accessToken = response.data.accessToken
          // Update user data if provided
          if (response.data.user) {
            this.user = response.data.user
          }
          this.loggedIn = true
          return true
        } catch {
          this.clearAuth()
          return false
        }
      },
    async logout() {
        try {
          // Server will clear the httpOnly cookie
          await apiLogout()
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          this.clearAuth()
        }
    }, 
    async clearAuth() {
        this.loggedIn = false;
        this.user = null;
        this.accessToken = null;
    }
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
} 