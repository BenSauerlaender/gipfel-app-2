import { defineStore } from 'pinia'

export const useFilterStore = defineStore('filter', {
  state: () => ({
    filters: {
      ascents: {
        allowedTypes: ['lead', 'solo', 'topRope', 'aborted']
      }
    }
  }),
  getters: {
  },
  actions: {
  }
}) 