import { defineStore } from 'pinia'
import { getRoutes } from 'src/api'

export const useRouteStore = defineStore('route', {
  state: () => ({
    routes: [] // Array of route objects
  }),

  getters: {
    isRoutesLoaded() {
      return this.routes.length > 0
    },
  },

  actions: {
    async loadRoutes() {
      const response = await getRoutes()
      this.routes = response.data
    },
    getRouteById(id) {
      return this.routes.find(route => route._id === id)
    }

  }
}) 