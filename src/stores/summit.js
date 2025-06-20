import { defineStore } from 'pinia'
import { getSummits } from 'src/api'

export const useSummitStore = defineStore('summit', {
  state: () => ({
    summits: [] // Array of summit objects
  }),

  getters: {
    isSummitsLoaded(state) {
      return state.summits.length > 0
    },
    getSummitById(state) {
      return (id) => state.summits.find(s => s._id === id)
    },
  },

  actions: {
    async loadSummits() {
      const response = await getSummits()
      this.summits = response.data
    },
  }
}) 