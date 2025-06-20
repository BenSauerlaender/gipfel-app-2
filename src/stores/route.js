import { defineStore } from 'pinia'
import { getRoutes } from 'src/api'

export const useRouteStore = defineStore('route', {
  state: () => ({
    routes: [] // Array of route objects
  }),

  getters: {
    isRoutesLoaded(state) {
      return state.routes.length > 0
    },
    getRouteById(state) {
      return (id) => state.routes.find(r => r._id === id)
    },
  },

  actions: {
    async loadRoutes() {
      const response = await getRoutes()
      this.routes = response.data
    },
  }
}) 