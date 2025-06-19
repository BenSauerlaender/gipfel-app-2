import { defineStore } from 'pinia'
import { getAscents } from 'src/api'

export const useAscentStore = defineStore('ascent', {
  state: () => ({
    ascents: [] // Array of ascent objects
  }),
  
  getters: {
    getAscentsForTimeline() {
    },
    isAscentsLoaded() {
      return this.ascents.length > 0
    }
  },

  actions: {
    async loadAscents() {
      const response = await getAscents()
      this.ascents = response.data
    },

  }
}) 