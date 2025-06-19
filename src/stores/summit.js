import { defineStore } from 'pinia'
import { getSummits } from 'src/api'

export const useSummitStore = defineStore('summit', {
  state: () => ({
    summits: [] // Array of summit objects
  }),

  getters: {
    isSummitsLoaded() {
      return this.summits.length > 0
    },
  },

  actions: {
    async loadSummits() {
      const response = await getSummits()
      this.summits = response.data
    },
    getSummitById(id) {
      return this.summits.find(summit => summit._id === id)
    }

  }
}) 